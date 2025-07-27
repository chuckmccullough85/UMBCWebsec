// Lab 3: Session Management Attacks JavaScript

// Global session data (easily accessible and modifiable!)
let currentUser = {
    username: "guest_user",
    role: "user",
    credits: 100,
    accessLevel: 1,
    sessionToken: "user_abc123xyz"
};

let sessionData = {
    credits: 100,
    isAdmin: false,
    accessLevel: 1,
    loginTime: new Date().toISOString()
};

document.addEventListener('DOMContentLoaded', function() {
    initializeSession();
    updateDisplay();
    updateStorageDisplay();
    logMessage("🔐 Session initialized. Welcome, " + currentUser.username);
});

function initializeSession() {
    // Store "secure" session data in browser storage
    localStorage.setItem('authToken', 'user_token_abc123');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('credits', '100');
    localStorage.setItem('sessionId', 'sess_' + Date.now());
    
    sessionStorage.setItem('accessLevel', '1');
    sessionStorage.setItem('loginTime', new Date().toISOString());
    sessionStorage.setItem('isAuthenticated', 'true');
}

function updateDisplay() {
    document.getElementById('currentUser').textContent = currentUser.username;
    document.getElementById('currentRole').textContent = currentUser.role;
    document.getElementById('accessLevel').textContent = currentUser.accessLevel;
    document.getElementById('userCredits').textContent = currentUser.credits;
    document.getElementById('sessionToken').textContent = currentUser.sessionToken;
    
    // Show admin panel if user is admin
    const adminPanel = document.getElementById('adminPanel');
    if (currentUser.role === 'admin' || sessionData.isAdmin || currentUser.accessLevel >= 5) {
        adminPanel.style.display = 'block';
    } else {
        adminPanel.style.display = 'none';
    }
}

function updateStorageDisplay() {
    const storageDiv = document.getElementById('storageDisplay');
    
    const localStorageObj = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageObj[key] = localStorage.getItem(key);
    }
    
    const sessionStorageObj = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        sessionStorageObj[key] = sessionStorage.getItem(key);
    }
    
    const storageContent = `
<strong>localStorage:</strong>
${JSON.stringify(localStorageObj, null, 2)}

<strong>sessionStorage:</strong>
${JSON.stringify(sessionStorageObj, null, 2)}

<strong>JavaScript Variables:</strong>
currentUser: ${JSON.stringify(currentUser, null, 2)}
sessionData: ${JSON.stringify(sessionData, null, 2)}`;
    
    storageDiv.innerHTML = '<pre>' + storageContent + '</pre>';
}

function logMessage(message) {
    const log = document.getElementById('consoleLog');
    const timestamp = new Date().toLocaleTimeString();
    log.innerHTML += '<br>[' + timestamp + '] ' + message;
    log.scrollTop = log.scrollHeight;
}

async function performAction(action) {
    const actionData = {
        action: action,
        userRole: currentUser.role,
        credits: currentUser.credits,
        accessLevel: currentUser.accessLevel,
        sessionToken: currentUser.sessionToken
    };
    
    logMessage(`🔄 Attempting action: ${action}`);
    
    try {
        const response = await fetch('/lab3/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actionData)
        });
        
        const result = await response.json();
        
        // Display results
        const resultPanel = document.getElementById('resultPanel');
        let html = '<h3>Action Processing Results</h3>';
        
        if (result.allowed) {
            html += '<div style="color: #28a745; margin-bottom: 1rem;">';
            html += '<strong>✅ Action Completed Successfully!</strong></div>';
            html += `<p><strong>Action:</strong> ${action}</p>`;
            html += `<p><strong>Server Response:</strong> ${result.message}</p>`;
            logMessage(`✅ ${action} completed successfully`);
        } else {
            html += '<div style="color: #dc3545; margin-bottom: 1rem;">';
            html += '<strong>🚫 Action Blocked by Server!</strong></div>';
            html += `<p><strong>Action:</strong> ${action}</p>`;
            html += `<p><strong>Server Response:</strong> ${result.message}</p>`;
            logMessage(`❌ ${action} blocked by server`);
        }
        
        // Show client vs server values comparison
        if (result.client_values && result.server_values) {
            html += '<div style="background-color: #fff3cd; padding: 1rem; border-radius: 8px; margin-top: 1rem;">';
            html += '<h4 style="color: #856404; margin-bottom: 0.5rem;">📊 Client vs Server Values:</h4>';
            html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">';
            
            html += '<div><strong>Your Client Values:</strong><br>';
            html += `Role: ${result.client_values.role}<br>`;
            html += `Credits: ${result.client_values.credits}<br>`;
            html += `Access Level: ${result.client_values.access_level}</div>`;
            
            html += '<div><strong>Server Values:</strong><br>';
            html += `Role: ${result.server_values.role}<br>`;
            html += `Credits: ${result.server_values.credits}<br>`;
            html += `Access Level: ${result.server_values.access_level}</div>`;
            
            html += '</div></div>';
        }
        
        // Show server-side detection alerts
        if (result.alerts && result.alerts.length > 0) {
            html += '<div style="background-color: #f8d7da; padding: 1rem; border-radius: 8px; margin-top: 1rem;">';
            html += '<h4 style="color: #dc3545; margin-bottom: 0.5rem;">🚨 Server-Side Attack Detection:</h4>';
            result.alerts.forEach(alert => {
                html += `<p style="color: #721c24; margin: 0.25rem 0;">${alert}</p>`;
                logMessage(`🚨 ${alert}`);
            });
            html += '</div>';
        }
        
        resultPanel.innerHTML = html;
        resultPanel.style.display = 'block';
        resultPanel.className = result.allowed ? 'result-panel' : 'result-panel error';
        
    } catch (error) {
        console.error('Error performing action:', error);
        logMessage(`💥 Error: ${error.message}`);
    }
}

