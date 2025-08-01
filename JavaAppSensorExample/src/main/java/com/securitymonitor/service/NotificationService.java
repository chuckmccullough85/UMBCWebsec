package com.securitymonitor.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    // Store alerts in memory for simplicity
    private Map<String, List<String>> alertsByApplication = new HashMap<>();
    
    // For a real implementation, you might:
    // - Send emails
    // - Send SMS
    // - Create a Slack notification
    // - Log to a security event management system
    
    public void sendAlert(String application, String category, String message) {
        String timestamp = LocalDateTime.now().format(TIME_FORMATTER);
        String alert = String.format("[%s] %s: %s", timestamp, category.toUpperCase(), message);
        
        // Add to in-memory storage
        alertsByApplication.computeIfAbsent(application, k -> new ArrayList<>()).add(alert);
        
        // Log the alert
        System.out.println("SECURITY ALERT - " + application + ": " + alert);
    }
    
    public List<String> getAlerts(String application) {
        return alertsByApplication.getOrDefault(application, new ArrayList<>());
    }
    
    public Map<String, List<String>> getAllAlerts() {
        return new HashMap<>(alertsByApplication);
    }
    
    public void clearAlerts(String application) {
        alertsByApplication.remove(application);
    }
}
