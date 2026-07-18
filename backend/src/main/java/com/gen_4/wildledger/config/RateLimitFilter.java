package com.gen_4.wildledger.config;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.gen_4.wildledger.exceptions.RateLimitExceededException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.Filter;

import lombok.extern.slf4j.Slf4j;

@Component
@Order(1)
@Slf4j
public class RateLimitFilter implements Filter {

    private final AppProperties appProperties;
    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    public RateLimitFilter(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        if (path.contains("/auth/")) {
            String clientIp = getClientIp(httpRequest);
            int maxRequests = appProperties.getRateLimit().getMaxRequestsPerMinute();
            long windowMs = appProperties.getRateLimit().getWindowMs();
            RequestCounter counter = requestCounts.computeIfAbsent(clientIp,
                k -> new RequestCounter(maxRequests, windowMs));

            if (counter.isRateLimited()) {
                log.warn("Rate limit exceeded for IP {} on {}", clientIp, path);
                throw new RateLimitExceededException("Too many requests. Please try again later");
            }
            counter.increment();
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RequestCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long windowStart = System.currentTimeMillis();
        private final int maxRequests;
        private final long windowMs;

        RequestCounter(int maxRequests, long windowMs) {
            this.maxRequests = maxRequests;
            this.windowMs = windowMs;
        }

        void increment() {
            count.incrementAndGet();
        }

        boolean isRateLimited() {
            long now = System.currentTimeMillis();
            if (now - windowStart > windowMs) {
                windowStart = now;
                count.set(0);
                return false;
            }
            return count.get() >= maxRequests;
        }
    }
    
}
