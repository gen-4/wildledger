package com.gen_4.wildledger.auth.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.gen_4.wildledger.auth.models.User;
import com.gen_4.wildledger.auth.repositories.UserRepository;
import com.gen_4.wildledger.auth.utils.JwtTokenProvider;

import java.io.IOException;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) 
    throws ServletException, IOException {

        String path = request.getRequestURI();

        try {
            String token = extractTokenFromRequest(request);

            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                Long userId = jwtTokenProvider.getUserIdFromToken(token);

                if (userId != null) {
                    User user = userRepository.findById(userId).orElse(null);
                    setAuthentication(user, request, path, userId, false);

                } else {
                    // Fallback: try username-based lookup for tokens without userId
                    String username = jwtTokenProvider.getUsernameFromToken(token);
                    if (username != null) {
                        User user = userRepository.findByUsername(username).orElse(null);
                        if (user != null) {
                            setAuthentication(user, request, path, null, false);
                        }
                    }
                }
            }
        } catch (DisabledException e) {
            throw e;
        } catch (LockedException e) {
            throw e;
        } catch (Exception e) {
            log.error("JWT authentication failed for path '{}': {}", path, e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    private void setAuthentication(
        User user, 
        HttpServletRequest request, 
        String path, 
        Long userId, 
        Boolean isFallback
    ) {
        if (user != null && user.isEnabled() && !user.isBanned()) {
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    user.getRoles().stream().map(role -> 
                        new SimpleGrantedAuthority(role.getRole().name())
                    ).collect(Collectors.toList())
                );

            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug(
                "Authenticated user '{}' (id={}) for request to {} {}", 
                user.getUsername(), user.getId(), path, !isFallback ? "" : "via username fallback"
            );
        } else if (!isFallback && userId != null) { // If !isFallback, userId will not be null
            log.warn("No user found with id={} for request to {}", userId, path);

        } else if (!user.isEnabled()) {
            throw new DisabledException("User " + user.getId() + " " + user.getUsername() + " is not enabled");

        } else if (user.isBanned()) {
            throw new LockedException("User " + user.getId() + " " + user.getUsername() + " is banned");
        }
    }
    
}
