---
marp: true
theme: gaia
allowLocalFiles: true
style: |
  section {
    font-size: 175%;
  }
---

# Chapter 5: User Management
## TCPRG4005 - Secure Programming

### Managing Users Securely in Software Systems

---

<!--
Speaker Notes:
Welcome to Chapter 5 on User Management. This chapter focuses on how to properly manage users within software systems while maintaining security. We'll explore user lifecycle management, role-based access patterns, and the security implications of user management decisions. This builds directly on our authorization concepts from Chapter 4, but focuses on the broader operational aspects of managing user accounts and roles.

Key learning objectives:
1. Understand secure user creation and lifecycle management
2. Learn about role-based user management patterns
3. Recognize the security risks of group accounts
4. Implement proper audit logging for user actions
5. Design separation of duties for sensitive operations
-->

## Chapter Overview

### Core Topics
- **User Lifecycle Management** - Creation, locking, and role management
- **Role-Based Access Patterns** - Designing effective role structures
- **Account Security Practices** - Avoiding group accounts and shared credentials
- **Audit and Monitoring** - Logging user actions and detecting anomalies
- **Separation of Duties** - Multi-person approval for sensitive operations

### Learning Outcomes
- Design secure user management workflows
- Implement proper user lifecycle controls
- Recognize and prevent common user management vulnerabilities
- Build audit trails for user activities

---

<!--
Speaker Notes:
This overview sets the stage for understanding that user management is not just about creating accounts - it's about the entire lifecycle of users in a system. We need to think about how users are created, how their permissions evolve, how we monitor their activities, and how we handle security incidents.

The key insight is that users are both necessary for system functionality and the primary source of security risk. Good user management balances operational needs with security requirements.
-->

## The User Management Challenge

### Users: The Necessary Security Risk

<div class="warning">
"Users are an unfortunate fact of any successful system. Despite the fact that users may be lazy, insecure, insubordinate, or oblivious, a given system must support them in their goals."
</div>

### Security vs. Usability Balance
- **Too Secure**: Users circumvent security measures
- **Too Permissive**: System becomes vulnerable to attacks
- **Goal**: Transparent security that doesn't impede legitimate work

### Key Principle
<div class="success">
Security should ideally be transparent to legitimate users while remaining effective against threats
</div>

---

<!--
Speaker Notes:
This slide establishes the fundamental tension in user management. Users are essential for system success, but they're also the weakest link in security. The quote emphasizes that users will find ways around security that's too restrictive - often creating worse security holes than the original measures tried to prevent.

The balance we need to strike is making security transparent to legitimate users while maintaining effectiveness against threats. Examples include single sign-on systems, smart card authentication, and role-based access that automatically provides the right permissions without users needing to request them.

Real-world example: Password requirements that are too complex lead users to write passwords down, creating a physical security risk that's often worse than having slightly simpler password requirements.
-->

## User Creation and Locking

### Secure User Creation Process

## User Creation Workflow:

1. **Request** → Initial user creation request
2. **Authorization Check** → Verify requester has permission
3. **Multi-Role Approval** → Require multiple approvers
4. **Account Creation** → Create user account in system
5. **Role Assignment** → Assign minimal required permissions
6. **Audit Log** → Record all creation activities
7. **User Notification** → Notify user of account creation

### Key Principles
- **Multi-Role Approval**: User creation should never be fully automated
- **Principle of Least Privilege**: Start with minimal permissions
- **Immediate Audit Trail**: Log all creation activities
- **Verification Process**: Confirm user identity before activation

---

<!--
Speaker Notes:
User creation is a critical security control point. Unlike password resets or permission changes, creating new users should typically require multiple people to approve - this prevents a single compromised account from creating unauthorized access.

The workflow shown demonstrates defense in depth: authorization check ensures the requester can create users, multi-role approval prevents single points of failure, proper role assignment follows least privilege, and audit logging provides accountability.

Examples of multi-role approval:
- HR initiates, IT security approves
- Manager requests, security team validates
- Automated request with manual approval step

The key is preventing both external attackers and malicious insiders from easily creating unauthorized accounts.
-->

## User Locking vs. Deletion

### Why Lock Instead of Delete?

<div class="two-column">

**Locking Benefits**
- Preserves audit trails
- Allows account recovery
- Maintains data relationships
- Prevents audit gaps

**Deletion Risks**
- Lost forensic evidence
- Broken data integrity
- Irreversible mistakes
- Compliance violations

</div>

### Implementation Strategy
```python
# DON'T: Separate locked field
user.locked = True

# DO: Remove all roles (delegates to authorization)
user.roles.clear()
```

<div class="warning">
Critical: Active users must have role changes applied immediately, not just on next login!
</div>

---

<!--
Speaker Notes:
This is a crucial distinction that many systems get wrong. Deleting users creates audit problems and compliance issues. When users are deleted, you lose the ability to track what they did historically, which is essential for security investigations and compliance audits.

