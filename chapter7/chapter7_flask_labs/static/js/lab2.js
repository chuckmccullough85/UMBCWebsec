// Lab 2: Hidden Field Manipulation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    
    // Initialize display
    updateUserDisplay();
    updateTotal();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            laptop_price: parseFloat(document.getElementById('laptop_price').value),
            headphones_price: parseFloat(document.getElementById('headphones_price').value),
            laptop_qty: parseInt(document.getElementById('laptop_qty').value),
            headphones_qty: parseInt(document.getElementById('headphones_qty').value),
            userRole: document.getElementById('userRole').value,
            discountPercent: parseFloat(document.getElementById('discountPercent').value),
            isVip: document.getElementById('isVip').value
        };
        
        submitCheckout(formData);
    });
});

function updateTotal() {
    const laptopQty = parseInt(document.getElementById('laptop_qty').value) || 0;
    const headphonesQty = parseInt(document.getElementById('headphones_qty').value) || 0;
    const laptopPrice = parseFloat(document.getElementById('laptop_price').value);
    const headphonesPrice = parseFloat(document.getElementById('headphones_price').value);
    const discountPercent = parseFloat(document.getElementById('discountPercent').value);
    
    const subtotal = (laptopQty * laptopPrice) + (headphonesQty * headphonesPrice);
    const discountAmount = subtotal * (discountPercent / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.08;
    const total = discountedSubtotal + tax;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('discount').textContent = discountAmount.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('discountPercDisplay').textContent = discountPercent.toFixed(0);
}

function updateUserDisplay() {
    const userRole = document.getElementById('userRole').value;
    const discountPercent = document.getElementById('discountPercent').value;
    const isVip = document.getElementById('isVip').value === 'true';
    
    let displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    if (isVip) displayRole += ' (VIP)';
    
    document.getElementById('userDisplay').textContent = displayRole;
    document.getElementById('discountDisplay').textContent = discountPercent + '%';
    document.getElementById('vipDisplay').textContent = isVip ? 'Yes' : 'No';
    
    updateTotal();
}

async function submitCheckout(formData) {
    const resultPanel = document.getElementById('resultPanel');
    
    try {
        const response = await fetch('/lab2/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        // Display results
        let html = '<h3>Checkout Processing Results</h3>';
        
        if (result.success) {
            html += '<div style="color: #28a745; margin-bottom: 1rem;">';
            html += '<strong>✅ Order Processed Successfully!</strong></div>';
            html += `<p><strong>Final Total:</strong> $${result.client_total.toFixed(2)}</p>`;
        } else {
            html += '<div style="color: #dc3545; margin-bottom: 1rem;">';
            html += '<strong>🚫 Order Blocked by Server-Side Validation!</strong></div>';
            html += `<p><strong>Your Manipulated Total:</strong> $${result.client_total.toFixed(2)}</p>`;
            html += `<p><strong>Correct Server Total:</strong> $${result.server_total.toFixed(2)}</p>`;
            html += `<p><strong>Difference:</strong> $${Math.abs(result.client_total - result.server_total).toFixed(2)}</p>`;
        }
        
        // Show detected tampering
        if (result.tampered_fields) {
            html += '<div style="background-color: #fff3cd; padding: 1rem; border-radius: 8px; margin-top: 1rem;">';
            html += '<h4 style="color: #856404; margin-bottom: 0.5rem;">🔍 Tampered Fields Detected:</h4>';
            
            for (const [field, tampered] of Object.entries(result.tampered_fields)) {
                if (tampered) {
                    html += `<p style="color: #856404; margin: 0.25rem 0;">• ${field.replace('_', ' ').toUpperCase()}</p>`;
                }
            }
            html += '</div>';
        }
        
        // Show server-side detection alerts
        if (result.alerts && result.alerts.length > 0) {
            html += '<div style="background-color: #f8d7da; padding: 1rem; border-radius: 8px; margin-top: 1rem;">';
            html += '<h4 style="color: #dc3545; margin-bottom: 0.5rem;">🚨 Server-Side Attack Detection:</h4>';
            result.alerts.forEach(alert => {
                html += `<p style="color: #721c24; margin: 0.25rem 0;">${alert}</p>`;
            });
            html += '</div>';
        }
        
        resultPanel.innerHTML = html;
        resultPanel.style.display = 'block';
        resultPanel.className = result.success ? 'result-panel' : 'result-panel error';
        
        // Scroll to results
        resultPanel.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error submitting checkout:', error);
        resultPanel.innerHTML = '<p style="color: #dc3545;">Error processing checkout. Please try again.</p>';
        resultPanel.style.display = 'block';
        resultPanel.className = 'result-panel error';
    }
}

// ATTACK FUNCTIONS
function makeMeVip() {
    document.getElementById('isVip').value = 'true';
    document.getElementById('userRole').value = 'vip';
    document.getElementById('discountPercent').value = '20';
    updateUserDisplay();
    
    alert('🚨 PRIVILEGE ESCALATION SUCCESSFUL!\n\n' +
          'You are now a VIP customer with 20% discount!\n' +
          'Hidden fields modified:\n' +
          '• isVip: false → true\n' +
          '• userRole: customer → vip\n' +
          '• discountPercent: 0 → 20');
}

function changePrices() {
    const originalLaptop = document.getElementById('laptop_price').value;
    const originalHeadphones = document.getElementById('headphones_price').value;
    
    document.getElementById('laptop_price').value = '129.99';
    document.getElementById('headphones_price').value = '19.99';
    updateTotal();
    
    alert('🚨 PRICE MANIPULATION SUCCESSFUL!\n\n' +
          `Laptop: $${originalLaptop} → $129.99 (90% off!)\n` +
          `Headphones: $${originalHeadphones} → $19.99 (90% off!)\n\n` +
          'Total savings: Over $1000!\n' +
          'Hidden price fields have been modified.');
}

function becomeAdmin() {
    document.getElementById('userRole').value = 'admin';
    document.getElementById('discountPercent').value = '50';
    document.getElementById('isVip').value = 'true';
    updateUserDisplay();
    
    alert('🚨 ADMIN PRIVILEGE ESCALATION!\n\n' +
          'You now have administrator privileges!\n' +
          '• Role: customer → admin\n' +
          '• Discount: 0% → 50%\n' +
          '• VIP Status: false → true\n\n' +
          'In a real application, this could grant access to:\n' +
          '• Administrative functions\n' +
          '• User data\n' +
          '• System controls');
}

function freeProducts() {
    document.getElementById('laptop_price').value = '0.01';
    document.getElementById('headphones_price').value = '0.01';
    document.getElementById('discountPercent').value = '0'; // Don't need discount if already free!
    updateTotal();
    
    alert('🚨 COMPLETE PRICE BYPASS!\n\n' +
          'All products are now essentially FREE!\n' +
          '• Laptop: $1299.99 → $0.01\n' +
          '• Headphones: $199.99 → $0.01\n' +
          '• Total order: ~$0.02\n\n' +
          'This demonstrates complete business logic bypass!');
}

// Make functions globally accessible for console manipulation
window.updateTotal = updateTotal;
window.updateUserDisplay = updateUserDisplay;
