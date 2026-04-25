package com.example.jobtracker.repository;

import com.example.jobtracker.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository; // Diese Bibliothek wird verwendet, 
                                                              // um die eingebauten Funktionen 
                                                              // von JPA zu nutzen

public interface ApplicationRepository extends JpaRepository<Application, Long> { // Application name der Klasse und Long der Primary key
}