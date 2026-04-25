package com.example.jobtracker.dto;

public class ResetPasswordRequest {

    private String oldPassword;
    private String newPassword;

    public ResetPasswordRequest() {
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}