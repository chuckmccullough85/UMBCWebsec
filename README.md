# TCPRG4005 - Secure Programming Course

**University of Maryland, Baltimore County (UMBC)**

A comprehensive 4-day intensive course on secure software development practices, covering fundamental security principles, common vulnerabilities, and practical implementation techniques.

## 📋 Course Overview

This course transforms developers into security-conscious programmers who build secure software by design. Through hands-on labs, real-world examples, and practical exercises, students learn to identify, prevent, and mitigate common security vulnerabilities in modern applications.

### Learning Objectives
- Develop a security-first mindset for software development
- Understand common vulnerabilities and attack vectors
- Implement secure coding practices across multiple languages
- Design and implement robust authentication and authorization systems
- Apply threat modeling and security architecture principles
- Build comprehensive logging and monitoring capabilities

## 🗓️ Course Structure

**Duration**: 4 Days × 7 Hours = 28 Total Hours  
**Format**: Interactive lectures, hands-on labs, and practical exercises

### Day 1: Security Foundations
- Introduction to security fundamentals
- Cryptography principles and implementation
- Authentication mechanisms and best practices

### Day 2: Access Control Systems
- Authorization models and RBAC implementation
- User lifecycle management
- Privilege escalation prevention

### Day 3: Secure Development Practices
- Input validation and injection prevention
- Client-side security and session management
- Cross-site scripting (XSS) and CSRF protection

### Day 4: Production Security
- Error handling and secure logging
- Security architecture and design patterns
- Threat modeling and risk assessment

## 📚 Table of Contents

### Course Materials

| Component | Description |
|-----------|-------------|
| [Course Introduction](./course_introduction_slides.md) | Welcome, logistics, and course overview |
| [Course Conclusion](./course_conclusion_slides.md) | Summary, resources, and next steps |

### Chapter 1: Introduction & Security Fundamentals
| Material | Description |
|----------|-------------|
| [Slides](./chapter1/chapter1_introduction_slides.md) | Introduction and security fundamentals presentation |
| [Notebook](./chapter1/chapter1_security_fundamentals.ipynb) | Interactive exercises and examples |
| [Exercise Answers](./chapter1/chapter1ExerciseAnswers.md) | Solutions and explanations |

### Chapter 2: Cryptography Fundamentals
| Material | Description |
|----------|-------------|
| [Slides](./chapter2/chapter2_cryptography_slides.md) | Cryptography principles and implementation |
| [Notebook](./chapter2/chapter2_cryptography_fundamentals.ipynb) | Hands-on cryptography exercises |
| [Exercise Answers](./chapter2/chapter2ExerciseAnswers.md) | Solutions and explanations |

### Chapter 3: Authentication Fundamentals
| Material | Description |
|----------|-------------|
| [Slides](./chapter3/chapter3_authentication_slides.md) | Authentication mechanisms and security |
| [Notebook](./chapter3/chapter3_authentication_fundamentals.ipynb) | Authentication implementation exercises |
| [Exercise Answers](./chapter3/chapter3ExerciseAnswers.md) | Solutions and explanations |
| [Common Words List](./chapter3/common_words_1000.txt) | Dictionary for password strength testing |

### Chapter 4: Authorization Fundamentals
| Material | Description |
|----------|-------------|
| [Slides](./chapter4/chapter4_authorization_slides.md) | Authorization models and RBAC implementation |
| [Notebook](./chapter4/chapter4_authorization_fundamentals.ipynb) | Authorization system exercises |
| [Demo Logs](./chapter4/demo_logs/) | Sample log files for analysis |

### Chapter 5: User Management Fundamentals
| Material | Description |
|----------|-------------|
| [Slides](./chapter5/chapter5_user_management_slides.md) | User lifecycle and management practices |
| [Notebook](./chapter5/chapter5_user_management_fundamentals.ipynb) | User management implementation exercises |

### Chapter 6: Data Validation & Advanced Topics
| Material | Description |
|----------|-------------|
| [Slides](./chapter6/chapter6_data_validation_slides.md) | Input validation and injection prevention |
| [Notebook](./chapter6/chapter6_advanced_exercises.ipynb) | Advanced security implementation exercises |

### Chapter 7: Client-Side Security
| Material | Description |
|----------|-------------|
| [Slides](./chapter7/chapter7_client_side_security_slides.md) | Client-side security and session management |
| [Notebook](./chapter7/chapter7_client_side_security.ipynb) | Client-side security exercises |
| [Flask Labs](./chapter7/chapter7_flask_labs/) | Hands-on web security laboratory |

