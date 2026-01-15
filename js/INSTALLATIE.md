# NordicFix AI Chatbot - Installatie Handleiding

Een slimme AI-chatbot voor NordicFix powered by Claude. De chatbot beantwoordt alleen vragen over NordicFix en verwijst vriendelijk door bij off-topic vragen.

---

## 📦 Wat zit erin?

| Bestand | Beschrijving |
|---------|--------------|
| `cloudflare-worker.js` | Backend proxy (houdt je API key veilig) |
| `chatbot-widget.js` | Frontend widget (drop-in voor je website) |

---

## 🚀 Stap 1: Cloudflare Worker Setup

### 1.1 Maak een Cloudflare account
- Ga naar [dash.cloudflare.com](https://dash.cloudflare.com)
- Maak gratis account aan (geen creditcard nodig)

### 1.2 Maak een Worker aan
1. Klik op **Workers & Pages** in de sidebar
2. Klik **Create Application**
3. Kies **Create Worker**
4. Geef het een naam: `nordicfix-chatbot`
5. Klik **Deploy**

### 1.3 Voeg de code toe
1. Klik op **Edit Code**
2. Verwijder alle bestaande code
3. Plak de inhoud van `cloudflare-worker.js`
4. Klik **Save and Deploy**

### 1.4 Voeg je API key toe
1. Ga terug naar je Worker overview
2. Klik op **Settings** → **Variables**
3. Onder "Environment Variables", klik **Add variable**
4. Vul in:
   - **Variable name:** `CLAUDE_API_KEY`
   - **Value:** je API key (begint met `sk-ant-...`)
5. ✅ Vink **Encrypt** aan
6. Klik **Save and Deploy**

### 1.5 Noteer je Worker URL
Je Worker URL ziet er zo uit:
```
https://nordicfix-chatbot.JOUW-ACCOUNT.workers.dev
```
Deze heb je nodig voor stap 2.

---

## 🌐 Stap 2: Website Integratie

### 2.1 Pas de API URL aan
Open `chatbot-widget.js` en zoek deze regel (rond regel 20):

```javascript
apiEndpoint: 'https://nordicfix-chatbot.JOUW-SUBDOMAIN.workers.dev',
```

Vervang dit met jouw Cloudflare Worker URL.

### 2.2 Upload naar je website
Upload `chatbot-widget.js` naar je website, bijvoorbeeld naar:
```
/js/chatbot-widget.js
```

### 2.3 Voeg toe aan elke pagina
Voeg deze twee regels toe aan elke pagina, net voor `</body>`:

```html
<div id="nordicfix-chatbot"></div>
<script src="/js/chatbot-widget-v2.js"></script>
```

**💡 Tip:** Als je een `footer.html` of footer template hebt, voeg het daar toe zodat het automatisch op elke pagina verschijnt!

---

## ⚙️ Optionele Aanpassingen

### Widget positie aanpassen
In `chatbot-widget.js`, zoek:
```javascript
position: 'right', // 'left' of 'right'
```

### Begroeting aanpassen
```javascript
greeting: 'Hallo! 👋 Ik ben de digitale assistent van NordicFix. Hoe kan ik je helpen?',
```

### Kleuren aanpassen
```javascript
colors: {
    primary: '#f39c5a',      // Oranje (button, accenten)
    secondary: '#6eb5d1',    // Blauw 
    dark: '#1e3a4f',         // Donkerblauw (header)
    darker: '#0f1e29',       // Achtergrond
}
```

### NordicFix informatie aanpassen
In `cloudflare-worker.js`, pas de `SYSTEM_PROMPT` aan met:
- Extra diensten
- Prijsinformatie
- Specifieke FAQ's
- Andere contactgegevens

---

## 💰 Kosten

### Cloudflare Workers (gratis tier)
- 100.000 requests per dag
- Meer dan genoeg voor de meeste websites

### Claude API
- Kosten per gesprek: ~€0.001 - €0.01
- Afhankelijk van berichtlengte
- Check [anthropic.com/pricing](https://anthropic.com/pricing)

**Tip:** Stel een spending limit in op je Anthropic dashboard!

---

## 🔒 Beveiliging

### Voor productie, pas CORS aan
In `cloudflare-worker.js`, regel 23:

```javascript
// Van:
'Access-Control-Allow-Origin': '*',

// Naar:
'Access-Control-Allow-Origin': 'https://nordicfix.nl',
```

Dit zorgt ervoor dat alleen jouw website de chatbot kan gebruiken.

---

## 🐛 Troubleshooting

### "Er ging iets mis" foutmelding
1. Check of je API key correct is in Cloudflare
2. Check of de Worker URL klopt in chatbot-widget.js
3. Open browser console (F12) voor error details

### Chatbot verschijnt niet
1. Check of `<div id="nordicfix-chatbot"></div>` aanwezig is
2. Check of het script pad klopt
3. Check browser console voor errors

### CORS errors
- Zorg dat je Worker deployed is
- Check of de URL exact overeenkomt

---

## 📞 Support

Vragen over de implementatie? Mail naar info@nordicfix.nl

---

*Gemaakt met ❤️ door NordicFix*
