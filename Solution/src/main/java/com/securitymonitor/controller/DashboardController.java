package com.securitymonitor.controller;

import com.securitymonitor.config.ThresholdConfig;
import com.securitymonitor.model.ApplicationStatus;
import com.securitymonitor.model.SecurityEvent;
import com.securitymonitor.service.EventService;
import com.securitymonitor.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Controller
public class DashboardController {
    
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    private final EventService eventService;
    private final NotificationService notificationService;
    private final ThresholdConfig thresholdConfig;
    
    @Autowired
    public DashboardController(EventService eventService, 
                              NotificationService notificationService,
                              ThresholdConfig thresholdConfig) {
        this.eventService = eventService;
        this.notificationService = notificationService;
        this.thresholdConfig = thresholdConfig;
    }
    
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("applications", eventService.getAllApplications());
        model.addAttribute("categories", thresholdConfig.getKnownCategories());
        model.addAttribute("appStatuses", eventService.getAllApplicationStatuses());
        
        // Get recent events (last hour)
        List<SecurityEvent> recentEvents = eventService.getRecentEvents(Duration.ofHours(1));
        model.addAttribute("recentEvents", recentEvents);
        
        // Get alerts for all applications
        model.addAttribute("allAlerts", notificationService.getAllAlerts());
        
        return "dashboard";
    }
    
    @GetMapping("/api/dashboard/status")
    @ResponseBody
    public Map<String, ApplicationStatus> getStatus() {
        return eventService.getAllApplicationStatuses();
    }
    
    @GetMapping("/api/dashboard/alerts")
    @ResponseBody
    public Map<String, List<String>> getAlerts() {
        return notificationService.getAllAlerts();
    }
    
    @GetMapping("/test-client")
    public String testClient(Model model) {
        model.addAttribute("applications", eventService.getAllApplications());
        model.addAttribute("categories", thresholdConfig.getKnownCategories());
        return "test-client";
    }
}