The implementation strategy shown is particularly important. Having a separate "locked" field is dangerous because it's easy to forget to check it in all code paths. By removing all roles instead, you delegate the enforcement to your existing authorization system, which should already be checking roles for every action.

The warning about active users is based on real-world security incidents. Systems that only check roles on login allow compromised users to maintain access by simply not logging out. Role changes must be enforced immediately for all active sessions.

Real example: An employee is terminated but their active session continues to have access because the system only checks roles at login time.
-->

## Automatic Locking Triggers

### When to Automatically Lock Accounts

#### Security-Based Triggers
- **Failed Login Attempts**: Multiple consecutive failures
- **Suspicious Activity**: Unusual access patterns or locations
- **Policy Violations**: Detected security policy breaches
- **Scheduled Reviews**: Inactive accounts after specified periods

#### Business-Based Triggers
- **Employment Changes**: Termination, role changes, transfers
- **Compliance Events**: Audit findings, regulatory requirements
- **Time-Based**: Temporary accounts, project completion

### Implementation Example
```python
def check_auto_lock_conditions(user):
    if user.failed_logins >= 5:
        lock_user(user, "Excessive failed logins")
    if user.last_activity < (now() - timedelta(days=90)):
        lock_user(user, "Inactive account")
    if detect_anomalous_behavior(user):
        lock_user(user, "Suspicious activity detected")
```

---

<!--
Speaker Notes:
Automatic locking is essential for scaling security operations. Manual review of every security event is impossible in large systems, so we need intelligent automation that can respond to clear indicators of compromise or policy violations.

The triggers shown represent different categories of risk:
- Security triggers respond to immediate threats
- Business triggers handle operational changes
- Time-based triggers handle account hygiene

The key principle is that it's much easier to unlock a legitimate user than to clean up after an attacker. False positives in locking are generally acceptable, while false negatives can be catastrophic.

Implementation considerations:
- Ensure unlock processes are well-defined and fast
- Provide clear communication to locked users
- Implement escalation paths for urgent unlock needs
- Log all automatic locking decisions for audit
-->

## Role Design and Management

### Understanding Roles vs. Users

<div class="two-column">

**Users**
- Individual people
- Unique identities
- Personal attributes
- Accountability targets

**Roles**
- Job functions
- Permission sets
- Business processes
- Access patterns

</div>

### Role Assignment Patterns
- **Single Role**: Simple assignments (most users)
- **Multiple Roles**: Complex job functions (managers, cross-functional)
- **Temporary Roles**: Project-based access
- **Emergency Roles**: Break-glass scenarios

### Role Hierarchy Example
```
├── Employee (base role)
│   ├── Developer
│   │   ├── Senior Developer
│   │   └── Lead Developer
│   ├── Manager
│   │   ├── Engineering Manager
│   │   └── Project Manager
│   └── Admin
│       ├── System Admin
│       └── Security Admin
```

---

<!--
Speaker Notes:
The distinction between users and roles is fundamental to scalable access control. Users are people; roles are functions. This separation allows us to manage permissions at the role level while maintaining individual accountability.

Multiple role assignment is common in real organizations. A person might be both a Senior Developer (technical permissions) and a Project Manager (project management permissions). The system needs to aggregate permissions from all assigned roles.

Role hierarchy helps with inheritance and reduces management overhead. A Senior Developer automatically inherits all Developer permissions, plus additional ones. This makes role management more intuitive and reduces the chance of permission gaps.

Temporary roles are crucial for project-based work, consulting, and emergency situations. These should have automatic expiration dates and regular review cycles.

Best practices:
- Keep role names aligned with business functions
- Document role permissions clearly
- Regularly review role assignments
- Implement role explosion detection (users with too many roles)
-->

## Workflow-Driven Role Analysis

### Using Workflow Analysis for Role Discovery

## Purchase Request Workflow Example:

1. **Purchase Request** → Employee submits request
2. **Amount Check** → Is amount > $1000?
   - **Yes** → Requires Manager Approval
   - **No** → Direct to Procurement
3. **Manager Approval** → Review and approve/deny
4. **Department Head Review** → Secondary approval for large amounts
5. **Procurement Processing** → Process approved requests
6. **Vendor Order** → Place order with vendor
7. **Delivery Confirmation** → Confirm receipt of goods
8. **Invoice Processing** → Process payment

### Derived Roles
- **Requestor**: Can create purchase requests
- **Manager**: Can approve requests under threshold
- **Department Head**: Can approve larger requests
- **Procurement**: Can process approved requests
- **Accounts Payable**: Can process invoices

---

<!--
Speaker Notes:
Workflow analysis is one of the most effective ways to identify what roles your system actually needs. By mapping out business processes, you can see exactly what permissions different users need at each step.

This purchase approval workflow reveals several important role requirements:
1. Different approval levels based on monetary thresholds
2. Sequential approval chains for larger amounts
3. Specialized roles for procurement and payment processing

