---
marp: true
theme: gaia
paginate: true

---

<style>
section {
    font-size: 175%;
}
</style>

<!-- _class: lead -->
# Chapter 11
## Threat Modeling

**Secure Programming Fundamentals**
*Thinking Like an Attacker*

---

## Learning Objectives

By the end of this chapter, you will:

- **Adopt** an adversarial mindset for security analysis
- **Apply** systematic threat modeling approaches
- **Master** the STRIDE methodology
- **Identify** attack vectors through abstraction layers
- **Create** comprehensive threat models for systems

---

<!-- _class: lead -->
# The Adversarial Mindset

*"How does one start to think like an attacker?"*

---

## From Developer to Attacker Thinking

### **Developer Mindset**
- Focus on the "happy path"
- Functional requirements first
- Assume correct usage
- Build for intended behavior

### **Attacker Mindset**
- Explore "unhappy paths"
- Question all assumptions
- Test unintended usage
- Break abstraction layers

---

## Why Attackers Often Win

### **Testing vs Development Skills**
- **Testers**: Adversarial mindset by nature
- **Developers**: Tunnel vision on functionality
- **Attackers**: Professional paranoia

### **The Gap**
- Developers think: *"This should work"*
- Attackers think: *"How can I break this?"*

---

## Structured Threat Modeling

### **What Is Threat Modeling?**
A **structured way** of thinking like an attacker to:
- Create a list of possible threats
- Understand attack vectors
- Prioritize security measures
- Address and mitigate risks

### **The Goal**
Transform unstructured security concerns into **actionable security requirements**

---

<!-- _class: lead -->
# Three Areas of Focus

*Choosing Your Threat Modeling Approach*

---

## Focus Area 1: Assets

### **Asset-Centric Threat Modeling**
Protect items of **value** to the organization

### **Three Types of Assets**
1. **Things to Protect**
   - Customer data, intellectual property, financial records
2. **Things Attackers Want** 
   - Credit card numbers, personal information, trade secrets
3. **Stepping Stones**
   - Development servers, admin accounts, network access

---

## Asset-Centric Example

### **E-Commerce Platform Assets**

| **Protect** | **Attackers Want** | **Stepping Stones** |
|-------------|-------------------|---------------------|
| Customer payment data | Credit card numbers | Employee workstations |
| User accounts | Personal information | Development databases |
| Business analytics | Purchase patterns | API endpoints |
| Source code | Trade algorithms | Admin interfaces |

### **Process**: List assets → Identify threats → Design protections

---

## Focus Area 2: Attackers

### **Attacker-Centric Threat Modeling**
Focus on **types and goals** of attackers

### **Benefits**
- Excellent for **stakeholder communication**
- Explains **who** would attack and **why**
- Humanizes the threat landscape

### **Challenges**
- Risk of "no one would ever do that" dismissal
- Limited variety unless attack surface is vast
- Can be too abstract for technical teams

---

## Attacker Categories

### **Internal Threats**
- **Malicious Insiders**: Disgruntled employees
- **Compromised Accounts**: Legitimate users under attacker control
- **Negligent Users**: Accidental security violations

### **External Threats**
- **Cybercriminals**: Financial motivation
- **Nation-State Actors**: Espionage and disruption
- **Hacktivists**: Ideological motivation
- **Script Kiddies**: Opportunistic attacks

---

## Focus Area 3: Systems

### **System-Centric Threat Modeling**
Most **robust** approach for technical analysis

### **Process**
1. Sketch out system model
2. Identify component interfaces
3. Map trust boundaries
4. Analyze data flows
5. Find attack surfaces

### **Why It Works**
- Useful during design phase
- Reveals gaps in coverage
- Technical and actionable

---

## System Modeling Components

### **Key Elements to Map**
- **Components**: Services, databases, APIs
- **Data Flows**: How information moves
- **Trust Boundaries**: Where trust assumptions change
- **External Interfaces**: Entry points for attackers
- **Privileges**: What each component can do

### **Trust Boundaries**
Critical zones where components **accept results** from other components within the same boundary

---

<!-- _class: lead -->
# Peeling Back Layers

*Dropping Down Abstraction Levels*

---

## The Abstraction Attack

### **Developer Abstraction**
- "Copying a string" → `strcpy(dest, src)`
- "Stream of bytes" → TCP connection
- "User input" → Web form data

### **Attacker Reality**
- "Copying bytes" → Buffer overflow potential
- "Orderable datagrams" → TCP sequence attacks
- "Arbitrary data" → Injection possibilities

---

## Real-World Examples

### **String Copy Attack**
```c
// Developer thinks: "Copy this string"
strcpy(dest, src);

// Attacker thinks: "Copy bytes until null terminator"
// What if src is longer than dest buffer?
```

### **TCP Stream Attack**
```python
# Developer thinks: "Reliable byte stream"
data = socket.recv(1024)

# Attacker thinks: "Manipulatable packet sequence"
# What about TCP sequence prediction?
```

---

## Physical Security Analogy

