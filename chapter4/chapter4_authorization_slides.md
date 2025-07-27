---
marp: true
theme: gaia
paginate: true
style: |
  section {
    font-size: 175%;
  }
  .important {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
  }
  .warning {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
  }
  .success {
    background-color: #d1edff;
    border: 1px solid #bee5eb;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
  }
  section.lead h1 {
    text-align: center;
  }
---

<!-- 
_class: lead 
_paginate: false
-->

# Chapter 4: Authorization
## TCPRG4005 Secure Programming

**Controlling What Users Can Do**

---
<!-- 
Speaker Notes:
Welcome to Chapter 4 on Authorization. This is a critical security topic that determines what authenticated users are allowed to do in our systems. Authorization is the gatekeeper that enforces security policies after authentication has verified who the user is.

Key learning objectives for today:
1. Understanding the difference between authentication and authorization
2. Learning common authorization vulnerabilities and how to prevent them
3. Implementing secure authorization systems
4. Understanding role-based access control (RBAC)
5. Exploring real-world authorization failures and their consequences
-->

# Learning Objectives

By the end of this chapter, you will be able to:

- **Distinguish** between authentication and authorization
- **Identify** common authorization vulnerabilities  
- **Implement** secure authorization checks
- **Design** role-based access control systems
- **Prevent** privilege escalation attacks
- **Apply** defense-in-depth authorization strategies

---
<!-- 
Speaker Notes:
These learning objectives build on our authentication knowledge from Chapter 3. While authentication asks "who are you?", authorization asks "what are you allowed to do?". This distinction is crucial - you can be properly authenticated but still not authorized for certain actions.

The vulnerabilities we'll cover are unfortunately very common in real applications. Many data breaches stem from authorization failures rather than authentication bypasses.
-->

# What is Authorization?

<div class="important">

**Authorization** determines whether a **verified user** has **permission** to perform a **specific action** or access a **particular resource**.

</div>

## Key Concepts:
- **Authentication** ➡️ "Who are you?"
- **Authorization** ➡️ "What can you do?"
- **Access Control** ➡️ Enforcing authorization decisions
- **Privilege** ➡️ A permission to perform an action

---
<!-- 
Speaker Notes:
This slide establishes the fundamental concept. Authorization always comes AFTER authentication - you can't authorize someone you haven't identified. 

Think of it like entering a secure building:
1. Authentication: You show your ID at the front desk
2. Authorization: Your ID determines which floors you can access

The key insight is that not everything requires authorization - some actions are available to all users. The challenge is carefully enumerating which actions DO require authorization checks.
-->

# The Authorization Process

## Authorization Flow:

1. **User Request** → Is user authenticated?
   - **No** → Deny - Redirect to Login
   - **Yes** → Continue to authorization check

2. **Authorization Check** → Is user authorized for this action?
   - **No** → Deny - Access Forbidden (HTTP 403)
   - **Yes** → Allow - Execute Action

3. **Action Execution** → Log the action for audit trail

<div class="success">
Always check authorization for **every** privileged action, not just at login!
</div>

---
<!-- 
Speaker Notes:
This flowchart shows the proper authorization flow. Notice that we check authentication first, then authorization. Each step can result in denial.

Key points to emphasize:
- Authorization checks happen for EVERY protected action, not just once
- Logging is important for auditing and incident response
- The system should fail securely - deny by default
- Never trust client-side authorization decisions

Common mistake: Only checking authorization once at login. User privileges can change during their session!
-->

# Common Authorization Models

<div class="columns">
<div>

## Role-Based Access Control (RBAC)
- Users assigned to **roles**
- Roles have **permissions**
- Scalable and manageable

## Attribute-Based Access Control (ABAC)
- Dynamic decisions based on **attributes**
- User, resource, environment context
- Fine-grained but complex

</div>
<div>

## Access Control Lists (ACL)
- Direct user-to-resource mapping
- Simple but hard to maintain

