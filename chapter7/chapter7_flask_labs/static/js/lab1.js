// Lab 1: Client-Side Validation Bypass JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('transferForm');
    const resultPanel = document.getElementById('resultPanel');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.getElementById('amountError').textContent = '';
        document.getElementById('memoError').textContent = '';
        
        const formData = {
            amount: parseFloat(document.getElementById('amount').value),
            memo: document.getElementById('memo').value,
            fromAccount: document.getElementById('fromAccount').value,
            toAccount: document.getElementById('toAccount').value
        };
        
        // Client-side validation (easily bypassed!)
        let hasErrors = false;
        
        if (formData.amount > 1000) {
            document.getElementById('amountError').textContent = 
                '🚫 Transfer amount cannot exceed $1000 for security reasons!';
            hasErrors = true;
        }
        
        if (formData.memo.length > 50) {
            document.getElementById('memoError').textContent = 
                '🚫 Memo cannot exceed 50 characters!';
            hasErrors = true;
        }
        
        if (hasErrors) {
            return false;
        }
        
        // Send to server for processing
        submitTransfer(formData);
    });
});

async function submitTransfer(formData) {
    const resultPanel = document.getElementById('resultPanel');
    
    try {
        const response = await fetch('/lab1/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        // Display results
        let html = '<h3>Transfer Processing Results</h3>';
        
        if (result.success) {
            html += '<div style="color: #28a745; margin-bottom: 1rem;">';
            html += '<strong>✅ Transfer Completed Successfully!</strong></div>';
            html += `<p><strong>Amount:</strong> $${result.amount.toFixed(2)}</p>`;
            html += `<p><strong>From:</strong> ${result.from_account}</p>`;
            html += `<p><strong>To:</strong> ${result.to_account}</p>`;
            html += `<p><strong>Memo:</strong> ${result.memo || 'None'}</p>`;
        } else {
            html += '<div style="color: #dc3545; margin-bottom: 1rem;">';
            html += '<strong>🚫 Transfer Blocked by Server!</strong></div>';
            html += `<p><strong>Attempted Amount:</strong> $${result.amount.toFixed(2)}</p>`;
            html += `<p><strong>Server Message:</strong> ${result.message}</p>`;
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
        console.error('Error submitting transfer:', error);
        resultPanel.innerHTML = '<p style="color: #dc3545;">Error processing transfer. Please try again.</p>';
        resultPanel.style.display = 'block';
        resultPanel.className = 'result-panel error';
    }
}

// ATTACK FUNCTIONS
function bypassMaxAmount() {
    const amountInput = document.getElementById('amount');
    amountInput.setAttribute('max', '999999');
    amountInput.value = '50000';
    
    alert('🚨 HACKED! Maximum amount limit removed and set to $50,000!\n\n' +
          'The client-side validation is now useless. Check the HTML - the max attribute changed from 1000 to 999999.');
}

function bypassLengthLimit() {
    const memoInput = document.getElementById('memo');
    memoInput.removeAttribute('maxlength');
    memoInput.value = 'This is a very long memo that exceeds the 50 character limit and should have been blocked by client-side validation but we can easily bypass it by removing the maxlength attribute! This demonstrates why client-side security is fundamentally flawed.';
    
    alert('🚨 HACKED! Memo length limit removed and bypassed!\n\n' +
          'The maxlength attribute has been removed from the HTML. You can now enter unlimited text.');
}

function manipulateDOM() {
    const form = document.getElementById('transferForm');
    const amountInput = document.getElementById('amount');
    const memoInput = document.getElementById('memo');
    
    // Remove all validation attributes
    amountInput.removeAttribute('max');
    amountInput.removeAttribute('min');
    amountInput.value = '1000000'; // One million dollars!
    
    memoInput.removeAttribute('maxlength');
    memoInput.value = 'HACKED! This transaction is for ONE MILLION DOLLARS and completely bypasses all client-side security measures!';
    
    alert('🚨 COMPLETE BYPASS! All client-side validation removed!\n\n' +
          'Amount: $1,000,000\n' +
          'Validation: DISABLED\n' +
          'HTML attributes: REMOVED\n\n' +
          'This demonstrates complete DOM manipulation.');
}

function removeValidation() {
    const form = document.getElementById('transferForm');
    
    // Override the form submission to bypass all validation
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const formData = {
            amount: parseFloat(document.getElementById('amount').value) || 999999,
            memo: document.getElementById('memo').value || 'Validation bypassed via JavaScript',
            fromAccount: document.getElementById('fromAccount').value || 'hacked_account',
            toAccount: document.getElementById('toAccount').value || 'attacker_account'
        };
        
        submitTransfer(formData);
    };
    
    // Also remove HTML validation attributes
    document.getElementById('amount').removeAttribute('max');
    document.getElementById('amount').removeAttribute('min');
    document.getElementById('amount').removeAttribute('required');
    document.getElementById('memo').removeAttribute('maxlength');
    document.getElementById('fromAccount').removeAttribute('required');
    document.getElementById('toAccount').removeAttribute('required');
    
    alert('🚨 VALIDATION COMPLETELY DISABLED!\n\n' +
          'All JavaScript validation functions have been overridden.\n' +
          'All HTML validation attributes have been removed.\n' +
          'The form will now accept ANY values.\n\n' +
          'Try submitting with extreme values!');
}
