---
marp: true
theme: gaia
style: |
  section {
    font-size: 175%;
  }
---


<!-- _class: center-content -->

# Chapter 3: Authentication
## Determining Valid Users

<div class="lead">
Secure Programming Fundamentals
</div>

---

<!-- 
Speaker Notes:
- Authentication is about verifying WHO someone is
- This is different from authorization (WHAT they can do)
- Often the weakest link in security systems
- Physical components often part of initial setup
- Three main vulnerability areas: weak passwords, data breaches, authentication implementation flaws
-->

## What is Authentication?

> Authentication is determining that the user attempting access is a valid user.

<div class="grid">
<div>

### Key Principles
- **Identity Verification**
- **Physical Components** (initial setup)
- **Vulnerable to Multiple Attack Vectors**

</div>
<div>

### Common Vulnerabilities
- Weak passwords
- Data breaches  
- Implementation gaps

</div>
</div>

---

<!-- 
Speaker Notes:
- Traditional complexity requirements often backfire
- Users find ways around complexity (password123!)
- Length is more important than complexity
- Math demonstrates why passphrases work better
- Standard keyboard has 94 possible characters
-->

## The Password Problem

### Traditional "Complex" Requirements
- Must contain digit, punctuation, upper/lowercase
- No common words
- **Problem**: Complexity for humans leads to circumvention

<div class="math">

**8-character passwords**: 94^8 = 6,095,689,385,410,816 possibilities

**4-word passphrases**: 25,000^4 = 160,000,000,000,000,000 possibilities

</div>

<div class="highlight">Length > Complexity</div>

---

<!-- 
Speaker Notes:
- Password restrictions dramatically reduce search space
- Banks often forbid punctuation - major red flag
- Case insensitive systems are concerning
- These restrictions often indicate plaintext storage
- May suggest SQL injection vulnerabilities
- Show how 94^8 drops to 36^8 with restrictions
-->

## Restrictive Passwords: Red Flags

<div class="grid">
<div>

### Common Restrictions
- No punctuation marks
- Case insensitive
- Limited character sets

<div class="math">
Restricted 8-char: 36^8 = 2,821,109,907,456
</div>

</div>
<div class="warning">

**What This Implies:**
- Passwords likely stored unencrypted
- System may be vulnerable to SQL injection
- Poor security architecture

</div>
</div>

---

<!-- 
Speaker Notes:
- Proactive password testing is good security practice
- Use same tools attackers would use
- Cracked passwords should force immediate reset
- Performance considerations for real-time checking
- Helps identify weak passwords before they're exploited
- Reduces damage from data leaks
-->

## Offensive Security: Password Testing

### Proactive Defense Strategy

1. **Regular Password Auditing**
   - Run all system passwords through crackers
   - Force reset of any cracked passwords

2. **Real-time Validation**
   - Check new passwords during reset
   - Reject easily crackable passwords

<div class="highlight">
If you can crack it, so can attackers
</div>

---

<!-- 
Speaker Notes:
- Data breaches are inevitable, not if but when
- Preparation is key - have a plan ready
- Never store passwords in plaintext
- Never make passwords recoverable
- Recovery phrases are different and require strict policies
- Customer service procedures need clear guidelines
-->

## Data Breaches: When (Not If)

<div class="warning">
CRITICAL: Passwords must never be reversible nor recoverable from what is stored
</div>

### Breach Preparation
- **Have a response plan ready**
- **Never store plaintext passwords**
- **Recovery phrases** ≠ passwords
- **Clear customer service policies**

---

<!-- 
Speaker Notes:
- One-way hash functions are essential for password storage
- Four key properties define a good hash function
- SHA-1 example shows avalanche effect
- Note that SHA-1 is now deprecated due to collision vulnerabilities
- Demonstrate how small input changes create large output changes
- Still not completely safe from attacks
-->

## Password Hashing Fundamentals

### One-Way Hash Function Properties

1. **Deterministic**: Same input → Same hash
2. **Irreversible**: Hash → Input is practically impossible  
3. **Collision Resistant**: Different inputs rarely produce same hash
4. **Avalanche Effect**: Small input change → Large output change

<div class="code-block">
sha1('abb') → 0xc64d3fcde20c5cd03142171e5ac47a87aa3c8ace
sha1('abc') → 0xa9993e364706816aba3e25717850c26c9cd0d89d
</div>

---

<!-- 
Speaker Notes:
- Hashing alone isn't enough - rainbow tables exist
- Pre-computed hash lookups for common passwords
- Same passwords produce identical hashes (pattern leakage)
- Salts add random data to each password
- Must be unique per user and stored with hash
- User doesn't need to know their salt value
- Prevents rainbow table attacks and pattern recognition
-->

## Salts: Defeating Rainbow Tables

### The Problem
- **Rainbow tables**: Pre-computed hash lookups
- **Identical passwords** → Identical hashes

