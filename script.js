// ═══════════════════════════════════════════
//  PRANEETHA VANAMALA — Portfolio Script
//  Includes: Navbar, Scroll Reveal, AI Chatbot
// ═══════════════════════════════════════════

// ── Navbar scroll shadow ──────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile burger menu ────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Active nav link on scroll ─────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

// ── Scroll reveal ─────────────────────────
document.querySelectorAll(
  '.hero-text, .hero-image-wrap, .about-grid, ' +
  '.skills-categories, .certs-row, .projects-grid, ' +
  '.achievement-banner, .resume-layout, .contact-cards'
).forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ═══════════════════════════════════════════
//  AI CHATBOT
// ═══════════════════════════════════════════

const PRANEETHA_CONTEXT = `
You are Praneetha's personal AI assistant on her portfolio website.
Answer ONLY questions about Praneetha Vanamala. Be friendly, concise, and professional.
If asked something unrelated to Praneetha, politely redirect to her portfolio topics.

Here is everything you know about Praneetha:

PERSONAL:
- Full name: Praneetha Vanamala
- Based in: Chennai, India
- Languages spoken: English, Hindi, Tamil, Kannada, Telugu

EDUCATION:
- B.E. Computer Science Engineering at St. Joseph's College of Engineering, Chennai (2025–2029)
- 1st Semester CGPA: 9.21
- Class XII from Narayana PU College (2024–2025) — 79%
- Class X from Vyasa International School (2022–2023) — 72%

INTERNSHIP:
- AI Intern at AGH (2025–Present)
- Working on AI-related tasks and projects

SKILLS:
- Programming: C, C++, HTML & CSS
- Mobile & Backend: Flutter, Firebase, Groq Llama API
- Tools: Git, GitHub, VS Code
- Currently learning: Python, UiPath/RPA, Agentic AI

PROJECTS:
1. SJC360 — A Flutter-based smart campus super app for St. Joseph's College of Engineering
   - 4 portals: Students, Teachers, HODs, Visitors
   - Features: real-time teacher availability, AI-powered auto-status from timetables,
     instant meeting broadcasts, Lost & Found, mess menus, IoT crowd detection,
     emergency contacts, Groq Llama AI chatbot, dark mode, Firebase real-time sync
   - Tech: Flutter, Firebase, Groq Llama API, IoT (Arduino, ESP8266, PIR sensors)

2. FocusBot — Productivity automation bot (In Progress)
   - Built with UiPath Studio
   - Tracks daily tasks, monitors screen time, generates end-of-day reports

CERTIFICATIONS:
- NPTEL: Python for Data Science
- Maven Silicon: Embedded C Programming

ACHIEVEMENTS:
- Thoothukodi TN Hackathon — Finalist (state-level hackathon in Tamil Nadu)

CONTACT:
- Email: vanamalapraneetha@gmail.com
- GitHub: github.com/codedbypraneetha
- LinkedIn: linkedin.com/in/praneetha-vanamala-8b6000370

Answer warmly and in first or third person depending on context.
Keep answers short (2–4 sentences max) unless the visitor asks for detail.
`;

// ── Build chatbot HTML ────────────────────
const chatHTML = `
<div id="chatbot-bubble" title="Chat with Praneetha's AI">
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 13H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V9h10v2z"/>
  </svg>
  <span class="chat-ping"></span>
</div>

<div id="chatbot-window" class="chat-closed">
  <div class="chat-header">
    <div class="chat-header-info">
      <div class="chat-avatar">PV</div>
      <div>
        <div class="chat-name">Praneetha's Assistant</div>
        <div class="chat-status"><span class="dot"></span> Online</div>
      </div>
    </div>
    <button id="chat-close" aria-label="Close chat">✕</button>
  </div>

  <div class="chat-messages" id="chatMessages">
    <div class="chat-msg bot">
      <div class="msg-bubble">
        👋 Hi! I'm Praneetha's AI assistant. Ask me anything about her skills, projects, or experience!
      </div>
    </div>
    <div class="chat-suggestions">
      <button class="suggestion" onclick="sendSuggestion(this)">What projects has she built?</button>
      <button class="suggestion" onclick="sendSuggestion(this)">What are her skills?</button>
      <button class="suggestion" onclick="sendSuggestion(this)">Tell me about SJC360</button>
      <button class="suggestion" onclick="sendSuggestion(this)">Where is she interning?</button>
    </div>
  </div>

  <div class="chat-input-row">
    <input type="text" id="chatInput" placeholder="Ask about Praneetha..." maxlength="200" />
    <button id="chatSend" onclick="sendMessage()">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
      </svg>
    </button>
  </div>
</div>
`;

// ── Inject chatbot into page ──────────────
const chatContainer = document.createElement('div');
chatContainer.id = 'chatbot-container';
chatContainer.innerHTML = chatHTML;
document.body.appendChild(chatContainer);

