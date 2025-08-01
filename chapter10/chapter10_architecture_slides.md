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

<!-- _class: lead -->
# Chapter 10
## Architecture and Design Patterns

**Secure Programming Fundamentals**
*Building Security from the Ground Up*

---

## Learning Objectives

By the end of this chapter, you will:

- **Understand** core secure design principles
- **Apply** security architecture patterns 
- **Implement** distrustful decomposition
- **Master** sensitive data handling
- **Evaluate** architectural security risks

---

<!-- _class: lead -->
# The Architecture Security Challenge

*"A security misstep in the design is much harder to patch, and may require a radical change"*

---

## Why Architecture Matters

### **Real-World Impact: Meltdown & Spectre**
- **Architecture**: CPU caching + pipelining
- **Vulnerability**: Undetectable data breach
- **Fix Cost**: 10-30% performance penalty
- **Redesign**: 20+ years of hardware evolution

### **The Fundamental Challenge**
- Bugs → Simple patches
- Design flaws → Radical changes

---

## Security Design Patterns

### **What Are Design Patterns?**
- Common interactions and constructions
- Implemented repeatedly across systems
- No built-in language syntax required

### **Security Design Patterns**
- Dozens of established patterns
- Address common security challenges
- Proven solutions to recurring problems

---

<!-- _class: lead -->
# Key Secure Design Principles

*Foundation for Secure Architecture*

---

## Principle 1: Least Privilege

### **Definition**
Any task or component should only have the **minimal set of privileges** to complete the job.

### **Military Analogy**
- "Need-to-Know" basis
- Compartmentalized information access

---

### **Implementation Examples**
- Database connections with limited permissions
- Service accounts with specific roles
- User interfaces hiding administrative functions

---

## Principle 2: Separation of Duties

### **Definition**
Require **more than one agent** to complete a sensitive task.

### **Also Known As**
- Compartmentalization
- Segregation of duties

---

### **Real-World Examples**
- **Banking**: Dual approval for large transactions
- **Code**: Separate development and deployment
- **Access**: Multiple keys for sensitive areas

---

## Principle 3: Defense-in-Depth

### **Definition**
All interfaces should have **redundancy** in security controls.

### **Core Concept**
- Layered defense mechanisms
- Multiple barriers for attackers
- Economic/tactical infeasibility

### **Network Example**
```
Internet → Firewall → DMZ → Internal Firewall → Application → Database
```

---

## Principle 4: Fail Safe

### **Definition**
A system should **protect confidentiality and integrity** even in a failed state.

### **Also Called**: Fail-Secure

### **Key Requirements**
- No sensitive information revelation
- Secure default states
- Graceful degradation

### **Example**: Database connection failure → Deny access (not allow)

---

## Principle 5: Economy of Mechanism

### **Definition**
Keep the design **small and simple**.

### **Why It Matters**
- Complex systems → More vulnerabilities
- Simple systems → Easier to audit

### **Heartbleed Example**
- Complex OpenSSL implementation
- Simple buffer over-read
- Massive global impact

---

## Principle 6: Complete Mediation

### **Definition**
**Every access** to every object must be authorized.

### **Key Points**
- Access checks on each request
- No privilege caching
- Reduced elevated privilege risks

### **Implementation**
```python
def access_resource(user, resource):
    if not authorize(user, resource):  # Check every time
        raise UnauthorizedException()
    return resource.data
```

---

## Principle 7: Open Design

### **Definition**
The security of a system should be **open to review**.

### **Kerckhoff's Principle**
*"A cryptosystem should be secure even if everything about the system, except the key, is public knowledge"*

### **Benefits**
- External scrutiny
- Community review
- Improved hardening

---

## Principle 8: Least Common Mechanism

### **Definition**
**Minimize common mechanisms** between different users and processes.

### **Risk**
- Shared mechanisms can leak information
- Cross-contamination between subjects

### **Solution**
- Separate mechanisms per subject/role
- Isolated access control systems

---

## Principle 9: Psychological Acceptability

### **Definition**
Security mechanisms should be **invisible** and introduce **minimal obstruction**.

### **User Behavior**
- Inhibited users bypass security
- Disabled mechanisms provide no protection
- Acceptance drives compliance

### **Design Goal**
Make security transparent to legitimate users

---

<!-- _class: lead -->
# Security Architect Role

*Dedicated Security Leadership*

---

## Security Architect Responsibilities

### **Primary Focus**
- Consider security from **beginning to end**
- Evaluate **misuse cases** and uncareful interactions
- Coordinate with System Architect

### **Key Challenge**
Security often takes a **back seat to business concerns**

### **When Needed**
- Sufficiently large systems
- High security risk environments
- Regulatory compliance requirements

---

## Security Architect vs System Architect

| **System Architect** | **Security Architect** |
|---------------------|------------------------|
| Use cases | **Misuse cases** |
| Careful interactions | **Uncareful interactions** |
| Functional requirements | **Security requirements** |
| Performance optimization | **Risk mitigation** |

### **Collaboration is Key**
- Cooperation and compromise
- Effective security lobbying
- Balance business and security needs

---

<!-- _class: lead -->
# Distrustful Decomposition

*Isolating and Mitigating Risk*

---

## Distrustful Decomposition Pattern

### **Goal**
Move separate functionality into **mutually distrustful** modules or programs.

### **Benefits**
1. **Isolation**: Compromise doesn't spread
2. **Distrust**: Remaining units question compromised unit
3. **Reduced Attack Surface**: Smaller privileged applications

