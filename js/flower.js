/**
 * flower.js
 * ==========================================================
 * CLASS: FlowerSystem
 * Quan ly toan bo khu hoa: cac canh, than, la va animation
 * no ho theo 3 phase: growing -> blooming -> alive
 * ==========================================================
 */
'use strict';

class FlowerSystem {
  constructor() {
    this.reset();
  }

  /**
   * Dat lai toan bo trang thai hoa.
   * Goi lai moi khi man hinh resize de tinh lai vi tri.
   */
  reset() {
    // Danh sach cac bong hoa
    // [x]     : vi tri ngang (% chieu rong man hinh)
    // [baseY] : goc o day man hinh
    // [delay] : so frame cho truoc khi bat dau vươn
    // [scale] : ty le kich thuoc
    // [lean]  : do nghieng (am = trai, duong = phai)
    //
    // San pham THEM/XOA DONG de them/bot hoa
    this.flowers = [
      { x: W * 0.38, baseY: H, progress: 0, delay: 0,  scale: 1.0,  lean: -0.15 },
      { x: W * 0.50, baseY: H, progress: 0, delay: 30, scale: 1.2,  lean:  0.0  },
      { x: W * 0.62, baseY: H, progress: 0, delay: 15, scale: 0.9,  lean:  0.12 },
      { x: W * 0.44, baseY: H, progress: 0, delay: 45, scale: 0.75, lean: -0.1  },
    ];

    this.globalFrame   = 0;
    this.phase         = 'growing'; // 'growing' | 'blooming' | 'alive'
    this.bloomProgress = 0;
  }

  /* ─────────────────────────────────────────────
     VE MOT CONG HOA DON (THAN + LA + DAU HOA)
     ───────────────────────────────────────────── */
  drawStem(flower) {
    const p = flower.progress; // 0 -> 1
    if (p <= 0) return;

    const stemHeight  = H * 0.52 * flower.scale;
    const topX        = flower.x + Math.sin(flower.lean) * stemHeight;
    const topY        = flower.baseY - stemHeight;

    // Diem ngon hien tai (animation tu duoi len)
    const currentTopX = flower.x + (topX - flower.x) * p;
    const currentTopY = flower.baseY + (topY - flower.baseY) * p;

    // -- Than cay (gradient xanh) --
    const stemGrad = ctx.createLinearGradient(flower.x, flower.baseY, currentTopX, currentTopY);
    stemGrad.addColorStop(0, CONFIG.STEM_COLOR_BOTTOM);
    stemGrad.addColorStop(1, CONFIG.STEM_COLOR_TOP);

    ctx.save();
    ctx.strokeStyle = stemGrad;
    ctx.lineWidth   = 4 * flower.scale;
    ctx.lineCap     = 'round';
    ctx.shadowColor = 'rgba(100, 220, 150, 0.3)';
    ctx.shadowBlur  = 8;

    // Duong cong nhe cho than hoa (Bezier bac 2)
    ctx.beginPath();
    ctx.moveTo(flower.x, flower.baseY);
    ctx.quadraticCurveTo(
      flower.x + (flower.lean * stemHeight * 0.5),
      flower.baseY - stemHeight * 0.5 * p,
      currentTopX, currentTopY
    );
    ctx.stroke();

    // -- La cay ben phai (xuat hien khi progress > 30%) --
    if (p > 0.3) {
      const leafProgress = Math.min(1, (p - 0.3) / 0.5);
      this.drawLeaf(
        flower.x + (flower.lean * stemHeight * 0.3),
        flower.baseY - stemHeight * 0.35,
        leafProgress * flower.scale,
        1 // huong phai
      );
    }

    // -- La cay ben trai (xuat hien khi progress > 50%) --
    if (p > 0.5) {
      const leafProgress = Math.min(1, (p - 0.5) / 0.5);
      this.drawLeaf(
        flower.x + (flower.lean * stemHeight * 0.5),
        flower.baseY - stemHeight * 0.55,
        leafProgress * flower.scale,
        -1 // huong trai
      );
    }
    ctx.restore();

    // -- Dau hoa (chi ve khi gan hoan thanh) --
    if (p >= 0.95) {
      this.drawFlowerHead(currentTopX, currentTopY, flower.scale, this.bloomProgress);
    }
  }