The key insight is that roles should map to actual business functions, not organizational charts. Someone might be a "Senior Vice President" organizationally, but their role in the purchase system might just be "Department Head Approver."

When designing roles from workflows:
- Start with the business process, not the org chart
- Identify decision points and approval gates
- Look for natural separation of duties
- Consider exception paths and emergency procedures
- Keep roles as simple as possible while meeting business needs

This approach prevents role proliferation and ensures that permissions actually match what users need to do their jobs.
-->

## The Group Account Problem

### Why Group Accounts Are Dangerous

<div class="danger">
"Consider a software company that must pay a per-seat license for a mission-critical web service. If the company buys a single seat, and has five people use the account, they are opening themselves to some serious security problems."
</div>

### Security Issues with Shared Accounts
1. **Credential Exposure**: Password shared across multiple people
2. **Expanded Attack Surface**: More people with secrets = more risk
3. **No Individual Accountability**: Can't trace actions to specific users
4. **Audit Impossibility**: All actions look like the same user
5. **Access Revocation Problems**: Can't remove one person's access

### Financial vs. Security Trade-offs
- **Short-term savings** vs. **long-term security costs**
- **Per-seat licensing** vs. **security breach consequences**
- **Convenience** vs. **compliance requirements**

---

<!--
Speaker Notes:
Group accounts represent a classic example of false economy in security. Organizations try to save money on per-seat licensing but create massive security vulnerabilities in the process.

The security issues are multiplicative, not additive. With a shared account:
- If any one person is compromised, the attacker gets the shared account
- If any one person goes rogue, they can act under the shared identity
- If you need to revoke someone's access, you have to change the password for everyone
- You can never tell who actually performed any specific action

Real-world examples where this matters:
- Payroll systems (who authorized that salary change?)
- Cloud storage (who deleted those backup files?)
- Social media accounts (who posted that inappropriate content?)
- Development systems (who pushed that malicious code?)

The key insight for developers is that software pricing models can encourage poor security practices. Making additional accounts expensive relative to the base price incentivizes customers to share accounts, which weakens security for everyone.

Better pricing models: flat rate for organizations under X users, minimal incremental cost for additional seats, or pricing based on features rather than seats.
-->

## Secure Pricing Models

### How Software Pricing Affects Customer Security

#### Problematic Pricing Models
```
❌ High per-seat costs ($100 base + $95 per additional user)
❌ Steep tier jumps (1 user = $50, 2-10 users = $500)
❌ Feature restrictions tied to user count
```

#### Security-Friendly Pricing
```
✅ Reasonable per-seat increments ($100 base + $10 per additional user)
✅ Volume discounts for security (bulk user pricing)
✅ Free additional accounts for security roles
✅ Pricing based on features, not users
```

### Developer Responsibility
<div class="success">
Part of writing secure software is making it easy for users to do the secure thing. Software pricing should not encourage users to weaken their security.
</div>

### Services Requiring Individual Accounts
- **Payroll and HR systems**
- **Cloud storage and backups**
- **Development and deployment tools**
- **Social media and communication**
- **Financial and accounting systems**

---

<!--
Speaker Notes:
This slide addresses an often-overlooked aspect of security: how business decisions in software pricing can create security vulnerabilities for customers. As developers and architects, we have a responsibility to consider how our pricing models affect customer security practices.

The examples show how dramatic pricing differences between single and multiple users can push organizations toward dangerous shared account practices. When adding a second user costs almost as much as the first, sharing becomes financially attractive despite security risks.

Security-friendly pricing recognizes that:
1. Individual accounts are a security best practice
2. Organizations shouldn't be penalized for doing security correctly
3. Some roles (like security administrators) may need separate accounts even if they're the same person

The services list helps developers recognize which types of software particularly need individual account pricing. These are systems where audit trails, accountability, and access revocation are critical security features.

Practical recommendations for product teams:
- Calculate the true cost of a security incident vs. lost per-seat revenue
- Consider offering security-focused pricing tiers
- Make individual accounts the default, not the premium option
- Provide clear documentation on why individual accounts matter
-->

## Authorization Logging and Auditing

### What to Log in User Management

#### Authentication Events
<div class="code-tiny">

```json
{
  "timestamp": "2025-07-23T14:30:22Z",
  "user_id": "john.doe",
  "event": "login_success",
  "source_ip": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "session_id": "abc123def456"
}
```

</div>

#### Authorization Events
<div class="code-tiny">

```json
{
  "timestamp": "2025-07-23T14:35:10Z",
  "user_id": "john.doe",
  "event": "permission_granted",
  "resource": "/admin/users/create",
  "role": "user_admin",
  "result": "allowed"
}
```

</div>

---

<!--
Speaker Notes:
Comprehensive logging is essential for user management security. The three categories shown represent different types of security-relevant events that need different information.

Authentication events help detect:
- Brute force attacks (multiple failed logins)
- Unusual login locations or times
- Session hijacking attempts
- Credential sharing

Authorization events help detect:
- Privilege escalation attempts
- Unauthorized resource access
- Pattern analysis for insider threats
- Compliance verification
-->

