package com.securitymonitor.controller;

import com.securitymonitor.model.SecurityEvent;
import com.securitymonitor.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    
    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }
    
    @PostMapping
    public ResponseEntity<String> addEvent(
            @RequestParam String application,
            @RequestParam String category,
            @RequestParam String description) {
        
        SecurityEvent event = new SecurityEvent(application, category, description, LocalDateTime.now());
        eventService.addEvent(event);
        
        return ResponseEntity.ok("Event recorded");
    }
    
    @GetMapping("/applications")
    public ResponseEntity<Set<String>> getApplications() {
        return ResponseEntity.ok(eventService.getAllApplications());
    }
    
    @GetMapping("/categories")
    public ResponseEntity<Set<String>> getCategories(@RequestParam String application) {
        return ResponseEntity.ok(eventService.getCategoriesForApplication(application));
    }
}
