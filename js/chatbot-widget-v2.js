/**
 * NordicFix AI Chatbot Widget v2
 * Met markdown link support
 */

(function() {
    'use strict';

    const CONFIG = {
        // BELANGRIJK: Pas deze URL aan naar jouw Cloudflare Worker
        apiEndpoint: 'https://nordicfix-chatbot.annadelapierre.workers.dev',
        
        position: 'right',
        greeting: 'Hallo! 👋 Ik ben de digitale assistent van NordicFix. Hoe kan ik je helpen?',
        placeholder: 'Stel je vraag...',
        title: 'NordicFix Assistent',
        
        colors: {
            primary: '#f39c5a',
            secondary: '#6eb5d1',
            dark: '#1e3a4f',
            darker: '#0f1e29',
            text: '#ffffff',
            textMuted: 'rgba(255,255,255,0.7)'
        }
    };

    const styles = `
        #nf-chat-widget {
            --nf-primary: ${CONFIG.colors.primary};
            --nf-secondary: ${CONFIG.colors.secondary};
            --nf-dark: ${CONFIG.colors.dark};
            --nf-darker: ${CONFIG.colors.darker};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            font-size: 15px;
            line-height: 1.5;
        }

        #nf-chat-toggle {
            position: fixed;
            bottom: 24px;
            ${CONFIG.position}: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--nf-primary), var(--nf-secondary));
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(243, 156, 90, 0.4);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        #nf-chat-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(243, 156, 90, 0.5);
        }

        #nf-chat-toggle svg {
            width: 28px;
            height: 28px;
            color: white;
            transition: transform 0.3s ease;
        }

        #nf-chat-toggle.open svg.chat-icon { display: none; }
        #nf-chat-toggle.open svg.close-icon { display: block; }
        #nf-chat-toggle svg.close-icon { display: none; }

        #nf-chat-window {
            position: fixed;
            bottom: 100px;
            ${CONFIG.position}: 24px;
            width: 380px;
            height: 520px;
            background: var(--nf-darker);
            border-radius: 16px;
            border: 1px solid rgba(110, 181, 209, 0.2);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s ease;
        }

        #nf-chat-window.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        #nf-chat-header {
            padding: 18px 20px;
            background: var(--nf-dark);
            border-bottom: 1px solid rgba(110, 181, 209, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        #nf-chat-header-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--nf-primary), var(--nf-secondary));
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #nf-chat-header-icon svg {
            width: 22px;
            height: 22px;
            color: white;
        }

        #nf-chat-header-text h3 {
            margin: 0;
            color: white;
            font-size: 16px;
            font-weight: 600;
        }

        #nf-chat-header-text span {
            font-size: 12px;
            color: var(--nf-secondary);
        }

        #nf-chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .nf-message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            animation: nf-fade-in 0.3s ease;
        }

        @keyframes nf-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .nf-message.bot {
            background: rgba(110, 181, 209, 0.15);
            color: white;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }

        .nf-message.user {
            background: linear-gradient(135deg, var(--nf-primary), #e8894d);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        .nf-message.typing {
            display: flex;
            gap: 4px;
            padding: 16px 20px;
        }

        .nf-typing-dot {
            width: 8px;
            height: 8px;
            background: var(--nf-secondary);
            border-radius: 50%;
            animation: nf-typing 1.4s infinite;
        }

        .nf-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .nf-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes nf-typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-8px); opacity: 1; }
        }

        #nf-chat-input-container {
            padding: 16px 20px;
            background: var(--nf-dark);
            border-top: 1px solid rgba(110, 181, 209, 0.15);
            display: flex;
            gap: 12px;
        }

        #nf-chat-input {
            flex: 1;
            padding: 12px 16px;
            background: rgba(15, 30, 41, 0.8);
            border: 1px solid rgba(110, 181, 209, 0.2);
            border-radius: 12px;
            color: white;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
        }

        #nf-chat-input:focus {
            border-color: var(--nf-secondary);
        }

        #nf-chat-input::placeholder {
            color: rgba(255,255,255,0.4);
        }

        #nf-chat-send {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--nf-primary), var(--nf-secondary));
            border: none;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }

        #nf-chat-send:hover {
            transform: scale(1.05);
        }

        #nf-chat-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        #nf-chat-send svg {
            width: 20px;
            height: 20px;
            color: white;
        }

        /* Links in berichten */
        .nf-message a {
            color: var(--nf-primary);
            text-decoration: underline;
            font-weight: 500;
        }

        .nf-message a:hover {
            color: #ffb380;
        }

        .nf-message.user a {
            color: white;
        }

        /* Alinea's in berichten */
        .nf-message p {
            margin: 0 0 8px 0;
        }

        .nf-message p:last-child {
            margin-bottom: 0;
        }

        @media (max-width: 480px) {
            #nf-chat-window {
                width: calc(100vw - 32px);
                height: calc(100vh - 140px);
                max-height: 600px;
                ${CONFIG.position}: 16px;
                bottom: 90px;
            }

            #nf-chat-toggle {
                ${CONFIG.position}: 16px;
                bottom: 16px;
            }
        }

        #nf-chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        #nf-chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        #nf-chat-messages::-webkit-scrollbar-thumb {
            background: rgba(110, 181, 209, 0.3);
            border-radius: 3px;
        }
    `;

    const template = `
        <div id="nf-chat-widget">
            <button id="nf-chat-toggle" aria-label="Open chat">
                <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div id="nf-chat-window">
                <div id="nf-chat-header">
                    <div id="nf-chat-header-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div id="nf-chat-header-text">
                        <h3>${CONFIG.title}</h3>
                        <span>● Online</span>
                    </div>
                </div>

                <div id="nf-chat-messages">
                    <div class="nf-message bot">${CONFIG.greeting}</div>
                </div>

                <div id="nf-chat-input-container">
                    <input type="text" id="nf-chat-input" placeholder="${CONFIG.placeholder}" autocomplete="off">
                    <button id="nf-chat-send" aria-label="Verstuur">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    class NordicFixChatbot {
        constructor() {
            this.isOpen = false;
            this.isLoading = false;
            this.history = [];
            this.init();
        }

        init() {
            const styleEl = document.createElement('style');
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);

            const container = document.getElementById('nordicfix-chatbot');
            if (container) {
                container.innerHTML = template;
            } else {
                const div = document.createElement('div');
                div.id = 'nordicfix-chatbot';
                div.innerHTML = template;
                document.body.appendChild(div);
            }

            this.toggle = document.getElementById('nf-chat-toggle');
            this.window = document.getElementById('nf-chat-window');
            this.messages = document.getElementById('nf-chat-messages');
            this.input = document.getElementById('nf-chat-input');
            this.sendBtn = document.getElementById('nf-chat-send');

            this.toggle.addEventListener('click', () => this.toggleChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            console.log('✅ NordicFix Chatbot v2 initialized');
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.toggle.classList.toggle('open', this.isOpen);
            this.window.classList.toggle('open', this.isOpen);
            
            if (this.isOpen) {
                setTimeout(() => this.input.focus(), 300);
            }
        }

        // Converteer markdown links [tekst](url) naar HTML
        formatMessage(text) {
            // Converteer markdown links naar HTML
            let formatted = text.replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener">$1</a>'
            );
            
            // Converteer losse URLs naar links
            formatted = formatted.replace(
                /(?<!\]|\()(https?:\/\/[^\s<]+)(?!\))/g,
                '<a href="$1" target="_blank" rel="noopener">$1</a>'
            );
            
            // Converteer dubbele newlines naar paragrafen
            const paragraphs = formatted.split(/\n\n+/);
            if (paragraphs.length > 1) {
                formatted = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
            }
            
            // Converteer enkele newlines naar <br>
            formatted = formatted.replace(/\n/g, '<br>');
            
            return formatted;
        }

        addMessage(text, type) {
            const msg = document.createElement('div');
            msg.className = `nf-message ${type}`;
            msg.innerHTML = this.formatMessage(text);
            this.messages.appendChild(msg);
            this.scrollToBottom();
        }

        showTyping() {
            const typing = document.createElement('div');
            typing.className = 'nf-message bot typing';
            typing.id = 'nf-typing';
            typing.innerHTML = `
                <div class="nf-typing-dot"></div>
                <div class="nf-typing-dot"></div>
                <div class="nf-typing-dot"></div>
            `;
            this.messages.appendChild(typing);
            this.scrollToBottom();
        }

        hideTyping() {
            const typing = document.getElementById('nf-typing');
            if (typing) typing.remove();
        }

        scrollToBottom() {
            this.messages.scrollTop = this.messages.scrollHeight;
        }

        async sendMessage() {
            const text = this.input.value.trim();
            if (!text || this.isLoading) return;

            this.addMessage(text, 'user');
            this.input.value = '';
            
            this.history.push({ role: 'user', content: text });

            this.isLoading = true;
            this.sendBtn.disabled = true;
            this.showTyping();

            try {
                const response = await fetch(CONFIG.apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: text,
                        history: this.history.slice(-10)
                    })
                });

                const data = await response.json();
                
                this.hideTyping();

                if (data.error) {
                    this.addMessage('Sorry, er ging iets mis. Probeer het later opnieuw of mail naar hello@nordicfix.nl', 'bot');
                } else {
                    this.addMessage(data.reply, 'bot');
                    this.history.push({ role: 'assistant', content: data.reply });
                }

            } catch (error) {
                console.error('Chat error:', error);
                this.hideTyping();
                this.addMessage('Sorry, ik kan momenteel niet reageren. Neem contact op via hello@nordicfix.nl', 'bot');
            }

            this.isLoading = false;
            this.sendBtn.disabled = false;
            this.input.focus();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new NordicFixChatbot());
    } else {
        new NordicFixChatbot();
    }

})();
