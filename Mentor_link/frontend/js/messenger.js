// messenger.js - Chat temps réel avec WebSocket (version DEBUG)
let socket = null;
let currentConvId = null;

async function loadMessengerContent() {
    console.log('🚀 loadMessengerContent() démarré');

    const convList = document.getElementById('conversationsList');
    if (!convList) {
        console.error('❌ #conversationsList introuvable');
        return;
    }

    const token = localStorage.getItem('access_token');
    console.log('🔑 Token:', token ? token.substring(0, 30) + '...' : 'ABSENT');

    if (!token) {
        console.warn('⚠️ Pas de token → redirection login');
        showPage('login');
        return;
    }

    // Lecture sécurisée du user
    let currentUser = {};
    try {
        const raw = localStorage.getItem('user');
        console.log('👤 localStorage user brut:', raw);
        if (raw && raw !== 'undefined') {
            currentUser = JSON.parse(raw);
            console.log('✅ currentUser:', currentUser);
        }
    } catch (e) {
        console.error('❌ Erreur parse user:', e);
    }

    try {
        console.log('📡 Requête conversations...');
        const res = await fetch(`${API_BASE}/chat/conversations/`, { headers: getAuthHeaders() });
        console.log('💬 Status conversations:', res.status);

        const rawText = await res.text();
        console.log('💬 Conversations brut:', rawText.substring(0, 300));

        let conversations = [];
        try {
            conversations = JSON.parse(rawText);
            console.log('✅ Conversations parsées:', conversations.length, 'éléments');
        } catch (e) {
            console.error('❌ Réponse non-JSON:', rawText);
            convList.innerHTML = `<p style="padding:1rem;color:red;">Erreur serveur (${res.status})</p>`;
            return;
        }

        convList.innerHTML = `
            <div style="padding:1rem; border-bottom:1px solid var(--border); font-weight:600;">💬 Messages</div>
            ${conversations.length === 0 ? '<p style="padding:1rem;">Aucune conversation</p>' : ''}
            ${conversations.map(conv => {
                const other = conv.participants_detail?.find(p => p.id !== currentUser.id);
                if (!other) return '';
                const initials = (other.first_name?.charAt(0) || '') + (other.last_name?.charAt(0) || '');
                const lastMsg = conv.last_message?.content || 'Nouvelle conversation';
                return `
                    <div class="conv-item" onclick="loadChatConversation(${conv.id})">
                        <div class="avatar">${initials || '?'}</div>
                        <div class="conv-info">
                            <div class="conv-name">${other.first_name || ''} ${other.last_name || ''}</div>
                            <div class="conv-preview">${escapeHtml(lastMsg)}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        `;

        if (conversations.length > 0) {
            console.log('📨 Chargement première conversation:', conversations[0].id);
            await loadChatConversation(conversations[0].id);
        } else {
            document.getElementById('chatWindow').innerHTML = `
                <div class="chat-header">Aucune conversation. Commencez par contacter un mentor.</div>
            `;
        }

    } catch (err) {
        console.error('❌ Erreur globale messenger:', err);
        convList.innerHTML = '<p style="padding:1rem;">Erreur de chargement des conversations</p>';
    }
}

window.loadChatConversation = async function(conversationId) {
    console.log('📨 loadChatConversation():', conversationId);
    currentConvId = conversationId;

    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) {
        console.error('❌ #chatWindow introuvable');
        return;
    }

    // Lecture sécurisée du user
    let currentUser = {};
    try {
        const raw = localStorage.getItem('user');
        if (raw && raw !== 'undefined') currentUser = JSON.parse(raw);
    } catch (e) {
        console.error('❌ Erreur parse user dans loadChatConversation:', e);
    }

    try {
        console.log('📡 Chargement messages + conversations...');
        const [msgRes, convRes] = await Promise.all([
            fetch(`${API_BASE}/chat/conversations/${conversationId}/messages/`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/chat/conversations/`, { headers: getAuthHeaders() })
        ]);

        console.log('📨 Status messages:', msgRes.status);
        console.log('💬 Status conversations:', convRes.status);

        const msgText  = await msgRes.text();
        const convText = await convRes.text();

        console.log('📨 Messages brut:', msgText.substring(0, 300));
        console.log('💬 Conversations brut:', convText.substring(0, 300));

        let messages = [], conversations = [];
        try {
            messages = JSON.parse(msgText);
            console.log('✅ Messages parsés:', messages.length);
        } catch (e) {
            console.error('❌ Messages non-JSON:', msgText);
        }
        try {
            conversations = JSON.parse(convText);
            console.log('✅ Conversations parsées:', conversations.length);
        } catch (e) {
            console.error('❌ Conversations non-JSON:', convText);
        }

        const conv    = conversations.find(c => c.id === conversationId);
        const other   = conv?.participants_detail?.find(p => p.id !== currentUser.id);
        const initials = (other?.first_name?.charAt(0) || '') + (other?.last_name?.charAt(0) || '');

        console.log('👤 Interlocuteur:', other);

        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="avatar">${initials || '?'}</div>
                <div><h4>${other?.first_name || ''} ${other?.last_name || ''}</h4></div>
            </div>
            <div class="chat-messages" id="chatMessages">
                ${Array.isArray(messages) ? messages.map(msg => `
                    <div class="message ${msg.sender === currentUser.id ? 'sent' : 'received'}">
                        <div class="message-bubble">${escapeHtml(msg.content)}</div>
                        <div class="msg-time">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                    </div>
                `).join('') : '<p>Aucun message</p>'}
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" placeholder="Écrire un message..." id="msgInput">
                <button class="btn btn-accent" onclick="sendWebSocketMessage()">Envoyer</button>
            </div>
        `;

        const msgDiv = document.getElementById('chatMessages');
        if (msgDiv) msgDiv.scrollTop = msgDiv.scrollHeight;

        connectWebSocket(conversationId);

    } catch (err) {
        console.error('❌ Erreur loadChatConversation:', err);
        chatWindow.innerHTML = '<div class="chat-header">Erreur de chargement des messages</div>';
    }
};

function connectWebSocket(conversationId) {
    console.log('🔌 connectWebSocket():', conversationId);
    if (socket) {
        console.log('🔌 Fermeture ancien socket');
        socket.close();
    }

    const token = localStorage.getItem('access_token');
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`;
    console.log('🔌 WS URL:', wsUrl);

    socket = new WebSocket(wsUrl);

    socket.onopen  = () => console.log('✅ WebSocket connecté');
    socket.onerror = (err) => console.error('❌ WebSocket error:', err);
    socket.onclose = (e)   => console.log('🔌 WebSocket fermé, code:', e.code, 'reason:', e.reason);

    socket.onmessage = (event) => {
        console.log('📨 Message WebSocket reçu:', event.data);
        try {
            const data = JSON.parse(event.data);
            const messagesDiv = document.getElementById('chatMessages');
            if (!messagesDiv) return;

            let currentUser = {};
            try {
                currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            } catch (e) {}

            const isSent = (data.sender === currentUser.username);
            messagesDiv.insertAdjacentHTML('beforeend', `
                <div class="message ${isSent ? 'sent' : 'received'}">
                    <div class="message-bubble">${escapeHtml(data.message)}</div>
                    <div class="msg-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                </div>
            `);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } catch (e) {
            console.error('❌ Erreur parse message WebSocket:', e);
        }
    };
}

window.sendWebSocketMessage = function() {
    const input = document.getElementById('msgInput');
    if (!input || !input.value.trim()) {
        console.warn('⚠️ Message vide ou input introuvable');
        return;
    }
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('❌ WebSocket non connecté, state:', socket?.readyState);
        alert('Connexion au chat perdue. Rechargez la page.');
        return;
    }
    const msg = input.value.trim();
    console.log('📤 Envoi message WebSocket:', msg);
    socket.send(JSON.stringify({ message: msg }));
    input.value = '';
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}