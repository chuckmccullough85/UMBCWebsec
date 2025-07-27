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
# Chapter 1
## Introduction to Secure Programming

**Secure Programming Fundamentals**
*TCPRG4005-2023-03-01*

---

## Learning Objectives

By the end of this chapter, you will:

- **Accept the reality** that all software has bugs
- **Understand** why security is not an add-on feature
- **Apply** security thinking throughout the SDLC
- **Develop** a security-first mindset
- **Recognize** common sources of security vulnerabilities

---

<!-- _class: lead -->
# The Fundamental Reality

*"All software has bugs and exploits"*

---

## The Security Truth

### **If you have written software...**
Someone will try to exploit the bugs you have written.

### **If you have tested software...**
Someone will try to exploit the bugs you missed.

### **No one can claim...**
- To write code without errors
- To find all errors in testing

---

## The IRA Perspective

### **October 13, 1984 - Message to Margaret Thatcher:**

> *"Remember, we only have to be lucky once. You have to be lucky always."*

### **Security Reality:**
- **Attackers** need to find just one weakness
- **Defenders** must protect against all possible attacks
- **Asymmetric challenge** favoring attackers

---

<!-- _class: lead -->
# Security From the Ground Up

*"Security is not an add-on feature"*

---

## The SDLC Security Challenge

### **Software Development LifeCycle:**

1. **Gather Requirements**
2. **Draft Design** 
3. **Implement Features**
4. **Test for Defects**
5. **Deploy to Production**
6. **Maintain Services**

### **Security holes can creep in at ANY point!**

---

## Requirements Phase Security

### **Dangerous Requirements:**
*"The CEO needs to be able to review the credit card numbers of all customers at any time."*

### **Security Prevention:**
- Careful discussion and review
- Policy and strategy documents
- PII handling policies
- Financial information guidelines
- Authentication requirements

---

## Implementation Phase Security

### **Coding Vulnerabilities:**
- Buffer overflows
- SQL injection
- Cross-site scripting
- Input validation failures

### **Secure Coding Practices:**
- Input validation
- Output encoding
- Parameterized queries
- Proper error handling

---

## Testing Phase Security

### **Security Testing:**
- Penetration testing
- Vulnerability scanning
- Static code analysis
- Dynamic application testing

### **Beyond Functional Testing:**
- Security test cases
- Abuse case testing
- Edge case validation

---

<!-- _class: lead -->
# The Security Mindset

*Thinking Like an Attacker*

---

## From Developer to Security Mindset

### **Traditional Developer Thinking:**
- Focus on functionality
- Assume correct usage
- Optimize for performance
- Build features quickly

### **Security-Aware Developer Thinking:**
- Question all assumptions
- Validate all inputs
- Consider misuse scenarios
- Build defensively

---

## Security is Effort and Diligence

### **Key Principles:**
- Security takes **effort and diligence**
- Secure practices must be **part of the system from day one**
- Security is not a **patch, plugin, or add-on**
- Bugs **will be written** - accept and mitigate

### **Mitigation Strategies:**
- Defensive programming
- Code reviews
- Security testing
- Continuous monitoring

---

<!-- _class: lead -->
# Chapter 1 Summary

**Building the Security Foundation**

---

## Key Takeaways

### **Fundamental Truths:**
- All software has bugs and exploits
- Security cannot be bolted on later
- Security requires effort throughout SDLC

### **Security Mindset:**
- Accept that bugs will be written
- Think like an attacker
- Build defenses from day one
- Plan for security maintenance

### **Next Steps:**
Apply security thinking to every phase of development!

---

## Chapter 1 Exercises

### **Exercise 1:** Reflect on bugs in your career
### **Exercise 2:** Define what a computer program is
### **Exercise 3:** Consider software vendor liability
### **Exercise 4:** Identify SDLC security bugs
### **Exercise 5:** Assess Dev/Ops separation
### **Exercise 6:** Secure third-party deployment
