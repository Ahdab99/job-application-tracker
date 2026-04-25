package com.example.jobtracker.dto;

import java.time.LocalDate;

public class JobAppRequest {

    private String companyName;
    private String position;
    private String status;
    private String notes;
    private LocalDate appliedDate;

    public JobAppRequest() {
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getPosition() {
        return position;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }
}