## Mandatory Access Control (MAC)
- System-enforced security levels
- Government/military applications

</div>
</div>

---
<!-- 
Speaker Notes:
Different authorization models suit different needs:

RBAC is most common in business applications. Examples:
- "Admin" role can delete users
- "Manager" role can approve expenses
- "Employee" role can view reports

ABAC is powerful for complex scenarios:
- "Allow if user is manager AND resource is in their department AND time is business hours"

ACLs are simple but don't scale:
- "John can read file1.txt"
- "Mary can write file2.txt"

MAC is for high-security environments where individual users can't change permissions.

Most real systems use hybrid approaches.
-->

# Vulnerability #1: Trusting User-Supplied Data

<div class="warning">
It is truly impressive how many web applications can be exploited by adding **?admin=1** to a given URL.
</div>

## The Problem:
- Privileges stored in **cookies**, **URLs**, or **client-side** code
- Users can **modify** these values
- Applications **trust** user-provided authorization data

## Examples:
- `?admin=true` in URL parameters
- `role=administrator` in cookies  
- Hidden form fields with privilege flags

---
<!-- 
Speaker Notes:
This is probably the most common authorization vulnerability. The quote about "?admin=1" is from our textbook and it's unfortunately very accurate.

Real examples I've seen:
- Banking application with account balance in cookies
- E-commerce site with "is_admin" in local storage
- Internal tool checking URL parameters for role permissions

The fundamental principle: NEVER trust data that comes from the client. All authorization decisions must be made server-side using server-controlled data.

Demo idea: Show a simple web form where changing a hidden field grants admin access.
-->

# Example: Vulnerable Authorization

```php
// BAD: Trusting user-supplied data
if ($_GET['admin'] == '1') {
    // Execute admin-only operation
    deleteAllUsers();
}

// BAD: Trusting cookies
if ($_COOKIE['role'] == 'administrator') {
    // Execute admin operation
    accessSecretData();
}

// BAD: Client-side authorization
<script>
if (userRole === 'admin') {
    showAdminPanel();
}
</script>
```

<div class="warning">
An attacker can easily modify URLs, cookies, and client-side code!
</div>

---
<!-- 
Speaker Notes:
These examples show common anti-patterns. Let's walk through each:

1. URL parameters - an attacker just needs to add ?admin=1 to any URL
2. Cookies - easily modified with browser dev tools or HTTP interceptors
3. Client-side JavaScript - can be bypassed entirely

The real danger is that these look "secure" to inexperienced developers. The application appears to check authorization, but it's checking data controlled by the attacker.

Note that client-side checks can be useful for UX (hiding irrelevant UI elements) but should NEVER be the only authorization check.
-->

# Secure Authorization Implementation

```php
// GOOD: Server-side role checking
function hasRole($userId, $requiredRole) {
    // Query trusted database
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $userRole = $stmt->fetchColumn();
    
    return $userRole === $requiredRole;
}

// GOOD: Check before every privileged action
if (hasRole($_SESSION['user_id'], 'administrator')) {
    deleteAllUsers();
} else {
    http_response_code(403);
    die("Access forbidden");
}
```

<div class="success">
Authority must come from a **trusted source** under **server control**!
</div>

---
<!-- 
Speaker Notes:
This shows the proper way to handle authorization:

1. Store authoritative role data in a server-controlled database
2. Use authenticated user ID to look up current permissions
3. Make authorization decisions server-side only
4. Check permissions for every privileged action

Key principles:
- Single source of truth for permissions (the database)
- Authenticated session provides user identity
- Server makes all authorization decisions
- Fail securely with appropriate error codes

The session user_id should come from a secure authentication system, not user input.
-->

# Vulnerability #2: Missing Authentication Checks

```php
// BAD: Authorization without authentication
if ($_SESSION['uid'] == 0) {
    // Execute admin-only operation
}

// BAD: Default values can be dangerous  
if ($_SESSION) {
    $uid = $_SESSION['uid'];
}
if ($uid == 0) {  // $uid might be uninitialized!
    // Execute admin-only operation
}
```

