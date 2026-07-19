package com.gen_4.wildledger.auth.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gen_4.wildledger.auth.dtos.AuthResponse;
import com.gen_4.wildledger.auth.dtos.LoginRequest;
import com.gen_4.wildledger.auth.dtos.RefreshTokenRequest;
import com.gen_4.wildledger.auth.dtos.RegisterRequest;
import com.gen_4.wildledger.auth.dtos.conversors.UserDtoConversor;
import com.gen_4.wildledger.auth.models.RoleOptions;
import com.gen_4.wildledger.auth.models.User;
import com.gen_4.wildledger.auth.repositories.RoleRepository;
import com.gen_4.wildledger.auth.repositories.UserRepository;
import com.gen_4.wildledger.auth.utils.JwtTokenProvider;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final String REFRESH_TOKEN_KEY_PREFIX = "refresh_token:";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.expiration}")
    private long accessExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for username='{}'", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration failed: username '{}' already taken", request.getUsername());
            throw new IllegalArgumentException("Invalid username or password. Try with other options");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLastLogin(Timestamp.from(Instant.now()));
        user.setRoles(List.of(roleRepository.findByRole(RoleOptions.USER).orElse(null)));
        userRepository.save(user);

        log.info("User registered successfully: username='{}', id={}", user.getUsername(), user.getId());
        return generateAndStoreTokens(user);
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for username='{}'", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        if (!authentication.isAuthenticated()) {
            log.warn("Login failed for username='{}': not authenticated", request.getUsername());
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Look up the user to get the ID for token embedding
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.isEnabled()) {
            throw new DisabledException("User " + user.getId() + " " + user.getUsername() + " is not enabled");

        } else if (user.isBanned()) {
            throw new LockedException("User " + user.getId() + " " + user.getUsername() + " is banned");
        }

        try {
            userRepository.updateLastLogin(user.getId(), Timestamp.from(Instant.now()));
        
        } catch (Exception e) {
            log.error("Unable to save last login date for user " + user.getUsername(), e);
        }

        log.info("Login successful for username='{}'", request.getUsername());
        return generateAndStoreTokens(user);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request received");

        String token = request.getRefreshToken();
        String username = jwtTokenProvider.getUsernameFromToken(token);
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        if (username == null) {
            log.warn("Refresh failed: could not extract username from token");
            throw new IllegalArgumentException("Invalid refresh token");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        String redisKey = REFRESH_TOKEN_KEY_PREFIX + username;

        if (!user.isEnabled()) {
            redisTemplate.delete(redisKey);
            throw new DisabledException("User " + user.getId() + " " + user.getUsername() + " is not enabled");

        } else if (user.isBanned()) {
            redisTemplate.delete(redisKey);
            throw new LockedException("User " + user.getId() + " " + user.getUsername() + " is banned");
        }

        String storedToken = redisTemplate.opsForValue().get(redisKey);

        if (storedToken == null || !storedToken.equals(token)) {
            log.warn("Refresh failed for user '{}': token mismatch or expired", username);
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        // Rotate: delete old token and issue new pair
        redisTemplate.delete(redisKey);
        AuthResponse generatedTokens = generateAndStoreTokens(user);
        log.info("Refresh token rotated for user '{}'", username);

        return generatedTokens;
    }

    public void logout(String refreshToken) {
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);

        if (username != null) {
            String redisKey = REFRESH_TOKEN_KEY_PREFIX + username;
            redisTemplate.delete(redisKey);
            log.info("Logged out user '{}': refresh token deleted from Redis", username);
        } else {
            log.warn("Logout called with invalid refresh token");
        }
    }

    private AuthResponse generateAndStoreTokens(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getUsername(), user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername(), user.getId());

        String redisKey = REFRESH_TOKEN_KEY_PREFIX + user.getUsername();
        redisTemplate.opsForValue().set(redisKey, refreshToken, Duration.ofMillis(refreshExpirationMs));

        log.debug("Generated token pair for user '{}' (id={}), stored refresh token in Redis with {}ms TTL",
            user.getUsername(), user.getId(), refreshExpirationMs
        );

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(accessExpirationMs)
            .user(UserDtoConversor.toUserDto(user))
            .build();
}
    
}
