const app = document.getElementById('app');

function logEvent(eventType, details) {
    const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
        details: details
    };
    console.log('Event logged:', event);
    // Here you can add code to send the event to the server if needed
}

function simulateEvent() {
    const eventTypes = ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'DATA_ACCESS', 'DATA_MODIFICATION'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const details = `Simulated event of type: ${randomType}`;
    logEvent(randomType, details);
}

app.addEventListener('click', simulateEvent);