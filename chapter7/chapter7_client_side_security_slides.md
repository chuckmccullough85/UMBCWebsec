---
marp: false
theme: gaia
paginate: true

---

<style>
section {
    font-size: 175%;
}
</style>
 
<!-- _class: auto-scaling -->

# Chapter 7: Client-Side Security
## Never Trust the Client

<div class="lead">
Client applications are fundamentally untrustworthy
</div>

---

<!-- 
Speaker Notes:
- Client-side security is fundamentally different from server-side
- The user controls the client completely - OS, hardware, software
- Anything sent to the client can be modified, analyzed, or reverse-engineered
- This applies to web browsers, mobile apps, desktop applications, IoT devices
- Gaming industry learned this lesson early with cheating and piracy
- Financial services, healthcare, and government sectors face similar challenges
- Defense must happen server-side with client validation only for UX
-->

## The Fundamental Truth

<div class="warning">
NEVER TRUST THE CLIENT
</div>

### Why Client-Side Security Fails
- **User controls the environment** completely
- **Code can be reverse-engineered** and modified
- **Network traffic can be intercepted** and manipulated
- **Memory can be inspected** and altered
- **Execution can be debugged** and bypassed

<div class="highlight">
Client-side security is user experience, not actual security
</div>

---

<!-- 
Speaker Notes:
- Modern games face sophisticated cheating tools and aimbots
- Valve's VAC (Valve Anti-Cheat) uses server-side validation extensively
- Call of Duty's Ricochet anti-cheat moved to kernel-level detection
- Even with kernel-level protection, cheats still exist
- Games implement server-side hit detection, movement validation
- Statistical analysis to detect impossible performance
- Real-time monitoring of player behavior patterns
-->

## Real-World Example: Online Gaming

### The Challenge
- **Aimbots**: Auto-targeting opponents
- **Wallhacks**: Seeing through walls
- **Speed hacks**: Moving faster than allowed
- **Resource manipulation**: Unlimited health/ammo

---

## Industry Response
- **Server-side validation** of all game actions
- **Statistical anomaly detection** 
- **Kernel-level anti-cheat** systems
- **Machine learning** behavior analysis

<div class="breach-example">
<strong>Example:</strong> Fortnite's battle against cheaters costs Epic Games millions annually in detection systems and lost revenue from banned players.
</div>

---

<!-- 
Speaker Notes:
- User-Agent strings are trivially spoofed
- IP geolocation can be masked with VPNs/proxies
- Browser fingerprinting can be defeated with tools
- Operating system detection can be faked
- Hardware information can be spoofed
- Screen resolution and capabilities can be modified
- Even timing information can be manipulated
- Business logic should never rely on client-reported metadata
-->

## Metadata and Side-Channel Attacks

### Everything Can Be Spoofed

<div class="grid">
<div>

**Easily Manipulated:**
- User-Agent strings
- Operating system info
- Browser version/type
- Screen resolution
- Language settings

</div>

---

<div>
**Advanced Spoofing:**
- IP geolocation
- Hardware fingerprinting
- Network timing
- Browser capabilities

</div>
</div>

<div class="attack-scenario">
<strong>Attack Example:</strong> Mobile banking apps that reduce security based on "trusted" device characteristics can be bypassed by spoofing device identifiers.
</div>

---

<!-- 
Speaker Notes:
- TCP/UDP packets can be dropped, delayed, or reordered
- Denial of service through selective packet dropping
- Timing attacks by artificially slowing/speeding connections
- Protocol manipulation at network layer
- WebSocket connections can be hijacked or manipulated
- HTTP headers can be modified or fabricated
- SSL/TLS can be terminated and re-encrypted (man-in-the-middle)
- Network-based attacks often invisible to application layer
-->

## Network-Level Manipulation

### Even "Reliable" Protocols Are Suspect

<div class="code-block small-text">
TCP appears reliable, but clients can:
• Drop packets to cause timeouts
• Reorder packets to trigger edge cases  
• Delay packets to manipulate timing
• Inject packets to confuse state
</div>

### Common Timing Exploits
- **Slow Connection Simulation** → Priority treatment
- **Burst Traffic** → Overwhelm rate limiting
- **Selective Delays** → Race conditions

---

