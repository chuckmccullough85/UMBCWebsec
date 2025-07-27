# Chapter 7 Client-Side Security Labs

Interactive Flask web application demonstrating why "Never Trust the Client" is a fundamental security principle.

## 🎯 Overview

This application provides three hands-on labs that demonstrate common client-side security vulnerabilities:

1. **Lab 1: Client-Side Validation Bypass** - Banking transfer form with bypassable limits
2. **Lab 2: Hidden Field Manipulation** - E-commerce checkout with tamperable pricing
3. **Lab 3: Session Management Attacks** - Web app with client-side privilege controls

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Flask web framework

### Installation

1. **Install Flask:**
   ```bash
   pip install flask
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Open your browser:**
   ```
   http://localhost:5000
   ```

## 📚 Lab Descriptions

### Lab 1: Client-Side Validation Bypass 🏦
**Objective:** Bypass $1000 transfer limit and 50-character memo restriction

**What you'll learn:**
- HTML attribute manipulation (`max`, `maxlength`)
- JavaScript validation bypass
- DOM tampering techniques
- Why client-side validation ≠ security

**Attack methods:**
- Browser developer tools manipulation
- JavaScript console commands
- Automated bypass buttons

### Lab 2: Hidden Field Manipulation 🛒
**Objective:** Change product prices and escalate user privileges

**What you'll learn:**
- Hidden fields are completely visible in HTML
- Price manipulation techniques
- User role escalation
- Business logic bypass

**Attack methods:**
- Hidden field value modification
- Privilege escalation attacks
- Discount manipulation
- Complete price override

### Lab 3: Session Management Attacks 🔑
**Objective:** Manipulate JavaScript variables and browser storage

**What you'll learn:**
- Client-side session vulnerabilities
- JavaScript variable manipulation
- localStorage/sessionStorage attacks
- Session token theft

**Attack methods:**
- Browser console exploitation
- Global variable modification
- Storage manipulation
- Complete access control bypass

## 🔧 How to Use

1. **Start with Lab 1** - Complete the labs in order for progressive learning
2. **Use browser developer tools** - Press F12 to open DevTools
3. **Try manual attacks first** - Learn to manipulate HTML/JavaScript yourself
4. **Use automated attack buttons** - See common exploitation patterns
5. **Check the attack log** - View server-side detection of your attempts

## 🚨 Server-Side Detection

This application includes **proper server-side validation** that detects client-side tampering:

- **Price validation:** Compares client prices with server database
- **Role verification:** Validates user roles against authoritative data
- **Range checking:** Enforces business logic limits
- **Attack logging:** Records all detected tampering attempts

Visit the Attack Log page to see how the server detects your manipulation attempts!

## 🎓 Educational Objectives

Students will understand:

- ✅ **Why client-side security fails** - Users control their browsers completely
- ✅ **Common attack techniques** - DOM manipulation, hidden field tampering, session attacks
- ✅ **Real-world impact** - How these vulnerabilities lead to financial fraud
- ✅ **Proper security architecture** - Server-side validation and "Never Trust the Client"

## 💰 Real-World Examples

These labs are based on actual security incidents:

- **2019:** E-commerce platform lost $2M due to client-side price validation
- **2020:** Banking app allowed unlimited transfers via DOM manipulation
- **2021:** Gaming platform lost $500K to client-side currency manipulation
- **2022:** Airline allowed $0 tickets through hidden field tampering

## 🛡️ Security Principles Demonstrated

### ❌ Wrong Approach (Client-Side)
```javascript
// Client-side validation (easily bypassed)
if (amount > 1000) {
    showError("Amount too high");
    return false;
}
```

### ✅ Correct Approach (Server-Side)
```python
# Server-side validation (secure)
if amount > user_daily_limit:
    log_security_event("Transfer limit exceeded")
    return {"error": "Transfer denied"}
```

## 🔗 Additional Resources

- [OWASP Client-Side Security](https://owasp.org/www-community/attacks/)
- [Browser Security Handbook](https://code.google.com/archive/p/browsersec/)
- [Web Application Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

## ⚠️ Educational Use Only

**Important:** These labs demonstrate real security vulnerabilities for educational purposes only. Never attempt these techniques on systems you don't own or without explicit permission.

## 📂 Project Structure

```
chapter7_flask_labs/
├── app.py                 # Main Flask application
├── templates/
│   ├── index.html        # Lab selection page
│   ├── lab1_banking.html # Banking validation bypass
│   ├── lab2_ecommerce.html # Hidden field manipulation
│   ├── lab3_session.html # Session management attacks
│   └── attack_log.html   # Attack detection log
├── static/
│   ├── css/style.css     # Application styling
│   └── js/
│       ├── lab1.js      # Lab 1 JavaScript
│       ├── lab2.js      # Lab 2 JavaScript
│       └── lab3.js      # Lab 3 JavaScript
└── README.md            # This file
```

## 🎯 Key Takeaways

1. **Never trust the client** - Users have complete control over their browsers
2. **Server-side validation is mandatory** - All security decisions must be made server-side
3. **Client-side measures are for UX only** - Not for security
4. **Always assume client data is tampered** - Validate everything on the server

---

**Happy learning! Remember: The client is in the user's control, not yours!** 🔐