<div class="warning">
If **$_SESSION** is not set, these checks may use **default values** that grant unintended privileges!
</div>

---
<!-- 
Speaker Notes:
This vulnerability occurs when developers check authorization without first ensuring the user is authenticated. The danger is that uninitialized variables often default to values that might grant privileges.

In PHP:
- Uninitialized variables default to null/false/0
- If admin users have ID 0, an unauthenticated user might accidentally get admin access

Similar issues occur in other languages:
- JavaScript: undefined values in comparisons
- Python: None values in conditionals
- C: uninitialized memory containing arbitrary values

The fix is always checking authentication before authorization.
-->

# Secure Authentication + Authorization

```php
// GOOD: Require authentication first
if (!$_SESSION || !isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Location: /login');
    exit();
}

// GOOD: Use obviously invalid defaults
$uid = -1;  // Invalid user ID
if ($_SESSION) {
    $uid = $_SESSION['user_id'];
}

// GOOD: Chain authorization after authentication
if ($_SESSION && isset($_SESSION['user_id'])) {
    $uid = $_SESSION['user_id'];
    if (hasAdminRole($uid)) {
        // Execute admin-only operation
    }
}
```

---
<!-- 
Speaker Notes:
The three examples show progressively better approaches:

1. First example: Block all unauthenticated access to protected areas
2. Second example: Use obviously invalid default values (-1 can never be a valid user ID)
3. Third example: Chain the checks together so authorization only happens after authentication

Best practice is the first approach - prevent unauthenticated users from reaching authorization code entirely. This creates clear security boundaries in your application.

The key insight: Make it impossible for the authorization check to accidentally succeed due to missing authentication data.
-->

# Vulnerability #3: Insufficient Privilege Separation

<div class="warning">
Running everything as **root/administrator** amplifies the damage from any successful attack.
</div>

## The Problem:
- Web applications running with **excessive privileges**
- Single compromise = **complete system compromise**
- No containment of **lateral movement**

## The Solution: **Defense in Depth**
- Separate processes for **different privilege levels**
- **Minimal permissions** for each component
- **System-level** access controls and quotas

---
<!-- 
Speaker Notes:
This is an architectural security principle. Even if your application-level authorization is perfect, defense-in-depth means limiting the damage if something goes wrong.

Real-world example: If a web application runs as root and has a shell injection vulnerability, the attacker gets root access to the entire system. But if the same application runs as a limited user, the damage is contained.

Key strategies:
- Web server runs as non-privileged user
- Database connections use limited accounts
- File operations use separate processes with minimal permissions
- System quotas prevent resource exhaustion attacks

This is about limiting blast radius - making sure one compromised component can't take down everything.
-->

# Implementing Privilege Separation

```python
# BAD: Everything runs as one privileged process
def archive_file(filename):
    # This runs as root - very dangerous!
    os.system(f"tar -czf archive.tar.gz {filename}")

# GOOD: Delegate to separate limited process
def archive_file(filename):
    # Validate input first
    if not is_safe_filename(filename):
        raise ValueError("Invalid filename")
    
    # Run as limited archiver user via subprocess
    subprocess.run([
        "sudo", "-u", "archiver",
        "/usr/local/bin/safe_archiver.sh",
        filename
    ], check=True)
```

<div class="success">
Separate processes, separate users, separate permissions!
</div>

---
<!-- 
Speaker Notes:
This example shows how to implement privilege separation in practice:

Bad approach:
- Everything runs in one process with high privileges
- Shell injection vulnerability = game over
- No containment if something goes wrong

Good approach:
- Validate input before passing to privileged operation
- Use subprocess to run with different user account
- Limited "archiver" user can only access specific directories
- Custom script with hardcoded safe operations

Additional hardening:
- Resource limits (CPU, memory, disk)
- chroot jails or containers
- SELinux/AppArmor policies
- Regular auditing of subprocess permissions

