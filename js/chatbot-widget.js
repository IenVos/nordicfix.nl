/**
 * NordicFix AI Chatbot Widget
 * Met booking formulier en specifieke beschikbaarheid
 */

(function () {
    'use strict';

    const CONFIG = {
        apiEndpoint: 'https://nordicfix-chatbot.annadelapierre.workers.dev',

        position: 'right',
        greeting: 'Hallo! 👋 Ik ben de digitale assistent van NordicFix. Hoe kan ik je helpen?',
        placeholder: 'Stel je vraag...',
        title: 'NordicFix Assistent',

        colors: {
            primary: '#f39c5a',
            secondary: '#6eb5d1',
            dark: '#1e3a4f',
            darker: '#172a39',
            text: '#ffffff',
            textMuted: 'rgba(255,255,255,0.7)'
        },

        // Beschikbare dagen: 0=zo, 1=ma, 2=di, 3=wo, 4=do, 5=vr, 6=za
        availableDays: [2, 3, 4, 5],

        // Tijden per dag
        availableTimesByDay: {
            2: ['10:00', '14:00', '16:00'],
            3: ['10:00', '14:00', '16:00'],
            4: ['10:00', '13:00'],
            5: ['10:00', '14:00']
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

        .nf-booking-link {
            color: var(--nf-primary) !important;
            text-decoration: underline;
            cursor: pointer;
            font-weight: 600;
        }

        .nf-booking-link:hover {
            color: #ffb380 !important;
        }

        .nf-booking-link::after {
            content: ' 📅';
        }

        #nf-booking-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1000000;
            justify-content: center;
            align-items: center;
        }

        #nf-booking-overlay.active {
            display: flex;
        }

        #nf-booking-modal {
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        #nf-booking-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1e3a4f;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: all 0.2s;
        }

        #nf-booking-close:hover {
            transform: scale(1.1) rotate(90deg);
            background: #1a252f;
        }

        #nf-booking-content {
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .nf-booking-form {
            padding: 40px;
            color: #1e3a4f;
        }

        .nf-booking-form h2 {
            color: #1e3a4f;
            margin: 0 0 8px 0;
            font-size: 24px;
        }

        .nf-booking-form > p {
            color: #666;
            margin: 0 0 24px 0;
        }

        .nf-form-group {
            margin-bottom: 16px;
        }

        .nf-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .nf-form-group label {
            display: block;
            margin-bottom: 6px;
            color: #1e3a4f;
            font-weight: 500;
            font-size: 14px;
        }

        .nf-form-group input,
        .nf-form-group select,
        .nf-form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 15px;
            font-family: inherit;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .nf-form-group input:focus,
        .nf-form-group select:focus,
        .nf-form-group textarea:focus {
            outline: none;
            border-color: #6eb5d1;
        }

        .nf-form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .nf-submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #f39c5a, #6eb5d1);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 10px;
        }

        .nf-submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(243, 156, 90, 0.4);
        }

        .nf-submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        #nf-booking-success {
            text-align: center;
            padding: 60px 40px;
        }

        .nf-success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            font-size: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }

        #nf-booking-success h3 {
            color: #1e3a4f;
            margin: 0 0 12px 0;
        }

        #nf-booking-success p {
            color: #666;
        }

        @media (max-width: 600px) {
            .nf-booking-form {
                padding: 24px;
            }

            .nf-form-row {
                grid-template-columns: 1fr;
            }
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
        <div id="nf-booking-overlay">
            <div id="nf-booking-modal">
                <button id="nf-booking-close">×</button>
                <div id="nf-booking-content"></div>
            </div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
            <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
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
            this.bookingOverlay = document.getElementById('nf-booking-overlay');
            this.bookingClose = document.getElementById('nf-booking-close');
            this.bookingContent = document.getElementById('nf-booking-content');

            this.toggle.addEventListener('click', () => this.toggleChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.bookingClose.addEventListener('click', () => this.closeBooking());
            this.bookingOverlay.addEventListener('click', (e) => {
                if (e.target === this.bookingOverlay) this.closeBooking();
            });

            console.log('✅ NordicFix Chatbot initialized');
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.toggle.classList.toggle('open', this.isOpen);
            this.window.classList.toggle('open', this.isOpen);

            if (this.isOpen) {
                setTimeout(() => this.input.focus(), 300);
            }
        }

        formatMessage(text) {
            text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            let formatted = text.replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                (match, linkText, url) => {
                    if (url === 'BOOKING' || url.includes('BOOKING') ||
                        linkText.toLowerCase().includes('afspraak') ||
                        linkText.toLowerCase().includes('kennismaking')) {
                        return `<a href="javascript:void(0);" class="nf-booking-link">${linkText}</a>`;
                    }
                    return `<a href="${url}" target="_blank" rel="noopener">${linkText}</a>`;
                }
            );

            formatted = formatted.replace(/\n/g, '<br>');
            return formatted;
        }

        addMessage(text, type) {
            const msg = document.createElement('div');
            msg.className = `nf-message ${type}`;
            msg.innerHTML = this.formatMessage(text);
            this.messages.appendChild(msg);
            this.scrollToBottom();

            msg.querySelectorAll('.nf-booking-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openBooking();
                });
            });
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

        getAvailableDates() {
            const dates = [];
            const today = new Date();

            for (let i = 1; i <= 60; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                if (CONFIG.availableDays.includes(date.getDay())) {
                    dates.push({
                        value: date.toISOString().split('T')[0],
                        day: date.getDay(),
                        label: date.toLocaleDateString('nl-NL', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        })
                    });
                }
            }
            return dates;
        }

        openBooking() {
            const availableDates = this.getAvailableDates();

            const dateOptions = availableDates.map(d =>
                `<option value="${d.value}" data-day="${d.day}">${d.label}</option>`
            ).join('');

            this.bookingContent.innerHTML = `
                <div class="nf-booking-form">
                    <h2>Plan een kennismaking</h2>
                    <p>Kies een datum en tijd die jou uitkomt.</p>
                    
                    <form id="nf-booking-form">
                        <div class="nf-form-row">
                           <div class="nf-form-group">
                                <label>Gewenste datum *</label>
                                <input type="text" name="date" id="nf-date-picker" required readonly placeholder="Klik om datum te kiezen">
                            </div>
                            <div class="nf-form-group">
                                <label>Email *</label>
                                <input type="email" name="email" required>
                            </div>
                        </div>
                        
                        <div class="nf-form-group">
                            <label>Telefoon</label>
                            <input type="tel" name="phone">
                        </div>
                        
                        <div class="nf-form-row">
                            <div class="nf-form-group">
                                <label>Datum *</label>
                                <select name="date" id="nf-date-select" required>
                                    <option value="">Kies een datum</option>
                                    ${dateOptions}
                                </select>
                            </div>
                            
                            <div class="nf-form-group">
                                <label>Tijdstip *</label>
                                <select name="time" id="nf-time-select" required disabled>
                                    <option value="">Kies eerst een datum</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="nf-form-group">
                            <label>Waar kan ik je mee helpen?</label>
                            <textarea name="notes" rows="3" placeholder="Vertel kort waar je hulp bij zoekt..."></textarea>
                        </div>
                        
                        <button type="submit" class="nf-submit-btn">
                            Afspraak aanvragen
                        </button>
                    </form>
                    
                    <div id="nf-booking-success" style="display:none;">
                        <div class="nf-success-icon">✓</div>
                        <h3>Aanvraag ontvangen!</h3>
                        <p>Ik neem binnen 24 uur contact met je op om de afspraak te bevestigen.</p>
                    </div>
                </div>
            `;
            // Initialiseer kalender
            setTimeout(() => {
                if (typeof flatpickr !== 'undefined') {
                    const datePicker = this.bookingContent.querySelector('#nf-date-picker');
                    const timePicker = this.bookingContent.querySelector('#nf-time-select');

                    flatpickr(datePicker, {
                        minDate: 'today',
                        dateFormat: 'Y-m-d',
                        disable: [
                            function (date) {
                                return ![2, 3, 4, 5].includes(date.getDay());
                            }
                        ],
                        onChange: function (selectedDates) {
                            const dayOfWeek = selectedDates[0].getDay();
                            const times = CONFIG.availableTimesByDay[dayOfWeek] || [];
                            timePicker.disabled = false;
                            timePicker.innerHTML = '<option value="">Kies een tijd</option>' +
                                times.map(time => `<option value="${time}">${time}</option>`).join('');
                        }
                    });
                }
            }, 100);       
            

            const form = this.bookingContent.querySelector('#nf-booking-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleBookingSubmit(e));
            }

            this.bookingOverlay.classList.add('active');
        }

        closeBooking() {
            this.bookingOverlay.classList.remove('active');
            setTimeout(() => {
                this.bookingContent.innerHTML = '';
            }, 300);
        }

        async handleBookingSubmit(e) {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('.nf-submit-btn');
            const formData = new FormData(form);

            const bookingData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                date: formData.get('date'),
                time: formData.get('time'),
                notes: formData.get('notes') || ''
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'Bezig met verzenden...';

            try {
                const response = await fetch(CONFIG.apiEndpoint + '/booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });

                if (response.ok) {
                    form.style.display = 'none';
                    document.getElementById('nf-booking-success').style.display = 'block';

                    setTimeout(() => {
                        this.closeBooking();
                    }, 3000);
                } else {
                    alert('Er ging iets mis. Probeer het opnieuw of mail naar hello@nordicfix.nl');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Afspraak aanvragen';
                }
            } catch (error) {
                console.error('Booking error:', error);
                alert('Fout bij verzenden. Neem contact op via hello@nordicfix.nl');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Afspraak aanvragen';
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new NordicFixChatbot());
    } else {
        new NordicFixChatbot();
    }

})();