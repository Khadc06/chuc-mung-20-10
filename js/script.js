/* =========================================================
   File này chỉ lo HIỆU ỨNG (cánh hoa, gõ chữ, đổi ảnh, nhạc).
   Mọi chữ, ảnh, nhạc, tốc độ đều đọc từ index.html — sửa ở đó.
   ========================================================= */
const intro = document.getElementById('intro');
const cardScene = document.getElementById('card-scene');
const openButton = document.getElementById('open-card');
const typedMessage = document.getElementById('typed-message');
const messageSource = document.getElementById('message-source');
const signature = document.getElementById('signature');
const audio = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const musicLabel = document.getElementById('music-label');
const replayButton = document.getElementById('replay');
const petalLayer = document.getElementById('petal-layer');
const sparkleLayer = document.getElementById('sparkle-layer');

let typingTimer = null;
let hasOpened = false;
let musicPlaying = false;

// Lời chúc: đọc từ khối #message-source trong HTML (mỗi <p> là một đoạn, <br> là xuống dòng).
function readMessage() {
  return Array.from(messageSource.querySelectorAll('p')).map((p) => {
    const clone = p.cloneNode(true);
    clone.querySelectorAll('br').forEach((br) => br.replaceWith('\u0001'));
    return clone.textContent.replace(/\s+/g, ' ').split('\u0001').map((l) => l.trim()).join('\n').trim();
  }).filter(Boolean).join('\n\n');
}
const typingSpeed = Number(typedMessage.dataset.speed) || 42;

// Chữ trên nút nhạc: lấy từ data-label-on / data-label-off trong HTML.
const labelOff = musicToggle.dataset.labelOff || musicLabel.textContent;
const labelOn = musicToggle.dataset.labelOn || labelOff;
musicLabel.textContent = labelOff;

// Âm lượng: data-volume trong thẻ <audio> (iPhone/iPad tự điều khiển âm lượng nên bỏ qua giá trị này).
const vol = parseFloat(audio.dataset.volume);
audio.volume = Number.isNaN(vol) ? 0.48 : Math.min(1, Math.max(0, vol));

// Ảnh: mọi thẻ <img class="photo-slide"> trong HTML sẽ luân phiên.
const slides = Array.from(document.querySelectorAll('.photo-slide'));
const photoFrame = document.querySelector('.photo-frame');
const interval = Number(photoFrame.dataset.interval);
const photoInterval = Number.isNaN(interval) ? 3000 : interval;
const dotsBox = document.getElementById('photo-dots');
const dots = slides.map((_, i) => {
  const d = document.createElement('button');
  d.type = 'button'; d.className = 'photo-dot'; d.setAttribute('aria-label', `Xem ảnh ${i + 1}`);
  d.addEventListener('click', (e) => { e.stopPropagation(); showPhoto(i, true); });
  dotsBox.appendChild(d); return d;
});
if (slides.length < 2) dotsBox.hidden = true;
let photoIndex = 0, photoTimer = null;
function showPhoto(i, manual) {
  photoIndex = i;
  slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
  dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  if (manual) startPhotoTimer();
}
function startPhotoTimer() {
  clearInterval(photoTimer);
  if (slides.length > 1 && photoInterval > 0) {
    photoTimer = setInterval(() => showPhoto((photoIndex + 1) % slides.length), photoInterval);
  }
}
photoFrame.addEventListener('click', () => { if (slides.length > 1) showPhoto((photoIndex + 1) % slides.length, true); });
showPhoto(0); // bộ đếm giờ tự đổi ảnh bắt đầu khi thiệp được mở

function random(min, max) { return Math.random() * (max - min) + min; }

