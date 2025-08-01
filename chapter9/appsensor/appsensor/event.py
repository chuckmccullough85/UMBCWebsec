class Event:
    def __init__(self, event_type, timestamp, details):
        self.event_type = event_type
        self.timestamp = timestamp
        self.details = details

    def __repr__(self):
        return f"Event(event_type={self.event_type}, timestamp={self.timestamp}, details={self.details})"

def create_sample_events():
    events = [
        Event("LOGIN_ATTEMPT", "2023-10-01T12:00:00Z", "User 'john_doe' attempted to log in."),
        Event("LOGIN_SUCCESS", "2023-10-01T12:01:00Z", "User 'john_doe' logged in successfully."),
        Event("LOGIN_FAILURE", "2023-10-01T12:02:00Z", "User 'john_doe' failed to log in."),
        Event("DATA_ACCESS", "2023-10-01T12:05:00Z", "User 'john_doe' accessed sensitive data."),
        Event("LOGOUT", "2023-10-01T12:10:00Z", "User 'john_doe' logged out."),
    ]
    return events