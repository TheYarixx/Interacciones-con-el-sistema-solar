// main.js const canvas = document.getElementById('canvas'); const infoPanel = document.getElementById('info-panel'); const nameEl = document.getElementById('planet-name'); const descEl = document.getElementById('planet-desc'); const buttons = document.getElementById('planet-buttons'); const music = document.getElementById('bg-music'); const toggleBtn = document.getElementById('music-toggle');

let isMusicPlaying = true; toggleBtn.onclick = () => { isMusicPlaying ? music.pause() : music.play(); toggleBtn.textContent = isMusicPlaying ? '🔇 Música' : '🔊 Música'; isMusicPlaying = !isMusicPlaying; };

const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); const renderer = new THREE.WebGLRenderer({ canvas }); renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement); controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x404040)); scene.add(new THREE.PointLight(0xffffff, 1.5, 0, 2));

const loader = new THREE.TextureLoader(); const planets = []; let selectedPlanet = null;

const planetMoons = { Tierra: [{ name: 'Luna', texture: 'textures/moons/luna.jpg', size: 0.08, distance: 0.6 }], Marte: [ { name: 'Fobos', texture: 'textures/moons/fobos.jpg', size: 0.05, distance: 0.5 }, { name: 'Deimos', texture: 'textures/moons/deimos.jpg', size: 0.04, distance: 0.7 } ], Júpiter: [{ name: 'Europa', texture: 'textures/moons/europa.jpg', size: 0.1, distance: 1.2 }], Saturno: [{ name: 'Titán', texture: 'textures/moons/titan.jpg', size: 0.1, distance: 1.2 }], Urano: [{ name: 'Titania', texture: 'textures/moons/titania.jpg', size: 0.08, distance: 1.2 }], Neptuno: [{ name: 'Tritón', texture: 'textures/moons/triton.jpg', size: 0.08, distance: 1.2 }] };

const planetsData = [ { name: 'Mercurio', texture: 'textures/mercury.jpg', size: 0.3, distance: 3.5, orbitSpeed: 0.03, desc: 'Mercurio es el planeta más cercano al Sol.' }, { name: 'Venus', texture: 'textures/venus.jpg', size: 0.35, distance: 5, orbitSpeed: 0.015, desc: 'Venus tiene una atmósfera muy densa y caliente.' }, { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.38, distance: 6.5, orbitSpeed: 0.01, desc: 'La Tierra es el único planeta conocido con vida.' }, { name: 'Marte', texture: 'textures/mars.jpg', size: 0.3, distance: 8, orbitSpeed: 0.008, desc: 'Marte es el planeta rojo con dos pequeñas lunas.' }, { name: 'Júpiter', texture: 'textures/jupiter.jpg', size: 0.8, distance: 10, orbitSpeed: 0.004, desc: 'Júpiter es el planeta más grande del sistema solar.' }, { name: 'Saturno', texture: 'textures/saturn.jpg', size: 0.7, distance: 12.5, orbitSpeed: 0.003, desc: 'Saturno es famoso por sus impresionantes anillos.' }, { name: 'Urano', texture: 'textures/uranus.jpg', size: 0.5, distance: 14.5, orbitSpeed: 0.002, desc: 'Urano es un gigante helado que rota de lado.' }, { name: 'Neptuno', texture: 'textures/neptune.jpg', size: 0.5, distance: 16.5, orbitSpeed: 0.0015, desc: 'Neptuno tiene vientos extremos.' }, { name: 'Plutón', texture: 'textures/pluto.jpg', size: 0.2, distance: 18.5, orbitSpeed: 0.001, desc: 'Plutón es un planeta enano con superficie helada.' } ];

let loaded = 0; const totalToLoad = planetsData.length + 1; function checkLoaded() { loaded++; if (loaded === totalToLoad) { document.getElementById('loading').style.display = 'none'; } }

// Fondo estrellado const starsGeometry = new THREE.BufferGeometry(); const starCount = 1000; const starPositions = new Float32Array(starCount * 3); for (let i = 0; i < starCount * 3; i++) { starPositions[i] = (Math.random() - 0.5) * 200; } starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3)); const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 }); const stars = new THREE.Points(starsGeometry, starsMaterial); scene.add(stars);

