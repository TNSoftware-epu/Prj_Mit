/**
 * config.js
 * ==========================================================
 * TAT CA CAU HINH CO THE CHINH SUA TAP TRUNG TAI DAY
 * ==========================================================
 */
'use strict';

const CONFIG = {

  // ══════════════════════════════════════════════════════
  // NHAC (YOUTUBE)
  // ══════════════════════════════════════════════════════
  // Lay video ID tu URL: youtube.com/watch?v=[ID_O_DAY]
  YOUTUBE_VIDEO_ID: 'E-MrJOz1VEY',   // Anchor - Novo Amor
  DEFAULT_VOLUME: 70,                  // Am luong mac dinh (0-100)

  // ══════════════════════════════════════════════════════
  // HAT LO LUNG
  // ══════════════════════════════════════════════════════
  MAX_PARTICLES: 80,          // So hat toi da tren man hinh
  PARTICLE_SPAWN_RATE: 0.4,   // Xac suat sinh hat moi frame (0.0-1.0)
  HEART_RATIO: 0.5,           // Ti le hat trai tim (0.0-1.0)
  RING_RATIO: 0.25,           // Ti le hat vong tron (0.0-1.0)
  // Con lai la dom sang (firefly)

  // ══════════════════════════════════════════════════════
  // VET CHUOT (MOUSE TRAIL)
  // ══════════════════════════════════════════════════════
  TRAIL_PARTICLES_PER_MOVE: 2, // So hat tao ra moi lan di chuot
  TRAIL_LIFETIME: 40,          // So frame truoc khi mo di
  TRAIL_SIZE_MIN: 6,           // Kich thuoc nho nhat hat trail
  TRAIL_SIZE_MAX: 14,          // Kich thuoc lon nhat hat trail

  // ══════════════════════════════════════════════════════
  // VO KHI CLICK TRAI TIM
  // ══════════════════════════════════════════════════════
  EXPLOSION_COUNT: 8,          // So manh vo khi no (5-12)
  EXPLOSION_SPEED: 4,          // Toc do vang manh vo

  // ══════════════════════════════════════════════════════
  // HOA
  // ══════════════════════════════════════════════════════
  FLOWER_PETAL_COUNT: 6,         // So canh hoa (5-8)
  FLOWER_PETAL_COLOR: '#FF8FC8', // Mau canh hoa (hong)
  STEM_COLOR_TOP: '#6ecf8f',     // Mau ngon than hoa (xanh ngoc)
  STEM_COLOR_BOTTOM: '#3a8f5a',  // Mau goc than hoa (xanh dam)
  FLOWER_GROW_SPEED: 0.004,      // Toc do vươn cao (0.001=cham, 0.01=nhanh)
  FLOWER_BLOOM_SPEED: 0.006,     // Toc do no hoa (0.001=cham, 0.01=nhanh)

  // ══════════════════════════════════════════════════════
  // NEN (BACKGROUND)
  // ══════════════════════════════════════════════════════
  BG_CENTER_COLOR: '#0a0518',    // Mau trung tam nen (xanh den sau)
  BG_MID_COLOR: '#060210',       // Mau trung gian nen
  BG_EDGE_COLOR: '#000000',      // Mau vien nen (den tuyet doi)
  DOT_SPACING: 30,               // Khoang cach giua cac cham luoi
  DOT_OPACITY: 0.08,             // Do mo cua cham luoi (0.0-1.0)
  DOT_SIZE: 0.8,                 // Kich thuoc cham luoi (pixel)
};
