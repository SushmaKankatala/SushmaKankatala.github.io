// Enhanced interactive effects for the portfolio

// Mouse trail effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 10;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
        this.animate();
    }

    addTrailPoint(x, y) {
        this.trail.push({ x, y, life: 1 });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    animate() {
        // Clear previous trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());

        this.trail.forEach((point, index) => {
            const element = document.createElement('div');
            element.className = 'mouse-trail';
            element.style.cssText = `
                position: fixed;
                pointer-events: none;
                width: ${10 - index}px;
                height: ${10 - index}px;
                background: radial-gradient(circle, rgba(37, 99, 235, ${point.life}), transparent);
                border-radius: 50%;
                left: ${point.x - (10 - index) / 2}px;
                top: ${point.y - (10 - index) / 2}px;
                z-index: 9999;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(element);

            // Fade out
            point.life -= 0.1;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Parallax scrolling effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.floating-icon');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;

            this.elements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Magnetic button effect
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
}

// Skill icon interaction
class SkillIconInteraction {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.init();
    }

    init() {
        this.skillItems.forEach(item => {
            item.addEventListener('click', () => {
                this.createBurst(item);
            });
        });
    }

    createBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100;

            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #2563eb;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${centerX}px;
                top: ${centerY}px;
                animation: burst 0.8s ease-out forwards;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes burst {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
                style.remove();
            }, 800);
        }
    }
}

// Text scramble effect
class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.getRandomChar();
                    this.queue[i].char = char;
                }
                output += `<span style="color:#2563eb">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.element.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    getRandomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Floating animation for random elements
class FloatingElements {
    constructor() {
        this.createFloatingShapes();
    }

    createFloatingShapes() {
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            shape.className = `floating-shape floating-${shapeType}`;
            shape.style.cssText = `
                position: fixed;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: ${color};
                opacity: 0.1;
                pointer-events: none;
                z-index: -1;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatRandom ${Math.random() * 10 + 5}s linear infinite;
            `;

            if (shapeType === 'circle') {
                shape.style.borderRadius = '50%';
            } else if (shapeType === 'triangle') {
                shape.style.width = '0';
                shape.style.height = '0';
                shape.style.borderLeft = '10px solid transparent';
                shape.style.borderRight = '10px solid transparent';
                shape.style.borderBottom = `20px solid ${color}`;
                shape.style.background = 'transparent';
            }

            document.body.appendChild(shape);
        }

        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatRandom {
                0% { transform: translateY(100vh) rotate(0deg); }
                100% { transform: translateY(-100px) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MouseTrail();
    new ParallaxEffect();
    new MagneticButtons();
    new SkillIconInteraction();
    new FloatingElements();

    // Add text scramble effect to hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const fx = new TextScramble(heroTitle);
        setTimeout(() => {
            fx.setText('Sushma Kankatala');
        }, 1000);
    }
});

// Easter egg: Konami code
(function() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.style.filter = 'hue-rotate(180deg)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
})();