// Sol loader.load('textures/sun.jpg', texture => { const sunGeo = new THREE.SphereGeometry(1.2, 32, 32); const sunMat = new THREE.MeshBasicMaterial({ map: texture }); const sun = new THREE.Mesh(sunGeo, sunMat); scene.add(sun); checkLoaded(); }, undefined, checkLoaded);

planetsData.forEach(data => { loader.load(data.texture, texture => { const orbitGroup = new THREE.Group(); scene.add(orbitGroup);

const geometry = new THREE.SphereGeometry(data.size, 32, 32);
const material = new THREE.MeshStandardMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
mesh.userData = { ...data, angle: Math.random() * Math.PI * 2 };
orbitGroup.add(mesh);
planets.push({ mesh, data });

// Lunas
if (planetMoons[data.name]) {
  planetMoons[data.name].forEach((moon, index) => {
    loader.load(moon.texture, moonTexture => {
      const moonGeo = new THREE.SphereGeometry(moon.size, 16, 16);
      const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.userData = { angle: Math.random() * Math.PI * 2, distance: moon.distance, speed: 0.03 + index * 0.01 };
      mesh.add(moonMesh);
      mesh.userData.moons = mesh.userData.moons || [];
      mesh.userData.moons.push(moonMesh);
    });
  });
}

// Anillos de Saturno
if (data.name === 'Saturno') {
  loader.load('textures/rings/saturn_ring.png', ringTexture => {
    const ringGeo = new THREE.RingGeometry(data.size + 0.1, data.size + 0.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);
  });
}

// Órbita visual
const orbitGeometry = new THREE.RingGeometry(data.distance - 0.01, data.distance + 0.01, 64);
const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
orbit.rotation.x = Math.PI / 2;
scene.add(orbit);

// Botón de selección
const btn = document.createElement('button');
btn.className = 'planet-btn';
btn.textContent = data.name;
btn.onclick = () => {
  selectedPlanet = mesh;
  nameEl.textContent = data.name;
  descEl.textContent = data.desc;
  infoPanel.style.display = 'block';
};
buttons.appendChild(btn);

checkLoaded();

}, undefined, checkLoaded); });

// Cinturones de asteroides function createAsteroidBelt(radius, count) { const belt = new THREE.Group(); for (let i = 0; i < count; i++) { const geo = new THREE.SphereGeometry(0.03, 6, 6); const mat = new THREE.MeshStandardMaterial({ color: 0x888888 }); const asteroid = new THREE.Mesh(geo, mat); const angle = Math.random() * Math.PI * 2; const dist = radius + (Math.random() - 0.5); asteroid.position.set(Math.cos(angle) * dist, (Math.random() - 0.5) * 0.3, Math.sin(angle) * dist); belt.add(asteroid); } scene.add(belt); }

createAsteroidBelt(9, 300); // Entre Marte y Júpiter createAsteroidBelt(21, 400); // Cinturón de Kuiper

camera.position.set(0, 5, 20); controls.update();

function animate() { requestAnimationFrame(animate);

planets.forEach(obj => { const { mesh, data } = obj; mesh.userData.angle += data.orbitSpeed; mesh.position.x = Math.cos(mesh.userData.angle) * data.distance; mesh.position.z = Math.sin(mesh.userData.angle) * data.distance; mesh.rotation.y += 0.01;

if (mesh.userData.moons) {
  mesh.userData.moons.forEach(moon => {
    moon.userData.angle += moon.userData.speed;
    moon.position.x = Math.cos(moon.userData.angle) * moon.userData.distance;
    moon.position.z = Math.sin(moon.userData.angle) * moon.userData.distance;
  });
}

});

if (selectedPlanet) { const pos = selectedPlanet.position; controls.target.copy(pos); camera.position.lerp(new THREE.Vector3(pos.x + 2, pos.y + 1, pos.z + 2), 0.05); }

controls.update(); renderer.render(scene, camera); } animate();

