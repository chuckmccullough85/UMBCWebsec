package com.example;

import com.securitymonitor.model.SecurityEvent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Example of how to use a controller advice to automatically capture exceptions
 * and send them to the security monitor.
 */
@ControllerAdvice
public class SecurityMonitoringAdvice {
    
    private static final String MONITOR_API_URL = "http://localhost:8080/api/events";
    private static final String APPLICATION_NAME = "ExampleApp";
    private final RestTemplate restTemplate = new RestTemplate();
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        // Log the exception to the security monitor
        sendSecurityEvent("error", "Unhandled exception: " + ex.getMessage());
        
        // Continue with normal exception handling
        return ResponseEntity.status(500).body("An error occurred");
    }
    
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<String> handleSecurityException(SecurityException ex) {
        // Log security-specific exceptions
        sendSecurityEvent("security", "Security exception: " + ex.getMessage());
        
        return ResponseEntity.status(403).body("Security violation detected");
    }
    
    private void sendSecurityEvent(String category, String description) {
        try {
            String url = MONITOR_API_URL + "?application={application}&category={category}&description={description}";
            
            Map<String, String> params = new HashMap<>();
            params.put("application", APPLICATION_NAME);
            params.put("category", category);
            params.put("description", description);
            
            restTemplate.postForObject(url, null, String.class, params);
        } catch (Exception e) {
            // Just log locally if the security monitor is unavailable
            System.err.println("Failed to send security event: " + e.getMessage());
        }
    }
}
