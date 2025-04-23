(function () {
  'use strict';

  // Check if the quantum visualizer feature is enabled
  if (
    !window.voidBloom ||
    !window.voidBloom.config ||
    !window.voidBloom.config.features.quantumVisualizer
  ) {
    console.log('Quantum Visualizer is disabled in configuration');
    return;
  }

  class QuantumVisualizer {
    constructor() {
      this.container = document.createElement('div');
      this.container.className = 'quantum-visualizer';
      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);
      document.body.appendChild(this.container);

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.maxParticles = 100;
      this.traumaProfile = document.body.getAttribute('data-trauma-profile') || 'void';
      this.memoryPhase = document.body.getAttribute('data-memory-phase') || 'alpha';

      this.resizeCanvas();
      this.initParticles();
      this.bindEvents();
      this.animate();
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    initParticles() {
      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2 + 1,
          color: this.getParticleColor(),
          speedX: Math.random() * 3 - 1.5,
          speedY: Math.random() * 3 - 1.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    getParticleColor() {
      // Different colors based on trauma profile
      const colors = {
        void: 'rgba(110, 12, 247, 0.7)',
        glitch: 'rgba(0, 255, 157, 0.7)',
        quantum: 'rgba(255, 50, 50, 0.7)',
        memory: 'rgba(255, 215, 0, 0.7)',
      };

      return colors[this.traumaProfile] || colors.void;
    }

    bindEvents() {
      window.addEventListener('resize', () => this.resizeCanvas());

      // Update visualizer when trauma profile changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === 'data-trauma-profile' ||
            mutation.attributeName === 'data-memory-phase'
          ) {
            this.traumaProfile = document.body.getAttribute('data-trauma-profile') || 'void';
            this.memoryPhase = document.body.getAttribute('data-memory-phase') || 'alpha';

            // Update particle colors
            this.particles.forEach((particle) => {
              particle.color = this.getParticleColor();
            });
          }
        });
      });

      observer.observe(document.body, { attributes: true });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw and update particles
      this.particles.forEach((particle) => {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();

        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.phase += 0.01;

        // Apply sinusoidal movement based on memory phase
        if (this.memoryPhase === 'beta') {
          particle.x += Math.sin(particle.phase) * 0.5;
        } else if (this.memoryPhase === 'gamma') {
          particle.y += Math.cos(particle.phase) * 0.5;
        } else if (this.memoryPhase === 'omega') {
          particle.x += Math.sin(particle.phase) * 0.5;
          particle.y += Math.cos(particle.phase) * 0.5;
        }

        // Boundary checking
        if (particle.x < 0 || particle.x > this.canvas.width) {
          particle.speedX *= -1;
        }

        if (particle.y < 0 || particle.y > this.canvas.height) {
          particle.speedY *= -1;
        }
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize the quantum visualizer once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if element with class 'quantum-ready' exists
    if (document.querySelector('.quantum-ready')) {
      new QuantumVisualizer();
    }
  });
})();