The goal is making each component only as powerful as it needs to be.
-->

# Role-Based Access Control (RBAC) Design

```python
class AuthorizationSystem:
    def __init__(self):
        self.user_roles = {}     # user_id -> set of roles
        self.role_permissions = {}  # role -> set of permissions
        
    def assign_role(self, user_id, role):
        if user_id not in self.user_roles:
            self.user_roles[user_id] = set()
        self.user_roles[user_id].add(role)
        
    def check_permission(self, user_id, permission):
        user_roles = self.user_roles.get(user_id, set())
        for role in user_roles:
            if permission in self.role_permissions.get(role, set()):
                return True
        return False
```

---
<!-- 
Speaker Notes:
This shows a basic RBAC implementation. Key concepts:

1. Separation of users and roles - users can have multiple roles
2. Separation of roles and permissions - roles can have multiple permissions
3. Check function that traverses the relationships

In practice, this would be backed by a database with tables like:
- users (id, name, email, etc.)
- roles (id, name, description)
- permissions (id, name, description)
- user_roles (user_id, role_id)
- role_permissions (role_id, permission_id)

Benefits of RBAC:
- Easy to add new users (just assign existing roles)
- Easy to modify permissions (change role definitions)
- Clear audit trail (who has what role)
- Supports principle of least privilege

This is a simplified example - production systems need more features like role hierarchies, time-based permissions, etc.
-->

# RBAC Example: Document Management

```python
# Define roles and permissions
auth = AuthorizationSystem()

# Set up role permissions
auth.role_permissions['viewer'] = {'read_document'}
auth.role_permissions['editor'] = {'read_document', 'edit_document'}
auth.role_permissions['admin'] = {'read_document', 'edit_document', 
                                 'delete_document', 'manage_users'}

# Assign user roles
auth.assign_role('alice', 'editor')
auth.assign_role('bob', 'viewer')
auth.assign_role('charlie', 'admin')

# Check permissions before actions
def delete_document(user_id, doc_id):
    if not auth.check_permission(user_id, 'delete_document'):
        raise PermissionError("Access denied")
    # Perform deletion...
```

---
<!-- 
Speaker Notes:
This practical example shows RBAC in action for a document management system:

Role hierarchy (from least to most privilege):
- Viewer: Can only read documents
- Editor: Can read and modify documents  
- Admin: Can do everything including user management

Notice how:
- Alice (editor) can modify documents but not delete them
- Bob (viewer) has read-only access
- Charlie (admin) has full access

The delete_document function shows the authorization check pattern:
1. Check permission before performing action
2. Fail securely if permission denied
3. Only execute the action if authorized

Real systems might have more complex roles:
- Department-specific editors
- Time-limited access
- Document owner permissions
- Approval workflows

The key is designing roles that match your business requirements while maintaining security.
-->

# Common Authorization Vulnerabilities

<div class="columns">
<div>

## **Insecure Direct Object References**
- Accessing objects by ID without permission check
- `/user/123/profile` → change to `/user/456/profile`

## **Missing Function Level Access Control**
- Protected UI but unprotected API endpoints
- Hidden admin menu but accessible admin URLs

</div>
<div>

## **Privilege Escalation**
- Horizontal: Access other users' data
- Vertical: Gain higher privileges

## **Race Conditions**
- Permission checks vs. action execution
- Time-of-check vs. time-of-use

</div>
</div>

---
<!-- 
Speaker Notes:
These are the most common authorization vulnerabilities found in real applications:

Insecure Direct Object References (IDOR):
- Very common in REST APIs
- Example: /api/orders/12345 - what if I try 12346?
- Fix: Always verify the current user can access the requested object

Missing Function Level Access Control:
- JavaScript hides admin menu but /admin/users still works
- API endpoints not properly protected
- Fix: Server-side authorization for every endpoint

