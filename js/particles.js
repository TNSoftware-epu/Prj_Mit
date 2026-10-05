/**
 * particles.js
 * ==========================================================
 * Cac class hat:
 *   - drawHeart()        : ham ve hinh trai tim
 *   - Particle           : hat lo lung chinh (heart/ring/firefly)
 *   - TrailParticle      : hat vet chuot
 *   - ExplosionFragment  : manh vo khi click trung hat
 *   - FallingHeart       : trai tim roi xuong khi click khoang trong
 * ==========================================================
 */
'use strict';

/* ─────────────────────────────────────────────
   HAM VE TRAI TIM (dung chung cho tat ca class)
   ─────────────────────────────────────────────
   @param {CanvasRenderingContext2D} c  - context
   @param {number} x  - toa do x tam trai tim
   @param {number} y  - toa do y tam trai tim
   @param {number} size - kich thuoc tong the
*/
function drawHeart(c, x, y, size) {
  const s = size * 0.5;
  c.beginPath();
  c.moveTo(x, y + s * 0.4);
  c.bezierCurveTo(x, y, x - s, y, x - s, y - s * 0.4);
  c.bezierCurveTo(x - s, y - s * 1.0, x, y - s * 1.0, x, y - s * 0.4);
  c.bezierCurveTo(x, y - s * 1.0, x + s, y - s * 1.0, x + s, y - s * 0.4);
  c.bezierCurveTo(x + s, y, x, y, x, y + s * 0.4);
  c.closePath();
}

/* ═══════════════════════════════════════════════════════════
   CLASS: Particle
   Hat lo lung bay tu duoi len (heart / ring / firefly)
   ═══════════════════════════════════════════════════════════ */
class Particle {
  /**
   * @param {number|null} x    - vi tri x (null = ngau nhien)
   * @param {number|null} y    - vi tri y (null = duoi man hinh)
   * @param {string|null} type - 'heart'|'ring'|'firefly'|null (null = ngau nhien)
   */
  constructor(x, y, type = null) {
    this.x = x ?? Math.random() * W;
    this.y = y ?? H + 20;

    // Xac dinh loai hat
    if (type) {
      this.type = type;
    } else {
      const r = Math.random();
      if      (r < CONFIG.HEART_RATIO)                       this.type = 'heart';
      else if (r < CONFIG.HEART_RATIO + CONFIG.RING_RATIO)   this.type = 'ring';
      else                                                    this.type = 'firefly';
    }

    // Kich thuoc theo loai
    if      (this.type === 'heart')   this.size = 8  + Math.random() * 18;
    else if (this.type === 'ring')    this.size = 6  + Math.random() * 14;
    else                              this.size = 2  + Math.random() * 4;

    // Vecto van toc
    this.vy = -(0.5 + Math.random() * 1.5); // Bay len
    this.vx = (Math.random() - 0.5) * 0.5;

    // Lac lu bang sin wave
    this.sineAmplitude  = 0.5 + Math.random() * 1.5;
    this.sineFrequency  = 0.02 + Math.random() * 0.03;
    this.sineOffset     = Math.random() * Math.PI * 2;

    // Vong doi & do mo
    this.alpha    = 0;
    this.maxAlpha = 0.5 + Math.random() * 0.5;
    this.life     = 1.0;
    this.fadeSpeed= 0.003 + Math.random() * 0.004;

    // Mau sac (hong den do hong)
    this.hue   = 320 + Math.random() * 40;
    this.frame = 0;
  }

  update() {
    this.frame++;
    this.x += this.vx + Math.sin(this.frame * this.sineFrequency + this.sineOffset) * this.sineAmplitude;
    this.y += this.vy;
    this.life -= this.fadeSpeed;

    // Fade in nhanh, fade out cham khi gan chet
    if (this.alpha < this.maxAlpha && this.life > 0.8) {
      this.alpha = Math.min(this.maxAlpha, this.alpha + 0.05);
    } else {
      this.alpha = this.maxAlpha * this.life;
    }
  }

  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.alpha);

    if (this.type === 'heart') {
      c.fillStyle   = `hsla(${this.hue}, 80%, 75%, 1)`;
      c.shadowColor = `hsla(${this.hue}, 90%, 70%, 0.6)`;
      c.shadowBlur  = 10;
      drawHeart(c, this.x, this.y, this.size);
      c.fill();

    } else if (this.type === 'ring') {
      c.strokeStyle = `hsla(${this.hue}, 70%, 80%, 1)`;
      c.lineWidth   = 1.5;
      c.shadowColor = `hsla(${this.hue}, 80%, 75%, 0.5)`;
      c.shadowBlur  = 8;
      // Ve 2 vong dong tam
      for (let i = 0; i < 2; i++) {
        c.beginPath();
        c.arc(this.x, this.y, this.size * (0.5 + i * 0.35), 0, Math.PI * 2);
        c.stroke();
      }

    } else {
      // Firefly: dom sang radial gradient
      const grd = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      grd.addColorStop(0,   `hsla(${this.hue + 30}, 100%, 90%, 1)`);
      grd.addColorStop(0.4, `hsla(${this.hue}, 90%, 80%, 0.6)`);
      grd.addColorStop(1,   `hsla(${this.hue}, 80%, 70%, 0)`);
      c.fillStyle = grd;
      c.beginPath();
      c.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      c.fill();
    }

    c.restore();
  }

  isDead() {
    return this.life <= 0 || this.y < -50 || this.x < -100 || this.x > W + 100;
  }
}

