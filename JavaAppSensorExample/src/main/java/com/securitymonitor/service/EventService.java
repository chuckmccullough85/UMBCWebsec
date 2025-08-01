package com.securitymonitor.service;

import com.securitymonitor.config.ThresholdConfig;
import com.securitymonitor.model.ApplicationStatus;
import com.securitymonitor.model.EventRepository;
import com.securitymonitor.model.SecurityEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final ThresholdConfig thresholdConfig;
    
    // Cache of application statuses
    private final Map<String, ApplicationStatus> applicationStatuses = new ConcurrentHashMap<>();
    
    @Autowired
    public EventService(EventRepository eventRepository, 
                        NotificationService notificationService,
                        ThresholdConfig thresholdConfig) {
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
        this.thresholdConfig = thresholdConfig;
    }
    
    @Scheduled(fixedRate = 60000)  // Run every minute
    public void purgeOldEvents() {
        // Remove events older than the configured retention period
        eventRepository.purgeOldEvents(thresholdConfig.getRetentionPeriod());
    }
    
    public void addEvent(SecurityEvent event) {
        // Add the event to the repository
        eventRepository.addEvent(event);
        
        // Update application status
        ApplicationStatus status = applicationStatuses.computeIfAbsent(
            event.getApplication(), ApplicationStatus::new);
        status.setLastEventTime(event.getTimestamp());
        
        // Check if any thresholds have been exceeded
        checkThresholds(event.getApplication(), event.getCategory());
    }
    
    private void checkThresholds(String application, String category) {
        // Get the relevant events
        List<SecurityEvent> events = eventRepository.getEvents(application, category);
        
        // Get the threshold for this category
        Integer threshold = thresholdConfig.getThreshold(category);
        if (threshold == null) {
            return;  // No threshold defined for this category
        }
        
        // Count events within the detection window
        Duration detectionWindow = thresholdConfig.getDetectionWindow(category);
        LocalDateTime cutoff = LocalDateTime.now().minus(detectionWindow);
        
        long recentEventCount = events.stream()
                .filter(event -> event.getTimestamp().isAfter(cutoff))
                .count();
        
        // If threshold exceeded, generate notification
        if (recentEventCount >= threshold) {
            String alertMessage = "Threshold exceeded: " + recentEventCount + " events in the last " + 
                detectionWindow.toMinutes() + " minutes";
            
            notificationService.sendAlert(application, category, alertMessage);
            
            // Update application status
            ApplicationStatus status = applicationStatuses.get(application);
            if (status != null) {
                status.addAlert(category + ": " + alertMessage);
            }
        }
    }
    
    // Get all applications
    public Set<String> getAllApplications() {
        return eventRepository.getAllApplications();
    }
    
    // Get all categories for an application
    public Set<String> getCategoriesForApplication(String application) {
        return eventRepository.getCategoriesForApplication(application);
    }
    
    // Get status for all applications
    public Map<String, ApplicationStatus> getAllApplicationStatuses() {
        // Ensure we have status objects for all applications
        for (String app : eventRepository.getAllApplications()) {
            applicationStatuses.computeIfAbsent(app, ApplicationStatus::new);
        }
        return new HashMap<>(applicationStatuses);
    }
    
    // Get status for a specific application
    public ApplicationStatus getApplicationStatus(String application) {
        return applicationStatuses.computeIfAbsent(application, ApplicationStatus::new);
    }
    
    // Get recent events across all applications
    public List<SecurityEvent> getRecentEvents(Duration window) {
        return eventRepository.getRecentEvents(window);
    }
}
