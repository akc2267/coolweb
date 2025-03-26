// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Three.js Scene Setup
let scene, camera, renderer;
let rings = [];
let blackHole;
let targetCameraPosition = { x: 0, y: 0, z: 15 };
let currentCameraPosition = { x: 0, y: 0, z: 15 };
let clock;
let uniforms = {};
let blackHoleUniforms = {};

// Initialize the 3D scene
function init() {
    // Create a clock for shader animations
    clock = new THREE.Clock();
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: false // Changed to false to prevent artifacts
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x111111, 0); // Changed from 0x000000 to 0x111111 to match the body background
    document.getElementById('webgl-container').appendChild(renderer.domElement);
    
    // Create rainbow tunnel
    createRainbowTunnel();
    
    // Create black hole
    createBlackHole();
    
    // Set up resize handler
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
    
    // Set up scroll triggers
    setupScrollTriggers();
}

// Create rainbow tunnel with shader rings - more rings and rainbow colors
function createRainbowTunnel() {
    const ringCount = 40; // Increased to 40 for maximum effect
    const colorOffsetStep = 1.0 / ringCount;
    
    // Pre-defined vibrant rainbow colors to ensure visibility
    const rainbowColors = [
        new THREE.Color(1.0, 0.0, 0.0), // Red
        new THREE.Color(1.0, 0.5, 0.0), // Orange
        new THREE.Color(1.0, 1.0, 0.0), // Yellow
        new THREE.Color(0.0, 1.0, 0.0), // Green
        new THREE.Color(0.0, 1.0, 1.0), // Cyan
        new THREE.Color(0.0, 0.0, 1.0), // Blue
        new THREE.Color(0.8, 0.0, 1.0)  // Purple
    ];
    
    for (let i = 0; i < ringCount; i++) {
        // Create ring geometry - larger at the start, smaller toward the end
        const radius = 12 - i * 0.18; // Larger radius and smaller reduction for better visibility
        const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2);
        
        // Create uniform values for this ring
        const ringUniforms = {
            uTime: { value: 0 },
            uColorOffset: { value: i * colorOffsetStep }
        };
        
        // Create shader material with improved opacity for better visibility
        const material = new THREE.ShaderMaterial({
            vertexShader: ringVertexShader,
            fragmentShader: ringFragmentShader,
            uniforms: ringUniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            opacity: 1.0, // Maximum opacity for better visibility
            blending: THREE.AdditiveBlending // Use additive blending for more vibrant colors
        });
        
        // Create mesh and position it with closer spacing
        const ring = new THREE.Mesh(geometry, material);
        ring.position.z = -i * 0.9; // Reduced spacing from 1.2 to 0.9 for denser tunnel
        
        // Add subtle initial rotation
        ring.rotation.z = Math.random() * Math.PI * 2;
        // Add some X/Y variation for more organic feel
        ring.position.x = (Math.random() - 0.5) * 0.5;
        ring.position.y = (Math.random() - 0.5) * 0.5;
        
        // Store uniform reference for animation
        ring.userData.uniforms = ringUniforms;
        
        // Add to scene and rings array
        scene.add(ring);
        rings.push(ring);
    }
}

