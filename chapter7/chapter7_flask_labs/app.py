"""
Chapter 7 Client-Side Security Labs - Flask Application
Educational demonstration of client-side security vulnerabilities
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'insecure_key_for_demo'

# Simulated database for demonstrations
PRODUCTS = {
    'laptop': {'name': 'Premium Laptop', 'price': 1299.99},
    'headphones': {'name': 'Wireless Headphones', 'price': 199.99},
    'mouse': {'name': 'Gaming Mouse', 'price': 79.99}
}

USER_ROLES = {
    'customer': {'discount': 0, 'is_vip': False},
    'vip': {'discount': 20, 'is_vip': True},
    'admin': {'discount': 50, 'is_vip': True}
}

# Track attacks for educational purposes
attack_log = []

def log_attack(attack_type, details):
    """Log detected attacks for educational demonstration"""
    attack_log.append({
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': attack_type,
        'details': details
    })

@app.route('/')
def index():
    """Main lab selection page"""
    return render_template('index.html')

@app.route('/lab1')
def lab1_banking():
    """Lab 1: Client-Side Validation Bypass"""
    return render_template('lab1_banking.html')

@app.route('/lab1/transfer', methods=['POST'])
def process_transfer():
    """Process banking transfer - demonstrates server-side detection"""
    data = request.get_json()
    
    amount = float(data.get('amount', 0))
    memo = data.get('memo', '')
    from_account = data.get('fromAccount', '')
    to_account = data.get('toAccount', '')
    
    # Server-side validation (the RIGHT way)
    alerts = []
    
    if amount > 1000:
        alerts.append(f"🚨 ATTACK DETECTED: Transfer amount ${amount:,.2f} exceeds $1000 limit!")
        log_attack("Amount Limit Bypass", f"Attempted transfer of ${amount:,.2f}")
    
    if len(memo) > 50:
        alerts.append(f"🚨 ATTACK DETECTED: Memo length {len(memo)} exceeds 50 character limit!")
        log_attack("Memo Length Bypass", f"Memo length: {len(memo)} characters")
    
    if amount <= 0:
        alerts.append("🚨 ATTACK DETECTED: Invalid transfer amount!")
        log_attack("Invalid Amount", f"Amount: ${amount}")
    
    # Simulate transfer processing
    success = len(alerts) == 0
    
    response = {
        'success': success,
        'amount': amount,
        'from_account': from_account,
        'to_account': to_account,
        'memo': memo,
        'alerts': alerts,
        'message': 'Transfer processed successfully!' if success else 'Transfer blocked by server-side validation!'
    }
    
    return jsonify(response)

@app.route('/lab2')
def lab2_ecommerce():
    """Lab 2: Hidden Field Manipulation"""
    return render_template('lab2_ecommerce.html', products=PRODUCTS, user_roles=USER_ROLES)

@app.route('/lab2/checkout', methods=['POST'])
def process_checkout():
    """Process e-commerce checkout - demonstrates hidden field tampering detection"""
    data = request.get_json()
    
    # Extract client-sent data
    client_laptop_price = float(data.get('laptop_price', 0))
    client_headphones_price = float(data.get('headphones_price', 0))
    client_user_role = data.get('userRole', 'customer')
    client_discount = float(data.get('discountPercent', 0))
    client_is_vip = data.get('isVip', 'false').lower() == 'true'
    
    laptop_qty = int(data.get('laptop_qty', 0))
    headphones_qty = int(data.get('headphones_qty', 0))
    
    # Server-side validation (the RIGHT way)
    alerts = []
    actual_laptop_price = PRODUCTS['laptop']['price']
    actual_headphones_price = PRODUCTS['headphones']['price']
    
    # Detect price tampering
    if abs(client_laptop_price - actual_laptop_price) > 0.01:
        alerts.append(f"🚨 PRICE TAMPERING DETECTED: Laptop price changed from ${actual_laptop_price} to ${client_laptop_price}")
        log_attack("Price Manipulation", f"Laptop: ${actual_laptop_price} → ${client_laptop_price}")
    
    if abs(client_headphones_price - actual_headphones_price) > 0.01:
        alerts.append(f"🚨 PRICE TAMPERING DETECTED: Headphones price changed from ${actual_headphones_price} to ${client_headphones_price}")
        log_attack("Price Manipulation", f"Headphones: ${actual_headphones_price} → ${client_headphones_price}")
    
    # Detect role tampering
    if client_user_role not in USER_ROLES:
        alerts.append(f"🚨 ROLE TAMPERING DETECTED: Invalid role '{client_user_role}'")
        log_attack("Role Manipulation", f"Invalid role: {client_user_role}")
    
    # Calculate correct total using server-side prices
    correct_subtotal = (laptop_qty * actual_laptop_price) + (headphones_qty * actual_headphones_price)
    correct_discount_percent = USER_ROLES.get('customer', {}).get('discount', 0)  # Default to customer
    correct_discount_amount = correct_subtotal * (correct_discount_percent / 100)
    correct_total = (correct_subtotal - correct_discount_amount) * 1.08  # 8% tax
    
    # Client-calculated total for comparison
    client_subtotal = (laptop_qty * client_laptop_price) + (headphones_qty * client_headphones_price)
    client_discount_amount = client_subtotal * (client_discount / 100)
    client_total = (client_subtotal - client_discount_amount) * 1.08
    
    if abs(client_total - correct_total) > 0.01:
        alerts.append(f"🚨 TOTAL MANIPULATION DETECTED: Client total ${client_total:.2f} vs Server total ${correct_total:.2f}")
    
    response = {
        'success': len(alerts) == 0,
        'client_total': client_total,
        'server_total': correct_total,
        'alerts': alerts,
        'tampered_fields': {
            'laptop_price': client_laptop_price != actual_laptop_price,
            'headphones_price': client_headphones_price != actual_headphones_price,
            'user_role': client_user_role != 'customer',
            'discount': client_discount != 0
        }
    }
    
    return jsonify(response)

@app.route('/lab3')
def lab3_session():
    """Lab 3: Session Management Attacks"""
    return render_template('lab3_session.html')

@app.route('/lab3/action', methods=['POST'])
def process_session_action():
    """Process session-based actions - demonstrates client-side session vulnerabilities"""
    data = request.get_json()
    
    action = data.get('action')
    client_user_role = data.get('userRole', 'user')
    client_credits = int(data.get('credits', 100))
    client_access_level = int(data.get('accessLevel', 1))
    
    # Simulate server-side session (what SHOULD happen)
    server_user_role = 'user'  # This would come from server session
    server_credits = 100       # This would come from database
    server_access_level = 1    # This would come from user profile
    
    alerts = []
    
    # Detect privilege escalation attempts
    if client_user_role != server_user_role:
        alerts.append(f"🚨 PRIVILEGE ESCALATION DETECTED: Role changed to '{client_user_role}'")
        log_attack("Privilege Escalation", f"Role: {server_user_role} → {client_user_role}")
    
    if client_credits != server_credits:
        alerts.append(f"🚨 CREDIT MANIPULATION DETECTED: Credits changed to {client_credits}")
        log_attack("Credit Manipulation", f"Credits: {server_credits} → {client_credits}")
    
    if client_access_level != server_access_level:
        alerts.append(f"🚨 ACCESS LEVEL TAMPERING DETECTED: Level changed to {client_access_level}")
        log_attack("Access Level Tampering", f"Level: {server_access_level} → {client_access_level}")
    
    # Determine if action is allowed based on SERVER data, not client data
    allowed = False
    message = ""
    
    if action == 'premium_content':
        allowed = server_credits >= 50
        message = "Premium content accessed" if allowed else "Access denied: Insufficient credits"
    elif action == 'admin_action':
        allowed = server_user_role == 'admin'
        message = "Admin action executed" if allowed else "Access denied: Admin privileges required"
    elif action == 'view_users':
        allowed = server_access_level >= 5
        message = "User list displayed" if allowed else "Access denied: Insufficient access level"
    
    response = {
        'allowed': allowed,
        'message': message,
        'alerts': alerts,
        'server_values': {
            'role': server_user_role,
            'credits': server_credits,
            'access_level': server_access_level
        },
        'client_values': {
            'role': client_user_role,
            'credits': client_credits,
            'access_level': client_access_level
        }
    }
    
    return jsonify(response)

@app.route('/attack-log')
def view_attack_log():
    """View detected attacks for educational purposes"""
    return render_template('attack_log.html', attacks=attack_log)

@app.route('/clear-log', methods=['POST'])
def clear_attack_log():
    """Clear attack log"""
    global attack_log
    attack_log = []
    return redirect(url_for('view_attack_log'))

if __name__ == '__main__':
    print("🔐 Chapter 7 Client-Side Security Labs")
    print("🌐 Open your browser to: http://localhost:5000")
    print("📚 Complete the labs to learn why client-side security fails!")
    print("\n🚨 Educational Use Only - Do not use these techniques on systems you don't own!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
