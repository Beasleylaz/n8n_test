class VoiceVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.bars = 64;
        this.barWidth = 3;
        this.barGap = 1;
        this.frequencies = new Array(this.bars).fill(0);
        this.phase = 0;
        this.animationFrame = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    updateFrequencies() {
        const time = Date.now() * 0.001;
        this.phase += 0.05;

        for (let i = 0; i < this.bars; i++) {
            // Create a complex waveform using multiple sine waves
            const baseFreq = i / this.bars;
            const wave1 = Math.sin(time * 2 + baseFreq * Math.PI * 2 + this.phase) * 0.5;
            const wave2 = Math.sin(time * 3 + baseFreq * Math.PI * 4) * 0.3;
            const wave3 = Math.sin(time * 5 + baseFreq * Math.PI * 6) * 0.2;
            
            // Combine waves and add some randomness
            this.frequencies[i] = Math.abs((wave1 + wave2 + wave3) + Math.random() * 0.1);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update frequencies
        this.updateFrequencies();
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, this.centerY - 100, 0, this.centerY + 100);
        gradient.addColorStop(0, '#00f7ff');
        gradient.addColorStop(1, '#6c63ff');
        
        // Draw bars
        const totalWidth = this.bars * (this.barWidth + this.barGap);
        const startX = this.centerX - totalWidth / 2;
        
        for (let i = 0; i < this.bars; i++) {
            const height = this.frequencies[i] * 100;
            const x = startX + i * (this.barWidth + this.barGap);
            
            // Draw bar
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = '#00f7ff';
            this.ctx.shadowBlur = 15;
            this.ctx.fillRect(x, this.centerY - height / 2, this.barWidth, height);
        }
        
        // Draw outer circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 120, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 247, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw inner circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 80, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(108, 99, 255, 0.2)';
        this.ctx.stroke();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoiceVisualizer('voice-visualizer');
}); 