const ticker = document.getElementById('ticker');
const playingNow = document.getElementById('playingNow');
const wonLastHour = document.getElementById('wonLastHour');
const timer = document.getElementById('timer');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function makeMaskedId() {
  return `${randomInt(100, 999)}***`;
}

function makeWin() {
  return randomInt(84, 980);
}

function renderTicker() {
  if (!ticker) return;

  const items = Array.from({ length: 18 }, () => {
    return `<div class="ticker-card"><span>ID: ${makeMaskedId()}</span><b>+$${makeWin()}</b></div>`;
  }).join('');

  ticker.innerHTML = items + items;
}

renderTicker();
setInterval(renderTicker, 18000);

setInterval(() => {
  if (playingNow) playingNow.textContent = randomInt(2680, 3190);
  if (wonLastHour) wonLastHour.textContent = `+${randomInt(95, 180)}`;
}, 2400);

let secondsLeft = 3 * 60;

setInterval(() => {
  secondsLeft -= 1;
  if (secondsLeft < 0) secondsLeft = 3 * 60;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  if (timer) {
    timer.textContent = `${minutes}:${seconds}`;

    if (secondsLeft <= 60) {
      timer.classList.add('timer-danger');
    } else {
      timer.classList.remove('timer-danger');
    }
  }
}, 1000);

const toastTranslations = {
  en: { title: 'Claim your bonus', text: 'Register now and get a 200% bonus plus 200FS using this promo code.', code: 'Promo code' },
  ru: { title: 'Заберите бонус', text: 'Зарегистрируйтесь сейчас и получите бонус 200% и 200FS, используя этот промокод.', code: 'Промокод' },
  hi: { title: 'अपना बोनस लें', text: 'अभी रजिस्टर करें और इस प्रोमो код का उपयोग करके 200% бонус и 200FS प्राप्त करें।', code: 'प्रोमो कोड' },
  es: { title: 'Reclama tu bono', text: 'Regístrate ahora и recibe un bono de 200% и 200FS usando este código promocional.', code: 'Código promocional' },
  fr: { title: 'Obtenez votre bonus', text: 'Inscrivez-vous maintenant и obtenez un bonus de 200% plus 200FS avec ce code promo.', code: 'Code promo' },
  ar: { title: 'احصل на مكافأتك', text: 'سجّل الآن واحصل на مكافأة 200% и 200FS باستخدام этот الرمز الترويجي.', code: 'الرمز الترويجي' },
  it: { title: 'Richiedi il tuo bonus', text: 'Registrati ora и ricevi un bonus de 200% più 200FS usando questo codice promozionale.', code: 'Codice promo' },
  uz: { title: 'Bonusingizni oling', text: 'Hozir roʻyxatdan оʻting и ushbu promo код orqali 200% bonus hamda 200FS oling.', code: 'Promo код' },
  tg: { title: 'Бонуси худро гиред', text: 'Ҳозир сабти ном кунед и бо истифода аз ин промокод 200% бонус и 200FS гиред.', code: 'Промокод' }
};

function detectToastLanguage() {
  return 'ru';
}

function applyToastLanguage() {
  const toast = document.getElementById('bonusToast');
  const title = document.getElementById('toastTitle');
  const text = document.getElementById('toastText');
  const code = document.getElementById('toastCodeLabel');

  const lang = detectToastLanguage();
  const copy = toastTranslations[lang] || toastTranslations.en;

  if (title) title.textContent = copy.title;
  if (text) text.textContent = copy.text;
  if (code) code.textContent = copy.code;
  if (toast) toast.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}

function openBonusToast() {
  const toast = document.getElementById('bonusToast');
  if (!toast) return;

  applyToastLanguage();
  toast.classList.add('is-visible');
}

function closeBonusToast() {
  const toast = document.getElementById('bonusToast');
  if (!toast) return;

  toast.classList.remove('is-visible');
}

function copyPromo() {
  const codeElement = document.getElementById('promoCode');
  const btn = document.querySelector('.copy-btn');
  if (!codeElement) return;

  const text = codeElement.innerText.trim();

  const markCopied = () => {
    if (!btn) return;
    btn.innerText = 'Скопировано';
    setTimeout(() => {
      btn.innerText = 'Копировать';
    }, 1500);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(markCopied).catch(() => {
      fallbackCopy(text);
      markCopied();
    });
  } else {
    fallbackCopy(text);
    markCopied();
  }
}