### The Solution: Unique Salts

<div class="code-block small-text">
sha1('password' + '9kpnw43x') → 0xa43d18b09df04646743795b63aae24ce20e039b9
sha1('password' + '1vdl4ef8') → 0x009aff16014e3047a89775e2a89c9637c0254745
</div>

- Random per user
- Stored with hash
- Forces custom brute-force per password

---

<!-- 
Speaker Notes:
- User notification is legally and ethically required
- Force password reset immediately
- Remind users about password reuse dangers
- May need to lock accounts pending secondary authentication
- Transparency builds trust despite embarrassment
- Clear communication about what was compromised
- Provide guidance on next steps
-->

## Breach Notification Protocol

<div class="grid">
<div>

### Immediate Actions
- **Notify all affected users**
- **Force password reset**
- **Mark accounts for re-authentication**

</div>
<div>

### User Guidance
- Change password elsewhere if reused
- Monitor accounts for suspicious activity
- Consider account locking for high-privilege users

</div>
</div>

<div class="highlight">Transparency builds trust</div>

---

<!-- 
Speaker Notes:
- Authentication should be intentionally slow
- Fast authentication enables brute force attacks
- Example: 1 million attempts per second vs much slower rates
- Progressive delays can help but enable DoS attacks
- Modern hash functions have work factors
- Contrary to normal performance optimization
- Balance security with user experience
-->

## Authentication Misfires: Speed

### The Counter-Intuitive Principle
<div class="highlight">Authentication should be slow</div>

<div class="comparison">
<div class="bad">

**Too Fast**
- 0.000001s rejection
- 1 million attempts/second
- Enables brute force

</div>
<div class="good">

**Appropriately Slow**  
- 1s rejection time
- Progressive delays (1s, 2s, 3s, 5s...)
- Work factor in hash functions

</div>
</div>

---

<!-- 
Speaker Notes:
- Timing attacks exploit execution time differences
- String comparison often stops at first mismatch
- Attacker can measure response times to guess passwords
- Example shows how 'swordfis...' takes longer than 'letmein'
- Must check ALL positions regardless of early mismatches
- Even the "fixed" version has subtle timing issues
- Proper implementation uses constant-time comparison
-->

## Timing Attacks: Subtle Vulnerabilities

### The Problem: Early Termination
<div class="code-block small-text">
# BAD: Vulnerable to timing attack
if attempt == 'swordfish':
    authenticate()
</div>

- **'swordfission'** takes longer to reject than **'letmein'**
- String comparison stops at first mismatch
- Attacker measures timing to discover password

### Mitigation
<div class="highlight">Check ALL positions regardless of early mismatches</div>

---

<!-- 
Speaker Notes:
- Never trust client-side authentication status
- Server must maintain authentication state
- Common mistake in client-server architectures
- Can be obvious (auth=1 parameter) or subtle (stale tokens)
- Shared machines create additional risks
- Authentication tokens should have expiration
- Server-side validation is mandatory
-->

## Trusting Client Authentication

<div class="warning">
Never rely on client-side authentication status
</div>

### Common Mistakes
- **Obvious**: `auth=1` in client messages
- **Subtle**: Accepting stale authentication tokens
- **Dangerous**: Shared machine vulnerabilities

### Proper Implementation
- **Server tracks authentication state**
- **Token expiration and validation**
- **Assume all client input is untrusted**

---

<!-- 
Speaker Notes:
- Three practical exercises to reinforce concepts
- Exercise 1 demonstrates passphrase entropy
- Exercise 2 requires planning and policy development
- Exercise 3 involves actual secure coding
- Timing attack resistance requires careful implementation
- Students should understand both theory and practice
-->

## Practical Exercises

### Exercise 1: Passphrase Analysis
Create 15 random uncommon words, compare against top 1000 English words

### Exercise 2: Incident Response Planning  
Draft organizational plan for password data leaks

### Exercise 3: Secure Authentication Implementation
Write timing-attack resistant authentication routine

---

<!-- 
Speaker Notes:
- Authentication is foundation of security
- Multiple attack vectors require comprehensive defense
- Password policies should favor length over complexity
- Proper storage with salted hashes is essential
- Implementation details matter enormously
- Regular testing and incident planning are crucial
- User education and transparency build trust
-->

## Key Takeaways

<div class="grid">
<div>

### Password Security
- **Length** over complexity
- **Salted hashing** required
- **Proactive testing** recommended

</div>
<div>

### Implementation Security
- **Intentionally slow** authentication
- **Timing attack** resistance
- **Server-side** validation only

</div>
</div>

<div class="highlight">
Authentication failures cascade through entire security model
</div>

---

<!-- _class: center-content -->

# Questions & Discussion

<div class="lead">
How does your organization handle password policies and breach response?
</div>