const isMobile = window.matchMedia('(max-width: 760px)').matches;
function createPetals(count = isMobile ? 12 : 24) {
  const petals = ['✿', '❀', '❋', '✽'];
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = `${random(0, 100)}%`;
    petal.style.fontSize = `${random(10, 23)}px`;
    petal.style.animationDuration = `${random(13, 26)}s`;
    petal.style.animationDelay = `${random(-26, 0)}s`;
    petal.style.setProperty('--drift', `${random(-160, 160)}px`);
    petal.style.setProperty('--spin', `${random(180, 900)}deg`);
    petal.style.opacity = random(.25, .72).toFixed(2);
    petalLayer.appendChild(petal);
  }
}

function createSparkles(count = isMobile ? 20 : 42) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${random(2, 98)}%`;
    sparkle.style.top = `${random(2, 98)}%`;
    sparkle.style.animationDuration = `${random(2, 5)}s`;
    sparkle.style.animationDelay = `${random(-5, 0)}s`;
    sparkle.style.opacity = random(.2, .8).toFixed(2);
    const size = random(2, 5);
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkleLayer.appendChild(sparkle);
  }
}

function typeMessage() {
  window.clearTimeout(typingTimer);
  typedMessage.style.minHeight = '';
  const text = readMessage();
  typedMessage.textContent = text;
  typedMessage.style.minHeight = typedMessage.offsetHeight + 'px';
  typedMessage.textContent = '';
  typedMessage.classList.add('typing');
  signature.classList.remove('visible');
  let index = 0;
  const typeNext = () => {
    if (index < text.length) {
      typedMessage.textContent += text.charAt(index);
      index++;
      typingTimer = window.setTimeout(typeNext, typingSpeed + (text.charAt(index - 1) === '\n' ? 150 : 0));
    } else {
      typedMessage.classList.remove('typing');
      signature.classList.add('visible');
      makeHeartBurst();
    }
  };
  typeNext();
}

function makeHeartBurst() {
  const card = document.getElementById('greeting-card');
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height * .48;
  for (let i = 0; i < 17; i++) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = Math.random() > .45 ? '♡' : '✧';
    heart.style.left = `${centerX + random(-20, 20)}px`;
    heart.style.top = `${centerY + random(-15, 15)}px`;
    heart.style.fontSize = `${random(12, 24)}px`;
    heart.style.setProperty('--x', `${random(-180, 180)}px`);
    heart.style.setProperty('--y', `${random(-130, 120)}px`);
    heart.style.setProperty('--r', `${random(-70, 70)}deg`);
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1900);
  }
}

// Nhạc là một bản nền WAV nằm trong dự án. Trình duyệt cho phép phát sau thao tác bấm.
async function startMusic() {
  try {
    await audio.play();
    musicPlaying = true;
    musicLabel.textContent = labelOn;
    musicToggle.setAttribute('aria-pressed', 'true');
  } catch (error) {
    // Trình duyệt không cho phát: giữ nút ở trạng thái tắt để người xem tự bấm.
    musicPlaying = false;
    musicLabel.textContent = labelOff;
    musicToggle.setAttribute('aria-pressed', 'false');
  }
}

function stopMusic() {
  audio.pause();
  musicPlaying = false;
  musicLabel.textContent = labelOff;
  musicToggle.setAttribute('aria-pressed', 'false');
}

async function openCard() {
  if (hasOpened) return;
  hasOpened = true;
  openButton.disabled = true;
  intro.classList.add('opening');
  await startMusic();
  window.setTimeout(() => {
    intro.style.opacity = '0';
    intro.style.transform = 'translateY(-14px) scale(.985)';
    window.setTimeout(() => {
      intro.classList.add('is-hidden');
      cardScene.classList.remove('is-hidden');
      cardScene.classList.add('entering');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.getElementById('scene-title').focus({ preventScroll: true });
      startPhotoTimer();
      window.setTimeout(typeMessage, 650);
      makeHeartBurst();
    }, 450);
  }, 650);
}

openButton.addEventListener('click', openCard);
musicToggle.addEventListener('click', async () => {
  if (musicPlaying) stopMusic();
  else await startMusic();
});
replayButton.addEventListener('click', () => {
  typeMessage();
});

createPetals();
createSparkles();
