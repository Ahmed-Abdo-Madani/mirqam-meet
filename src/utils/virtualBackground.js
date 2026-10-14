// Virtual background and visual effects processor using Canvas 2D
export class BackgroundProcessor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.animId = null;
    this.currentEffect = 'none';
    this.videoElement = null;
    this.customImage = null;
    this.processedStream = null;

    this.canvas.width = 1280;
    this.canvas.height = 720;
  }

  setEffect(effectType) {
    this.currentEffect = effectType;
  }

  start(videoElement) {
    this.videoElement = videoElement;
    this.stop();

    const drawFrame = () => {
      if (!this.videoElement || this.videoElement.paused || this.videoElement.ended) {
        this.animId = requestAnimationFrame(drawFrame);
        return;
      }

      const w = this.canvas.width;
      const h = this.canvas.height;
      const ctx = this.ctx;

      if (this.currentEffect === 'none') {
        ctx.filter = 'none';
        ctx.drawImage(this.videoElement, 0, 0, w, h);
      } else if (this.currentEffect === 'blur-light') {
        // Light blur simulation
        ctx.filter = 'blur(6px)';
        ctx.drawImage(this.videoElement, 0, 0, w, h);
        ctx.filter = 'none';
        // Draw centered sharper subject simulation with oval radial mask
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + 50, w * 0.28, h * 0.42, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(this.videoElement, 0, 0, w, h);
        ctx.restore();
      } else if (this.currentEffect === 'blur-heavy') {
        // Heavy blur simulation
        ctx.filter = 'blur(16px)';
        ctx.drawImage(this.videoElement, 0, 0, w, h);
        ctx.filter = 'none';
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + 50, w * 0.28, h * 0.42, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(this.videoElement, 0, 0, w, h);
        ctx.restore();
      } else if (this.currentEffect === 'office') {
        // Mirqam executive modern office background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#1c2f48');
        grad.addColorStop(0.5, '#223c56');
        grad.addColorStop(1, '#172740');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Architectural room elements & window
        ctx.fillStyle = 'rgba(35, 148, 154, 0.15)';
        ctx.fillRect(w * 0.1, h * 0.15, w * 0.35, h * 0.6);
        ctx.strokeStyle = 'rgba(201, 219, 223, 0.25)';
        ctx.lineWidth = 3;
        ctx.strokeRect(w * 0.1, h * 0.15, w * 0.35, h * 0.6);

        // Office desk line
        ctx.fillStyle = '#101d2d';
        ctx.fillRect(0, h * 0.78, w, h * 0.22);
        ctx.fillStyle = '#23949A';
        ctx.fillRect(0, h * 0.775, w, 4);

        // Draw subject in center
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + 50, w * 0.28, h * 0.42, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(this.videoElement, 0, 0, w, h);
        ctx.restore();
      } else if (this.currentEffect === 'abstract-teal') {
        // Mirqam Teal Abstract
        const grad = ctx.createRadialGradient(w * 0.8, h * 0.2, 50, w / 2, h / 2, w * 0.8);
        grad.addColorStop(0, '#23949A');
        grad.addColorStop(0.5, '#172740');
        grad.addColorStop(1, '#0E1A29');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Soft brand geometric accents
        ctx.strokeStyle = 'rgba(132, 214, 216, 0.12)';
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.05, h * 0.08, w * 0.9, h * 0.84);

        // Draw subject in foreground
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + 50, w * 0.28, h * 0.42, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(this.videoElement, 0, 0, w, h);
        ctx.restore();
      }

      this.animId = requestAnimationFrame(drawFrame);
    };

    this.animId = requestAnimationFrame(drawFrame);
    this.processedStream = this.canvas.captureStream(30);
    return this.processedStream;
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
