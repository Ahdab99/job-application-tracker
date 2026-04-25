package com.example.jobtracker.exception;

public class ApplicationNotFoundException extends RuntimeException {
     //eine eigene Fehlerklasse um zwischen Not Found, Bad Request und Server error zu unterscheiden    
                                                                
    public ApplicationNotFoundException(String message) {
        super(message);
    }
}   