package com.securitymonitor.config;

import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class ThresholdConfig {
    // Default retention period for events (24 hours)
    private final Duration defaultRetentionPeriod = Duration.ofHours(24);
    
    // Default detection window (5 minutes)
    private final Duration defaultDetectionWindow = Duration.ofMinutes(5);
    
    // Thresholds by category
    private final Map<String, Integer> thresholds = Map.of(
        "authentication", 5,       // 5 authentication failures
        "injection", 3,            // 3 potential injection attempts
        "access-control", 4,       // 4 unauthorized access attempts
        "input-validation", 10,    // 10 input validation failures
        "session", 3               // 3 session manipulation attempts
    );
    
    // Detection windows by category
    private final Map<String, Duration> detectionWindows = Map.of(
        "authentication", Duration.ofMinutes(10),
        "injection", Duration.ofMinutes(5),
        "access-control", Duration.ofMinutes(15),
        "input-validation", Duration.ofMinutes(5),
        "session", Duration.ofMinutes(10)
    );
    
    // Getter methods
    public Duration getRetentionPeriod() {
        return defaultRetentionPeriod;
    }
    
    public Integer getThreshold(String category) {
        return thresholds.getOrDefault(category, null);
    }
    
    public Duration getDetectionWindow(String category) {
        return detectionWindows.getOrDefault(category, defaultDetectionWindow);
    }
    
    public Map<String, String> getKnownCategories() {
        Map<String, String> categories = new HashMap<>();
        categories.put("authentication", "Authentication Issues");
        categories.put("injection", "Injection Attempts");
        categories.put("access-control", "Access Control Violations");
        categories.put("input-validation", "Input Validation Failures");
        categories.put("session", "Session Management Issues");
        return categories;
    }
}