### Chapter 8: Error Handling & Advanced Topics
| Material | Description |
|----------|-------------|
| [Slides](./chapter8/chapter8_error_handling_slides.md) | Secure error handling and advanced topics |
| [Notebook](./chapter8/chapter8_advanced_exercises.ipynb) | Advanced security exercises |

### Chapter 9: Event Logging & Monitoring
| Material | Description |
|----------|-------------|
| [Slides](./chapter9/chapter9_event_logging_slides.md) | Logging strategies and security monitoring |
| [Notebook](./chapter9/chapter9_event_logging_exercises.ipynb) | Logging and monitoring exercises |

### Chapter 10: Security Architecture
| Material | Description |
|----------|-------------|
| [Slides](./chapter10/chapter10_architecture_slides.md) | Security architecture and design patterns |
| [Notebook](./chapter10/chapter10_architecture_exercises.ipynb) | Architecture design exercises |

### Chapter 11: Threat Modeling
| Material | Description |
|----------|-------------|
| [Slides](./chapter11/chapter11_threat_modeling_slides.md) | Threat modeling methodologies and tools |
| [Notebook](./chapter11/chapter11_threat_modeling_exercises.ipynb) | Threat modeling workshops |
| [Exercise Guide](./chapter11/chapter11_threat_modeling_exercises.md) | Structured threat modeling exercises |

## 🛠️ Prerequisites & Setup

### Required Software
- **Visual Studio Code** (latest version)
- **Python 3.8+** with pip
- **Node.js** (LTS version) with npm
- **Git** for version control

### Recommended VS Code Extensions
- Python Extension Pack
- Markdown All in One
- GitLens
- Security Code Scan
- REST Client

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chuckmccullough85/UMBCWebsec.git
   cd UMBCWebsec
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify your setup:**
   ```bash
   python --version
   code --version
   ```

## 🚀 Getting Started

### For Students
1. **Review the course introduction slides** to understand the structure and expectations
2. **Set up your development environment** using the installation guide above
3. **Start with Chapter 1** and progress through the materials sequentially
4. **Complete hands-on exercises** in the Jupyter notebooks for each chapter
5. **Practice with the Flask labs** in Chapter 7 for real-world experience

### For Instructors
1. **Review all slide presentations** and customize timing/logistics as needed
2. **Test lab environments** and ensure all dependencies are properly installed
3. **Prepare vulnerable applications** for hands-on security testing exercises
4. **Review exercise answers** and prepare additional examples as needed

## 🔧 Lab Environments

### Chapter 7: Flask Security Labs
The `chapter7_flask_labs` directory contains a complete web application with intentional security vulnerabilities for educational purposes:

- **Banking Application** (Lab 1): Authentication vulnerabilities
- **E-commerce Platform** (Lab 2): Authorization and injection flaws  
- **Session Management** (Lab 3): Session handling security issues

⚠️ **Warning**: These applications contain intentional security vulnerabilities. Use only in isolated educational environments.

## 📖 Additional Resources

### Security Standards & Frameworks
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Recommended Reading
- "The Web Application Hacker's Handbook" by Dafydd Stuttard & Marcus Pinto
- "Secure Coding in C and C++" by Robert Seacord
- "Iron-Clad Java: Building Secure Web Applications" by Jim Manico & August Detlefsen

### Practice Environments
- [DVWA (Damn Vulnerable Web Application)](http://www.dvwa.co.uk/)
- [WebGoat](https://owasp.org/www-project-webgoat/)
- [Mutillidae II](https://sourceforge.net/projects/mutillidae/)


## ⚠️ Security Disclaimer

This repository contains educational materials about security vulnerabilities and attack techniques. All examples are provided for educational purposes only:

- **Use responsibly** and only in authorized testing environments
- **Never test** on systems you don't own or lack permission to test
- **Follow responsible disclosure** if you discover real vulnerabilities
- **Respect privacy** and confidentiality of systems and data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💼 About the Instructor

**Chuck McCullough** is an experienced software engineer and security training specialist with extensive background in secure application development and cybersecurity education. He specializes in practical, hands-on training that transforms developers into security-conscious programmers.



---

**🎯 Goal**: Transform developers into security champions who build secure software by design, not as an afterthought.

*Make every line of code contribute to a more secure digital world.*