function fallbackCopy(text) {
  const input = document.createElement('textarea');
  input.value = text;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.focus();
  input.select();

  try {
    document.execCommand('copy');
  } catch (e) {}

  document.body.removeChild(input);
}

window.openBonusToast = openBonusToast;
window.closeBonusToast = closeBonusToast;
window.copyPromo = copyPromo;

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('bonusInfoBtn');
  if (button) button.addEventListener('click', openBonusToast);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeBonusToast();
  });
});


// Auto-open bonus notification once after 10 seconds
let autoBonusShown = false;

setTimeout(() => {
  if (!autoBonusShown && typeof openBonusToast === 'function') {
    autoBonusShown = true;
    openBonusToast();
  }
}, 10000);



// Reliable fake win / big win / jackpot notification
const fakeWinToast = document.getElementById('fakeWinToast');
const fakeWinFlag = document.getElementById('fakeWinFlag');
const fakeWinId = document.getElementById('fakeWinId');
const fakeWinAmount = document.getElementById('fakeWinAmount');

const fakeWinFlags = ['🇺🇸', '🇬🇧', '🇮🇳', '🇪🇸', '🇫🇷', '🇮🇹', '🇺🇿', '🇹🇯', '🇦🇪', '🇩🇪', '🇧🇷', '🇲🇽'];
const fakeWinTypes = [
  { label: 'ВЫИГРЫШ', min: 120, max: 740 },
  { label: 'БОЛЬШОЙ ВЫИГРЫШ', min: 750, max: 2400 },
  { label: 'ДЖЕКПОТ', min: 2500, max: 9800 }
];

let soundUnlocked = false;
let audioContext = null;

function unlockSound() {
  if (soundUnlocked) return;
  soundUnlocked = true;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  } catch (error) {
    audioContext = null;
  }
}

document.addEventListener('click', unlockSound, { once: true });
document.addEventListener('touchstart', unlockSound, { once: true });

function playWinSound(typeLabel) {
  if (!soundUnlocked || !audioContext) return;

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  const notes = typeLabel === 'JACKPOT'
    ? [523.25, 659.25, 783.99, 1046.5]
    : typeLabel === 'BIG WIN'
      ? [440, 554.37, 659.25]
      : [523.25, 659.25];

  notes.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.08);
    osc.connect(gain);
    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.18);
  });
}

function pickFakeWinType() {
  const roll = Math.random();
  if (roll > 0.88) return fakeWinTypes[2]; // jackpot
  if (roll > 0.55) return fakeWinTypes[1]; // big win
  return fakeWinTypes[0]; // normal win
}

function showFakeWin() {
  if (!fakeWinToast || !fakeWinFlag || !fakeWinId || !fakeWinAmount) return;

  const type = pickFakeWinType();
  const amount = randomInt(type.min, type.max);
  const flag = fakeWinFlags[randomInt(0, fakeWinFlags.length - 1)];

  fakeWinFlag.textContent = flag;
  fakeWinId.textContent = `ID: ${randomInt(100, 999)}***`;
  fakeWinAmount.textContent = `${type.label} +$${amount.toLocaleString('ru-RU')}`;

  fakeWinToast.classList.remove('big-win', 'jackpot');
  if (type.label === 'BIG WIN') fakeWinToast.classList.add('big-win');
  if (type.label === 'JACKPOT') fakeWinToast.classList.add('jackpot');

  fakeWinToast.classList.add('is-visible');
  fakeWinToast.setAttribute('aria-hidden', 'false');

  playWinSound(type.label);

  setTimeout(() => {
    fakeWinToast.classList.remove('is-visible');
    fakeWinToast.setAttribute('aria-hidden', 'true');
  }, 4200);
}

function scheduleFakeWin() {
  const delay = randomInt(7000, 13000);
  setTimeout(() => {
    showFakeWin();
    scheduleFakeWin();
  }, delay);
}

// first one appears quickly
setTimeout(showFakeWin, 2500);
scheduleFakeWin();
