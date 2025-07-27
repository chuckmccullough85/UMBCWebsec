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
  .logistics {
    background-color: #e8f4fd;
    border: 1px solid #b8daff;
    border-radius: 5px;
    padding: 15px;
    margin: 10px 0;
  }
  section.lead h1 {
    text-align: center;
  }
  .small-text {
    font-size: 80%;
  }
---

<!-- 
_class: lead 
_paginate: false
-->

# TCPRG4005 
# Secure Programming
## 4-Day Intensive Course

**Building Security into Software from the Ground Up**

*University of Maryland, Baltimore County (UMBC)*

---

# Welcome & Course Overview

## What You'll Learn:
- **Security-first development mindset**
- **Common vulnerabilities and how to prevent them**
- **Secure coding practices across multiple languages**
- **Real-world application security techniques**
- **Hands-on labs and practical exercises**

<div class="important">
**Goal**: Transform you into a security-conscious developer who builds secure software by design, not as an afterthought.
</div>

---

# Course Logistics

<div class="logistics">

## Schedule (To be confirmed by instructor):
- **Start Time**: _[Instructor will provide]_
- **End Time**: _[Instructor will provide]_
- **Morning Break**: _[Instructor will provide]_
- **Lunch Break**: _[Instructor will provide]_
- **Afternoon Break**: _[Instructor will provide]_

## Course Format:
- **4 Days** × **7 Hours/Day** = **28 Total Hours**
- **Interactive lectures** with live coding examples
- **Hands-on labs** and practical exercises
- **Real-world case studies** and security assessments

</div>

---

# Meet Your Instructor

## Chuck McCullough
### Software Engineer & Security Training Specialist

<div class="small-text">

### Professional Background:
- **Software Engineer** with extensive experience in secure application development
- **Technical Trainer** specializing in cybersecurity and secure programming practices
- **Industry Experience** across multiple programming languages and frameworks
- **Security Focus** on practical, real-world application security implementation

### Teaching Philosophy:
*"Security isn't a feature you add at the end—it's a mindset you develop from the beginning. My goal is to help you think like both a developer and an attacker."*

</div>

<div class="success">
**Approach**: Hands-on, practical learning with real-world examples and immediate application
</div>

---

# Let's Get to Know Each Other!

## Student Introductions
*Please share (2-3 minutes each):*

1. **Your Name & Role**
   - Current position/title
   
2. **Programming Experience**
   - Languages you work with
   - Years of development experience
   
4. **Course Goals**
   - What you hope to learn
   - Specific problems you're trying to solve

---

# Course Structure & Timeline

## 4-Day Learning Journey

### **Day 1: Foundations** (7 hours)
- **Chapter 1**: Introduction & Security Fundamentals *(1.5 hours)*
- **Chapter 2**: Cryptography Fundamentals *(2.5 hours)*
- **Chapter 3**: Authentication Fundamentals *(3 hours)*

### **Day 2: Access Control** (7 hours)
- **Chapter 4**: Authorization Fundamentals *(3.5 hours)*
- **Chapter 5**: User Management *(3.5 hours)*
---

### **Day 3: Data & Input Security** (7 hours)
- **Chapter 6**: Data Validation & Advanced Exercises *(3.5 hours)*
- **Chapter 7**: Client-Side Security *(3.5 hours)*

### **Day 4: Operations & Architecture** (7 hours)
- **Chapter 8**: Error Handling & Advanced Topics *(2 hours)*
- **Chapter 9**: Event Logging & Monitoring *(2.5 hours)*
- **Chapter 10**: Security Architecture *(1.5 hours)*
- **Chapter 11**: Threat Modeling *(1 hour)*

---

# Detailed Daily Breakdown

<div class="small-text">

## Day 1: Security Foundations
- **Morning**: Course intro, security fundamentals, crypto basics
- **Afternoon**: Authentication mechanisms, password security, MFA

## Day 2: Access Control Systems
- **Morning**: Authorization models, RBAC, common vulnerabilities
- **Afternoon**: User lifecycle management, privilege escalation prevention

## Day 3: Secure Development
- **Morning**: Input validation, SQL injection, XSS prevention
- **Afternoon**: Client-side security, session management, CSRF

## Day 4: Production Security
- **Morning**: Error handling, logging strategies, monitoring
- **Afternoon**: Security architecture, threat modeling, final project

</div>

<div class="important">
Each day includes **theory**, **hands-on labs**, **real-world examples**, and **practical exercises**
</div>

---

# Tool Requirements

## Required Software & Setup