Privilege Escalation:
- Horizontal: Alice accesses Bob's account
- Vertical: Regular user becomes admin
- Often combined with other vulnerabilities

Race Conditions:
- Check permission in one thread, execute in another
- Permission changes between check and execution
- Fix: Atomic operations or locks

Each of these has caused major data breaches in real applications.
-->

# Preventing Insecure Direct Object References

```python
# BAD: No authorization check
@app.route('/user/<user_id>/profile')
def get_profile(user_id):
    profile = db.get_user_profile(user_id)
    return render_template('profile.html', profile=profile)

# GOOD: Verify ownership
@app.route('/user/<user_id>/profile')
@login_required
def get_profile(user_id):
    if not can_access_user(current_user.id, user_id):
        abort(403)
    profile = db.get_user_profile(user_id)
    return render_template('profile.html', profile=profile)

def can_access_user(current_user_id, target_user_id):
    # Users can access their own profile, admins can access anyone's
    return (current_user_id == target_user_id or 
            has_role(current_user_id, 'admin'))
```

---
<!-- 
Speaker Notes:
IDOR is extremely common because it's easy to forget the authorization check. The pattern is:

1. Extract object ID from URL/request
2. Check if current user can access that object
3. Only then retrieve and return the object

The can_access_user function implements the business logic:
- Users can access their own profiles
- Admins can access any profile
- Everyone else gets denied

Common IDOR locations:
- User profiles (/user/123)
- Documents (/document/456)
- Orders (/order/789)
- Messages (/message/101112)

Prevention strategies:
- Always check authorization before object access
- Use UUIDs instead of sequential IDs (makes guessing harder)
- Implement access control at the database level too
- Regular security testing with different user accounts

The key insight: Just because a URL exists doesn't mean the current user should be able to access it.
-->

# Defense in Depth Strategy

```python
class SecureDocumentService:
    def delete_document(self, user_id, doc_id):
        # Layer 1: Authentication check
        user = self.auth_service.get_authenticated_user(user_id)
        if not user:
            raise AuthenticationError()
            
        # Layer 2: Application-level authorization
        if not self.can_delete_document(user, doc_id):
            raise AuthorizationError()
            
        # Layer 3: Database-level permission check
        doc = self.db.get_document_if_deletable(user_id, doc_id)
        if not doc:
            raise AuthorizationError()
            
        # Layer 4: File system permissions (separate process)
        self.file_service.delete_as_limited_user(doc.file_path)
        
        # Layer 5: Audit logging
        self.audit_log.log_deletion(user_id, doc_id)
```

---
<!-- 
Speaker Notes:
Defense in depth means multiple independent security layers. If one layer fails, others provide protection.

Layer breakdown:
1. Authentication: Verify user identity with valid session
2. Application authorization: Check business rules (roles, permissions)
3. Database authorization: Database-level row security or views
4. System authorization: File system permissions, separate user accounts
5. Audit logging: Track all actions for investigation

Why multiple layers?
- Bugs in application code don't bypass database security
- Compromised application can't access all system files
- Database compromise doesn't give file system access
- Audit trail helps detect and investigate attacks

Each layer should be independent:
- Different technologies (app code, database, OS)
- Different attack vectors required
- Different teams can maintain each layer

Real example: Even if an attacker finds SQL injection, they still can't delete files without OS-level permissions, and all attempts are logged.
-->

# Authorization Logging and Monitoring

```python
import logging
from datetime import datetime

class AuthorizationLogger:
    def __init__(self):
        self.logger = logging.getLogger('authorization')
        
    def log_access_granted(self, user_id, resource, action):
        self.logger.info(f"ACCESS_GRANTED: user={user_id} "
                        f"resource={resource} action={action} "
                        f"timestamp={datetime.utcnow()}")
                        
    def log_access_denied(self, user_id, resource, action, reason):
        self.logger.warning(f"ACCESS_DENIED: user={user_id} "
                           f"resource={resource} action={action} "
                           f"reason={reason} timestamp={datetime.utcnow()}")
                           
    def log_privilege_escalation_attempt(self, user_id, attempted_action):
        self.logger.critical(f"PRIVILEGE_ESCALATION: user={user_id} "
                           f"attempted={attempted_action} "
                           f"timestamp={datetime.utcnow()}")
```

