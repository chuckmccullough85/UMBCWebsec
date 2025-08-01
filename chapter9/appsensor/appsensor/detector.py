class Event:
    def __init__(self, event_type, timestamp, details):
        self.event_type = event_type
        self.timestamp = timestamp
        self.details = details

class Detector:
    def __init__(self):
        self.events = []

    def add_event(self, event):
        self.events.append(event)

    def analyze_events(self):
        for event in self.events:
            if self.is_attack(event):
                self.handle_attack(event)

    def is_attack(self, event):
        # Simple heuristic for detecting an attack
        return event.event_type in ['SQL Injection', 'Cross-Site Scripting']

    def handle_attack(self, event):
        print(f"Attack detected: {event.event_type} at {event.timestamp} with details: {event.details}")