## Administrative Event Logging

#### Administrative Events
<div class="code-tiny">

```json
{
  "timestamp": "2025-07-23T14:40:05Z",
  "admin_user": "admin.smith",
  "target_user": "john.doe",
  "event": "role_assigned",
  "role": "developer",
  "justification": "New team member onboarding"
}
```

</div>

### Key Logging Principles
<div class="compact-list">

- **Log security decisions** before and after execution
- **Include context** for investigation purposes
- **Never log sensitive data** (passwords, tokens)
- **Ensure tamper-evidence** and integrity protection
- **Implement retention policies** and automated analysis
- **Plan for alerting** on suspicious patterns

</div>
```

---

<!--
Speaker Notes:
Comprehensive logging is essential for user management security. The three categories shown represent different types of security-relevant events that need different information.

Authentication events help detect:
- Brute force attacks (multiple failed logins)
- Unusual login locations or times
- Session hijacking attempts
- Credential sharing

Authorization events help detect:
- Privilege escalation attempts
- Unauthorized resource access
- Pattern analysis for insider threats
- Compliance verification

Administrative events help detect:
- Unauthorized account modifications
- Privilege creep over time
- Administrative account misuse
- Violation of separation of duties

Key logging principles:
1. Log before and after security decisions
2. Include enough context for investigation
3. Never log sensitive data (passwords, tokens)
4. Ensure logs are tamper-evident
5. Implement log retention policies
6. Plan for log analysis and alerting

The JSON format shown is structured for automated analysis, which is essential for detecting patterns across large numbers of events.
-->

## Anomaly Detection in User Behavior

### Detecting Suspicious Patterns

<div class="compact-list">

#### Time-Based Anomalies
- **Off-hours access**: Logins at unusual times
- **Rapid succession**: Multiple actions in short timeframes
- **Duration anomalies**: Sessions much longer/shorter than normal

#### Location-Based Anomalies
- **Impossible travel**: Geographically impossible locations
- **New locations**: First-time access from unfamiliar IPs
- **VPN detection**: Sudden use of anonymization services

</div>

---

<!--
Speaker Notes:
Anomaly detection is where logging becomes actionable security intelligence. Raw logs are useful for forensics, but real-time detection can prevent ongoing attacks.

The categories shown represent different types of behavioral analysis:

Time-based detection catches:
- Compromised accounts used outside business hours
- Automated attacks (too fast for humans)
- Persistence mechanisms (very long sessions)

Location-based detection catches:
- Account takeover from different geographic regions
- Use of anonymization tools to hide location
- Impossible travel (login from New York, then London 30 minutes later)

These patterns often indicate compromise because they represent deviations from normal user behavior patterns.
-->

## Behavioral Anomaly Detection

<div class="compact-list">

#### Behavior-Based Anomalies
- **Permission escalation**: Attempting actions beyond normal role
- **Data access patterns**: Accessing unusual/excessive amounts of data
- **Administrative actions**: Non-admin users attempting admin functions

</div>

### Example Detection Logic
<div class="code-small">

```python
def detect_suspicious_activity(user, current_action):
    # Off-hours access check
    if current_action.time.hour < 6 or current_action.time.hour > 22:
        if not user.has_after_hours_permission():
            alert("Off-hours access attempt", user, current_action)
    
    # Failed login detection
    if user.failed_logins_today() > 3:
        alert("Multiple failed logins", user, current_action)
    
    # Location-based detection
    if user.location_change_impossible(current_action.ip):
        alert("Impossible travel detected", user, current_action)
```

</div>
```

---

<!--
Speaker Notes:
Anomaly detection is where logging becomes actionable security intelligence. Raw logs are useful for forensics, but real-time detection can prevent ongoing attacks.

The categories shown represent different types of behavioral analysis:

Time-based detection catches:
- Compromised accounts used outside business hours
- Automated attacks (too fast for humans)
- Persistent access by terminated employees

Location-based detection catches:
- Credential theft and remote usage
- Account takeover by external attackers
- Employees working from unauthorized locations

Behavior-based detection catches:
- Insider threats exceeding normal authority
- Compromised accounts performing unusual actions
- Privilege escalation attacks

The key challenge is balancing sensitivity with false positives. Too aggressive and you'll alert on legitimate but unusual behavior. Too permissive and you'll miss real attacks.

Best practices:
- Start with obvious anomalies (impossible travel, off-hours access)
- Build baselines of normal behavior for each user/role
- Use machine learning for complex pattern detection
- Provide clear escalation paths for security teams
- Allow users to self-report legitimate anomalies
-->

## Separation of Duties

### Multi-Person Controls for Sensitive Operations

<div class="two-column">

**Single-Person Risks**
- Fraud opportunities
- Accidental errors
- Coercion vulnerability
- No oversight

**Multi-Person Benefits**
- Fraud prevention
- Error checking
- Collusion required
- Audit trail

</div>

### Implementation Patterns

