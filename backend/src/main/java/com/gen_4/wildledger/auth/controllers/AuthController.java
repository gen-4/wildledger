package com.gen_4.wildledger.auth.controllers;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gen_4.wildledger.auth.dtos.AuthResponse;
import com.gen_4.wildledger.auth.dtos.LoginRequest;
import com.gen_4.wildledger.auth.dtos.RefreshTokenRequest;
import com.gen_4.wildledger.auth.dtos.RegisterRequest;
import com.gen_4.wildledger.auth.services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /auth/register - username='{}'", request.getUsername());
        AuthResponse response = authService.register(request);
        log.info("Registration successful for user '{}'", request.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /auth/login - username='{}'", request.getUsername());
        AuthResponse response = authService.login(request);
        log.info("Login successful for user '{}'", request.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("POST /auth/refresh");
        AuthResponse response = authService.refreshToken(request);
        log.info("Token refresh successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("POST /auth/logout");
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
    }
    
}