// Create black hole with shader
function createBlackHole() {
    // Create geometry
    const geometry = new THREE.PlaneGeometry(30, 30);
    
    // Create uniform values for black hole
    blackHoleUniforms = {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uRadius: { value: 0.4 }
    };
    
    // Create shader material
    const material = new THREE.ShaderMaterial({
        vertexShader: blackHoleVertexShader,
        fragmentShader: blackHoleFragmentShader,
        uniforms: blackHoleUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    
    // Create mesh and position it
    blackHole = new THREE.Mesh(geometry, material);
    blackHole.position.z = -20;
    
    // Add to scene
    scene.add(blackHole);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update time for shaders
    const elapsedTime = clock.getElapsedTime();
    
    // Update uniforms for all rings
    rings.forEach((ring, index) => {
        ring.userData.uniforms.uTime.value = elapsedTime;
        
        // Add subtle rotation
        ring.rotation.z += 0.001 * (index % 2 === 0 ? 1 : -1);
    });
    
    // Update black hole uniforms
    blackHoleUniforms.uTime.value = elapsedTime;
    
    // Check if we need to reset the black hole intensity when near the top
    if (window.scrollY < 50) {
        blackHoleUniforms.uIntensity.value = 0;
    }
    
    // Smooth camera movement
    currentCameraPosition.x += (targetCameraPosition.x - currentCameraPosition.x) * 0.05;
    currentCameraPosition.y += (targetCameraPosition.y - currentCameraPosition.y) * 0.05;
    currentCameraPosition.z += (targetCameraPosition.z - currentCameraPosition.z) * 0.05;
    
    camera.position.set(currentCameraPosition.x, currentCameraPosition.y, currentCameraPosition.z);
    
    renderer.render(scene, camera);
}

// Clean up function to reset the renderer and prevent artifacts
function cleanupRenderer() {
    renderer.clear();
    
    // Reset black hole if it's causing issues when scrolling back up
    if (blackHole && blackHoleUniforms) {
        blackHoleUniforms.uIntensity.value = 0;
    }
}

// Set up scroll triggers
function setupScrollTriggers() {
    // Main scroll progress tracker for camera movement
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            ease: "power2.inOut"
        }
    });
    
    // Camera movement sequence
    tl.to(targetCameraPosition, {
        z: 8, // Start with a small zoom out effect
        duration: 5
    })
    .to(targetCameraPosition, {
        z: 5, // Then zoom in slightly into the tunnel
        duration: 8
    })
    .to(targetCameraPosition, {
        z: -5, // Move deeper into the tunnel for "You jump" text
        y: 1, // Add subtle vertical movement
        x: 0.5, // Add subtle horizontal movement
        duration: 10
    })
    .to(targetCameraPosition, {
        z: -15, // Move to the black hole area for "We jump" text
        y: -1, // Continue the subtle movements for added dynamism
        x: -0.5,
        duration: 10
    })
    .to(targetCameraPosition, {
        z: -25, // Move through the black hole
        y: 0, // Return to center
        x: 0,
        duration: 12
    });
    
    // Text animations with enhanced effects
    ScrollTrigger.create({
        trigger: "#jump",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to("#jump", { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" });
        },
        onLeave: () => {
            gsap.to("#jump", { opacity: 0, y: -30, duration: 0.8, ease: "power2.in" });
        },
        onEnterBack: () => {
            gsap.to("#jump", { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" });
        },
        onLeaveBack: () => {
            gsap.to("#jump", { opacity: 0, y: 30, duration: 0.8, ease: "power2.in" });
        }
    });
    
    // Initial state for jump section
    gsap.set("#jump", { opacity: 0, y: 30, scale: 0.95 });
    
    ScrollTrigger.create({
        trigger: "#jump2",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to("#jump2", { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" });
            
            // Start showing black hole with a more dramatic effect
            gsap.to(blackHoleUniforms.uIntensity, {
                value: 0.9,
                duration: 2.5,
                ease: "power3.inOut"
            });
            
            // Add a subtle camera shake effect
            gsap.to(camera.rotation, {
                x: "-=0.03",
                y: "+=0.03",
                z: "-=0.01",
                duration: 0.5,
                repeat: 3,
                yoyo: true,
                ease: "power1.inOut"
            });
        },
        onLeave: () => {
            gsap.to("#jump2", { opacity: 0, y: -40, scale: 0.9, duration: 0.8, ease: "back.in(1.5)" });
        },
        onEnterBack: () => {
            gsap.to("#jump2", { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" });
        },
        onLeaveBack: () => {
            gsap.to("#jump2", { opacity: 0, y: 40, scale: 0.9, duration: 0.8, ease: "back.in(1.5)" });
        }
    });
    
    // Initial state for jump2 section
    gsap.set("#jump2", { opacity: 0, y: 40, scale: 0.9 });
    
    // Enhanced black hole expansion and transition to content
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 80%",
        onEnter: () => {
            // Create a timeline for coordinated transition
            const transitionTl = gsap.timeline();
            
            // Expand black hole
            transitionTl.to(blackHoleUniforms.uRadius, {
                value: 0.8,
                duration: 2.5,
                ease: "elastic.out(1, 0.7)"
            }, 0);
            
            // Move black hole forward
            transitionTl.to(blackHole.position, {
                z: -15,
                duration: 2,
                ease: "power2.inOut"
            }, 0);
            
            // Add rotation to black hole
            transitionTl.to(blackHole.rotation, {
                z: Math.PI * 2,
                duration: 4,
                ease: "power1.inOut"
            }, 0);
            
            // Increase black hole intensity
            transitionTl.to(blackHoleUniforms.uIntensity, {
                value: 1.0,
                duration: 1.5,
                ease: "power2.inOut"
            }, 0.5);
            
            // Fade out all rings with staggered timing
            rings.forEach((ring, index) => {
                transitionTl.to(ring.material, {
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, 0.5 + index * 0.02); // Staggered timing
            });
            
            // Add camera motion during transition
            transitionTl.to(camera.rotation, {
                x: 0.1,
                y: -0.1,
                duration: 2,
                ease: "power1.inOut",
                yoyo: true
            }, 0);
        }
    });
    
    // Add scroll direction detection to trigger cleanup
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            // If scrolling back up to the top, run cleanup
            if (self.direction === -1 && self.progress < 0.1) {
                cleanupRenderer();
            }
        }
    });
    
    // Enhanced intro content animation
    const introTl = gsap.timeline({
        delay: 0.5
    });
    
    introTl.from(".intro-content h1", {
        y: 70,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    })
    .from(".tagline", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.7")
    .from(".footer", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");
    
    // Add subtle animation to the heading
    gsap.to(".intro-content h1", {
        y: -10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Enhanced content section animations
    const contentSections = [".about-section", "#principles", "#team", "#portfolio"];
    
    contentSections.forEach(section => {
        // Create a timeline for each section
        let sectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "center center",
                toggleActions: "play none none reverse"
            }
        });
        
        // Animate heading first
        sectionTl.from(`${section} h2`, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
        
        // Then animate the rest with staggered timing
        sectionTl.from(`${section} .number, ${section} h3, ${section} p`, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=0.4");
        
        // Add subtle scroll-based parallax on section elements
        if (section !== ".about-section") { // Skip for about section which has different layout
            ScrollTrigger.create({
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    const elements = document.querySelectorAll(`${section} .section-item`);
                    elements.forEach((el, i) => {
                        gsap.to(el, {
                            y: (i % 2 === 0) ? self.progress * -30 : self.progress * -20,
                            duration: 0
                        });
                    });
                }
            });
        }
    });
}

// Enhanced mouse interaction for tilt effect
function addMouseTiltEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Create smoother animation with requestAnimationFrame
    function updateMouseTilt() {
        // Smoothly interpolate mouse position for more fluid motion
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Apply to camera rotation
        camera.rotation.x = mouseY * 0.07;
        camera.rotation.y = mouseX * 0.07;
        
        // Also influence the rings slightly
        rings.forEach((ring, index) => {
            const depth = index / rings.length; // 0 to 1 based on depth
            const strengthFactor = 1 - depth * 0.7; // Rings closer to camera move more
            
            ring.rotation.x = mouseY * 0.02 * strengthFactor;
            ring.rotation.y = mouseX * 0.02 * strengthFactor;
        });
        
        requestAnimationFrame(updateMouseTilt);
    }
    
    // Start the animation loop
    updateMouseTilt();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize when document is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Start loading the scene
    init();
    addMouseTiltEffect();
    
    // Hide preloader after a slight delay to ensure WebGL is ready
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        
        // Add entrance animation for the content
        gsap.from('.logo, .nav', {
            y: -50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            delay: 0.5
        });
    }, 1000);
});