<!-- 
Speaker Notes:
- Real-world example of network manipulation in online poker
- Timing attacks can reveal information about server state
- Rate limiting can be bypassed through distributed attacks
- Network-level attacks often go undetected by application monitoring
- SSL/TLS provides encryption but not protection against timing manipulation
-->

## Network Attack Example

<div class="breach-example">
<strong>Real Attack:</strong> Online poker bots use timing manipulation to gain information about opponent hands and exploit server-side assumptions about human response times.
</div>

### Why This Works
- **Server expects human timing** patterns
- **Bots can precisely control** network delays  
- **Information leakage** through response timing
- **Statistical analysis** reveals opponent behavior

## Defense Strategies
- **Rate limiting** with jitter
- **Constant-time responses** regardless of game state
- **Behavioral analysis** to detect non-human patterns

---

<!-- 
Speaker Notes:
- Client-side state is completely under user control
- Shopping cart contents, user preferences, progress tracking
- Game state like inventory, levels, achievements
- Form data, wizard progress, multi-step processes
- Financial data, balances, transaction history
- Session state should live on server with only session ID on client
- Session IDs must be cryptographically random and large
- Additional metadata validation provides defense in depth
-->

## Stateless Client Design

### The Problem with Client-Side State
- **Shopping carts** → Price manipulation
- **Game progress** → Unlocking premium content
- **Form wizards** → Skipping validation steps
- **User preferences** → Privilege escalation

## Secure Session Management
<div class="grid">
<div class="good">

**Server-Side State**
- Session data on server
- Cryptographically random IDs
- Short expiration times
- Metadata validation

</div>
<div class="bad">

**Client-Side State**
- Local storage of sensitive data
- Predictable session tokens
- Long-lived sessions
- Trust client metadata

</div>
</div>

---

<!-- 
Speaker Notes:
- E-commerce platforms face constant price manipulation attempts
- Mobile games deal with in-app purchase bypassing
- Financial apps must validate all transaction data server-side
- Healthcare apps can't trust client-reported vital signs
- Educational platforms face cheating through client modification
- Real estate apps must verify property data server-side
- Travel booking systems validate pricing and availability server-side
-->

## Real-World Client Manipulation

### E-commerce Price Manipulation
<div class="attack-scenario">
<strong>Attack:</strong> Modify JavaScript to change product prices before checkout.
<strong>Defense:</strong> Server-side price validation at every step.
</div>

## Mobile App Binary Modification  
<div class="attack-scenario">
<strong>Attack:</strong> Reverse engineer apps to bypass premium features.
<strong>Defense:</strong> Server-side feature validation, certificate pinning.
</div>

---

<!-- 
Speaker Notes:
- Web application attacks through browser developer tools
- DOM manipulation is trivial for any user
- Hidden form fields provide no security
- Client-side validation is only for user experience
- Server must validate all inputs regardless of client restrictions
-->

## Web Application Attacks

### DOM Manipulation Attack
<div class="attack-scenario">
<strong>Attack:</strong> Browser developer tools to modify hidden form fields, disabled buttons, or client-side validation.
<strong>Defense:</strong> Server-side validation of all inputs, regardless of client-side restrictions.
</div>

## Common Web Attack Vectors
- **Form field modification** → Change hidden values
- **JavaScript injection** → Execute malicious code  
- **Cookie manipulation** → Session hijacking
- **Local storage access** → Extract cached data
- **HTTP request modification** → Parameter tampering

---

<!-- 
Speaker Notes:
- Input validation must happen on server regardless of client validation
- Sanitization should be built into serialization/deserialization
- Whitelist approach preferred over blacklist
- Range validation more specific than type validation
- Business logic validation separate from technical validation
- Fail securely - drop invalid requests completely
- Log validation failures for security monitoring
-->

## Comprehensive Data Sanitization

### Validation Layers
1. **Syntax Validation** → Format, length, character sets
2. **Semantic Validation** → Business rules, ranges  
3. **Authorization Validation** → User permissions
4. **Integrity Validation** → Checksums, signatures

### Implementation Strategy
<div class="code-block small-text">
// Build validation into serialization
class UserInput {
    @Range(0, 100)
    @NotNull
    private Integer age;
    
    @Email @MaxLength(254)
    private String email;
}
</div>

<div class="highlight">Drop malformed requests immediately</div>

---

