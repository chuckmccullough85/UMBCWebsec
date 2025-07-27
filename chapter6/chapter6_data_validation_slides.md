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
  --color-warning: #ff5555;
  --color-info: #8be9fd;
}

section {
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

h1, h2, h3 {
  color: var(--color-highlight);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

blockquote {
  border-left: 4px solid var(--color-accent);
  background: rgba(80, 250, 123, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.lead {
  font-size: 1.2em;
  color: var(--color-info);
  text-align: center;
  margin: 2rem 0;
}

.highlight {
  background: linear-gradient(45deg, var(--color-highlight), var(--color-accent));
  color: var(--color-background);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  font-weight: bold;
}

.warning {
  background: rgba(255, 85, 85, 0.2);
  border: 2px solid var(--color-warning);
  padding: 1rem;
  border-radius: 8px;
  color: var(--color-warning);
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.small-text {
  font-size: 0.8em;
  line-height: 1.4;
}

.code-block {
  background: #282a36;
  border: 1px solid #6272a4;
  border-radius: 6px;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  overflow-x: auto;
}

.comparison {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.comparison > div {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
}

.good {
  background: rgba(80, 250, 123, 0.2);
  border: 2px solid var(--color-accent);
}

.bad {
  background: rgba(255, 85, 85, 0.2);
  border: 2px solid var(--color-warning);
}

ul li {
  margin: 0.5rem 0;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.breach-example {
  background: rgba(255, 85, 85, 0.1);
  border-left: 4px solid var(--color-warning);
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9em;
}
</style>

<!-- _class: center-content -->

# Chapter 6: Data Validation
## The Golden Rule of Security

<div class="lead">
Never Trust User Input
</div>

---

<!-- 
Speaker Notes:
- This is THE fundamental rule of secure programming
- Nearly every security vulnerability stems from trusting user input
- User input includes obvious things like forms, but also headers, file uploads, API calls
- Even metadata and system information can be manipulated
- Defense in depth starts with input validation
- This chapter covers the most common vulnerabilities: buffer overflows and injection attacks
-->

## The Cardinal Rule

<div class="warning">
NEVER TRUST INPUT FROM THE USER
</div>

### What This Includes:
- **Text length and content**
- **Character restrictions**
- **Application usage patterns**
- **Resource consumption**
- **System integrity assumptions**
- **Data theft intentions**

<div class="highlight">Nearly every security hole comes from trusting user input</div>

---

<!-- 
Speaker Notes:
- Buffer overflows dominated vulnerabilities for decades
- Still major risk in C, C++, Assembly - any language with manual memory management
- Four deadly C functions to never use: gets, sprintf, strcpy, strcat
- Even "safe" versions can be used incorrectly
- Modern languages with bounds checking help but don't eliminate risk
- Show famous examples: Morris Worm (1988), Code Red (2001)
-->

## Buffer Overflows: The Classic Attack

### Historical Context
- **Most common vulnerability for decades**
- **Still prevalent in C/C++/Assembly**
- **Manual boundary checks required**

<div class="code-block small-text">
// BAD: Unbounded copy
char buffer[BUF_SZ];
strcpy(buffer, user_input);  // DANGEROUS!

// Four functions to NEVER use:
// gets(), sprintf(), strcpy(), strcat()
</div>

<div class="breach-example">
<strong>Real Example:</strong> Morris Worm (1988) exploited buffer overflow in fingerd daemon, affecting 10% of internet-connected computers
</div>

---

<!-- 
Speaker Notes:
- Even "safe" functions can be used incorrectly
- strlen(user_input) defeats the purpose - attacker controls this
- Must use destination size, never source size
- NUL termination is critical in C strings
- Show how to properly use strncpy with size-1 for NUL byte
- Demonstrate common mistakes developers make
-->

## Buffer Overflow Prevention

<div class="comparison">
<div class="bad">

**Wrong Way**
```c
// Uses source size!
strncpy(buffer, user_input, 
        strlen(user_input));

// No NUL termination
strncpy(buffer, user_input, 
        sizeof(buffer));
```

</div>
<div class="good">

**Correct Way**
```c
char buffer[BUF_SZ] = {0};

// Use destination size - 1
strncpy(buffer, user_input, 
        sizeof(buffer)-1);
```

</div>
</div>

<div class="highlight">
Use destination capacity, not source length
</div>

---

<!-- 
Speaker Notes:
- SQL injection is now the #1 web vulnerability
- String concatenation creates the vulnerability
- Attacker embeds SQL syntax in user input
- Show the classic example with admin check
- Explain how the malicious input breaks out of the intended query structure
- OWASP consistently ranks this as top threat
-->

## SQL Injection: Today's #1 Threat

### The Vulnerable Pattern
<div class="code-block small-text">
# BAD: String concatenation with user input
def is_admin(user):
    cursor.execute(f'''
        SELECT is_admin FROM login 
        WHERE username = '{user}'
    ''')
    return cursor.fetchone()[0]
</div>

### Malicious Input
<div class="code-block small-text">
is_admin("'; SELECT true; --")

# Results in:
SELECT is_admin FROM login WHERE username = ''; SELECT true; --'
</div>

---

<!-- 
Speaker Notes:
- Equifax breach (2017) - 147 million records exposed
- Yahoo breach (2013-2014) - 3 billion accounts
- Ashley Madison (2015) - 32 million users
- Target (2013) - 40 million credit cards
- These all involved injection vulnerabilities or poor input validation
- Financial and reputational damage in billions
- Legal consequences and regulatory fines
-->

## Real-World SQL Injection Breaches

<div class="breach-example">
<strong>Equifax (2017):</strong> SQL injection in web application exposed 147 million records. Cost: $4+ billion in settlements and remediation.
</div>

<div class="breach-example">
<strong>TalkTalk (2015):</strong> SQL injection exposed 4 million customer records. £77 million fine and customer exodus.
</div>

<div class="breach-example">
<strong>Heartland Payment (2008):</strong> SQL injection led to 134 million credit card exposures. $140 million in fines and costs.
</div>

---

<!-- 
Speaker Notes:
- SQL injection principles apply to any language interpretation
- Shell injection through system() calls
- JavaScript eval() vulnerabilities
- LDAP injection in authentication systems
- XML injection in API parsing
- NoSQL injection in MongoDB queries
- Show variety of attack vectors beyond just SQL
-->

## Beyond SQL: Other Injection Attacks

### Shell Injection
<div class="code-block small-text">
# BAD: User input in shell commands
my($month,$year) = split(' ', <>);
system("cal $month $year");

# Attack: "January; rm -rf /"
</div>

### Code Injection
<div class="code-block small-text">
# BAD: Dynamic code evaluation
request = input('Enter string to split: ')
words = eval(f'"{request}".split()')

# Attack: "__import__('os').system('rm -rf /')"
</div>

---

<!-- 
Speaker Notes:
- NoSQL databases aren't immune to injection
- MongoDB queries can be manipulated
- JSON injection in APIs
- LDAP injection in directory services
- XPath injection in XML processing
- Template injection in rendering engines
- Each has specific syntax but same principle
-->

## Modern Injection Variants

### NoSQL Injection (MongoDB)
<div class="code-block small-text">
# Vulnerable query construction
db.users.find({"username": user_input, "password": password_input})

# Attack payload: {"$ne": null}
# Bypasses authentication entirely
</div>

### LDAP Injection
<div class="code-block small-text">
# Vulnerable LDAP filter
filter = f"(&(uid={username})(password={password}))"

# Attack: "admin)(|(uid=*"
# Results in: (&(uid=admin)(|(uid=*)(password=anything))
</div>

---

<!-- 
Speaker Notes:
- Parameterized queries are the gold standard
- Separate code from data completely
- Input validation as additional layer
- Whitelist approach preferred over blacklist
- Length limits and character restrictions
- Encoding/escaping as last resort
- Multiple layers of defense
-->

## Injection Prevention Strategies

<div class="grid">
<div>

### Primary Defense
- **Parameterized Queries**
- **Prepared Statements**
- **Stored Procedures**

<div class="code-block small-text">
# Safe parameterized query
cursor.execute(
    "SELECT * FROM users WHERE id = ?", 
    (user_id,)
)
</div>

</div>
<div>

### Secondary Defenses
- **Input Validation**
- **Length Restrictions**
- **Character Whitelisting**
- **Encoding/Escaping**

</div>
</div>

---

<!-- 
Speaker Notes:
- Input validation should be comprehensive
- Validate type, length, format, range
- Use whitelists, not blacklists
- Server-side validation is mandatory
- Client-side validation is UX, not security
- Fail securely - reject invalid input
- Log validation failures for monitoring
-->

## Comprehensive Input Validation

### Validation Checklist
- ✅ **Data Type** (string, integer, email)
- ✅ **Length Limits** (min/max characters)
- ✅ **Format** (regex patterns, structure)
- ✅ **Range** (numeric bounds, date ranges)
- ✅ **Character Sets** (allowed/forbidden chars)
- ✅ **Business Logic** (valid account numbers)

<div class="warning">
Client-side validation ≠ Security
Always validate server-side!
</div>

---

<!-- 
Speaker Notes:
- Exercise 1 gets students thinking about language-specific risks
- Exercise 2 demonstrates vulnerability discovery skills
- Exercise 3 shows injection exploitation techniques
- Have students work through these systematically
- Discuss findings and solutions as group
- Emphasize that finding vulnerabilities helps fix them
-->

## Hands-On Exercises

### Exercise 1: Language Risk Assessment
**What language does your team use? What's the biggest security risk?**

### Exercise 2: Buffer Overflow Hunt
```c
enum { BUF_SZ = 128 };
char buffer[BUF_SZ] = {0};
strncpy(buffer, user_command, sizeof(buffer)-1);
strncat(buffer, user_argument, sizeof(buffer)-1);
```
**Find the vulnerability. What input would exploit it?**

---

<!-- 
Speaker Notes:
- Exercise 3 combines multiple vulnerability types
- Shell injection opportunity through user_year
- Cal command can be exploited with command chaining
- Could use semicolon, ampersand, pipe operators
- Redirection could overwrite system files
- Students should identify the eval/system call chain
-->

## Exercise 3: Multi-Vector Attack

```python
user_year = input('Enter a year')
script = f"cal '{user_year}' > output.txt"
sys.execl(script)
```

**Find the injection vulnerability. What could be passed to exploit it?**

<div class="small-text">
Think about: Command chaining, file redirection, system commands
</div>

---

<!-- 
Speaker Notes:
- Input validation is first line of defense
- Defense in depth requires multiple layers
- Regular security testing and code review
- Automated tools can catch common patterns
- Developer education is crucial
- Secure coding standards and guidelines
- Incident response planning for when defenses fail
-->

## Building Secure Input Handling

<div class="grid">
<div>

### Technical Controls
- **Parameterized Queries**
- **Input Validation Libraries**
- **Bounds Checking**
- **Sanitization Functions**

</div>
<div>

### Process Controls
- **Code Review**
- **Security Testing**
- **Developer Training**
- **Secure Coding Standards**

</div>
</div>

<div class="highlight">
Security is a process, not a product
</div>

---

<!-- 
Speaker Notes:
- Data validation is foundational to all security
- User input is the primary attack vector
- Historical vulnerabilities still relevant today
- Modern applications face evolved threats
- Prevention is more cost-effective than response
- Security mindset must be built into development process
- Regular testing and updates essential
-->

## Key Takeaways

### The Golden Rules
1. **Never trust user input** - validate everything
2. **Use parameterized queries** - separate code from data  
3. **Validate server-side** - client validation is UX only
4. **Fail securely** - reject invalid input completely
5. **Apply defense in depth** - multiple validation layers

<div class="warning">
Every input is a potential attack vector
</div>

---

<!-- _class: center-content -->

# Questions & Discussion

<div class="lead">
What input validation strategies does your organization currently use?<br>
What gaps might exist in your current approach?
</div>