#### Financial Operations
```
Request → Manager Approval → Finance Review → Payment
```

#### User Administration
```
HR Request → Security Review → Admin Creation → Supervisor Verification
```

#### Data Deletion
```
User Request → Data Owner Approval → Admin Execution → Compliance Review
```

### Technical Implementation
```python
class SeparationOfDuties:
    def require_dual_approval(self, action, initiator, approver):
        if initiator.role == approver.role:
            raise SecurityError("Same role cannot approve")
        if initiator.department == approver.department:
            self.require_external_review(action)
```

---

<!--
Speaker Notes:
Separation of duties is a fundamental control that prevents both fraud and accidents by requiring multiple people to participate in sensitive operations. This concept comes from accounting and finance but applies broadly to security-sensitive operations.

The patterns shown demonstrate how different types of operations need different approval chains:
- Financial operations need manager and finance approval
- User administration needs HR and security involvement
- Data operations need data owner and admin participation

Key design principles:
1. No single person should control an entire sensitive process
2. Approvers should be from different roles or departments
3. The approval chain should match the risk level
4. Emergency procedures should still maintain some separation

Technical implementation considerations:
- Prevent self-approval (same person in different roles)
- Consider department-level conflicts of interest
- Implement time-based approval expiration
- Provide clear audit trails of all approvals
- Handle emergency override procedures securely

Real-world examples:
- Bank wire transfers requiring two signatures
- Code deployments requiring peer review
- Database schema changes requiring DBA approval
- User terminations requiring HR and IT coordination
-->

## User Management Best Practices

<div class="compact-list">

### Lifecycle Management
✅ **Onboarding**: Proper identity verification and role assignment  
✅ **Ongoing**: Regular access reviews and role updates  
✅ **Offboarding**: Immediate access revocation and account locking  
✅ **Auditing**: Continuous monitoring and compliance verification  

### Technical Controls
✅ **Strong Authentication**: Multi-factor authentication for all accounts  
✅ **Session Management**: Timeout and concurrent session limits  
✅ **Password Policies**: Appropriate complexity without encouraging workarounds  
✅ **Account Recovery**: Secure reset procedures with proper verification  

</div>

---

<!--
Speaker Notes:
This slide summarizes the key best practices across the entire user management lifecycle. Each category represents a different aspect of comprehensive user management security.

Lifecycle management ensures that user access remains appropriate as their roles and employment status change. Many security incidents result from outdated access that should have been revoked.

Technical controls provide the foundation for secure user management. These are the mechanisms that enforce policies and detect violations.
-->

## Operational Security Controls

<div class="compact-list">

### Operational Controls
✅ **Regular Reviews**: Periodic access certification and role validation  
✅ **Incident Response**: Clear procedures for compromised accounts  
✅ **Training**: User education on security practices  
✅ **Documentation**: Clear policies and procedures  

### Implementation Priorities
1. **Start with basic lifecycle controls** (onboarding/offboarding)
2. **Implement strong authentication** and session management
3. **Add monitoring and alerting** capabilities
4. **Build regular review processes** and audit procedures
5. **Develop incident response** procedures
6. **Create user training** and awareness programs

</div>  

---

<!--
Speaker Notes:
This slide summarizes the key best practices across the entire user management lifecycle. Each category represents a different aspect of comprehensive user management security.

Lifecycle management ensures that user access remains appropriate as their roles and employment status change. Many security incidents result from outdated access that should have been revoked.

Technical controls provide the foundation for secure user management. These are the mechanisms that enforce policies and detect violations.

Operational controls ensure that technical mechanisms are properly maintained and that humans in the loop make good security decisions.

Key implementation priorities:
1. Start with basic lifecycle controls (onboarding/offboarding)
2. Implement strong authentication and session management
3. Add monitoring and alerting capabilities
4. Build regular review and audit processes
5. Develop incident response procedures
6. Create user training and awareness programs

The goal is defense in depth: multiple layers of controls that work together to prevent, detect, and respond to user management security issues.
-->

## Common User Management Vulnerabilities

<div class="compact-list dense-content">

### Top Security Risks

#### Orphaned Accounts
- **Problem**: Accounts that outlive their users (terminated employees, contractors)
- **Impact**: Persistent unauthorized access
- **Solution**: Automated deprovisioning and regular account audits

#### Privilege Creep
- **Problem**: Users accumulating permissions over time without removal
- **Impact**: Excessive privileges that violate least privilege principle
- **Solution**: Regular access reviews and role-based management

</div>

---

<!--
Speaker Notes:
These vulnerabilities represent the most common user management security failures seen in real-world systems. Each represents a breakdown in user lifecycle management that creates ongoing security risks.

Orphaned accounts are particularly dangerous because they represent "ghost" access that may not be monitored or maintained. Attackers specifically look for these accounts because they're less likely to be detected.

Privilege creep is inevitable without active management. Users naturally accumulate additional permissions for projects, temporary assignments, and role changes, but permissions are rarely removed automatically.
-->