### **The Fence Scenario**
- **Security Control**: Locked gate in fence
- **Expected Behavior**: Users enter through gate
- **Abstraction Break**: What if attackers climb over fence?

### **Lesson**
Always consider **alternative paths** that bypass intended security controls

---

<!-- _class: lead -->
# STRIDE Methodology

*Microsoft's Systematic Threat Analysis*

---

## STRIDE Overview

### **Six Threat Categories**
- **S**poofing Identity
- **T**ampering with Data  
- **R**epudiation
- **I**nformation Disclosure
- **D**enial of Service
- **E**levation of Privilege

### **Process**
For each system component, ask questions in each STRIDE category

---

## S - Spoofing Identity

### **Core Question**
How can authentication be subverted, circumvented, or broken?

### **Attack Scenarios**
- **User Spoofing**: Attacker poses as legitimate user
- **System Spoofing**: Malicious server poses as trusted service
- **Service Spoofing**: Fake API endpoints intercept requests

### **Example Questions**
- Can someone impersonate another user?
- How do we verify system identity?
- What prevents DNS spoofing attacks?

---

## T - Tampering with Data

### **Core Question**
What ways can data or processes be modified?

### **Attack Scenarios**
- **Input Tampering**: Malicious data injection
- **In-Transit Modification**: Man-in-the-middle attacks
- **Storage Tampering**: Database manipulation

### **Example Questions**
- What inputs might be unexpected?
- Can sensitive sections be altered?
- Would processing steps out of order be exploitable?

---

## R - Repudiation

### **Core Question**
How would an attacker hide their steps?

### **Attack Scenarios**
- **Log Deletion**: Removing evidence of attacks
- **False Evidence**: Creating misleading audit trails
- **Identity Confusion**: Making actions untraceable

### **Example Questions**
- What data are ripe targets for deletion?
- What trails exist to track actions?
- How is unusual behavior logged or monitored?

---

## I - Information Disclosure

### **Core Question**
What data are useful to an attacker?

### **Attack Scenarios**
- **Data Leakage**: Unintended information exposure
- **Access Control Bypass**: Unauthorized data access
- **Side-Channel Attacks**: Inferring data from system behavior

### **Example Questions**
- What data are stored in plaintext?
- How are sensitive data used?
- What information leaks through error messages?

---

## D - Denial of Service

### **Core Question**
What operations are computationally expensive?

### **Attack Scenarios**
- **Resource Exhaustion**: CPU, memory, disk, network
- **Application Logic Attacks**: Expensive operations
- **Infrastructure Attacks**: Network flooding

### **Example Questions**
- What storage systems are used?
- What limits exist for each system?
- Which operations lack rate limiting?

---

## E - Elevation of Privilege

### **Core Question**
In what ways can the authorization system be subverted?

### **Attack Scenarios**
- **Privilege Escalation**: Gaining higher permissions
- **Authorization Bypass**: Circumventing access controls
- **Role Confusion**: Exploiting role-based systems

### **Example Questions**
- What privileges do systems need?
- What privileges does each role need?
- Can a privilege be invoked accidentally?

---

<!-- _class: lead -->
# STRIDE in Practice

*Applying the Methodology*

---

## STRIDE Analysis Process

### **Step 1: System Decomposition**
- Identify all system components
- Map data flows between components
- Define trust boundaries

### **Step 2: Threat Identification**
- Apply each STRIDE category to each component
- Document potential threats
- Consider component interactions

### **Step 3: Risk Assessment**
- Evaluate threat likelihood and impact
- Prioritize threats by risk level
- Identify existing mitigations

---

## Web Application STRIDE Example

### **Component**: User Login System

| **STRIDE** | **Threat** | **Mitigation** |
|------------|------------|----------------|
| **Spoofing** | Password brute force | Account lockout, MFA |
| **Tampering** | Session token manipulation | Signed tokens, HTTPS |
| **Repudiation** | Denied unauthorized access | Comprehensive logging |
| **Info Disclosure** | Password in logs | Sanitized logging |
| **DoS** | Login flood attacks | Rate limiting |
| **Elevation** | Admin privilege escalation | Role validation |

---

## Database STRIDE Example

### **Component**: Customer Database

| **STRIDE** | **Threat** | **Mitigation** |
|------------|------------|----------------|
| **Spoofing** | Application impersonation | Certificate-based auth |
| **Tampering** | SQL injection | Parameterized queries |
| **Repudiation** | Data modification denial | Database audit logs |
| **Info Disclosure** | Data breach | Encryption at rest |
| **DoS** | Query resource exhaustion | Query timeouts, limits |
| **Elevation** | Database admin escalation | Least privilege access |

---

<!-- _class: lead -->
# Advanced Threat Modeling

*Beyond Basic STRIDE*

---

## Threat Modeling Methodologies

### **STRIDE** (Microsoft)
- Six threat categories
- Component-focused analysis
- Good for systematic coverage

### **PASTA** (Process for Attack Simulation and Threat Analysis)
- Seven-stage process
- Risk-centric approach
- Business-aligned threat modeling

