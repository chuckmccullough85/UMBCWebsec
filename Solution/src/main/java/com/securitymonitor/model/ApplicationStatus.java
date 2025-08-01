package com.securitymonitor.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ApplicationStatus {
    private String applicationName;
    private int activeAlerts;
    private String healthStatus; // "Good", "Warning", "Critical"
    private LocalDateTime lastEventTime;
    private List<String> recentAlerts = new ArrayList<>();
    
    public ApplicationStatus(String applicationName) {
        this.applicationName = applicationName;
        this.activeAlerts = 0;
        this.healthStatus = "Good";
    }
    
    // Getters and setters
    public String getApplicationName() {
        return applicationName;
    }
    
    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }
    
    public int getActiveAlerts() {
        return activeAlerts;
    }
    
    public void setActiveAlerts(int activeAlerts) {
        this.activeAlerts = activeAlerts;
        updateHealthStatus();
    }
    
    public String getHealthStatus() {
        return healthStatus;
    }
    
    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }
    
    public LocalDateTime getLastEventTime() {
        return lastEventTime;
    }
    
    public void setLastEventTime(LocalDateTime lastEventTime) {
        this.lastEventTime = lastEventTime;
    }
    
    public List<String> getRecentAlerts() {
        return recentAlerts;
    }
    
    public void addAlert(String alert) {
        if (recentAlerts.size() >= 10) {
            recentAlerts.remove(0); // Remove oldest alert
        }
        recentAlerts.add(alert);
        activeAlerts++;
        updateHealthStatus();
    }
    
    private void updateHealthStatus() {
        if (activeAlerts == 0) {
            healthStatus = "Good";
        } else if (activeAlerts < 5) {
            healthStatus = "Warning";
        } else {
            healthStatus = "Critical";
        }
    }
}
