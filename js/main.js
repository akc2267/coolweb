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
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
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

// Create rainbow tunnel with shader rings
function createRainbowTunnel() {
    const ringCount = 25;
    const colorOffsetStep = 1.0 / ringCount;
    
    for (let i = 0; i < ringCount; i++) {
        // Create ring geometry - larger at the start, smaller toward the end
        const radius = 10 - i * 0.2;
        const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2);
        
        // Create uniform values for this ring
        const ringUniforms = {
            uTime: { value: 0 },
            uColorOffset: { value: i * colorOffsetStep }
        };
        
        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader: ringVertexShader,
            fragmentShader: ringFragmentShader,
            uniforms: ringUniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        
        // Create mesh and position it
        const ring = new THREE.Mesh(geometry, material);
        ring.position.z = -i * 1.2;
        
        // Add subtle initial rotation
        ring.rotation.z = Math.random() * Math.PI * 2;
        
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
    
    // Smooth camera movement
    currentCameraPosition.x += (targetCameraPosition.x - currentCameraPosition.x) * 0.05;
    currentCameraPosition.y += (targetCameraPosition.y - currentCameraPosition.y) * 0.05;
    currentCameraPosition.z += (targetCameraPosition.z - currentCameraPosition.z) * 0.05;
    
    camera.position.set(currentCameraPosition.x, currentCameraPosition.y, currentCameraPosition.z);
    
    renderer.render(scene, camera);
}

// Set up scroll triggers
function setupScrollTriggers() {
    // Main scroll progress tracker for camera movement
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });
    
    // Camera movement sequence
    tl.to(targetCameraPosition, {
        z: 5, // Move slightly into the tunnel
        duration: 10
    })
    .to(targetCameraPosition, {
        z: -5, // Move deeper into the tunnel for "You jump" text
        duration: 10
    })
    .to(targetCameraPosition, {
        z: -15, // Move to the black hole area for "We jump" text
        duration: 10
    })
    .to(targetCameraPosition, {
        z: -25, // Move through the black hole
        duration: 10
    });
    
    // Text animations
    ScrollTrigger.create({
        trigger: "#jump",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to("#jump", { opacity: 1, duration: 1 });
        },
        onLeave: () => {
            gsap.to("#jump", { opacity: 0, duration: 1 });
        },
        onEnterBack: () => {
            gsap.to("#jump", { opacity: 1, duration: 1 });
        },
        onLeaveBack: () => {
            gsap.to("#jump", { opacity: 0, duration: 1 });
        }
    });
    
    ScrollTrigger.create({
        trigger: "#jump2",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to("#jump2", { opacity: 1, duration: 1 });
            
            // Start showing black hole
            gsap.to(blackHoleUniforms.uIntensity, {
                value: 0.9,
                duration: 2
            });
        },
        onLeave: () => {
            gsap.to("#jump2", { opacity: 0, duration: 1 });
        },
        onEnterBack: () => {
            gsap.to("#jump2", { opacity: 1, duration: 1 });
        },
        onLeaveBack: () => {
            gsap.to("#jump2", { opacity: 0, duration: 1 });
        }
    });
    
    // Black hole expansion and transition to content
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 80%",
        onEnter: () => {
            // Expand black hole
            gsap.to(blackHoleUniforms.uRadius, {
                value: 0.8,
                duration: 2
            });
            
            // Move black hole forward
            gsap.to(blackHole.position, {
                z: -15,
                duration: 2
            });
            
            // Increase black hole intensity
            gsap.to(blackHoleUniforms.uIntensity, {
                value: 1.0,
                duration: 1
            });
            
            // Fade out all rings
            rings.forEach(ring => {
                gsap.to(ring.material, {
                    opacity: 0,
                    duration: 1.5
                });
            });
        }
    });
    
    // Intro content animation
    gsap.from(".intro-content h1", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5
    });
    
    gsap.from(".footer", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1
    });
    
    // Content section animations
    const contentSections = [".about-section", "#principles", "#team", "#portfolio"];
    
    contentSections.forEach(section => {
        gsap.from(`${section} h2, ${section} h3, ${section} p, ${section} .number`, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: section,
                start: "top 80%"
            }
        });
    });
}

// Add mouse interaction for tilt effect
function addMouseTiltEffect() {
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Subtle camera tilt based on mouse position
        gsap.to(camera.rotation, {
            x: mouseY * 0.05,
            y: mouseX * 0.05,
            duration: 1
        });
    });
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
