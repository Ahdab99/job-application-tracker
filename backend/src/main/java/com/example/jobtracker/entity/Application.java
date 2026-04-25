package com.example.jobtracker.entity;

import jakarta.persistence.*; // Bibliothek for JPA -> DB
import java.time.LocalDate;   // Datum ohne die echte Zeit 
import java.time.LocalDateTime; // Datum mit der echter Zeit 

@Entity  // Diese Klasse ist eine Tabelle in der DB
@Table(name = "applications") // mit name applications 
public class Application {

    @Id // Das ist der Primary key  
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id BIGINT AUTO_INCREMENT (1->2->3->4 usw)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Eine Application muss wissen,zu welchem User sie gehört.                                               
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status appStatus;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private LocalDate appliedDate;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private String Notes;

    public Application() { /* Default constructor, wichtig für JPA 
                            damit ein Objekt ohne Parameter erstellt werden kann */
    }

    public Application(User user, Status appStatus, String companyName, String position,
                       LocalDate appliedDate, LocalDateTime updatedAt, String Notes) {
        this.user = user;
        this.appStatus = appStatus;
        this.companyName = companyName;
        this.position = position;
        this.appliedDate = appliedDate;
        this.updatedAt = updatedAt;
        this.Notes = Notes;
    }

    @PrePersist
    @PreUpdate
    public void updateTimestamp() { // Die Zeit automatisch setzen, wenn es Änderungen gibt
        this.updatedAt = LocalDateTime.now();
    }

    //GETTER = Lesen 
    public long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Status getAppStatus() {
        return appStatus;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getPosition() {
        return position;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getNotes(){
        return Notes;
    }

    // SETTER = ändern
    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAppStatus(Status appStatus) {
        this.appStatus = appStatus;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setNotes (String Notes){
        this.Notes = Notes;
    }
}