package com.example.jobtracker.service;

import com.example.jobtracker.dto.AuthResponse;
import com.example.jobtracker.dto.RegisterRequest;
import com.example.jobtracker.entity.User;
import com.example.jobtracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.jobtracker.dto.LoginRequest;
import com.example.jobtracker.dto.ForgotPasswordRequest;
import com.example.jobtracker.dto.ForgotPasswordResetRequest;
import com.example.jobtracker.dto.ResetPasswordRequest;
import com.example.jobtracker.dto.ApiResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.jobtracker.security.JwtService;
import com.example.jobtracker.dto.UserProfileResponse;
import com.example.jobtracker.exception.EmailAlreadyExistsException;
import com.example.jobtracker.exception.InvalidCredentialsException;
import com.example.jobtracker.exception.UserNotFoundException;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder , JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
    throw new InvalidCredentialsException("Invalid password");
    }

    String token = jwtService.generateToken(user.getEmail());

    return new AuthResponse(token, "Login successful");
    }

    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UserNotFoundException("User with this email does not exist"));

    String resetToken = UUID.randomUUID().toString();
    LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);

    user.setResetToken(resetToken);
    user.setResetTokenExpiry(expiryTime);
    userRepository.save(user);

    String resetLink = frontendUrl + "/frontend/html/forgotReset.html?token=" + resetToken;
    emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    return new ApiResponse("Password reset email sent successfully.");
    }

    public ApiResponse resetPassword(String email, ResetPasswordRequest request) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
        throw new IllegalArgumentException("Old password is required");
    }
    if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
        throw new IllegalArgumentException("New password is required");
    }
    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new InvalidCredentialsException("Old password is incorrect");
    }
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
    return new ApiResponse("Password reset successfully");
    }


    public UserProfileResponse updateCurrentUserProfile(String email, String newName) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    if (newName == null || newName.trim().isEmpty()) {
        throw new IllegalArgumentException("Name cannot be empty");
    }

    user.setName(newName.trim());
    userRepository.save(user);

    return new UserProfileResponse(user.getName(), user.getEmail(), user.getPhotoUrl());
    }

  public UserProfileResponse uploadProfilePhoto(String email, MultipartFile file) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException("File is empty");
    }

    try {
        String uploadDir = "uploads/profile-photos";
        Path uploadPath = Paths.get(uploadDir);

        System.out.println("Upload dir absolute path: " + uploadPath.toAbsolutePath());

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(fileName);

        System.out.println("Saving file to: " + filePath.toAbsolutePath());

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String photoUrl = "/uploads/profile-photos/" + fileName;
        user.setPhotoUrl(photoUrl);

        System.out.println("Photo URL before save: " + photoUrl);

        userRepository.save(user);

        System.out.println("User saved successfully");

        return new UserProfileResponse(user.getName(), user.getEmail(), user.getPhotoUrl());

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Photo upload failed: " + e.getMessage(), e);
    }
}

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return new UserProfileResponse(user.getName(), user.getEmail(), user.getPhotoUrl());
    }

    public ApiResponse resetForgottenPassword(ForgotPasswordResetRequest request) {
    if (request.getToken() == null || request.getToken().isBlank()) {
        throw new IllegalArgumentException("Reset token is required");
    }

    if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
        throw new IllegalArgumentException("New password is required");
    }

    User user = userRepository.findByResetToken(request.getToken())
            .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

    if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException("Reset token has expired");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    user.setResetToken(null);
    user.setResetTokenExpiry(null);

    userRepository.save(user);

    return new ApiResponse("Password has been reset successfully");
    }

    @Value("${app.frontend.url}")
    private String frontendUrl;
    
}