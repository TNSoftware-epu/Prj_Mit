/**
 * audio.js
 * ==========================================================
 * Tich hop YouTube Iframe API
 * - Khoi tao player an
 * - Tu dong phat va lap lai
 * - Ket noi volume slider voi API setVolume()
 *
 * San pham THAY DOI NHAC: doi YOUTUBE_VIDEO_ID trong config.js
 * ==========================================================
 */
'use strict';

let ytPlayer = null;
let ytReady  = false;

/**
 * Ham nay duoc YouTube Iframe API tu dong goi
 * khi thu vien da tai xong (khong can goi thu cong).
 */
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('youtube-player', {
    height: '1',
    width:  '1',
    videoId: CONFIG.YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay:       1,
      loop:           1,
      playlist:       CONFIG.YOUTUBE_VIDEO_ID, // Can thiet de loop hoat dong
      controls:       0,
      showinfo:       0,
      modestbranding: 1,
      iv_load_policy: 3,
      rel:            0,
      origin: window.location.origin || 'http://localhost',
    },
    events: {
      onReady: (event) => {
        ytReady = true;
        event.target.setVolume(CONFIG.DEFAULT_VOLUME);
        event.target.playVideo();
      },
      onStateChange: (event) => {
        // Dam bao nhac luon phat neu bi dung dot ngot
        if (event.data === YT.PlayerState.ENDED) {
          event.target.playVideo();
        }
      },
    },
  });
};

/**
 * Ket noi thanh slider am luong voi YouTube API.
 * Duoc goi sau khi DOM da san sang.
 */
function initVolumeSlider() {
  const slider = document.getElementById('volumeSlider');

  slider.addEventListener('input', function () {
    const vol = parseInt(this.value);

    // Dieu chinh am luong YouTube
    if (ytReady && ytPlayer) {
      ytPlayer.setVolume(vol);
    }

    // Cap nhat mau gradient cua slider tuong ung voi gia tri
    const pct = vol + '%';
    this.style.background =
      `linear-gradient(to right, #ff6eb4 0%, #ff6eb4 ${pct}, rgba(255,255,255,0.2) ${pct})`;
  });
}

/**
 * Phat nhac (goi khi nguoi dung click vao overlay).
 * An toan: khong lam gi neu player chua san sang.
 */
function playMusic() {
  if (ytReady && ytPlayer) {
    ytPlayer.playVideo();
    const slider = document.getElementById('volumeSlider');
    ytPlayer.setVolume(parseInt(slider.value));
  }
}
