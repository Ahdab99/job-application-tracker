package com.example.jobtracker.dto;

public class ApiResponse { /*Wird benutzt für Antworten wie:Application deleted,Saved,Updated und Error */

    private String message;

    public ApiResponse() {
    }

    public ApiResponse(String message) { // Nachricht erzeugen
        this.message = message;
    }

    public String getMessage() { // Spring braucht Getter → JSON machen.
        return message;
    }

    public void setMessage(String message) { // Spring braucht Setter → JSON lesen.
        this.message = message;
    }
}
