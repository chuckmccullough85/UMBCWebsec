package com.example;

import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Example of how to integrate the security monitoring into your application
 */
public class SecurityMonitoringClient {
    
    private static final String MONITOR_API_URL = "http://localhost:8080/api/events";
    private final String applicationName;
    private final RestTemplate restTemplate;
    
    public SecurityMonitoringClient(String applicationName) {
        this.applicationName = applicationName;
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Send a security event to the monitoring service
     * 
     * @param category Category of the event (e.g., "authentication", "injection")
     * @param description Description of the event
     * @return true if the event was successfully sent
     */
    public boolean sendSecurityEvent(String category, String description) {
        try {
            String url = MONITOR_API_URL + "?application={application}&category={category}&description={description}";
            
            Map<String, String> params = new HashMap<>();
            params.put("application", applicationName);
            params.put("category", category);
            params.put("description", description);
            
            String response = restTemplate.postForObject(url, null, String.class, params);
            return "Event recorded".equals(response);
        } catch (Exception e) {
            // Log but don't disrupt normal application flow
            System.err.println("Failed to send security event: " + e.getMessage());
            return false;
        }
    }
    
    // Example usage in an authentication method
    public void exampleAuthenticationFailure(String username) {
        sendSecurityEvent("authentication", "Failed login attempt for user: " + username);
    }
    
    // Example usage for detecting SQL injection
    public void exampleSqlInjectionAttempt(String suspiciousQuery) {
        sendSecurityEvent("injection", "Potential SQL injection attempt: " + suspiciousQuery);
    }
    
    // Example usage for detecting access control violations
    public void exampleAccessControlViolation(String username, String resource) {
        sendSecurityEvent("access-control", "User " + username + " attempted to access unauthorized resource: " + resource);
    }
}