// ── Inject chatbot styles ─────────────────
const chatStyles = document.createElement('style');
chatStyles.textContent = `
#chatbot-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; font-family: 'DM Sans', sans-serif; }

#chatbot-bubble {
  width: 58px; height: 58px;
  background: #5dba7e;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #041008;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(93,186,126,0.45);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-left: auto;
  position: relative;
}
#chatbot-bubble:hover { transform: scale(1.08); box-shadow: 0 8px 30px rgba(93,186,126,0.55); }

.chat-ping {
  position: absolute; top: 4px; right: 4px;
  width: 12px; height: 12px;
  background: #f59e0b;
  border-radius: 50%;
  border: 2px solid #0a0f0d;
  animation: ping 1.8s ease-in-out infinite;
}
@keyframes ping {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

#chatbot-window {
  width: 340px;
  background: #0f1a14;
  border: 1px solid #243020;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  margin-bottom: 1rem;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  transform-origin: bottom right;
}
#chatbot-window.chat-closed {
  opacity: 0; transform: scale(0.85) translateY(20px); pointer-events: none;
}
#chatbot-window.chat-open {
  opacity: 1; transform: scale(1) translateY(0); pointer-events: all;
}

.chat-header {
  background: #141f18;
  border-bottom: 1px solid #243020;
  padding: 1rem 1.2rem;
  display: flex; align-items: center; justify-content: space-between;
}
.chat-header-info { display: flex; align-items: center; gap: 0.75rem; }
.chat-avatar {
  width: 36px; height: 36px;
  background: #5dba7e;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 800;
  color: #041008;
}
.chat-name { font-size: 0.88rem; font-weight: 700; color: #e4ede7; }
.chat-status { font-size: 0.72rem; color: #7a9986; display: flex; align-items: center; gap: 0.3rem; }
.chat-status .dot { width: 6px; height: 6px; background: #5dba7e; border-radius: 50%; display: inline-block; }

#chat-close {
  background: none; border: none;
  color: #7a9986; font-size: 1rem;
  cursor: pointer; padding: 0.2rem;
  transition: color 0.2s;
}
#chat-close:hover { color: #e4ede7; }

.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: #243020 transparent;
}

.chat-msg { display: flex; }
.chat-msg.bot { justify-content: flex-start; }
.chat-msg.user { justify-content: flex-end; }

.msg-bubble {
  max-width: 80%;
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  font-size: 0.85rem;
  line-height: 1.5;
}
.chat-msg.bot .msg-bubble {
  background: #1c2b22;
  color: #e4ede7;
  border-bottom-left-radius: 4px;
}
.chat-msg.user .msg-bubble {
  background: #5dba7e;
  color: #041008;
  font-weight: 500;
  border-bottom-right-radius: 4px;
}

.chat-typing .msg-bubble {
  display: flex; gap: 4px; align-items: center;
  padding: 0.75rem 1rem;
}
.typing-dot {
  width: 6px; height: 6px;
  background: #5dba7e;
  border-radius: 50%;
  animation: typingBounce 1.2s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chat-suggestions {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  margin-top: 0.25rem;
}
.suggestion {
  background: #1c2b22;
  border: 1px solid #243020;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
  color: #5dba7e;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.suggestion:hover { background: rgba(93,186,126,0.15); border-color: #5dba7e; }

.chat-input-row {
  display: flex; gap: 0.5rem;
  padding: 0.9rem 1rem;
  border-top: 1px solid #243020;
  background: #141f18;
}
#chatInput {
  flex: 1;
  background: #1c2b22;
  border: 1px solid #243020;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 0.85rem;
  color: #e4ede7;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}
#chatInput:focus { border-color: #5dba7e; }
#chatInput::placeholder { color: #7a9986; }

#chatSend {
  width: 38px; height: 38px;
  background: #5dba7e;
  border: none;
  border-radius: 8px;
  color: #041008;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.1s;
  flex-shrink: 0;
}
#chatSend:hover { background: #6dcf91; }
#chatSend:active { transform: scale(0.93); }
`;
document.head.appendChild(chatStyles);

// ── Chatbot logic ─────────────────────────
const bubble    = document.getElementById('chatbot-bubble');
const chatWin   = document.getElementById('chatbot-window');
const closeBtn  = document.getElementById('chat-close');
const chatInput = document.getElementById('chatInput');
const messages  = document.getElementById('chatMessages');

let isOpen = false;
let conversationHistory = [];

bubble.addEventListener('click', () => toggleChat(true));
closeBtn.addEventListener('click', () => toggleChat(false));

function toggleChat(open) {
  isOpen = open;
  chatWin.classList.toggle('chat-open', open);
  chatWin.classList.toggle('chat-closed', !open);
  bubble.style.display = open ? 'none' : 'flex';
  if (open) setTimeout(() => chatInput.focus(), 300);
}

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendSuggestion(btn) {
  chatInput.value = btn.textContent;
  btn.closest('.chat-suggestions')?.remove();
  sendMessage();
}

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot chat-typing';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="msg-bubble">
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  addMessage(text, 'user');
  showTyping();

  conversationHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: PRANEETHA_CONTEXT,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again!";

    conversationHistory.push({ role: 'assistant', content: reply });

    removeTyping();
    addMessage(reply, 'bot');
  } catch (err) {
    removeTyping();
    addMessage("Oops! Something went wrong. Please try again in a moment.", 'bot');
    conversationHistory.pop();
  }
}