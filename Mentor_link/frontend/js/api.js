// js/api.js
const API_BASE = 'http://127.0.0.1:8000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}