  /* ─────────────────────────────────────────────
     VE LA CAY (hinh elip gradient xanh)
     @param {number} x, y     - vi tri goc la
     @param {number} size     - ty le kich thuoc la
     @param {number} direction- 1 = phai, -1 = trai
     ───────────────────────────────────────────── */
  drawLeaf(x, y, size, direction) {
    const leafW = 25 * size;
    const leafH = 12 * size;
    ctx.save();
    ctx.translate(x, y);

    const leafGrad = ctx.createLinearGradient(-leafW * direction, 0, leafW * direction, 0);
    leafGrad.addColorStop(0,   '#4de89a');
    leafGrad.addColorStop(0.5, '#3ecf80');
    leafGrad.addColorStop(1,   'rgba(60, 180, 100, 0.1)');

    ctx.fillStyle   = leafGrad;
    ctx.shadowColor = 'rgba(80, 220, 130, 0.4)';
    ctx.shadowBlur  = 6;

    ctx.beginPath();
    ctx.ellipse(leafW * 0.5 * direction, 0, leafW, leafH, 0.2 * direction, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ─────────────────────────────────────────────
     VE DAU HOA NO (CANH + NHUY)
     @param {number} x, y   - tam hoa
     @param {number} scale  - ty le kich thuoc
     @param {number} bloomP - tien trinh no (0->1)
     ───────────────────────────────────────────── */
  drawFlowerHead(x, y, scale, bloomP) {
    if (bloomP <= 0) return;

    const petalCount  = CONFIG.FLOWER_PETAL_COUNT;
    const petalLength = 22 * scale * bloomP;
    const petalWidth  = 12 * scale * bloomP;

    ctx.save();
    ctx.translate(x, y);

    // -- Canh hoa (ve tung canh xoay deu) --
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);

      const petalGrad = ctx.createLinearGradient(0, 0, 0, -petalLength);
      petalGrad.addColorStop(0,   'rgba(255, 200, 230, 0.9)');
      petalGrad.addColorStop(0.5, CONFIG.FLOWER_PETAL_COLOR);
      petalGrad.addColorStop(1,   'rgba(255, 130, 190, 0.6)');

      ctx.fillStyle   = petalGrad;
      ctx.shadowColor = 'rgba(255, 150, 200, 0.6)';
      ctx.shadowBlur  = 12;

      ctx.beginPath();
      ctx.ellipse(0, -petalLength * 0.55, petalWidth * 0.5, petalLength * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // -- Nhuy hoa (tam vang) --
    const centerR    = 7 * scale * bloomP;
    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerR);
    centerGrad.addColorStop(0,   '#fff176');
    centerGrad.addColorStop(0.5, '#ffd54f');
    centerGrad.addColorStop(1,   '#ffb300');

    ctx.fillStyle   = centerGrad;
    ctx.shadowColor = 'rgba(255, 220, 50, 0.8)';
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    ctx.arc(0, 0, centerR, 0, Math.PI * 2);
    ctx.fill();

    // -- Cham nhuy nho xung quanh --
    ctx.fillStyle  = 'rgba(255, 255, 100, 0.7)';
    ctx.shadowBlur = 4;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = centerR * 0.6;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* ─────────────────────────────────────────────
     UPDATE - Goi moi frame trong game loop
     ───────────────────────────────────────────── */
  update() {
    this.globalFrame++;

    // Cap nhat tien trinh vuon cay cua moi hoa
    this.flowers.forEach(flower => {
      if (this.globalFrame > flower.delay) {
        // San pham CHINH TOC DO VUON: tang de nhanh hon
        flower.progress = Math.min(1, flower.progress + CONFIG.FLOWER_GROW_SPEED);
      }
    });

    // Chuyen sang phase 'blooming' khi tat ca hoa da vuon xong
    const allGrown = this.flowers.every(f => f.progress >= 0.95);
    if (allGrown && this.phase === 'growing') {
      this.phase = 'blooming';
    }

    // Hoa dan no khi dang trong phase 'blooming'
    if (this.phase === 'blooming') {
      // San pham CHINH TOC DO NO HOA: tang de nhanh hon
      this.bloomProgress = Math.min(1, this.bloomProgress + CONFIG.FLOWER_BLOOM_SPEED);
      if (this.bloomProgress >= 1) this.phase = 'alive';
    }

    // Lay dong nhe khi hoa da no
    if (this.phase === 'alive') {
      this.flowers.forEach((flower, i) => {
        flower.lean += Math.sin(this.globalFrame * 0.015 + i * 1.2) * 0.0003;
        // Gioi han goc nghieng (-0.25 <-> 0.25 radian)
        flower.lean  = Math.max(-0.25, Math.min(0.25, flower.lean));
      });
    }
  }

  /* ─────────────────────────────────────────────
     DRAW - Ve tat ca bong hoa len canvas
     ───────────────────────────────────────────── */
  draw() {
    this.flowers.forEach(flower => this.drawStem(flower));
  }
}
