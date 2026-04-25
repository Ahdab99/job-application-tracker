package com.example.jobtracker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String password;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @OneToMany(mappedBy = "user")
    private List<Application> applications = new ArrayList<>();

    public User() {
    }

    public User(Long id, String email, String name, LocalDateTime createdAt, String password) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.password = password;
        // this.photoUrl = photoUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

       public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }

    public String getPhotoUrl() {
    return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
    this.photoUrl = photoUrl;
    }

    public String getResetToken() {
    return resetToken;
    }

    public void setResetToken(String resetToken) {
    this.resetToken = resetToken;
    }

    public LocalDateTime getResetTokenExpiry() {
    return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
    this.resetTokenExpiry = resetTokenExpiry;
    }
}