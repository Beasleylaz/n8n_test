class VoiceVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.bars = 128;
        this.barWidth = 2;
        this.barGap = 1;
        this.frequencies = new Array(this.bars).fill(0);
        this.phase = 0;
        
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
        this.phase += 0.03;

        for (let i = 0; i < this.bars; i++) {
            const baseFreq = i / this.bars;
            const wave1 = Math.sin(time * 2 + baseFreq * Math.PI * 2 + this.phase) * 0.5;
            const wave2 = Math.sin(time * 3 + baseFreq * Math.PI * 4) * 0.3;
            const wave3 = Math.sin(time * 5 + baseFreq * Math.PI * 6) * 0.2;
            
            this.frequencies[i] = Math.abs((wave1 + wave2 + wave3) + Math.random() * 0.05);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateFrequencies();
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#00f7ff');
        gradient.addColorStop(1, '#6c63ff');
        
        // Draw circular background
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 247, 255, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw bars in a circle
        for (let i = 0; i < this.bars; i++) {
            const angle = (i / this.bars) * Math.PI * 2;
            const height = this.frequencies[i] * radius * 0.5;
            
            const innerX = this.centerX + Math.cos(angle) * (radius - height);
            const innerY = this.centerY + Math.sin(angle) * (radius - height);
            const outerX = this.centerX + Math.cos(angle) * (radius + height);
            const outerY = this.centerY + Math.sin(angle) * (radius + height);
            
            this.ctx.beginPath();
            this.ctx.moveTo(innerX, innerY);
            this.ctx.lineTo(outerX, outerY);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = this.barWidth;
            this.ctx.shadowColor = '#00f7ff';
            this.ctx.shadowBlur = 10;
            this.ctx.stroke();
        }
        
        // Draw inner circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, radius * 0.6, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(108, 99, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoiceVisualizer('voice-visualizer');
}); 