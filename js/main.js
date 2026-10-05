/**
 * main.js
 * ==========================================================
 * Diem khoi dong chinh cua ung dung:
 *   - Overlay "Cham de bat dau"
 *   - Con tro chuot tuy chinh
 *   - Xu ly tuong tac chuot (di chuyen, click)
 *   - Game loop chinh (requestAnimationFrame)
 * ==========================================================
 */
'use strict';

/* ─────────────────────────────────────────────
   CAC MANG CHUA HAT
   ───────────────────────────────────────────── */
let particles    = []; // Hat lo lung chinh (Particle)
let trailParticles = []; // Vet chuot (TrailParticle)
let explosions   = []; // Manh vo khi click (ExplosionFragment)
let fallingHearts= []; // Trai tim roi (FallingHeart)

/* ─────────────────────────────────────────────
   HE THONG HOA
   ───────────────────────────────────────────── */
let flowerSystem = null;

/* ─────────────────────────────────────────────
   TRANG THAI GAME
   ───────────────────────────────────────────── */
let gameStarted = false;
let frameCount  = 0;

/* ═══════════════════════════════════════════════════════════
   OVERLAY "CHAM DE BAT DAU"
   ═══════════════════════════════════════════════════════════ */

/**
 * Tao cac cham trang tri nen cho overlay (thuc hien bang JS
 * de co vi tri ngau nhien moi lan tai trang).
 */
function createOverlayDots() {
  const container = document.getElementById('overlay-dots');
  for (let i = 0; i < 40; i++) {
    const dot  = document.createElement('div');
    dot.className = 'overlay-dot';
    const size = 2 + Math.random() * 6;
    dot.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${Math.random() * 100}%;
      top:    ${Math.random() * 100}%;
      --dur:  ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 3}s;
    `;
    container.appendChild(dot);
  }
}

/**
 * Bat dau trai nghiem: an overlay, bat nhac, hien indicator.
 * Chi thuc hien mot lan duy nhat (dung co gameStarted).
 */
function startExperience() {
  if (gameStarted) return;
  gameStarted = true;

  const overlay = document.getElementById('start-overlay');
  overlay.classList.add('fade-out');
  setTimeout(() => { overlay.style.display = 'none'; }, 800);

  // Hien thi thanh indicator nhac o goc duoi trai
  document.getElementById('music-indicator').classList.add('visible');

  // Bat nhac (ham duoc dinh nghia trong audio.js)
  playMusic();
}

/* ═══════════════════════════════════════════════════════════
   TUONG TAC CHUOT
   ═══════════════════════════════════════════════════════════ */
let mouseX = 0, mouseY = 0;
let lastMouseX = 0, lastMouseY = 0;

/**
 * Di chuyen chuot:
 *   - Cap nhat vi tri con tro tuy chinh
 *   - Sinh hat vet chuot (TrailParticle)
 */
function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Cap nhat vi tri con tro HTML
  const cursor = document.getElementById('customCursor');
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  if (!gameStarted) return;

  // Chi sinh hat neu chuot di chuyen du lon (tranh sinh qua nhieu)
  const dist = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
  if (dist > 5) {
    for (let i = 0; i < CONFIG.TRAIL_PARTICLES_PER_MOVE; i++) {
      trailParticles.push(new TrailParticle(mouseX, mouseY));
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

/**
 * Click chuot:
 *   - Neu click trung hat trai tim -> No tung
 *   - Neu click khoang trong -> Tao trai tim roi
 */
function onMouseClick(e) {
  if (!gameStarted) return;

  const cx = e.clientX;
  const cy = e.clientY;

  // -- Tim hat trai tim gan nhat voi diem click --
  const HIT_RADIUS = 20; // Ban kinh hit detection (pixel)
  let hitIndex = -1;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (p.type !== 'heart') continue;
    const dist = Math.hypot(p.x - cx, p.y - cy);
    if (dist < HIT_RADIUS + p.size * 0.5) {
      hitIndex = i;
      break;
    }
  }

  if (hitIndex >= 0) {
    // -- CLICK TRUNG: Tao vu no --
    const hit = particles[hitIndex];
    for (let i = 0; i < CONFIG.EXPLOSION_COUNT; i++) {
      explosions.push(new ExplosionFragment(hit.x, hit.y));
    }
    particles.splice(hitIndex, 1); // Xoa hat bi click
  } else {
    // -- CLICK KHOANG TRONG: Tao trai tim roi --
    fallingHearts.push(new FallingHeart(cx, cy));
  }
}

/* ═══════════════════════════════════════════════════════════
   GAME LOOP CHINH
   ═══════════════════════════════════════════════════════════ */

/**
 * Vong lap render chinh chay bang requestAnimationFrame.
 * Thu tu ve: Nen -> Hoa -> Hat lo lung -> Vet chuot -> No -> Trai tim roi
 */
function loop() {
  frameCount++;

  // 1. Xoa man hinh va ve nen
  drawBackground();

  // 2. Cap nhat va ve khu hoa
  if (flowerSystem) {
    flowerSystem.update();
    flowerSystem.draw();
  }

  // 3. Sinh hat moi (chi khi game da bat dau)
  if (gameStarted && particles.length < CONFIG.MAX_PARTICLES) {
    if (Math.random() < CONFIG.PARTICLE_SPAWN_RATE) {
      particles.push(new Particle(Math.random() * W, H + 10));
    }
  }

  // 4. Hat lo lung chinh
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  // 5. Vet chuot
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    trailParticles[i].update();
    trailParticles[i].draw(ctx);
    if (trailParticles[i].isDead()) trailParticles.splice(i, 1);
  }

  // 6. Manh vo no
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].draw(ctx);
    if (explosions[i].isDead()) explosions.splice(i, 1);
  }

  // 7. Trai tim roi
  for (let i = fallingHearts.length - 1; i >= 0; i--) {
    fallingHearts[i].update();
    fallingHearts[i].draw(ctx);
    if (fallingHearts[i].isDead()) fallingHearts.splice(i, 1);
  }

  requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════════════════════════
   KHOI DONG UNG DUNG
   ═══════════════════════════════════════════════════════════ */
function init() {
  // 1. Khoi tao canvas va ve nen lan dau
  resizeCanvas();

  // 2. Tao he thong hoa
  flowerSystem = new FlowerSystem();

  // 3. Tao cham nen overlay
  createOverlayDots();

  // 4. Khoi tao volume slider
  initVolumeSlider();

  // 5. Gan event listeners
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click',     onMouseClick);

  const overlay = document.getElementById('start-overlay');
  overlay.addEventListener('click',      startExperience);
  overlay.addEventListener('touchstart', startExperience, { passive: true });

  // 6. Bat dau render loop
  requestAnimationFrame(loop);
}

// Goi init() sau khi DOM da tai xong
document.addEventListener('DOMContentLoaded', init);
