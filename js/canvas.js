/**
 * canvas.js
 * ==========================================================
 * Quan ly Canvas chinh: khoi tao, resize, ve nen
 * ==========================================================
 */
'use strict';

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

// Kich thuoc man hinh hien tai (global, duoc cap nhat khi resize)
let W = 0, H = 0;

/**
 * Thay doi kich thuoc canvas theo cua so trinh duyet.
 * Goi lai moi khi window.resize.
 */
function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  drawBackground();
}

/**
 * Ve nen toi gradient + luoi cham nho.
 * Duoc goi moi frame de xoa man hinh truoc khi ve lai.
 */
function drawBackground() {
  // Gradient radial toi tu giua ra vien
  // San pham thay doi MAU NEN trong CONFIG (BG_CENTER_COLOR, BG_EDGE_COLOR)
  const grad = ctx.createRadialGradient(
    W / 2, H / 2, 0,
    W / 2, H / 2, Math.max(W, H) * 0.75
  );
  grad.addColorStop(0,   CONFIG.BG_CENTER_COLOR);
  grad.addColorStop(0.5, CONFIG.BG_MID_COLOR);
  grad.addColorStop(1,   CONFIG.BG_EDGE_COLOR);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Luoi cham nho li ti mo nhat - tao cam giac khong gian dem
  // Thay doi DOT_SPACING, DOT_OPACITY, DOT_SIZE trong config.js
  ctx.fillStyle = `rgba(200, 180, 255, ${CONFIG.DOT_OPACITY})`;
  for (let x = CONFIG.DOT_SPACING / 2; x < W; x += CONFIG.DOT_SPACING) {
    for (let y = CONFIG.DOT_SPACING / 2; y < H; y += CONFIG.DOT_SPACING) {
      ctx.beginPath();
      ctx.arc(x, y, CONFIG.DOT_SIZE, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Lang nghe su kien resize cua so
window.addEventListener('resize', () => {
  resizeCanvas();
  // Reset vi tri hoa khi man hinh thay doi kich thuoc
  if (typeof flowerSystem !== 'undefined' && flowerSystem) {
    flowerSystem.reset();
  }
});
