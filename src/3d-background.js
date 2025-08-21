let scene, camera, renderer, particles, particlesMaterial, particlesGeometry;
let isInitialized = false;

export function init3DBackground(theme = 'dark') {
  // Dynamic import for Three.js
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => initThree(theme);
  document.head.appendChild(script);
}

export function update3DTheme(theme) {
  if (!isInitialized || !particlesMaterial) return;
  
  // Update particle colors based on theme
  const colors = particlesGeometry.attributes.color.array;
  const particlesCount = colors.length / 3;
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    const color = new THREE.Color();
    
    if (theme === 'light') {
      // Dark, contrasting colors for light mode visibility
      const hue = Math.random() * 0.4 + 0.5; // Deep blues, purples, teals
      color.setHSL(hue, 0.8, 0.3); // Lower lightness for contrast
    } else {
      // Elegant dark colors for dark mode
      const hue = Math.random() * 0.1 + 0.5; // Deep blues, purples
      color.setHSL(hue, 0.7, 0.6);
    }
    
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }
  
  particlesGeometry.attributes.color.needsUpdate = true;
  
  // Update material opacity based on theme
  particlesMaterial.opacity = theme === 'light' ? 1.0 : 0.8;
}

function initThree(theme) {
  const THREE = window.THREE;
  if (!THREE) return;

  const canvas = document.getElementById('background-canvas')
  if (!canvas) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Create floating particles
  particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 1000
  const positions = new Float32Array(particlesCount * 3)
  const colors = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10
    positions[i + 1] = (Math.random() - 0.5) * 10
    positions[i + 2] = (Math.random() - 0.5) * 10
    
    // Theme-based colors
    const color = new THREE.Color()
    if (theme === 'light') {
      // Dark, contrasting colors for light mode visibility
      const hue = Math.random() * 0.4 + 0.5; // Deep blues, purples, teals
      color.setHSL(hue, 0.8, 0.3); // Lower lightness for contrast
    } else {
      // Elegant dark colors for dark mode
      const hue = Math.random() * 0.1 + 0.5; // Deep blues, purples
      color.setHSL(hue, 0.7, 0.6);
    }
    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: theme === 'light' ? 1.0 : 0.8,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  camera.position.z = 5

  // Mouse interaction
  const mouse = { x: 0, y: 0 }
  
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  })

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)

    // Rotate particles
    particles.rotation.x += 0.001
    particles.rotation.y += 0.002

    // Mouse influence
    particles.rotation.x += mouse.y * 0.0001
    particles.rotation.y += mouse.x * 0.0001

    renderer.render(scene, camera)
  }

  animate()
  isInitialized = true;

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}