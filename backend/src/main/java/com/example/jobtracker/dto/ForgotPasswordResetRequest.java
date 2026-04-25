package com.example.jobtracker.dto;

public class ForgotPasswordResetRequest {

    private String token;
    private String newPassword;

    public ForgotPasswordResetRequest() {
    }

    public String getToken() {
        return token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}