## Additional Vulnerability Patterns

<div class="compact-list dense-content">

#### Shared Service Accounts
- **Problem**: Application accounts shared by multiple systems or people
- **Impact**: No accountability, difficult credential rotation
- **Solution**: Individual service accounts with proper authentication

#### Weak Onboarding/Offboarding
- **Problem**: Inconsistent processes for user lifecycle management
- **Impact**: Delayed provisioning or persistent access after termination
- **Solution**: Automated workflows with security checkpoints

### Prevention Strategies
- **Implement automated** account lifecycle management
- **Require justification** for all permission grants
- **Conduct regular access** certification campaigns
- **Monitor for unused** or dormant accounts

</div>

---

<!--
Speaker Notes:
These vulnerabilities represent the most common user management security failures seen in real-world systems. Each represents a breakdown in user lifecycle management that creates ongoing security risks.

Orphaned accounts are particularly dangerous because they represent "ghost" access that may not be monitored or maintained. Attackers specifically look for these accounts because they're less likely to be detected.

Privilege creep is inevitable without active management. Users naturally accumulate additional permissions for projects, temporary assignments, and role changes, but permissions are rarely removed automatically.

Shared service accounts violate the principle of individual accountability. When something goes wrong, you can't tell which system or person was responsible.

Weak lifecycle processes are often the root cause of other vulnerabilities. Without proper onboarding, users may get inappropriate access. Without proper offboarding, accounts persist after they should be terminated.

Prevention strategies:
- Implement automated account lifecycle management
- Require justification for all permission grants
- Conduct regular access certification campaigns
- Monitor for unused or dormant accounts
- Establish clear ownership for all service accounts
- Document and test all lifecycle procedures
-->

## User Management Architecture

### System Components

<div class="small-text">

## User Management System Architecture:

- **Identity Provider** → Manages user identities
  - Connects to **User Repository** (user data storage)
  - Provides **Authentication** services
- **User Repository** → Stores user information
  - Feeds **Role Management** system
- **Authentication** → Verifies user identity
  - Creates **Session Management**
- **Role Management** → Manages user roles and permissions
  - Provides data to **Authorization** system
- **Session Management** → Maintains user sessions
  - Integrates with **Authorization**
- **Authorization** → Makes access control decisions
  - Protects **Applications**
- **Applications** → Business applications
  - Sends events to **Audit Service**
- **Audit Service** → Logs and monitors all activities

</div>

<div class="compact-list">

### Integration Points
- **HR Systems**: Employee lifecycle events
- **Directory Services**: Centralized identity management
- **Applications**: Role and permission enforcement
- **Monitoring**: Security event correlation

### Design Principles
- **Single Source of Truth**: Centralized user identity
- **Loose Coupling**: Independent service components
- **Event-Driven**: Reactive to lifecycle changes
- **Audit by Design**: Comprehensive logging

</div>

---

<!--
Speaker Notes:
This architecture diagram shows how user management integrates into a broader security ecosystem. The key insight is that user management isn't a single system but a collection of integrated services.

The flow shows how identity flows through the system:
1. Identity Provider manages user credentials and basic information
2. User Repository stores detailed user data and attributes
3. Authentication Service validates credentials and creates sessions
4. Role Management assigns and maintains user permissions
5. Authorization Service makes access control decisions
6. Applications enforce those decisions
7. Audit Service logs all security-relevant events
8. Security Monitoring analyzes patterns and detects anomalies

Integration points represent external systems that need to interact with user management:
- HR systems trigger account creation and termination
- Directory services provide centralized identity across multiple applications
- Applications need to check permissions and roles
- Monitoring systems need access to security events
- Compliance systems need audit reports and access certification

Design principles ensure the architecture remains maintainable and secure:
- Single source of truth prevents conflicting identity information
- Loose coupling allows components to evolve independently
- Event-driven design enables real-time security responses
- Audit by design ensures comprehensive security logging
-->

## Implementation Example: Secure User Service

### Core User Management Service
<div class="code-tiny">

```python
class SecureUserService:
    def create_user(self, requester, user_data, justification):
        # Multi-step approval process
        if not self.authorize_user_creation(requester):
            raise PermissionError("Insufficient privileges")
        
        # Create pending user request
        request = self.create_approval_request(
            requester=requester, user_data=user_data, 
            justification=justification
        )
        
        # Require secondary approval
        self.notify_approvers(request)
        return request.id
    
    def approve_user_creation(self, approver, request_id):
        request = self.get_request(request_id)
        
        # Prevent self-approval (separation of duties)
        if approver.id == request.requester.id:
            raise SecurityError("Cannot approve own request")
        
        # Validate approver permissions
        if not self.can_approve_user_creation(approver):
            raise PermissionError("Cannot approve user creation")
        
        # Create the user with audit logging
        user = self.provision_user_account(request.user_data)
        self.audit_log("user_created", approver, user, request)
        return user
```

</div>

---