<!-- 
Speaker Notes:
- Financial services face regulatory requirements for client security
- Mobile banking apps use certificate pinning and jailbreak detection
- Even with these protections, server-side validation is mandatory
- Cryptocurrency wallets must validate all transactions server-side
- Payment processors implement fraud detection and velocity checks
- Insurance applications validate claims data through multiple sources
-->

## Financial Services Security

### Multi-Layer Client Protection
- **Certificate Pinning** → Prevent MITM attacks
- **Jailbreak/Root Detection** → Identify compromised devices
- **App Integrity Checks** → Detect modifications
- **Behavioral Biometrics** → Analyze user patterns

### Server-Side Requirements
- **Transaction limits** validated server-side
- **Account balances** never trusted from client
- **Authentication tokens** cryptographically verified
- **Business rules** enforced on server only

<div class="breach-example">
<strong>Example:</strong> JP Morgan Chase spends $600M+ annually on cybersecurity, focusing heavily on client-side attack prevention.
</div>

---

<!-- 
Speaker Notes:
- IoT devices present unique client-side security challenges
- Firmware can be extracted and reverse engineered
- Network protocols often unencrypted or weakly encrypted
- Physical access allows hardware debugging and modification
- Default credentials frequently unchanged
- Update mechanisms often insecure or non-existent
- Cloud backend must validate all device communications
-->

## IoT and Embedded Systems

### Unique Challenges
- **Physical Access** → Hardware debugging, firmware extraction
- **Limited Resources** → Weak crypto, no secure boot
- **Long Lifecycles** → Unpatched vulnerabilities
- **Default Credentials** → Known passwords

### Mitigation Strategies
<div class="grid">
<div>

**Device Level:**
- Secure boot chains
- Hardware security modules
- Tamper detection
- Encrypted storage

</div>
<div>

**Server Level:**
- Device authentication
- Command validation
- Anomaly detection
- Rate limiting

</div>
</div>

---

<!-- 
Speaker Notes:
- Mirai botnet demonstrated massive scale of IoT vulnerabilities
- Default credentials remain a major problem in 2025
- Physical access to devices enables sophisticated attacks
- Cloud backends must assume device compromise
- Firmware updates often delivered insecurely
- Zero-trust architecture essential for IoT deployments
-->

## IoT Security Breach Example

<div class="breach-example">
<strong>Mirai Botnet (2016):</strong> Compromised 600,000+ IoT devices using default credentials, caused major internet outages. Demonstrated critical need for server-side device validation.
</div>

### Lessons Learned
- **Default credentials** must be changed on first use
- **Firmware updates** need secure delivery mechanisms
- **Device authentication** required for all communications
- **Network segmentation** limits breach impact
- **Behavioral monitoring** detects compromised devices

---

<!-- 
Speaker Notes:
- Modern web browsers provide some protection but can't prevent all attacks
- Content Security Policy helps but can be bypassed
- Same-origin policy prevents some attacks but not others
- Browser developer tools give attackers full access
- Extensions and plugins can modify page behavior
- JavaScript can be disabled or modified
- Local storage and cookies are fully accessible to users
-->

## Web Application Client Security

### Browser Attack Vectors
- **Developer Tools** → Inspect, modify, debug applications
- **Browser Extensions** → Inject malicious JavaScript  
- **Proxy Tools** → Intercept and modify HTTP traffic
- **Local Storage** → Access sensitive cached data
- **Source Code** → View and analyze client logic

### Defense Mechanisms
<div class="comparison">
<div class="good">

**Effective Defenses**
- Server-side validation
- HTTPS everywhere
- Content Security Policy
- HTTP security headers

</div>
<div class="bad">

**Ineffective "Security"**
- JavaScript obfuscation
- Client validation only
- Hidden form fields
- Right-click blocking

</div>
</div>

---

<!-- 
Speaker Notes:
- API security requires treating all clients as potentially malicious
- Rate limiting prevents abuse but can be circumvented
- Authentication tokens must be properly validated and rotated
- API versioning helps manage security updates
- Input validation at API gateway level
- Monitoring and alerting for suspicious patterns
- Geographic and behavioral restrictions
-->

## API Security Best Practices

### Treat All API Clients as Hostile

<div class="grid">
<div>

**Input Validation:**
- Schema validation
- Rate limiting per client
- Request size limits
- Parameter sanitization

**Authentication:**
- Token-based auth
- Short-lived credentials
- Multi-factor authentication