// ATTACK FUNCTIONS
function becomeAdmin() {
    const oldRole = currentUser.role;
    
    currentUser.role = "admin";
    currentUser.username = "admin_hacker";
    currentUser.accessLevel = 9;
    currentUser.sessionToken = "admin_hacked_token";
    sessionData.isAdmin = true;
    
    // Also update browser storage
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('authToken', 'admin_hacked_token');
    sessionStorage.setItem('accessLevel', '9');
    
    updateDisplay();
    updateStorageDisplay();
    
    logMessage(`🚨 PRIVILEGE ESCALATION: ${oldRole} → admin`);
    
    alert('🚨 PRIVILEGE ESCALATION SUCCESSFUL!\n\n' +
          `Role changed: ${oldRole} → admin\n` +
          'Access level: 1 → 9\n' +
          'Username: guest_user → admin_hacker\n' +
          'Session token: Updated\n\n' +
          'You now have access to admin features!');
}

function addCredits() {
    const oldCredits = currentUser.credits;
    
    currentUser.credits = 9999;
    sessionData.credits = 9999;
    
    // Also update browser storage
    localStorage.setItem('credits', '9999');
    
    updateDisplay();
    updateStorageDisplay();
    
    logMessage(`💰 CREDIT MANIPULATION: ${oldCredits} → 9999`);
    
    alert('🚨 CREDIT MANIPULATION SUCCESSFUL!\n\n' +
          `Credits increased: ${oldCredits} → 9999\n` +
          'You can now access all premium features!\n\n' +
          'In a real application, this would represent\n' +
          'thousands of dollars in free services.');
}

function stealSession() {
    const stolenData = {
        authToken: localStorage.getItem('authToken'),
        sessionId: sessionStorage.getItem('sessionId'),
        userRole: localStorage.getItem('userRole'),
        credits: localStorage.getItem('credits'),
        currentUser: { ...currentUser },
        sessionData: { ...sessionData }
    };
    
    logMessage('🚨 SESSION HIJACKING ATTEMPT');
    logMessage('Stolen auth token: ' + stolenData.authToken);
    logMessage('Stolen session ID: ' + stolenData.sessionId);
    
    // Simulate sending to attacker server
    console.log('🚨 STOLEN SESSION DATA:', stolenData);
    
    alert('🚨 SESSION HIJACKING SUCCESSFUL!\n\n' +
          'Stolen Information:\n' +
          `• Auth Token: ${stolenData.authToken}\n` +
          `• Session ID: ${stolenData.sessionId}\n` +
          `• User Role: ${stolenData.userRole}\n` +
          `• Credits: ${stolenData.credits}\n\n` +
          'This data has been logged to console and could be\n' +
          'sent to an attacker server for session replay!');
}

function manipulateStorage() {
    // Completely manipulate browser storage
    localStorage.setItem('userRole', 'superadmin');
    localStorage.setItem('credits', '999999');
    localStorage.setItem('authToken', 'god_mode_token_xyz');
    localStorage.setItem('accessLevel', '999');
    
    sessionStorage.setItem('accessLevel', '999');
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('permissions', 'all');
    
    updateStorageDisplay();
    
    logMessage('🚨 BROWSER STORAGE COMPLETELY MANIPULATED');
    
    alert('🚨 BROWSER STORAGE MANIPULATION!\n\n' +
          'All storage values have been modified:\n' +
          '• Role: superadmin\n' +
          '• Credits: 999999\n' +
          '• Auth Token: god_mode_token_xyz\n' +
          '• Access Level: 999\n\n' +
          'Any application relying on browser storage\n' +
          'for security is now completely compromised!');
}

function bypassAccessControl() {
    // Override all access control functions
    const originalPerformAction = window.performAction;
    
    window.performAction = function(action) {
        logMessage(`🚨 ACCESS CONTROL BYPASSED for action: ${action}`);
        logMessage(`✅ ${action} executed without authorization!`);
        
        const resultPanel = document.getElementById('resultPanel');
        resultPanel.innerHTML = `
            <h3>🚨 Access Control Bypassed!</h3>
            <div style="color: #dc3545; margin-bottom: 1rem;">
                <strong>UNAUTHORIZED ACCESS SUCCESSFUL!</strong>
            </div>
            <p><strong>Action:</strong> ${action}</p>
            <p><strong>Status:</strong> Executed without server validation</p>
            <p><strong>Method:</strong> JavaScript function override</p>
            <div style="background-color: #f8d7da; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4 style="color: #dc3545;">Complete Security Bypass Achieved</h4>
                <p>All client-side access controls have been disabled. This demonstrates why security decisions must NEVER be made on the client side.</p>
            </div>
        `;
        resultPanel.style.display = 'block';
        resultPanel.className = 'result-panel error';
    };
    
    // Also escalate all client-side privileges
    currentUser.role = "god";
    currentUser.accessLevel = 999;
    currentUser.credits = 999999;
    
    updateDisplay();
    
    logMessage('🚨 COMPLETE ACCESS CONTROL BYPASS ACTIVATED');
    
    alert('🚨 COMPLETE ACCESS CONTROL BYPASS!\n\n' +
          'All security functions have been overridden!\n' +
          '• JavaScript validation: DISABLED\n' +
          '• Access controls: BYPASSED\n' +
          '• Privilege checks: IGNORED\n\n' +
          'Try any action now - they will all succeed\n' +
          'without server validation!');
}

// Make variables and functions globally accessible for console manipulation
window.currentUser = currentUser;
window.sessionData = sessionData;
window.updateDisplay = updateDisplay;
window.updateStorageDisplay = updateStorageDisplay;
window.logMessage = logMessage;
