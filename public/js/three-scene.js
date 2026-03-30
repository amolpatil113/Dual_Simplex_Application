// public/js/three-scene.js
if (document.getElementById('canvas-container')) {
    const container = document.getElementById('canvas-container');

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = -Math.random() * 200;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Procedural Airplane Group
    const airplane = new THREE.Group();

    // Fuselage
    const fuselageGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    fuselageGeom.rotateZ(Math.PI / 2);
    const planeMat = new THREE.MeshPhongMaterial({ color: 0xe0e0e0, shininess: 100 });
    const fuselage = new THREE.Mesh(fuselageGeom, planeMat);
    airplane.add(fuselage);

    // Nose
    const noseGeom = new THREE.ConeGeometry(0.5, 1, 32);
    noseGeom.rotateZ(-Math.PI / 2);
    noseGeom.translate(2.5, 0, 0);
    const nose = new THREE.Mesh(noseGeom, planeMat);
    airplane.add(nose);

    // Tail
    const tailGeom = new THREE.ConeGeometry(0.4, 0.8, 32);
    tailGeom.rotateZ(Math.PI / 2);
    tailGeom.translate(-2.4, 0, 0);
    const tail = new THREE.Mesh(tailGeom, planeMat);
    airplane.add(tail);

    // Wings
    const wingGeom = new THREE.BoxGeometry(1.5, 0.1, 6);
    wingGeom.translate(0.5, 0, 0);
    const wings = new THREE.Mesh(wingGeom, planeMat);
    airplane.add(wings);

    // Tail Fin
    const finGeom = new THREE.BoxGeometry(0.8, 1.2, 0.1);
    finGeom.translate(-1.8, 0.6, 0);
    const fin = new THREE.Mesh(finGeom, new THREE.MeshPhongMaterial({ color: 0xff7e5f }));
    airplane.add(fin);

    scene.add(airplane);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const engineLight = new THREE.PointLight(0x00c9ff, 2, 10);
    engineLight.position.set(-2.5, 0, 0);
    airplane.add(engineLight);

    // Initial positioning
    airplane.position.set(0, 0, -10);
    camera.position.z = 5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Subtle floating movement
        const time = Date.now() * 0.001;
        airplane.position.y = Math.sin(time) * 0.5;
        airplane.rotation.z = Math.sin(time * 0.5) * 0.05;
        airplane.rotation.x = Math.max(Math.min(mouseY * 0.05, 0.5), -0.5);
        
        stars.rotation.z += 0.0002;
        
        renderer.render(scene, camera);
    }

    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Expose airplane to GSAP script
    window.threeAirplane = airplane;
}
