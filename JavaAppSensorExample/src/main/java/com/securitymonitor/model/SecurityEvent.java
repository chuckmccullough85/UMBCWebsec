package com.securitymonitor.model;

import java.time.LocalDateTime;

public class SecurityEvent {
    private String application;
    private String category;
    private String description;
    private LocalDateTime timestamp;
    
    public SecurityEvent() {
    }
    
    public SecurityEvent(String application, String category, String description, LocalDateTime timestamp) {
        this.application = application;
        this.category = category;
        this.description = description;
        this.timestamp = timestamp;
    }
    
    // Getters and setters
    public String getApplication() {
        return application;
    }
    
    public void setApplication(String application) {
        this.application = application;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