### **Natural Implementation**
Unix fork/exec model with small, simple programs

---

## Implementation Strategy

### **Privilege Delegation**
```
High-Privilege App → Delegates to → Lower-Privilege App
```

### **Automatic Benefits**
- Validation of elevated requests
- Logging of privilege escalation
- Natural security boundaries

### **Example Architecture**
```
Web Server (low privilege) → Database Proxy (medium) → Database (high)
```

---

## Distrustful Decomposition Example

### **Traditional Monolith**
```
[ Web App with Database Access ]
├── User Management (High Privilege)
├── Content Management (High Privilege)  
├── Reporting (High Privilege)
└── File Upload (High Privilege)
```

### **Decomposed Architecture**
```
[ Web App (Low) ] → [ Auth Service (Medium) ]
                 → [ Content Service (Low) ]
                 → [ Report Service (Medium) ]
                 → [ File Service (Sandboxed) ]
```

---

<!-- _class: lead -->
# Clear Sensitive Information

*Preventing Data Leakage*

---

## Clear Sensitive Information Pattern

### **The Problem**
- Programs handle sensitive information
- Resources may be **re-used** by the system
- Sensitive data can persist in unexpected places

### **Resources at Risk**
- Memory allocations
- Temporary files
- Cache systems
- Screen pixels

---

## Implementation Requirements

### **Identify Sensitive Data**
- Passwords and keys
- Personal information
- Financial data
- Session tokens

### **Explicit Scrubbing**
- Overwrite memory with zeroes
- Flush cache systems
- Clear temporary files
- Black out screen sections

---

## Technical Challenges

### **Language Limitations**
- Garbage collection complications
- Compiler optimizations
- Memory management constraints

### **Pool Resources**
- Database connections
- Thread pools
- Uncommitted transactions
- Connection state

### **Verification Difficulty**
Simple mechanisms are easier to verify

---

## Secure Memory Clearing Example

### **C/C++ Implementation**
```c
void secure_zero(void *ptr, size_t len) {
    volatile unsigned char *p = ptr;
    while (len--) *p++ = 0;
}
```

### **Why Volatile?**
Prevents compiler optimization from removing the clearing code

### **Platform-Specific Solutions**
- `SecureZeroMemory()` (Windows)
- `explicit_bzero()` (Linux)
- `sodium_memzero()` (libsodium)

---

<!-- _class: lead -->
# Architectural Risk Assessment

*Evaluating Design Security*

---

## Common Architectural Vulnerabilities

### **Trust Boundary Violations**
- Implicit trust between components
- Inadequate input validation
- Privilege escalation paths

### **Data Flow Security**
- Unencrypted sensitive data
- Inadequate access controls
- Information leakage paths

### **Component Interaction Risks**
- Race conditions
- State management issues
- Session handling flaws

---

## Migration Security Risks

### **Language Migration Risks**
- Different security models
- Memory management changes
- Library vulnerability differences
- Type system variations

### **Platform Migration (Unix → Windows)**
- Permission model differences
- File system security variations
- Service model changes
- Registry vs. configuration files

---

## Historical Example: Clipper Chip

### **1990s Encryption Architecture**
- Secret Skipjack algorithm
- Government key escrow
- Manufacturer-determined keys
- Warrant-based decryption

### **Architectural Flaws**
- **Closed Design**: Secret algorithm
- **Single Point of Failure**: Government escrow
- **Trust Issues**: Key management
- **Scale Problems**: Global key storage

---

<!-- _class: lead -->
# Best Practices Summary

*Implementing Secure Architecture*

---

## Design Phase Checklist

### **Principle Application**
- ✅ Least privilege for all components
- ✅ Separation of duties for sensitive operations
- ✅ Defense-in-depth across all layers
- ✅ Fail-safe defaults throughout

### **Architecture Patterns**
- ✅ Distrustful decomposition implemented
- ✅ Clear sensitive information procedures
- ✅ Security architect involvement
- ✅ Open design for review

---

## Implementation Guidelines

### **Trust Boundaries**
- Clearly define component trust levels
- Validate all cross-boundary interactions
- Implement comprehensive logging

### **Data Protection**
- Identify sensitive information flows
- Implement clearing procedures
- Verify scrubbing effectiveness

### **Privilege Management**
- Minimize elevated privilege scope
- Use delegation patterns
- Monitor privilege escalation

---

## Review and Validation

### **Security Architecture Review**
- External security assessment
- Penetration testing
- Code review with security focus

### **Ongoing Monitoring**
- Architecture evolution tracking
- Security debt management
- Continuous threat modeling

### **Documentation**
- Security design decisions
- Trust boundary specifications
- Threat model updates

---

<!-- _class: lead -->
# Chapter 10 Summary

**Key Takeaways for Secure Architecture**

---

## Core Principles Mastered

- **Least Privilege**: Minimal necessary permissions
- **Separation of Duties**: Multi-agent sensitive tasks
- **Defense-in-Depth**: Layered security controls
- **Fail Safe**: Secure failure modes
- **Economy of Mechanism**: Simple, auditable designs

## Patterns Implemented

- **Distrustful Decomposition**: Isolated, mutually suspicious components
- **Clear Sensitive Information**: Explicit data scrubbing
- **Security Architect Role**: Dedicated security leadership

## Next Steps: Apply these principles to your architecture designs! 🏗️🔒
