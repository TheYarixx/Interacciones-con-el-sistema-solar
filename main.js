const canvas = document.getElementById('canvas');
const infoPanel = document.getElementById('info-panel');
const nameEl = document.getElementById('planet-name');
const descEl = document.getElementById('planet-desc');
const buttons = document.getElementById('planet-buttons');
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');

let isMusicPlaying = true;
toggleBtn.onclick = () => {
  if (isMusicPlaying) {
    music.pause();
    toggleBtn.textContent = '🔇 Música';
  } else {
    music.play();
    toggleBtn.textContent = '🔊 Música';
  }
  isMusicPlaying = !isMusicPlaying;
};

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.PointLight(0xffffff, 1.5, 0, 2));
scene.add(new THREE.AmbientLight(0x404040));

const loader = new THREE.TextureLoader();
const planets = [];

const planetsData = [
  { name: 'Mercurio', texture: 'textures/mercury.jpg', size: 0.3, distance: 3.5, desc: 'Mercurio es el planeta más cercano al Sol...' },
  { name: 'Venus', texture: 'textures/venus.jpg', size: 0.35, distance: 5, desc: 'Venus tiene una atmósfera densa y tóxica.' },
  { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.38, distance: 6.5, desc: 'La Tierra es el único planeta conocido con vida.' },
  { name: 'Marte', texture: 'textures/mars.jpg', size: 0.3, distance: 8, desc: 'El planeta rojo, con cañones y volcanes.' },
  { name: 'Júpiter', texture: 'textures/jupiter.jpg', size: 0.8, distance: 10, desc: 'Júpiter es el más grande, con una gran mancha roja.' },
  { name: 'Saturno', texture: 'textures/saturn.jpg', size: 0.7, distance: 12.5, desc: 'Famoso por sus anillos visibles.' },
  { name: 'Urano', texture: 'textures/uranus.jpg', size: 0.5, distance: 14.5, desc: 'Urano gira de lado y es un gigante helado.' },
  { name: 'Neptuno', texture: 'textures/neptune.jpg', size: 0.5, distance: 16.5, desc: 'El más lejano, con vientos extremos.' },
  { name: 'Plutón', texture: 'textures/pluto.jpg', size: 0.2, distance: 18.5, desc: 'Un planeta enano con una superficie helada.' }
];

let loadedCount = 0;
const totalToLoad = planetsData.length + 1;

function checkLoadingComplete() {
  loadedCount++;
  if (loadedCount >= totalToLoad) {
    document.getElementById('loading').style.display = 'none';
  }
}

// Sol
loader.load('textures/sun.jpg', (texture) => {
  const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ map: texture });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);
  checkLoadingComplete();
}, undefined, checkLoadingComplete);

planetsData.forEach(data => {
  loader.load(data.texture, (texture) => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = data.distance;
    mesh.userData = data;
    mesh.userData.rotationSpeed = 0.005 + Math.random() * 0.005;
    scene.add(mesh);
    planets.push(mesh);

    // Órbita
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.01, data.distance + 0.01, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    const btn = document.createElement('button');
    btn.className = 'planet-btn';
    btn.textContent = data.name;
    btn.onclick = () => {
      controls.target.copy(mesh.position);
      camera.position.set(mesh.position.x + 2, mesh.position.y + 1, mesh.position.z + 2);
      nameEl.textContent = data.name;
      descEl.textContent = data.desc;
      infoPanel.style.display = 'block';
    };
    buttons.appendChild(btn);

    checkLoadingComplete();
  }, undefined, checkLoadingComplete);
});

camera.position.set(0, 5, 20);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.rotation.y += p.userData.rotationSpeed;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();
