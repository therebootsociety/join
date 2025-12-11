import * as THREE from 'three';

// --- COSMIC BACKGROUND SYSTEM ---
const initBackground = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    // Add subtle fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Star Field ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 4000;
    const posArray = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for(let i = 0; i < starCount * 3; i+=3) {
        // Random positions in a sphere
        const r = 400 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i+2] = r * Math.cos(phi);

        // Color variation (Blue/Purple/White)
        const colorType = Math.random();
        if (colorType > 0.9) { // White
            colors[i] = 1; colors[i+1] = 1; colors[i+2] = 1;
        } else if (colorType > 0.6) { // Purple
            colors[i] = 0.6; colors[i+1] = 0.3; colors[i+2] = 1;
        } else { // Blue
            colors[i] = 0.4; colors[i+1] = 0.6; colors[i+2] = 1;
        }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // --- Floating Particles (Closer) ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const pPosArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        pPosArray[i] = (Math.random() - 0.5) * 50; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(pPosArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x6366F1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 50;

    // --- Animation Loop ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Mouse interaction
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Smooth rotation based on mouse
        starMesh.rotation.y += 0.001 + (targetX - starMesh.rotation.y) * 0.01;
        starMesh.rotation.x += 0.0005 + (targetY - starMesh.rotation.x) * 0.01;

        // Particles float independently
        particlesMesh.rotation.y -= 0.002;
        particlesMesh.rotation.x -= 0.001;

        // Gentle breathing effect
        const time = Date.now() * 0.0005;
        starMesh.scale.x = 1 + Math.sin(time) * 0.05;
        starMesh.scale.y = 1 + Math.sin(time) * 0.05;
        starMesh.scale.z = 1 + Math.sin(time) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// --- FORM HANDLING SYSTEM ---
const initForm = () => {
    const form = document.getElementById('join-form');
    const successMessage = document.getElementById('success-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button');
        const originalBtnContent = btn.innerHTML;
        
        // Loading state
        btn.innerHTML = 'ESTABLISHING UPLINK...';
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            instagram: formData.get('instagram'),
            country: formData.get('country'),
            timestamp: new Date().toISOString(),
            // FormSubmit Configuration
            _subject: `AETHER WAITLIST: ${formData.get('name')}`,
            _template: "table",
            _captcha: "false" 
        };

        try {
            // Using FormSubmit.co AJAX endpoint to send email without backend
            const response = await fetch("https://formsubmit.co/ajax/philippyg@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // Success UI
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Set Success Text
            const titleEl = successMessage.querySelector('h3');
            const textEl = successMessage.querySelector('p');
            if(titleEl) titleEl.textContent = "ACCESS GRANTED";
            if(textEl) textEl.textContent = "DATA TRANSMITTED TO SECTOR COMMAND";
            
            // Reset after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.classList.add('hidden');
                btn.innerHTML = originalBtnContent;
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
            }, 5000);

        } catch (error) {
            console.error("Transmission Error:", error);
            btn.innerHTML = 'TRANSMISSION FAILED';
            
            // Fallback UI
            setTimeout(() => {
                btn.innerHTML = originalBtnContent;
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                alert("Unable to reach servers. Please check your connection.");
            }, 3000);
        }
    });
};

// Start immediately (module scripts are deferred by default, so DOM is ready)
initBackground();
initForm();