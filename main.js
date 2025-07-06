const canvas = document.getElementById('canvas');
const infoPanel = document.getElementById('info-panel');
const nameEl = document.getElementById('planet-name');
const descEl = document.getElementById('planet-desc');
const buttons = document.getElementById('planet-buttons');
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');

let isMusicPlaying = true;
toggleBtn.onclick = () => {
  isMusicPlaying ? music.pause() : music.play();
  toggleBtn.textContent = isMusicPlaying ? '🔇 Música' : '🔊 Música';
  isMusicPlaying = !isMusicPlaying;
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x404040));
scene.add(new THREE.PointLight(0xffffff, 1.5, 0, 2));

const loader = new THREE.TextureLoader();
const planets = [];
let selectedPlanet = null;

const planetsData = [
  { name: 'Mercurio', texture: 'textures/mercury.jpg', size: 0.3, distance: 3.5, orbitSpeed: 0.03, desc: 'Mercurio es el planeta más cercano al Sol y el más pequeño. No tiene lunas y su superficie está cubierta de cráteres.' },
  { name: 'Venus', texture: 'textures/venus.jpg', size: 0.35, distance: 5, orbitSpeed: 0.015, desc: 'Venus tiene una atmósfera muy densa y caliente. Gira en dirección opuesta a la mayoría de los planetas.' },
  { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.38, distance: 6.5, orbitSpeed: 0.01, desc: 'La Tierra es el tercer planeta desde el Sol y el único conocido con vida. El 71% está cubierto por agua.' },
  { name: 'Marte', texture: 'textures/mars.jpg', size: 0.3, distance: 8, orbitSpeed: 0.008, desc: 'Marte es conocido como el Planeta Rojo. Tiene volcanes, cañones gigantes y dos pequeñas lunas.' },
  { name: 'Júpiter', texture: 'textures/jupiter.jpg', size: 0.8, distance: 10, orbitSpeed: 0.004, desc: 'Júpiter es el planeta más grande del sistema solar, con más de 75 lunas y una gran mancha roja.' },
  { name: 'Saturno', texture: 'textures/saturn.jpg', size: 0.7, distance: 12.5, orbitSpeed: 0.003, desc: 'Saturno es famoso por sus impresionantes anillos hechos de hielo y roca. Tiene más de 80 lunas.' },
  { name: 'Urano', texture: 'textures/uranus.jpg', size: 0.5, distance: 14.5, orbitSpeed: 0.002, desc: 'Urano es un gigante helado que rota de lado. Su color azul verdoso se debe al metano en su atmósfera.' },
  { name: 'Neptuno', texture: 'textures/neptune.jpg', size: 0.5, distance: 16.5, orbitSpeed: 0.0015, desc: 'Neptuno tiene vientos más rápidos que cualquier otro planeta y un color azul intenso por el metano.' },
  { name: 'Plutón', texture: 'textures/pluto.jpg', size: 0.2, distance: 18.5, orbitSpeed: 0.001, desc: 'Plutón es un planeta enano con una superficie helada y una órbita muy excéntrica.' }
];

let loaded = 0;
const totalToLoad = planetsData.length + 1;

function checkLoaded() {
  loaded++;
  if (loaded === totalToLoad) {
    document.getElementById('loading').style.display = 'none';
  }
}

loader.load('textures/sun.jpg', texture => {
  const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ map: texture });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);
  checkLoaded();
}, undefined, checkLoaded);

planetsData.forEach(data => {
  loader.load(data.texture, texture => {
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ...data, angle: Math.random() * Math.PI * 2 };
    orbitGroup.add(mesh);
    planets.push({ mesh, data });

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
  }, undefined, checkLoaded);
});

camera.position.set(0, 5, 20);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  planets.forEach(obj => {
    const { mesh, data } = obj;
    mesh.userData.angle += data.orbitSpeed;
    mesh.position.x = Math.cos(mesh.userData.angle) * data.distance;
    mesh.position.z = Math.sin(mesh.userData.angle) * data.distance;
    mesh.rotation.y += 0.01;
  });

  if (selectedPlanet) {
    const pos = selectedPlanet.position;
    controls.target.copy(pos);
    camera.position.lerp(new THREE.Vector3(pos.x + 2, pos.y + 1, pos.z + 2), 0.05);
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
