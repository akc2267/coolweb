// Vertex shader for rainbow rings
const ringVertexShader = `
varying vec2 vUv;
varying float vDepth;

void main() {
    vUv = uv;
    
    // Calculate depth for color variations
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vDepth = -modelPosition.z * 0.05;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader for rainbow rings
const ringFragmentShader = `
varying vec2 vUv;
varying float vDepth;
uniform float uTime;
uniform float uColorOffset;

// Function to convert HSL to RGB
vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
    // Calculate distance from center for the ring effect
    float dist = length(vUv - vec2(0.5, 0.5)) * 2.0;
    
    // Sharpen the edge of the ring
    float ring = smoothstep(0.9, 1.0, dist) - smoothstep(0.7, 0.9, dist);
    
    // Add some wave motion
    float wave = sin(dist * 25.0 - uTime * 0.5) * 0.1;
    ring += wave * 0.1;
    
    // Rainbow color based on depth and time
    float hue = vDepth * 2.0 + uColorOffset + uTime * 0.05;
    vec3 color = hsl2rgb(vec3(hue, 0.8, 0.6));
    
    // Create edge highlights for depth
    float edgeHighlight = smoothstep(0.8, 0.9, dist) * 0.5;
    color += edgeHighlight;
    
    // Adjust alpha for transparency
    float alpha = ring * 0.9;
    
    // Output final color
    gl_FragColor = vec4(color, alpha);
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
    
    // Black hole is pure black with varying alpha
    gl_FragColor = vec4(0.0, 0.0, 0.0, gradient * uIntensity);
}
`;