/* ═══════════════════════════════════════════════════════════
   CLASS: TrailParticle
   Hat vet chuot - nhe, nhanh tan, hoa xoay
   ═══════════════════════════════════════════════════════════ */
class TrailParticle {
  constructor(x, y) {
    this.x    = x + (Math.random() - 0.5) * 10;
    this.y    = y + (Math.random() - 0.5) * 10;
    this.size = CONFIG.TRAIL_SIZE_MIN + Math.random() * (CONFIG.TRAIL_SIZE_MAX - CONFIG.TRAIL_SIZE_MIN);

    this.alpha   = 0.6 + Math.random() * 0.3;
    this.life    = CONFIG.TRAIL_LIFETIME;
    this.maxLife = this.life;

    this.vy       = -(0.3 + Math.random() * 0.8);
    this.vx       = (Math.random() - 0.5) * 0.8;
    this.hue      = 310 + Math.random() * 50;
    this.rotation = (Math.random() - 0.5) * 0.2; // Toc do xoay
    this.angle    = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.angle += this.rotation;
    this.alpha  = (this.life / this.maxLife) * 0.7;
    this.size  *= 0.97; // Thu nho dan
  }

  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.alpha);
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    c.fillStyle   = `hsla(${this.hue}, 85%, 78%, 1)`;
    c.shadowColor = `hsla(${this.hue}, 90%, 80%, 0.5)`;
    c.shadowBlur  = 6;
    drawHeart(c, 0, 0, this.size);
    c.fill();
    c.restore();
  }

  isDead() { return this.life <= 0 || this.size < 1; }
}

/* ═══════════════════════════════════════════════════════════
   CLASS: ExplosionFragment
   Manh vo trai tim bay ra khi click trung hat
   ═══════════════════════════════════════════════════════════ */
class ExplosionFragment {
  constructor(x, y) {
    this.x    = x;
    this.y    = y;
    this.size = 4 + Math.random() * 10;

    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * CONFIG.EXPLOSION_SPEED;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.gravity = 0.12 + Math.random() * 0.08; // Trong luc gia
    this.hue  = 310 + Math.random() * 60;
    this.life = 1.0;
  }

  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vy += this.gravity; // Trong luc keo xuong
    this.vx *= 0.97;
    this.life -= 0.025;
    this.size *= 0.97;
  }

  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.life);
    c.fillStyle   = `hsla(${this.hue}, 85%, 75%, 1)`;
    c.shadowColor = `hsla(${this.hue}, 90%, 80%, 0.6)`;
    c.shadowBlur  = 8;
    drawHeart(c, this.x, this.y, this.size);
    c.fill();
    c.restore();
  }

  isDead() { return this.life <= 0; }
}

/* ═══════════════════════════════════════════════════════════
   CLASS: FallingHeart
   Trai tim roi xuong day khi click khoang trong (co trong luc)
   ═══════════════════════════════════════════════════════════ */
class FallingHeart {
  constructor(x, y) {
    this.x    = x;
    this.y    = y;
    this.size = 18 + Math.random() * 12;

    this.vx      = (Math.random() - 0.5) * 2;
    this.vy      = -2 + Math.random() * 1; // Bay len nhe truoc khi roi
    this.gravity = 0.15;

    this.life     = 1.0;
    this.hue      = 320 + Math.random() * 40;
    this.rotation = (Math.random() - 0.5) * 0.3;
    this.angle    = 0;
  }

  update() {
    this.x  += this.vx;
    this.vy += this.gravity; // Trong luc
    this.y  += this.vy;
    this.angle += this.rotation;
    this.vx *= 0.99;

    // Cham day man hinh thi mo dan va bien mat
    if (this.y >= H - 30) {
      this.y = H - 30;
      this.life -= 0.04;
    }
  }

  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.life);
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    c.fillStyle   = `hsla(${this.hue}, 90%, 70%, 1)`;
    c.shadowColor = `hsla(${this.hue}, 95%, 75%, 0.7)`;
    c.shadowBlur  = 15;
    drawHeart(c, 0, 0, this.size);
    c.fill();
    c.restore();
  }

  isDead() { return this.life <= 0; }
}