<!--
Speaker Notes:
This code example demonstrates secure user creation with proper separation of duties and audit controls. The key security features include:

1. Authorization check before allowing request creation
2. Separation of duties - requester cannot approve their own request
3. Secondary approval requirement from authorized personnel
4. Comprehensive audit logging of all actions
5. Clear justification required for account creation

The two-phase process (request → approval) ensures that:
- User creation is never accidental or unauthorized
- There's always a paper trail for new accounts
- Emergency situations can be handled with proper approvals
- Audit trails capture the business justification

Additional security considerations for production implementation:
- Time limits on approval requests (prevent stale requests)
- Emergency override procedures with additional logging
- Integration with HR systems for automated workforce changes
- Role assignment validation against business policies
- Automated notification of account creation to security teams

This pattern can be extended to other sensitive operations like role assignments, permission grants, and account modifications. The key is maintaining the separation of duties while keeping the process efficient enough for operational needs.
-->

## User Management Metrics and KPIs

<div class="compact-list">

### Security Metrics
📊 **Account Lifecycle**
- Average time to provision new accounts
- Time to revoke access after termination
- Percentage of accounts with regular access review

📊 **Access Compliance**
- Users with excessive privileges
- Accounts without recent activity
- Failed access attempts per user

📊 **Audit and Review**
- Percentage of privileged actions with dual approval
- Time to complete access certification campaigns
- Number of policy violations detected

</div>
- Time to detect unauthorized access attempts
- Coverage of automated monitoring rules

### Business Metrics
📈 **Operational Efficiency**
- User satisfaction with access request process
- Cost per user account maintained
- Reduction in access-related help desk tickets

📈 **Risk Management**
- Number of security incidents related to user management
- Mean time to detect account compromises
- Compliance audit findings related to access control

---

<!--
Speaker Notes:
Metrics are essential for measuring the effectiveness of user management security controls. Without measurement, you can't tell if your controls are working or improve them over time.

Security metrics focus on the technical effectiveness of controls:
- Lifecycle metrics ensure accounts are managed promptly
- Compliance metrics identify drift from security policies
- Audit metrics measure the effectiveness of oversight controls

Business metrics help justify security investments and identify process improvements:
- Efficiency metrics show operational costs and user impact
- Risk metrics demonstrate security value and incident prevention

Key implementation considerations:
- Automate metric collection where possible
- Set realistic targets based on business needs
- Review metrics regularly with stakeholders
- Use metrics to drive continuous improvement
- Balance security metrics with usability metrics

Example targets might include:
- 95% of new accounts provisioned within 24 hours
- 100% of terminated employee access revoked within 2 hours
- Less than 5% of users with privileges exceeding their role requirements
- All privileged actions require dual approval
- Security incidents detected within 15 minutes on average

The goal is to create a data-driven approach to user management security that balances protection with operational efficiency.
-->

## Real-World Case Studies

### Case Study 1: Privilege Escalation Attack
**Scenario**: Disgruntled employee accumulates excessive privileges over 6 months
**Failure Points**: No regular access reviews, automatic role accumulation
**Impact**: Access to payroll data, customer records, and financial systems
**Lessons**: Regular access certification, automated privilege monitoring

### Case Study 2: Shared Account Compromise
**Scenario**: Marketing team shares social media account credentials
**Failure Points**: Cost-cutting on individual accounts, poor credential management
**Impact**: Unauthorized posts, brand damage, regulatory fines
**Lessons**: Individual accounts for all business-critical services

### Case Study 3: Orphaned Service Account
**Scenario**: Contractor leaves, service account remains active for 18 months
**Failure Points**: No service account inventory, manual offboarding process
**Impact**: Persistent backdoor access, data exfiltration
**Lessons**: Automated service account management, regular account audits

---

<!--
Speaker Notes:
These case studies illustrate real-world consequences of user management failures. Each represents a different category of vulnerability that organizations commonly face.

Case Study 1 (Privilege Escalation):
This is extremely common in organizations without formal access review processes. Users naturally accumulate permissions for projects, role changes, and temporary assignments, but permissions are rarely removed. Over time, users can end up with far more access than their current role requires.

Prevention measures:
- Quarterly access certification campaigns
- Automated alerts for users with excessive privileges
- Role-based management instead of individual permission grants
- Clear procedures for removing temporary access

Case Study 2 (Shared Accounts):
This demonstrates how cost considerations can override security concerns. The marketing team thought they were saving money, but the cost of the incident (brand damage, regulatory fines, incident response) far exceeded the cost of individual accounts.

Prevention measures:
- Security-friendly pricing models for vendors
- Clear policies against shared accounts
- Regular audits for shared credential usage
- Business case education for stakeholders

Case Study 3 (Orphaned Accounts):
Service accounts are often forgotten in offboarding processes because they're not tied to specific individuals. This creates persistent access that can be discovered and exploited by attackers.

Prevention measures:
- Service account inventory and ownership tracking
- Automated alerts for unused accounts
- Integration between HR systems and account management
- Regular service account reviews and rotation
-->

