const canvas = document.getElementById('canvas'); const infoPanel = document.getElementById('info-panel'); const nameEl = document.getElementById('planet-name'); const descEl = document.getElementById('planet-desc'); const buttons = document.getElementById('planet-buttons'); const music = document.getElementById('bg-music'); const toggleBtn = document.getElementById('music-toggle');

let isMusicPlaying = true; toggleBtn.onclick = () => { isMusicPlaying ? music.pause() : music.play(); toggleBtn.textContent = isMusicPlaying ? '🔇 Música' : '🔊 Música'; isMusicPlaying = !isMusicPlaying; };

const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); const renderer = new THREE.WebGLRenderer({ canvas }); renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement); controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x404040)); scene.add(new THREE.PointLight(0xffffff, 1.5, 0, 2));

const loader = new THREE.TextureLoader(); const planets = []; let selectedPlanet = null;

const planetsData = [ { name: 'Mercurio', texture: 'textures/mercury.jpg', size: 0.3, distance: 3.5, orbitSpeed: 0.03, desc: 'Mercurio es el planeta más cercano al Sol y el más pequeño.', moons: [] }, { name: 'Venus', texture: 'textures/venus.jpg', size: 0.35, distance: 5, orbitSpeed: 0.015, desc: 'Venus tiene una atmósfera muy densa y caliente.', moons: [] }, { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.38, distance: 6.5, orbitSpeed: 0.01, desc: 'La Tierra es el único planeta conocido con vida.', moons: [{ name: 'Luna', texture: 'textures/moons/moon.jpg', size: 0.1, distance: 0.6 }] }, { name: 'Marte', texture: 'textures/mars.jpg', size: 0.3, distance: 8, orbitSpeed: 0.008, desc: 'El planeta rojo.', moons: [{ name: 'Fobos', texture: 'textures/moons/phobos.jpg', size: 0.05, distance: 0.4 }] }, { name: 'Júpiter', texture: 'textures/jupiter.jpg', size: 0.8, distance: 10, orbitSpeed: 0.004, desc: 'El planeta más grande.', moons: [{ name: 'Europa', texture: 'textures/moons/europa.jpg', size: 0.1, distance: 1.5 }] }, { name: 'Saturno', texture: 'textures/saturn.jpg', size: 0.7, distance: 12.5, orbitSpeed: 0.003, desc: 'Famoso por sus anillos.', moons: [{ name: 'Titán', texture: 'textures/moons/titan.jpg', size: 0.1, distance: 1.2 }], ring: 'textures/rings/saturn_ring.png' }, { name: 'Urano', texture: 'textures/uranus.jpg', size: 0.5, distance: 14.5, orbitSpeed: 0.002, desc: 'Gigante helado.', moons: [{ name: 'Titania', texture: 'textures/moons/titania.jpg', size: 0.07, distance: 0.8 }] }, { name: 'Neptuno', texture: 'textures/neptune.jpg', size: 0.5, distance: 16.5, orbitSpeed: 0.0015, desc: 'Azul y ventoso.', moons: [{ name: 'Tritón', texture: 'textures/moons/triton.jpg', size: 0.08, distance: 0.9 }] }, { name: 'Plutón', texture: 'textures/pluto.jpg', size: 0.2, distance: 18.5, orbitSpeed: 0.001, desc: 'Planeta enano.', moons: [] } ];

let loaded = 0; const totalToLoad = planetsData.length + 1;

function checkLoaded() { loaded++; if (loaded === totalToLoad) { document.getElementById('loading').style.display = 'none'; } }

loader.load('textures/sun.jpg', texture => { const sunGeo = new THREE.SphereGeometry(1.2, 32, 32); const sunMat = new THREE.MeshBasicMaterial({ map: texture }); const sun = new THREE.Mesh(sunGeo, sunMat); scene.add(sun); checkLoaded(); }, undefined, checkLoaded);

planetsData.forEach(data => { loader.load(data.texture, texture => { const orbitGroup = new THREE.Group(); scene.add(orbitGroup);

const geometry = new THREE.SphereGeometry(data.size, 32, 32);
const material = new THREE.MeshStandardMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
mesh.userData = { ...data, angle: Math.random() * Math.PI * 2 };
orbitGroup.add(mesh);
planets.push({ mesh, data });

// Anillos de Saturno
if (data.ring) {
  const ringTex = loader.load(data.ring);
  const ringGeo = new THREE.RingGeometry(data.size * 1.2, data.size * 2, 64);
  const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  mesh.add(ring);
}

// Lunas
if (data.moons) {
  data.moons.forEach(moon => {
    loader.load(moon.texture, moonTex => {
      const moonGeo = new THREE.SphereGeometry(moon.size, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({ map: moonTex });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.position.x = moon.distance;
      mesh.add(moonMesh);
    });
  });
}

// Órbita visual
const orbitGeometry = new THREE.RingGeometry(data.distance - 0.01, data.distance + 0.01, 64);
const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
orbit.rotation.x = Math.PI / 2;
scene.add(orbit);

// Botón
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

// Cinturón de asteroides (entre Marte y Júpiter) for (let i = 0; i < 300; i++) { const angle = Math.random() * Math.PI * 2; const radius = 9 + Math.random(); const asteroid = new THREE.Mesh( new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshStandardMaterial({ color: 0x888888 }) ); asteroid.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius); scene.add(asteroid); }

// Cinturón de Kuiper (después de Neptuno) for (let i = 0; i < 200; i++) { const angle = Math.random() * Math.PI * 2; const radius = 20 + Math.random() * 3; const asteroid = new THREE.Mesh( new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshStandardMaterial({ color: 0x666666 }) ); asteroid.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius); scene.add(asteroid); }

camera.position.set(0, 5, 20); controls.update();

function animate() { requestAnimationFrame(animate);

planets.forEach(obj => { const { mesh, data } = obj; mesh.userData.angle += data.orbitSpeed; mesh.position.x = Math.cos(mesh.userData.angle) * data.distance; mesh.position.z = Math.sin(mesh.userData.angle) * data.distance; mesh.rotation.y += 0.01; });

if (selectedPlanet) { const pos = selectedPlanet.position; controls.target.copy(pos); camera.position.lerp(new THREE.Vector3(pos.x + 2, pos.y + 1, pos.z + 2), 0.05); }

controls.update(); renderer.render(scene, camera); } animate();