### **TRIKE**
- Risk-based approach
- Automated threat generation
- Requirements-driven methodology

---

## Attack Trees

### **Concept**
Hierarchical representation of **attack paths**

### **Structure**
- **Root**: Attack goal
- **Branches**: Attack methods
- **Leaves**: Specific attack steps

### **Benefits**
- Visual threat representation
- Cost-benefit analysis
- Defense prioritization

---

## Attack Tree Example

### **Goal**: Steal Customer Credit Cards

```
Steal Credit Cards
├── Compromise Database
│   ├── SQL Injection
│   ├── Insider Threat
│   └── Database Server Exploit
├── Intercept Transactions
│   ├── Man-in-the-Middle
│   ├── Network Sniffing
│   └── Certificate Spoofing
└── Social Engineering
    ├── Phishing Employees
    ├── Physical Access
    └── Vendor Impersonation
```

---

## Data Flow Diagrams (DFDs)

### **Purpose**
Map how **sensitive data** flows through systems

### **Elements**
- **Processes**: Transform data
- **Data Stores**: Persist data
- **External Entities**: Sources/sinks
- **Data Flows**: Movement between elements

### **Security Focus**
- Where does sensitive data go?
- What transforms sensitive data?
- Where are trust boundaries crossed?

---

## Threat Modeling Tools

### **Free Tools**
- **Microsoft Threat Modeling Tool**
- **OWASP Threat Dragon**
- **Threagile** (Infrastructure as Code)

### **Commercial Tools**
- **ThreatModeler**
- **IriusRisk**
- **SD Elements**

### **Benefits**
- Automated threat generation
- Consistent methodology
- Integration with development workflows

---

<!-- _class: lead -->
# Practical Applications

*Real-World Threat Modeling*

---

## Threat Modeling in SDLC

### **Design Phase**
- Architectural threat modeling
- Component interaction analysis
- Trust boundary definition

### **Development Phase**
- Code-level threat analysis
- Security requirement validation
- API security review

### **Deployment Phase**
- Infrastructure threat modeling
- Configuration security review
- Operational security assessment

---

## Agile Threat Modeling

### **Challenges**
- Traditional threat modeling is heavyweight
- Agile teams need lightweight processes
- Continuous delivery requires fast feedback

### **Solutions**
- **Incremental Modeling**: Model user stories
- **Threat Sprints**: Dedicated threat modeling sessions
- **Automated Tools**: Integration with CI/CD
- **Security Champions**: Embedded security expertise

---

## DevSecOps Integration

### **Shift-Left Security**
- Threat modeling in design phase
- Security requirements as code
- Automated threat analysis

### **Continuous Threat Modeling**
- Model changes trigger security review
- Automated threat detection
- Security feedback loops

### **Tool Integration**
- Version control integration
- CI/CD pipeline integration
- Security dashboard reporting

---

<!-- _class: lead -->
# Common Pitfalls and Best Practices

*Making Threat Modeling Effective*

---

## Common Pitfalls

### **1. Analysis Paralysis**
- Trying to model everything perfectly
- Getting lost in theoretical threats
- Never reaching actionable outcomes

### **2. Tool Obsession**
- Focusing on tools instead of thinking
- Over-engineering the process
- Neglecting human expertise

### **3. One-Time Activity**
- Treating threat modeling as a checkpoint
- Not updating models as systems evolve
- Losing institutional knowledge

---

## Best Practices

### **Start Simple**
- Begin with high-level system view
- Focus on critical assets and flows
- Iterate and refine over time

### **Make It Collaborative**
- Include diverse perspectives
- Involve architects, developers, security
- Document decisions and rationale

### **Keep It Current**
- Update models with system changes
- Regular threat model reviews
- Version control for threat models

---

## Measuring Success

### **Process Metrics**
- Threats identified per component
- Coverage of system components
- Time from threat to mitigation

### **Outcome Metrics**
- Security vulnerabilities found
- Security incidents prevented
- Cost of security measures

### **Cultural Metrics**
- Team security awareness
- Security consideration in design
- Proactive security thinking

---

<!-- _class: lead -->
# Chapter 11 Summary

**Key Takeaways for Effective Threat Modeling**

---

## Core Concepts Mastered

### **Adversarial Mindset**
- Think beyond the "happy path"
- Question assumptions and abstractions
- Explore unintended system behaviors

### **Systematic Approaches**
- **Asset-focused**: Protect valuable resources
- **Attacker-focused**: Understand threat actors
- **System-focused**: Analyze technical architecture

### **STRIDE Methodology**
- **Spoofing, Tampering, Repudiation**
- **Information Disclosure, DoS, Elevation of Privilege**
- Systematic threat category coverage

## Implementation Strategies

### **Process Integration**
- Embed in software development lifecycle
- Adapt for agile and DevSecOps environments
- Use tools to support, not replace, thinking

### **Continuous Improvement**
- Iterate and refine threat models
- Update with system evolution
- Learn from security incidents

## Next Steps: Apply threat modeling to your next project! 🎯🔒
