package com.securitymonitor.model;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class EventRepository {
    // Store events by application and category
    private Map<String, Map<String, List<SecurityEvent>>> eventsByAppAndCategory = new ConcurrentHashMap<>();
    
    // Add an event
    public void addEvent(SecurityEvent event) {
        String app = event.getApplication();
        String category = event.getCategory();
        
        // Get or create the category map for this application
        Map<String, List<SecurityEvent>> categoryMap = eventsByAppAndCategory.computeIfAbsent(app, k -> new ConcurrentHashMap<>());
        
        // Get or create the event list for this category
        List<SecurityEvent> events = categoryMap.computeIfAbsent(category, k -> new ArrayList<>());
        
        // Add the event
        events.add(event);
    }
    
    // Get events for an application and category
    public List<SecurityEvent> getEvents(String application, String category) {
        Map<String, List<SecurityEvent>> categoryMap = eventsByAppAndCategory.get(application);
        if (categoryMap == null) {
            return new ArrayList<>();
        }
        
        List<SecurityEvent> events = categoryMap.get(category);
        return events != null ? new ArrayList<>(events) : new ArrayList<>();
    }
    
    // Purge old events
    public void purgeOldEvents(Duration maxAge) {
        LocalDateTime cutoff = LocalDateTime.now().minus(maxAge);
        
        for (Map<String, List<SecurityEvent>> categoryMap : eventsByAppAndCategory.values()) {
            for (List<SecurityEvent> events : categoryMap.values()) {
                events.removeIf(event -> event.getTimestamp().isBefore(cutoff));
            }
        }
    }
    
    // Get all applications
    public Set<String> getAllApplications() {
        return eventsByAppAndCategory.keySet();
    }
    
    // Get all categories for an application
    public Set<String> getCategoriesForApplication(String application) {
        Map<String, List<SecurityEvent>> categoryMap = eventsByAppAndCategory.get(application);
        return categoryMap != null ? categoryMap.keySet() : Set.of();
    }
    
    // Get recent events for all applications and categories
    public List<SecurityEvent> getRecentEvents(Duration window) {
        List<SecurityEvent> recentEvents = new ArrayList<>();
        LocalDateTime cutoff = LocalDateTime.now().minus(window);
        
        for (Map<String, List<SecurityEvent>> categoryMap : eventsByAppAndCategory.values()) {
            for (List<SecurityEvent> events : categoryMap.values()) {
                for (SecurityEvent event : events) {
                    if (event.getTimestamp().isAfter(cutoff)) {
                        recentEvents.add(event);
                    }
                }
            }
        }
        
        return recentEvents;
    }
}
