import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_chat_validation_block_bad_input():
    response = client.post('/api/chat', json={'message': ''})
    assert response.status_code == 422


def test_chat_returns_demo_answer():
    response = client.post('/api/chat', json={'message': 'How do I improve germination?', 'crop': 'Rice'})
    assert response.status_code == 200
    json_data = response.json()
    assert 'answer' in json_data
    assert json_data['demo_mode'] is True


def test_weather_returns_payload():
    response = client.get('/api/weather?location=Hyderabad')
    assert response.status_code == 200
    assert 'current' in response.json()


def test_settings_roundtrip():
    payload = { 'language': 'te', 'default_crop': 'Rice', 'default_location': 'Warangal', 'voice_enabled': True, 'tts_enabled': True, 'notifications_enabled': True, 'dark_mode': False }
    update_response = client.put('/api/settings', json=payload)
    assert update_response.status_code == 200
    saved_response = client.get('/api/settings')
    assert saved_response.status_code == 200
    assert saved_response.json()['language'] == 'te'
