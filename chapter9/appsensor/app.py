from flask import Flask, render_template, request, jsonify
from appsensor.event import Event
from appsensor.detector import Detector
from appsensor.response import Response

app = Flask(__name__)

detector = Detector()
response = Response()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/event', methods=['POST'])
def create_event():
    data = request.json
    event = Event(event_type=data['event_type'], details=data['details'])
    detector.analyze(event)
    response.handle(event)
    return jsonify({'message': 'Event processed successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)