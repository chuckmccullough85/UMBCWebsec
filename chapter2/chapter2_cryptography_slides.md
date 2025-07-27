---
marp: true
theme: gaia
style: |
  section {
    font-size: 175%;
  }
---

# Chapter 2: Cryptography for Programmers
## Practical Security Implementation

**TCPRG4005 - Secure Programming**

---

# ⚠️ Golden Rule #1

## **NEVER IMPLEMENT YOUR OWN CRYPTO!**

- Use **battle-tested libraries**
- Let cryptographers handle the math
- Focus on **proper implementation**
- Understand **what** to use, not **how** to build

---

# Why We Study Historical Ciphers

## Learning from Failure 🔍

- **Caesar Cipher**: Brute force in seconds
- **Substitution**: Frequency analysis breaks it
- **Vigenère**: Statistical analysis reveals patterns

## Modern Lesson:
> **Security through obscurity ALWAYS fails**

---

# Modern Cryptography Standards

## **Symmetric Encryption** 🔒
- **AES-256** (Advanced Encryption Standard)
- **ChaCha20** (Modern stream cipher)
- **AES-GCM** (Authentication + Encryption)

## **Asymmetric Encryption** 🗝️
- **RSA-2048** minimum (RSA-4096 preferred)
- **ECC P-256** (Elliptic Curve Cryptography)
- **Ed25519** (EdDSA signatures)

---

# Password Security Standards

## **Hashing Algorithms** 🛡️
- **bcrypt** (Adaptive cost, built-in salt)
- **scrypt** (Memory-hard function)
- **Argon2** (Winner of password hashing competition)

## **NEVER USE** ❌
- MD5, SHA-1 (broken)
- Plain SHA-256 (too fast)
- Custom "salt + hash" schemes

---

# AES Implementation Best Practices

## **Cipher Modes** 🔧
- **GCM**: Authenticated encryption (recommended)
- **CBC**: Requires separate HMAC
- **CTR**: Stream cipher mode
- **ECB**: ❌ NEVER USE (patterns leak)

## **Key Requirements**
- **256-bit keys** minimum
- **Random IV/Nonce** for each encryption
- **Proper key derivation** (PBKDF2, scrypt)

---

# Secure Random Number Generation

## **Cryptographically Secure** ✅
```python
# Python
import secrets
random_bytes = secrets.randbits(256)

# JavaScript (Node.js)
const crypto = require('crypto');
const randomBytes = crypto.randomBytes(32);

# C#
using System.Security.Cryptography;
var rng = RandomNumberGenerator.Create();
```

## **NEVER USE** ❌
- `random()`, `Math.random()`
- Predictable seeds
- System time as entropy

---

# Initialization Vectors (IVs)

## **Critical Requirements** 🎯
- **Unique** for every encryption
- **Random** or **counter-based**
- **Same size** as block size (128-bit for AES)
- **Not secret** (can be stored with ciphertext)

## **Common Mistakes** ⚠️
- Reusing IVs = **catastrophic failure**
- Using predictable IVs
- Encrypting IV (unnecessary)

---

# Practical Crypto Libraries

## **Python** 🐍
```python
from cryptography.fernet import Fernet
# High-level, secure by default

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
# Low-level control
```

## **JavaScript** 📱
```javascript
// Node.js built-in crypto
const crypto = require('crypto');

// Web Crypto API (browser)
window.crypto.subtle.encrypt()
```

---

# Digital Signatures

## **When to Use** ✍️
- **Authentication**: Verify sender identity
- **Integrity**: Detect tampering
- **Non-repudiation**: Sender can't deny

## **Standards** 📋
- **RSA-PSS** (RSA with better padding)
- **ECDSA** (Elliptic Curve signatures)
- **Ed25519** (Fast, secure, simple)

---

# Key Management Best Practices

## **Storage** 🔐
- **Hardware Security Modules** (HSM)
- **Key Management Services** (AWS KMS, Azure Key Vault)
- **Environment variables** (never in code!)
- **Encrypted at rest**

## **Rotation** 🔄
- **Regular key rotation** (automated)
- **Graceful key transitions**
- **Revocation mechanisms**

---

# Common Implementation Mistakes

## **Timing Attacks** ⏱️
```python
# WRONG - vulnerable to timing
if user_hash == stored_hash:
    return True

# RIGHT - constant time comparison
import hmac
return hmac.compare_digest(user_hash, stored_hash)
```

