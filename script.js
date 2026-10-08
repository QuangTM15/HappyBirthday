(() => {
  'use strict';
  const cfg = window.BIRTHDAY_CONFIG || {};
  const $ = id => document.getElementById(id);
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const total = scenes.length;
  const audio = $('customAudio');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let galleryIndex = 0;
  let galleryAnimating = false;
  let galleryTimer = null;
  let candlesBlown = false;
  let wishAccepted = false;
  let letterOpened = false;
  let prankNoCount = 0;
  let isGiftOpening = false;
  let toastTimer = null;
  let prankTimer = null;
  let micStream = null;
  let micRaf = null;
  let micCtx = null;
  let bgCtx = null;
  let tuneTimer = null;
  let tunePlaying = false;
  let customPlaying = false;
  const notes = [
    ['G4', .29], ['G4', .27], ['A4', .56], ['G4', .54], ['C5', .55], ['B4', 1],
    ['G4', .29], ['G4', .27], ['A4', .56], ['G4', .54], ['D5', .55], ['C5', 1],
    ['G4', .29], ['G4', .27], ['G5', .56], ['E5', .54], ['C5', .54], ['B4', .54], ['A4', .9],
    ['F5', .29], ['F5', .27], ['E5', .56], ['C5', .54], ['D5', .55], ['C5', 1.12]
  ];
  const frequencies = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };

  function text(id, value) {
    $(id).textContent = String(value ?? '');
  }

  function showToast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 3400);
  }

  function fillContent() {
    text('birthdayLabel', cfg.birthdayLabel || 'A LITTLE MAGIC, JUST FOR YOU');
    text('recipientName', cfg.recipient || 'Mít');
    text('endRecipient', cfg.recipient || 'Mít');
    text('introMessage', cfg.intro || 'Có một món quà nho nhỏ đang đợi cậu...');
    text('cakeMessage', cfg.cakeMessage || 'Nhắm mắt lại, ước một điều nhé!');
    text('letterTitle', cfg.letterTitle || 'Gửi cậu,');
    text('fromName', cfg.from || 'Một người luôn quý cậu ♡');
    text('endingMessage', cfg.ending || 'Chúc cậu tuổi mới thật hạnh phúc!');
    document.title = `Happy Birthday ${cfg.recipient || '♡'} 🎂`;
    const body = $('letterBody');
    (Array.isArray(cfg.letter) ? cfg.letter : []).forEach(paragraph => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      body.append(p);
    });
    const progress = $('progressDots');
    scenes.forEach(() => {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      dot.setAttribute('aria-hidden', 'true');
      progress.append(dot);
    });
    if (cfg.customMusic) audio.src = cfg.customMusic;
    else audio.removeAttribute('src');
  }

  function closeWishModal() {
    clearTimeout(prankTimer);
    prankTimer = null;
    $('wishPrank').hidden = true;
    document.body.classList.remove('wish-dialog-open');
  }

  function showScene(index) {
    if (index < 0 || index >= total) return;
    if (index === 2 && !wishAccepted) {
      showToast('Phải xác nhận điều ước trước đã nha ♡');
      return;
    }
    if (index === 4 && !letterOpened) {
      showToast('Còn lá thư chưa mở kìa 💌');
      return;
    }
    stopMic();
    closeWishModal();
    scenes.forEach((scene, i) => {
      scene.hidden = i !== index;
      scene.classList.toggle('is-active', i === index);
      scene.scrollTop = 0;
    });
    current = index;
    document.body.dataset.scene = String(index);
    $('backBtn').hidden = index === 0;
    text('progressText', `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`);
    Array.from($('progressDots').children).forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (index === 2) { clearTimeout(galleryTimer); galleryAnimating = false; $('galleryCard').classList.remove('photo-leaving', 'photo-entering'); renderGallery(); }
    if (index === 4) celebrate(95);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function createTwinkles() {
    if (reducedMotion) return;
    for (let i = 0; i < 65; i++) {
      const star = document.createElement('span');
      star.className = 'twinkle';
      star.textContent = Math.random() > .77 ? '✦' : '·';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.fontSize = `${7 + Math.random() * 16}px`;
      star.style.animationDuration = `${2 + Math.random() * 4}s`;
      star.style.animationDelay = `-${Math.random() * 5}s`;
      $('twinkles').append(star);
    }
  }

  function createCakeSky() {
    const sky = $('cakeSky');
    for (let i = 0; i < 34; i++) {
      const star = document.createElement('span');
      star.className = 'cake-sky-star';
      star.style.setProperty('--star-x', `${3 + Math.random() * 94}%`);
      star.style.setProperty('--star-y', `${4 + Math.random() * 91}%`);
      star.style.setProperty('--star-size', `${4 + Math.random() * 10}px`);
      star.style.setProperty('--star-duration', `${2.2 + Math.random() * 4}s`);
      star.style.setProperty('--star-delay', `${-Math.random() * 7}s`);
      sky.append(star);
    }
  }

  function celebrate(count = 100) {
    if (reducedMotion) return;
    const palette = ['#fbd0e4', '#ff9ec1', '#ffe0a0', '#fff9fa', '#c8a9f4', '#e16a9f'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = palette[Math.floor(Math.random() * palette.length)];
      piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
      piece.style.animationDuration = `${2 + Math.random() * 2.5}s`;
      piece.style.animationDelay = `${Math.random() * .6}s`;
      $('confetti').append(piece);
      setTimeout(() => piece.remove(), 5700);
    }
  }

  function openWishModal() {
    if (current !== 1 || wishAccepted) return;
    $('wishPrank').hidden = false;
    document.body.classList.add('wish-dialog-open');
    $('prankYes').focus({ preventScroll: true });
  }

  function blowCandles() {
    if (candlesBlown || current !== 1) return;
    candlesBlown = true;
    $('cakeWrap').classList.add('blown-out');
    text('candleHint', 'Điều ước đã bay tới các vì sao! ✨');
    $('blowBtn').hidden = true;
    $('micBtn').hidden = true;
    $('afterCakeBtn').hidden = true;
    stopMic();
    celebrate(48);
    prankTimer = setTimeout(openWishModal, reducedMotion ? 180 : 1100);
  }

  function rejectWish() {
    if (wishAccepted) return;
    const replies = [
      'Ơ kìa, đừng chối vội thế chứ =)))',
      'Chối nhanh vậy làm mình càng nghi hơn đó nha 🤭',
      'Có tin được không vậy =)))'
    ];
    text('prankReply', replies[Math.min(prankNoCount, replies.length - 1)]);
    prankNoCount++;
    const card = $('wishPrankCard');
    card.classList.remove('is-teasing');
    void card.offsetWidth;
    card.classList.add('is-teasing');
  }

  function acceptWish() {
    if (wishAccepted) return;
    wishAccepted = true;
    text('wishPrankTitle', 'Biết ngay mà! ♡');
    text('prankReply', 'Vậy thì... mình cũng mong điều ước ấy thành sự thật đó ♡');
    $('prankActions').hidden = true;
    $('wishPrankCard').classList.add('is-accepted');
    $('afterCakeBtn').hidden = false;
    prankTimer = setTimeout(() => {
      if (current !== 1) return;
      showScene(2);
      celebrate(70);
    }, reducedMotion ? 250 : 1550);
  }

  async function listenMic() {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Trình duyệt chưa hỗ trợ micro. Cậu có thể nhấn nút thổi nến nhé!');
      return;
    }
    if (!window.isSecureContext) {
      showToast('Cần HTTPS để dùng micro. Nút thổi nến vẫn dùng được nhé!');
      return;
    }
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (candlesBlown || current !== 1) { stopMic(); return; }
      micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = micCtx.createMediaStreamSource(micStream);
      const analyser = micCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      text('candleHint', 'Hãy thổi gần micro của điện thoại... 💨');
      let loudFrames = 0;
      const listen = () => {
        if (!micStream || candlesBlown) return;
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          const x = (samples[i] - 128) / 128;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / samples.length);
        loudFrames = rms > .11 ? loudFrames + 1 : Math.max(0, loudFrames - 1);
        if (loudFrames >= 7) { blowCandles(); return; }
        micRaf = requestAnimationFrame(listen);
      };
      listen();
    } catch (error) {
      stopMic();
      showToast('Không truy cập được micro. Hãy dùng nút “Phùù... thổi nến” nhé!');
    }
  }

  function stopMic() {
    if (micRaf) cancelAnimationFrame(micRaf);
    micRaf = null;
    if (micStream) micStream.getTracks().forEach(track => track.stop());
    micStream = null;
    if (micCtx) micCtx.close().catch(() => {});
    micCtx = null;
  }

  function renderGallery() {
    const photos = Array.isArray(cfg.gallery) && cfg.gallery.length
      ? cfg.gallery
      : [{ src: '', caption: 'Một khoảnh khắc thật xinh ♡', sticker: '🌸', gradient: 'peach' }];
    galleryIndex = (galleryIndex + photos.length) % photos.length;
    const photo = photos[galleryIndex];
    const image = $('galleryImage');
    const placeholder = $('photoPlaceholder');
    image.onload = () => { image.hidden = false; placeholder.hidden = true; };
    image.onerror = () => { image.hidden = true; placeholder.hidden = false; };
    image.hidden = true;
    placeholder.hidden = false;
    image.removeAttribute('src');
    placeholder.className = `photo-placeholder ${photo.gradient || 'peach'}`;
    text('photoSticker', photo.sticker || '🌷');
    text('photoCaption', photo.caption || 'A little memory ♡');
    $('photoHolder').setAttribute('aria-label', photo.caption || 'Ảnh kỷ niệm');
    if (photo.src) image.src = photo.src;
    const dots = $('galleryDots');
    dots.replaceChildren();
    photos.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `gallery-dot${i === galleryIndex ? ' active' : ''}`;
      dots.append(dot);
    });
  }

  function changePhoto(direction) {
    const count = Array.isArray(cfg.gallery) ? cfg.gallery.length : 1;
    if (count <= 1 || galleryAnimating) return;
    galleryAnimating = true;
    const card = $('galleryCard');
    if (reducedMotion) { galleryIndex = (galleryIndex + direction + count) % count; renderGallery(); galleryAnimating = false; return; }
    card.style.setProperty('--photo-direction', direction > 0 ? '1' : '-1');
    card.classList.add('photo-leaving');
    galleryTimer = setTimeout(() => {
      galleryIndex = (galleryIndex + direction + count) % count;
      renderGallery();
      card.classList.remove('photo-leaving');
      card.classList.add('photo-entering');
      galleryTimer = setTimeout(() => { card.classList.remove('photo-entering'); galleryAnimating = false; }, 320);
    }, 260);
  }

  function openLetter() {
    if (letterOpened) return;
    letterOpened = true;
    $('envelopeButton').hidden = true;
    $('letterPaper').hidden = false;
    $('letterFollowup').hidden = false;
    celebrate(32);
    if (window.innerWidth < 600) setTimeout(() => $('letterPaper').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' }), 180);
  }

  function scheduleTune() {
    if (!tunePlaying || !bgCtx) return;
    const base = bgCtx.currentTime + .08;
    let time = 0;
    for (const [note, duration] of notes) {
      const osc = bgCtx.createOscillator();
      const gain = bgCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequencies[note], base + time);
      gain.gain.setValueAtTime(.0001, base + time);
      gain.gain.exponentialRampToValueAtTime(.055, base + time + .04);
      gain.gain.exponentialRampToValueAtTime(.0001, base + time + duration * .90);
      osc.connect(gain);
      gain.connect(bgCtx.destination);
      osc.start(base + time);
      osc.stop(base + time + duration);
      time += duration;
    }
    tuneTimer = setTimeout(scheduleTune, (time + 1.3) * 1000);
  }

  function syncMusicButton() {
    const playing = tunePlaying || customPlaying;
    $('musicBtn').setAttribute('aria-pressed', String(playing));
    $('musicBtn').setAttribute('aria-label', playing ? 'Tắt nhạc' : 'Bật nhạc');
  }

  function stopMusic() {
    customPlaying = false;
    audio.pause();
    tunePlaying = false;
    clearTimeout(tuneTimer);
    tuneTimer = null;
    if (bgCtx) bgCtx.close().catch(() => {});
    bgCtx = null;
    syncMusicButton();
  }

  function startSynth() {
    if (tunePlaying) return;
    try {
      bgCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (bgCtx.state === 'suspended') bgCtx.resume();
      tunePlaying = true;
      scheduleTune();
      syncMusicButton();
    } catch (error) {
      showToast('Thiết bị chưa hỗ trợ phát nhạc nền.');
    }
  }

  function startMusic() {
    if (customPlaying || tunePlaying) return;
    if (cfg.customMusic) {
      audio.play().then(() => {
        customPlaying = true;
        syncMusicButton();
      }).catch(() => {
        showToast('Không phát được bài hát, chuyển sang giai điệu mặc định ♪');
        startSynth();
      });
    } else {
      startSynth();
    }
  }

  function toggleMusic() {
    if (customPlaying || tunePlaying) stopMusic();
    else startMusic();
  }

  function resetExperience() {
    clearTimeout(prankTimer);
    candlesBlown = false;
    wishAccepted = false;
    letterOpened = false;
    prankNoCount = 0;
    galleryIndex = 0;
    galleryAnimating = false;
    clearTimeout(galleryTimer);
    $('galleryCard').classList.remove('photo-leaving', 'photo-entering');
    $('cakeWrap').classList.remove('blown-out');
    text('candleHint', 'Nến đang lung linh... 🕯️');
    $('blowBtn').hidden = false;
    $('micBtn').hidden = false;
    $('afterCakeBtn').hidden = true;
    $('envelopeButton').hidden = false;
    $('letterPaper').hidden = true;
    $('letterFollowup').hidden = true;
    $('prankActions').hidden = false;
    $('wishPrankCard').classList.remove('is-accepted', 'is-teasing');
    text('wishPrankTitle', 'Khoan đã... ♡');
    text('prankReply', 'Đừng hỏi sao mình biết nha =)))');
    showScene(0);
  }

  fillContent();
  createTwinkles();
  createCakeSky();
  showScene(0);
  $('openGiftBtn').addEventListener('click', () => {
    if (isGiftOpening) return;
    isGiftOpening = true;
    const button = $('openGiftBtn');
    const giftArea = $('welcomeGiftArea');
    startMusic();
    button.disabled = true;
    giftArea.classList.add('is-opening');
    setTimeout(() => {
      showScene(1);
      celebrate(65);
      giftArea.classList.remove('is-opening');
      button.disabled = false;
      isGiftOpening = false;
    }, reducedMotion ? 100 : 1800);
  });
  $('backBtn').addEventListener('click', () => showScene(current - 1));
  $('musicBtn').addEventListener('click', toggleMusic);
  $('blowBtn').addEventListener('click', blowCandles);
  $('micBtn').addEventListener('click', listenMic);
  $('prankNo').addEventListener('click', rejectWish);
  $('prankYes').addEventListener('click', acceptWish);
  $('afterCakeBtn').addEventListener('click', () => showScene(2));
  $('prevPhoto').addEventListener('click', () => changePhoto(-1));
  $('nextPhoto').addEventListener('click', () => changePhoto(1));
  $('galleryNextBtn').addEventListener('click', () => showScene(3));
  $('envelopeButton').addEventListener('click', openLetter);
  $('letterNextBtn').addEventListener('click', () => showScene(4));
  $('replayBtn').addEventListener('click', resetExperience);
  $('endingHeart').addEventListener('click', () => {
    celebrate(24);
    const heart = $('endingHeart');
    heart.classList.remove('heart-tapped');
    void heart.offsetWidth;
    heart.classList.add('heart-tapped');
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMic(); });
  window.addEventListener('pagehide', () => { stopMic(); stopMusic(); });
})();