### **Primary Development Environment:**
- **Visual Studio Code** (latest version)
- **Git** for version control
- **Python 3.8+** with pip
- **Node.js** (LTS version) with npm

### **Essential VS Code Extensions:**
- **Python Extension Pack**
- **Markdown All in One**
- **GitLens**
- **Security Code Scan** (or similar security linting)
- **REST Client** (for API testing)
---

### **Additional Tools:**
- **Web browser** with developer tools (Chrome/Firefox recommended)
- **Terminal/Command prompt** access
- **Text editor** as backup (Notepad++, Sublime Text, etc.)

---

# Getting Course Materials

## GitHub Repository Setup

### **Step 1: Clone the Repository**
```bash
# Command will be provided by instructor
git clone [REPOSITORY_URL_TO_BE_PROVIDED]
cd UMBCWebsec
```

### **Step 2: Install Dependencies**
```bash
# Python dependencies
pip install -r requirements.txt

# Node.js dependencies (if applicable)
npm install
```

### **Step 3: Verify Setup**
```bash
# Test Python environment
python --version
pip list

# Test VS Code extensions
code --list-extensions
```

<div class="warning">
**Note**: Repository URL will be provided by the instructor at the start of class
</div>

---

# Course Materials Overview

## What's Included:

### **For Each Chapter:**
- **Slide Presentations** (Marp format for easy viewing/export)
- **Jupyter Notebooks** with interactive exercises
- **Code Examples** in multiple languages
- **Lab Exercises** with step-by-step instructions
- **Answer Keys** for self-assessment

### **Additional Resources:**
- **Security checklists** for different languages/frameworks
- **Reference documentation** and quick guides
- **Real-world case studies** and vulnerability examples
- **Tools and scripts** for security testing
---

### **Hands-On Labs:**
- **Vulnerable applications** for practice
- **Security scanning tools** and techniques
- **Code review exercises**
- **Threat modeling workshops**

---

# Learning Approach & Expectations

## Our Teaching Method:

### **Interactive Learning:**
- **Ask questions** anytime during presentations
- **Participate actively** in discussions and exercises
- **Share experiences** and real-world challenges
- **Collaborate** on problem-solving

### **Hands-On Practice:**
- **Live coding** examples during lectures
- **Individual exercises** to reinforce concepts
- **Group activities** for complex scenarios
- **Real vulnerability analysis** and remediation
---
### **Practical Application:**
- **Immediate practice** of concepts learned
- **Real-world scenarios** and case studies
- **Industry best practices** and standards
- **Actionable takeaways** for your current projects

<div class="success">
**Remember**: The goal is practical knowledge you can use immediately in your work!
</div>

---

# Course Policies & Guidelines

## Participation & Engagement:
- **Active participation** is encouraged and valued
- **Questions welcome** at any time during the course
- **Respect for all participants** and their experience levels
- **Collaborative learning environment**

## Technology Use:
- **Laptops/devices** for hands-on exercises
- **Phone use** limited to breaks (emergencies excepted)
- **Screen sharing** may be used for group problem-solving
---
## Materials & Resources:
- **Course materials** are yours to keep and reference

- **Updates** and additional resources may be provided post-course

<div class="important">
**Security Note**: Some exercises involve intentionally vulnerable code. Please use only in the controlled lab environment.
</div>

---


# Safety & Security Considerations

<div class="warning">

## Important Reminders:

### **Lab Environment:**
- **Use provided VMs/containers** for vulnerable applications
- **Never test** on production systems or systems you don't own
- **Isolate practice environments** from corporate networks
- **Follow responsible disclosure** if you discover real vulnerabilities

### **Code Examples:**
- **Intentionally vulnerable code** is for educational purposes only
- **Don't deploy** example code to production environments
- **Always validate** security practices in your specific context
---
### **Professional Ethics:**
- **Use knowledge responsibly** and ethically
- **Respect** others' systems and data
- **Follow** your organization's security policies

</div>

---

# Questions Before We Begin?

## Ready to Start Your Security Journey?

### **Final Setup Check:**
- ✅ **VS Code** installed and ready
- ✅ **Git** configured for repository access
- ✅ **Python** and **Node.js** environments ready
- ✅ **Course materials** will be cloned shortly

### **What's Next:**
1. **Clone the repository** (URL to be provided)
2. **Verify environment setup**
3. **Begin Chapter 1**: Introduction & Security Fundamentals

<div class="important">
**Let's build secure software together!**
</div>

---

<!-- 
_class: lead 
_paginate: false
-->

# Ready to Begin!
## Chapter 1: Introduction & Security Fundamentals

**Let's start building security into every line of code we write.**

*Questions? Ask anytime!*
