// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Initialize Hero Section Animation
    initHeroAnimation();
    
    // Initialize WebGL Title Animations
    initWebGLTitleAnimations();
    
    // Initialize Content Section Animations
    initContentSectionAnimations();
});

function initHeroAnimation() {
    // Hero section fade out on scroll
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: '.scroll-spacer',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                // Apply a subtle parallax effect to the hero content
                gsap.to('.hero-content', {
                    y: self.progress * 100,
                    duration: 0.1
                });
            }
        },
        opacity: 0,
        ease: 'power2.inOut'
    });
    
    // Animate hero title, tagline, and logo on page load
    const heroTl = gsap.timeline();
    
    heroTl.from('.logo img', {
        rotate: 360,
        opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.7)'
    })
    .from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero-tagline', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-footer', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5');
}

function initWebGLTitleAnimations() {
    // First WebGL section
    gsap.to('.webgl-section:nth-of-type(1)', {
        scrollTrigger: {
            trigger: '.webgl-start',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        opacity: 1,
        ease: 'power2.inOut'
    });
    
    // Second WebGL section
    gsap.to('.webgl-section:nth-of-type(2)', {
        scrollTrigger: {
            trigger: '.scroll-spacer:nth-of-type(3)',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        opacity: 1,
        ease: 'power2.inOut'
    });
    
    // Fade out second WebGL section
    gsap.to('.webgl-section:nth-of-type(2)', {
        scrollTrigger: {
            trigger: '.webgl-end',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        opacity: 0,
        ease: 'power2.inOut'
    });
}

function initContentSectionAnimations() {
    // Animated logo in about section
    gsap.to('#about .animated-logo img', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        rotation: 360,
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        repeatDelay: 1
    });
    
    // About section fade in
    gsap.from('#about .section-header', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('#about .section-content p', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Principles section
    gsap.from('#principles .numbered-heading', {
        scrollTrigger: {
            trigger: '#principles',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('#principles p', {
        scrollTrigger: {
            trigger: '#principles',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Team section
    gsap.from('#team .section-title', {
        scrollTrigger: {
            trigger: '#team',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('#team .team-member', {
        scrollTrigger: {
            trigger: '#team',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('#team .supporters-title', {
        scrollTrigger: {
            trigger: '#team .supporters-title',
            start: 'top bottom',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('#team .supporters-list li', {
        scrollTrigger: {
            trigger: '#team .supporters-list',
            start: 'top bottom',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    // Portfolio section
    gsap.from('#portfolio .section-title', {
        scrollTrigger: {
            trigger: '#portfolio',
            start: 'top center',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('#portfolio .portfolio-item', {
        scrollTrigger: {
            trigger: '#portfolio .portfolio-grid',
            start: 'top bottom',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Get the target's position
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            // Animate scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add a canvas effect to simulate the WebGL background effect
const canvas = document.createElement('canvas');
canvas.classList.add('webgl-canvas');
document.body.appendChild(canvas);

// Position the canvas
Object.assign(canvas.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.5
});

const ctx = canvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Simple particle system to simulate the WebGL effect
const particles = [];
const particleCount = 100;

// Create particles
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        direction: Math.random() * Math.PI * 2,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Clear canvas
    ctx.fillStyle = 'rgba(20, 20, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    });
    
    // Draw connections between particles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Start animation
animate();