</div>
<div>

**Monitoring & Response:**
- Anomaly detection
- Geographic analysis
- Velocity checking
- Automated blocking

**Data Protection:**
- Minimal data exposure
- Field-level encryption
- Audit logging

</div>
</div>

<div class="attack-scenario">
<strong>API Attack:</strong> Automated credential stuffing attacks against banking APIs, attempting millions of login combinations per hour.
</div>

---

<!-- 
Speaker Notes:
- OWASP Top 10 includes several client-side related vulnerabilities
- Security testing must include client manipulation scenarios
- Code review should focus on server-side validation
- Penetration testing should attempt client-side bypasses
- Automated scanning tools can detect some client-side issues
- Manual testing required for complex business logic
-->

## Security Testing Methods

### Testing Methodologies
1. **Static Analysis** → Code review for client trust issues
2. **Dynamic Analysis** → Runtime manipulation testing  
3. **Penetration Testing** → Real-world attack simulation
4. **Fuzz Testing** → Invalid input generation
5. **Binary Analysis** → Reverse engineering protection

### Common Test Scenarios
- **Parameter manipulation** via proxy tools
- **Business logic bypass** through modified clients
- **Rate limiting evasion** with distributed attacks
- **Authentication bypass** through token manipulation

<div class="highlight">Test like an attacker: assume complete client control</div>

---

<!-- 
Speaker Notes:
- Real-world exercises should cover multiple client types
- Weight tracking example involves health data privacy concerns
- Voting systems represent high-stakes security requirements
- Students should consider both technical and business impact
- Exercises should progress from simple to complex scenarios
- Group discussions help explore different attack vectors
-->

## Practical Exercises

### Exercise 1: Health Data Validation
**Scenario**: Weight tracking system receiving vitals from mobile devices

**Security Considerations:**
- Data range validation (realistic vital signs)
- Timestamp verification (prevent replay attacks)
- Device authentication (prevent spoofed readings)
- Privacy protection (encrypt sensitive health data)

### Exercise 2: Voting System Security  
**Scenario**: Electronic voting with networked voting machines

**Design Requirements:**
- **Cryptographic verification** of all votes
- **Air-gapped networks** where possible
- **Paper backup** systems for auditing
- **Tamper-evident hardware** protections

---

<!-- 
Speaker Notes:
- Client-side security is about risk management, not elimination
- Multiple layers of defense provide better protection
- Server-side validation is non-negotiable
- Client-side protections add friction for attackers
- Regular security assessments identify new attack vectors
- Industry best practices evolve with threat landscape
- Developer education critical for implementation
-->

## Building Defense in Depth

### Client-Side Hardening (Speed Bumps)
- **Code obfuscation** → Slows reverse engineering
- **Anti-tamper protection** → Detects modifications
- **Runtime protection** → Monitors execution environment
- **Behavioral analysis** → Identifies automated attacks

### Server-Side Enforcement (Real Security)
- **Input validation** → Reject malicious data
- **Business logic validation** → Enforce rules server-side
- **Authentication & authorization** → Verify every request
- **Monitoring & alerting** → Detect attack patterns

<div class="warning">
Client-side protections buy time; server-side validation provides security
</div>

---

<!-- 
Speaker Notes:
- Client-side security failures cascade to server compromise
- Cost of client-side attacks includes data breaches, fraud, reputation damage
- Compliance requirements often mandate specific client protections
- Industry standards provide frameworks for implementation
- Regular updates and patches essential for client applications
- Incident response plans must account for client compromise scenarios
-->

## Key Takeaways

### The Immutable Laws
1. **Never trust client data** → Validate everything server-side
2. **Client code is visible** → No secrets in client applications
3. **Client environment is hostile** → Assume complete compromise
4. **Defense in depth** → Layer multiple protections
5. **Monitor and respond** → Detect attacks in real-time

### Implementation Priorities
- **Server-side validation** is mandatory, not optional
- **Encrypted communications** protect data in transit
- **Strong authentication** verifies client identity
- **Comprehensive logging** enables attack detection
- **Regular updates** address new vulnerabilities

<div class="highlight">
Security is determined by your weakest client, not your strongest server
</div>

---

<!-- _class: center-content -->

# Questions & Discussion

<div class="lead">
What client-side security challenges does your organization face?<br>
How do you balance user experience with security requirements?
</div>