---
<!-- 
Speaker Notes:
Authorization logging is crucial for:
1. Security monitoring and incident response
2. Compliance and auditing requirements
3. Understanding user behavior patterns
4. Detecting attack attempts

What to log:
- All authorization decisions (granted and denied)
- Context: user, resource, action, timestamp
- Failed attempts (potential attacks)
- Privilege changes and role assignments

Log levels:
- INFO: Normal successful access
- WARNING: Denied access (might be normal or suspicious)
- CRITICAL: Clear attack attempts or privilege escalation

Important considerations:
- Don't log sensitive data (passwords, PII)
- Use structured logging for easy analysis
- Store logs securely (attackers often try to delete evidence)
- Set up alerting for suspicious patterns

Example suspicious patterns:
- Many rapid access denials from one user
- Attempts to access many different resources
- Access patterns outside normal business hours
- Users trying to access resources they've never accessed before

This logging integrates with SIEM systems for automated threat detection.
-->

# Real-World Case Study: Broken Authorization

<div class="warning">

**Case: Social Media Data Breach**
- **Vulnerability**: Insecure Direct Object References in API
- **Impact**: 50 million user profiles exposed
- **Attack**: Incrementing user IDs in API calls
- **Root Cause**: Missing authorization checks in API endpoints

</div>

## Lessons Learned:
1. **Every API endpoint** needs authorization checks
2. **Hidden != Secure** - UI restrictions are not enough
3. **Automated testing** can catch these vulnerabilities
4. **Security reviews** should include all endpoints, not just UI

---
<!-- 
Speaker Notes:
This is based on real breaches like the Facebook/Cambridge Analytica incident and others where IDOR vulnerabilities led to massive data exposure.

Attack timeline:
1. Attacker discovers API endpoint like /api/user/12345/profile
2. Attacker writes script to increment user ID and fetch profiles
3. No authorization check means attacker gets data for all users
4. Millions of profiles downloaded before detection

Why this happened:
- Developers secured the web UI but forgot about direct API access
- Authorization logic was only in frontend JavaScript
- No rate limiting on API endpoints
- No monitoring for unusual access patterns

Prevention strategies:
- Treat APIs as first-class attack surfaces
- Implement authorization at the API layer, not just UI
- Use automated security testing tools
- Monitor for unusual access patterns
- Implement rate limiting and request validation

The key lesson: Every way to access data needs the same level of security. Attackers don't use your UI - they attack your APIs directly.
-->

# Best Practices Summary

<div class="success">

## ✅ **Do This:**
- **Server-side authorization** for every protected action
- **Principle of least privilege** - minimum required permissions
- **Fail securely** - deny by default
- **Defense in depth** - multiple independent security layers
- **Comprehensive logging** for audit and monitoring

</div>

<div class="warning">

## ❌ **Don't Do This:**
- **Client-side authorization** as the only check
- **Trust user-supplied** authorization data
- **Authorization without authentication** checks first
- **Excessive privileges** for application processes

</div>

---
<!-- 
Speaker Notes:
These best practices summarize the key takeaways from this chapter:

DO:
- Server-side: All authorization decisions on the server using trusted data
- Least privilege: Users and processes get minimum required permissions
- Fail securely: When in doubt, deny access and log the attempt
- Defense in depth: Multiple layers so one failure doesn't compromise everything
- Logging: Track all authorization decisions for monitoring and compliance

DON'T:
- Client-side only: Never rely solely on JavaScript or hidden form fields
- Trust user data: URLs, cookies, form data can all be manipulated
- Skip authentication: Always verify identity before checking permissions
- Excessive privileges: Don't run everything as admin/root

