class VoiceVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.bars = 32;
        this.barWidth = 4;
        this.barGap = 2;
        this.barHeight = 0;
        this.maxBarHeight = 100;
        this.animationFrame = null;
        this.isActive = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    start() {
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#00f7ff');
        gradient.addColorStop(1, '#6c63ff');
        
        // Draw bars
        for (let i = 0; i < this.bars; i++) {
            const x = this.centerX - (this.bars * (this.barWidth + this.barGap)) / 2 + i * (this.barWidth + this.barGap);
            const height = Math.sin(Date.now() * 0.01 + i * 0.2) * this.maxBarHeight * 0.5 + this.maxBarHeight * 0.5;
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.centerY - height / 2, this.barWidth, height);
            
            // Add glow effect
            this.ctx.shadowColor = '#00f7ff';
            this.ctx.shadowBlur = 10;
        }

        // Draw circular background
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 120, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 247, 255, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Initialize visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new VoiceVisualizer('voice-visualizer');
    
    // Start visualization when conversation starts
    document.querySelector('elevenlabs-convai').addEventListener('conversationStarted', () => {
        visualizer.start();
    });

    // Stop visualization when conversation ends
    document.querySelector('elevenlabs-convai').addEventListener('conversationEnded', () => {
        visualizer.stop();
    });
}); 