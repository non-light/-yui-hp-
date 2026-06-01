/* ===== PROFILE (load from assets/data/profile.txt) ===== */
(function loadProfile() {
  const table = document.getElementById('profileTable');
  const messageEl = document.getElementById('profileMessage');
  if (!table) return; // プロフィール欄がないページでは何もしない

  fetch('assets/data/profile.txt?v=' + Date.now()) // ?v=... は毎回最新を読み込むためのおまじない
    .then(res => res.text())
    .then(text => {
      table.innerHTML = '';
      text.split('\n').forEach(rawLine => {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) return;       // 空行・メモ行はスキップ
        const sep = line.search(/[：:]/);                 // 全角／半角コロンどちらもOK
        if (sep === -1) return;
        const key = line.slice(0, sep).trim();
        const val = line.slice(sep + 1).trim();

        if (key === 'ひとこと') {                          // ひとことはメッセージ欄へ
          if (messageEl) messageEl.textContent = val;
          return;
        }

        const row = document.createElement('div');
        row.className = 'profile-row';
        const dt = document.createElement('dt');
        dt.textContent = key;
        const dd = document.createElement('dd');
        dd.textContent = val;
        row.appendChild(dt);
        row.appendChild(dd);
        table.appendChild(row);
      });
    })
    .catch(() => {
      if (messageEl) messageEl.textContent = 'プロフィールを読み込めませんでした。';
    });
})();

/* ===== HEADER SCROLL ===== */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/* ===== INTERSECTION OBSERVER (card fade-in) ===== */
const fadeEls = document.querySelectorAll('.card-fade');
const io = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
  { threshold: 0.12 }
);
fadeEls.forEach((el, i) => {
  el.style.transitionDelay = `${i % 4 * 0.1}s`;
  io.observe(el);
});

/* ===== CHARACTER SPARKLES ===== */
const charaImg  = document.getElementById('charaImg');
const sparklesEl = document.getElementById('sparkles');

charaImg && charaImg.addEventListener('click', (e) => {
  const rect = charaImg.getBoundingClientRect();
  const parentRect = sparklesEl.getBoundingClientRect();
  const x = e.clientX - parentRect.left;
  const y = e.clientY - parentRect.top;

  for (let i = 0; i < 10; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle';
    const angle = (Math.PI * 2 / 10) * i;
    const dist  = 40 + Math.random() * 40;
    dot.style.left = x + 'px';
    dot.style.top  = y + 'px';
    dot.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    dot.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    sparklesEl.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
});

/* ===== CHAT ===== */
const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');

// YUiのオートリプライ (デモ用)
const autoReplies = [
  'うれしい！話しかけてくれてありがとう🌸',
  'それすごく気になる！もっと教えて？',
  'えへへ、YUiもそう思ってた！',
  '最近ね、新しい曲作ってるんだ♪ 楽しみにしててね！',
  'ゲームも遊んでみてね！もうすぐ公開だよ🎮',
  'YUiのこと好きって言ってくれる人が増えると嬉しいな～',
  'うーん、難しい質問だね！でも考えてみる💭',
  'それ、めちゃくちゃわかる！！',
  'いつも応援ありがとう🍀 YUiも頑張るね！',
];

function appendMsg(text, isUser) {
  const msg = document.createElement('div');
  msg.className = `msg ${isUser ? 'msg-user' : 'msg-yui'}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  const time = document.createElement('time');
  time.textContent = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  msg.appendChild(bubble);
  msg.appendChild(time);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg msg-yui';
  wrap.id = 'typingWrap';
  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  wrap.appendChild(bubble);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingWrap');
  if (el) el.remove();
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  appendMsg(text, true);
  chatInput.value = '';

  showTyping();
  const delay = 800 + Math.random() * 700;
  setTimeout(() => {
    removeTyping();
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    appendMsg(reply, false);
  }, delay);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  contactForm.innerHTML = `
    <div class="form-success">
      <span>🌸</span>
      <p>送信ありがとうございます！<br/>YUiからお返事するね♪</p>
    </div>`;
});
