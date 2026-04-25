package com.example.jobtracker.controller;

import com.example.jobtracker.dto.ApiResponse;
import com.example.jobtracker.dto.AuthResponse;
import com.example.jobtracker.dto.ForgotPasswordRequest;
import com.example.jobtracker.dto.LoginRequest;
import com.example.jobtracker.dto.RegisterRequest;
import com.example.jobtracker.dto.ResetPasswordRequest;
import com.example.jobtracker.dto.UpdateProfileRequest;
import com.example.jobtracker.dto.UserProfileResponse;
import com.example.jobtracker.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.jobtracker.dto.ForgotPasswordResetRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public ApiResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return authService.getCurrentUserProfile(email);
    }

    @PutMapping("/me")
    public UserProfileResponse updateCurrentUserProfile(@RequestBody UpdateProfileRequest request,
                                                        Authentication authentication) {
        String email = authentication.getName();
        return authService.updateCurrentUserProfile(email, request.getName());
    }

    @PostMapping(value = "/me/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserProfileResponse uploadProfilePhoto(@RequestParam("file") MultipartFile file,
                                                  Authentication authentication) {
        String email = authentication.getName();
        return authService.uploadProfilePhoto(email, file);
    }

    @PostMapping("/reset-password")
    public ApiResponse resetPassword(@RequestBody ResetPasswordRequest request,
                                     Authentication authentication) {
        String email = authentication.getName();
        return authService.resetPassword(email, request);
    }

    @PostMapping("/forgot-password/reset")
    public ApiResponse resetForgottenPassword(@RequestBody ForgotPasswordResetRequest request) {
    return authService.resetForgottenPassword(request);
    }
}