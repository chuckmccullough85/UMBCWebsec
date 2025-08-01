class ResponseHandler:
    def __init__(self):
        self.responses = []

    def log_event(self, event):
        self.responses.append(event)
        print(f"Event logged: {event}")

    def trigger_alert(self, event):
        print(f"Alert triggered for event: {event}")

    def handle_event(self, event):
        self.log_event(event)
        if event['type'] == 'attack':
            self.trigger_alert(event)

# Example usage
if __name__ == "__main__":
    handler = ResponseHandler()
    sample_event = {
        'type': 'attack',
        'timestamp': '2023-10-01T12:00:00Z',
        'details': 'SQL Injection attempt detected.'
    }
    handler.handle_event(sample_event)