The overarching principle: Authorization is a security control, not a UI feature. It must be implemented with the same rigor as other security controls like encryption and authentication.

Remember: Perfect authorization is hard, but these practices will prevent the most common vulnerabilities that lead to real breaches.
-->

# Hands-On Exercises

## Exercise 1: Authorization Analysis
**Think about a software system you use that involves users with different privileges. Draft a list of activities that should involve authorization.**

## Exercise 2: Secure Web Service Design  
**Design a web service that allows a user to delete old syslog files from the system. How should authorization be handled? What components are required?**

## Interactive Lab:
- Build a vulnerable authorization system
- Exploit common vulnerabilities  
- Implement secure fixes
- Test defense mechanisms

---
<!-- 
Speaker Notes:
These exercises reinforce the chapter concepts:

Exercise 1 helps students think about authorization in familiar systems:
- Email (read own messages, admin can read all)
- File systems (read/write permissions)
- Banking (view own accounts, teller can view customer accounts)
- Social media (view public posts, friends can see private posts)

Exercise 2 is a realistic scenario that requires thinking about:
- Web authentication (who is the user?)
- File system permissions (can they delete system files?)
- Privilege separation (web process shouldn't run as root)
- Input validation (prevent path traversal attacks)
- Audit logging (track who deleted what)

The interactive lab will let students:
- See real authorization vulnerabilities in action
- Practice exploiting IDOR and privilege escalation
- Implement proper authorization checks
- Test their fixes against attack scenarios

This hands-on approach helps students understand not just the theory but how these vulnerabilities manifest in real code.
-->

# Summary

## Key Takeaways:

1. **Authorization happens AFTER authentication** - verify identity first
2. **Server-side authorization only** - never trust client-side data
3. **Check every privileged action** - not just at login
4. **Principle of least privilege** - minimal required permissions
5. **Defense in depth** - multiple independent security layers
6. **Comprehensive monitoring** - log and alert on authorization events

<div class="important">
**Remember**: Authorization vulnerabilities are among the most common causes of data breaches. Getting this right is critical for application security.
</div>

---
<!-- 
Speaker Notes:
Final summary of the key concepts:

1. Authentication first: Can't authorize someone you haven't identified
2. Server-side decisions: Client data can always be manipulated
3. Every action: Privileges can change during a session
4. Least privilege: Limit damage from successful attacks
5. Defense in depth: Multiple layers provide resilience
6. Monitoring: Detect attacks and ensure compliance

The call-out box emphasizes the real-world importance. Authorization bugs are consistently in the OWASP Top 10 and cause major breaches.

Next steps for students:
- Practice implementing these concepts in their projects
- Study real-world authorization schemes (OAuth, SAML, etc.)
- Learn about advanced topics like ABAC and policy languages
- Stay current with security research and vulnerability reports

The goal is building security-minded developers who think about authorization from the design phase, not as an afterthought.
-->

# Questions & Discussion

## Discussion Topics:
- What authorization systems have you encountered?
- How do you balance security with usability?
- What are the challenges of implementing RBAC at scale?
- How does authorization work in microservices architectures?

## Next Session:
**Chapter 5: User Management**
- User lifecycle management
- Role assignment and privilege changes
- Account security and monitoring

---
<!-- 
Speaker Notes:
The discussion questions encourage students to:
1. Share real-world experience with different authorization systems
2. Think about the practical challenges of implementation
3. Consider advanced architectural patterns
4. Connect theory to their own development work

Common discussion points:
- OAuth and modern web authentication
- Cloud IAM systems (AWS, Azure, GCP)
- Enterprise directory services (Active Directory)
- Mobile app authorization patterns
- API security and token-based auth

The preview of Chapter 5 shows how authorization connects to broader user management concerns:
- How do users get roles in the first place?
- What happens when employees leave the company?
- How do you audit and clean up stale permissions?
- How do you handle emergency access scenarios?

This creates continuity between chapters and shows how security topics interconnect in real systems.
-->
