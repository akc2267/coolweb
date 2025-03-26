// Vertex shader for rainbow rings
const ringVertexShader = `
varying vec2 vUv;
varying float vDepth;

void main() {
    vUv = uv;
    
    // Calculate depth for color variations - increased for more pronounced color effect
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vDepth = -modelPosition.z * 0.15; // Increased from 0.05 to 0.15 for stronger color variation by depth
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader for rainbow rings
const ringFragmentShader = `
varying vec2 vUv;
varying float vDepth;
uniform float uTime;
uniform float uColorOffset;

// Function to convert HSL to RGB with dramatically enhanced colors
vec3 hsl2rgb(vec3 c) {
    // Dramatically increase saturation and lightness for maximum vibrancy
    c.y = 1.0; // Maximum saturation
    c.z = 0.9; // Very high lightness for bright colors
    
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    vec3 color = c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    
    // Boost color intensity even further
    return color * 1.8; // Multiply by 1.8 for extremely bright colors
}

void main() {
    // Calculate distance from center for the ring effect
    float dist = length(vUv - vec2(0.5, 0.5)) * 2.0;
    
    // Create wider rings with softer edges
    float ring = smoothstep(0.85, 1.0, dist) - smoothstep(0.65, 0.85, dist);
    
    // Add more pronounced wave motion
    float wave = sin(dist * 30.0 - uTime * 0.7) * 0.15;
    ring += wave * 0.2;
    
    // Rainbow color based on depth and time with maximum vibrancy
    float hue = vDepth * 3.0 + uColorOffset + uTime * 0.08; // Increased color variation
    vec3 color = hsl2rgb(vec3(hue, 1.0, 0.9)); // Maximum saturation and lightness
    
    // Create edge highlights for depth
    float edgeHighlight = smoothstep(0.8, 0.9, dist) * 0.5;
    color += edgeHighlight;
    
    // Maximum alpha for best visibility
    float alpha = min(ring * 2.0, 1.0); // Dramatically increased from 1.4 to 2.0
    
    // Output final color with maximum brightness
    gl_FragColor = vec4(color * 2.0, alpha); // Multiply color by 2.0 for maximum brightness
}
`;

// Vertex shader for the black hole
const blackHoleVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader for the black hole
const blackHoleFragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uIntensity;
uniform float uRadius;

void main() {
    // Distance from center
    float dist = length(vUv - vec2(0.5, 0.5));
    
    // Create radial gradient for the black hole
    float gradient = smoothstep(uRadius, uRadius * 0.5, dist);
    
    // Add some subtle animation
    float animation = sin(dist * 20.0 - uTime) * 0.02;
    gradient += animation;
    
    // Apply a threshold to avoid almost-transparent black areas
    if (gradient * uIntensity < 0.05) {
        discard; // Don't render pixels that are nearly transparent
    }
    
    // Black hole is pure black with varying alpha
    gl_FragColor = vec4(0.0, 0.0, 0.0, gradient * uIntensity);
}
`;