## Exercise Preview

### Practical Applications

#### Exercise 1: Third-Party Service Analysis
- **Objective**: Identify services requiring individual vs. group access
- **Skills**: Risk assessment, business impact analysis
- **Deliverable**: Categorized service inventory with justifications

#### Exercise 2: Role Design Workshop
- **Objective**: Design role structure for an online shoe store
- **Skills**: Workflow analysis, permission mapping, role hierarchy
- **Deliverable**: Complete role definition with interactions and privileges

### Real-World Implementation
- Apply user management principles to actual systems
- Practice separation of duties design
- Implement audit logging and monitoring
- Design secure user lifecycle processes

---

<!--
Speaker Notes:
The exercises build practical skills in user management design and implementation. They're designed to bridge the gap between theoretical knowledge and real-world application.

Exercise 1 helps students develop risk assessment skills by evaluating their organization's actual third-party services. This makes the learning immediately relevant and helps them identify real security improvements they can make.

Exercise 2 focuses on role design, which is one of the most challenging aspects of user management. By working through a concrete scenario (online shoe store), students practice:
- Analyzing business workflows to identify roles
- Mapping permissions to business functions
- Designing role hierarchies and interactions
- Considering edge cases and exception handling

The real-world implementation component ensures students can apply these concepts in practical settings. This includes:
- Technical implementation of user management controls
- Integration with existing systems and processes
- Balancing security with operational efficiency
- Measuring and monitoring effectiveness

These exercises prepare students to make meaningful contributions to user management security in their organizations, whether they're developers, administrators, or security professionals.
-->

## Chapter Summary

### Key Takeaways

🔐 **User Lifecycle Management**
- Secure creation requires multi-role approval
- Locking is better than deletion for audit trails
- Automatic triggers prevent manual oversight gaps

🔐 **Role-Based Design**
- Roles represent functions, not people
- Workflow analysis reveals natural role boundaries
- Separation of duties prevents single points of failure

🔐 **Security Architecture**
- Individual accounts prevent accountability gaps
- Comprehensive logging enables threat detection
- Event-driven design supports real-time security

### Critical Success Factors
✅ Balance security with operational efficiency  
✅ Design for auditability from the beginning  
✅ Implement defense in depth across user lifecycle  
✅ Monitor and measure effectiveness continuously  

---

<!--
Speaker Notes:
This summary reinforces the key concepts and success factors for effective user management security. The three main areas represent the core competencies students need to develop.

User lifecycle management is about having the right processes and controls in place for the entire user journey from creation to deactivation. The key insight is that poor lifecycle management creates most user-related security vulnerabilities.

Role-based design is about creating maintainable and secure permission structures that align with business needs. The workflow analysis approach helps ensure roles actually match how people work.

Security architecture ensures that user management integrates properly with broader security systems and provides the visibility needed for threat detection.

Critical success factors emphasize the practical challenges of implementing user management security:
- Security vs. efficiency balance prevents user circumvention
- Auditability by design makes compliance and investigation possible
- Defense in depth ensures single points of failure don't compromise security
- Continuous monitoring and measurement enable improvement

The next chapter on Data Validation will build on these user management concepts by focusing on how to handle user input securely, which is fundamental to preventing user-driven attacks.
-->

## Looking Ahead: Chapter 6

### Data Validation
**Core Principle**: "Never trust input from the user"

### Preview Topics
- **Input Validation Strategies** - Preventing malicious data entry
- **Buffer Overflow Prevention** - Memory safety in user input handling
- **SQL Injection Defense** - Protecting database operations
- **Cross-Site Scripting (XSS)** - Securing web application inputs
- **Validation Architecture** - Building robust input handling systems

### Connection to User Management
User management provides **identity and authorization**, but data validation protects against **malicious user actions** once they're authenticated and authorized.

<div class="success">
"Nearly every single security hole comes from trusting, implicitly or explicitly, input from the user."
</div>

---

<!--
Speaker Notes:
This preview sets up the logical progression from user management to data validation. We've established who users are and what they're allowed to do - now we need to protect against what they might try to do maliciously.

The core principle of "never trust user input" is fundamental to secure programming. Even authenticated and authorized users can be:
- Compromised by attackers
- Accidentally entering malicious data
- Deliberately trying to exploit the system
- Using tools that generate unexpected input

The connection between chapters is important: user management tells us WHO is making a request and WHETHER they're allowed to make it, but data validation protects us from HOW they make the request.

This progression builds the complete picture of secure user interaction:
1. Authentication: Who are you?
2. Authorization: What can you do?
3. User Management: How do we manage your lifecycle and roles?
4. Data Validation: How do we safely handle what you send us?

The quote emphasizes that input validation isn't just one security control among many - it's the foundation of secure programming. Most successful attacks ultimately come down to exploiting trust in user-provided data.

Students should leave this chapter understanding that user management and data validation work together to create comprehensive protection against user-related threats.
-->