## **Padding Oracle Attacks**
- Always use **authenticated encryption** (GCM)
- Validate **before** decrypting

---

# Transport Layer Security (TLS)

## **Minimum Standards** 🌐
- **TLS 1.2** minimum (TLS 1.3 preferred)
- **Perfect Forward Secrecy** (PFS)
- **HSTS** headers
- **Certificate pinning** for critical apps

## **Cipher Suites** 🔒
- **AEAD ciphers** (AES-GCM, ChaCha20-Poly1305)
- **ECDHE** key exchange
- **Avoid** RC4, 3DES, weak ciphers

---

# Cryptographic Principles

## **Kerckhoffs's Principle** 🔍
> *"The security should depend only on the key, not on the secrecy of the algorithm"*

## **Defense in Depth** 🛡️
- Multiple layers of security
- Assume components will fail
- Plan for compromise

---

# Real-World Attack Examples

## **Heartbleed (OpenSSL)** 💔
- **Lesson**: Even crypto libraries have bugs
- **Solution**: Regular updates, multiple implementations

## **Padding Oracle Attacks** ⚠️
- **Lesson**: Implementation details matter
- **Solution**: Authenticated encryption

## **Weak Random Numbers** 🎲
- **Lesson**: Predictable = broken
- **Solution**: Cryptographically secure RNG

---

# Compliance & Standards

## **Regulatory Requirements** 📋
- **FIPS 140-2** (Government)
- **Common Criteria** (International)
- **PCI DSS** (Payment cards)
- **GDPR** (Data protection)

## **Industry Standards** 🏢
- **NIST Guidelines** (SP 800-series)
- **OWASP Crypto Storage Cheat Sheet**
- **IETF RFCs** (TLS, cryptographic standards)

---

# Practical Implementation Checklist

## **Before You Code** ✅
- [ ] Use established libraries
- [ ] Understand the threat model
- [ ] Plan key management
- [ ] Choose appropriate algorithms

## **During Implementation** ✅
- [ ] Generate strong random keys/IVs
- [ ] Use authenticated encryption
- [ ] Implement constant-time comparisons
- [ ] Handle errors securely

---

# Migration Strategy

## **Legacy System Updates** 🔄
1. **Audit** current cryptographic usage
2. **Identify** weak algorithms
3. **Plan** gradual migration
4. **Implement** crypto agility
5. **Monitor** for deprecations

## **Crypto Agility** 🏃‍♂️
- Design for **algorithm replacement**
- Use **configuration-driven** crypto choices
- Plan for **quantum-resistant** algorithms

---

# Testing Your Crypto

## **What to Test** 🧪
- **Key generation** quality
- **IV/Nonce uniqueness**
- **Error handling** (don't leak info)
- **Timing attack** resistance

## **Tools** 🔧
- **Static analysis** (Veracode, SonarQube)
- **Penetration testing**
- **Code review** by crypto experts

---

# Future: Post-Quantum Cryptography

## **The Quantum Threat** ⚛️
- **Shor's Algorithm**: Breaks RSA, ECC
- **Grover's Algorithm**: Halves symmetric key strength

## **Preparation** 🚀
- **Monitor** NIST post-quantum standards
- **Design** for crypto agility
- **Plan** migration strategies
- **Double** symmetric key sizes (256 → 512)

---

# Key Takeaways for Programmers

## **The Big Picture** 🎯
1. **Use standard libraries** and algorithms
2. **Understand** what you're protecting
3. **Plan** for key management from day one
4. **Stay updated** on vulnerabilities
5. **Test** your implementations
6. **Design** for crypto agility

## **Remember** 💡
> *"Good cryptography is hard. Great cryptography is harder. Leave it to the experts and focus on using it correctly."*

---

# Resources & Further Reading

## **Essential References** 📚
- **OWASP Cryptographic Storage Cheat Sheet**
- **NIST SP 800-57** (Key Management)
- **"Cryptography Engineering"** by Ferguson, Schneier, Kohno
- **IETF TLS 1.3 RFC 8446**

## **Stay Current** 📰
- **CVE Database** for vulnerabilities
- **NIST Computer Security Resource Center**
- **Cryptography mailing lists**
- **Security conference talks**

---

# Questions & Discussion 💬

## **Think About:**
- What crypto does your current project use?
- How do you store secrets?
- What's your key rotation strategy?
- Are you ready for post-quantum crypto?

**Next: Hands-on cryptography analysis in the notebook!**