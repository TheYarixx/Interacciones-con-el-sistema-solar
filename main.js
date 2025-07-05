const canvas = document.getElementById('canvas');
const infoPanel = document.getElementById('info-panel');
const nameEl = document.getElementById('planet-name');
const descEl = document.getElementById('planet-desc');
const buttons = document.getElementById('planet-buttons');

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x404040));
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(0, 0, 0);
scene.add(light);

const loader = new THREE.TextureLoader();

const planetsData = [
  { name: 'Mercurio', texture: 'textures/mercury.jpg', size: 0.2, distance: 3.5, desc: 'Planeta más cercano al Sol.' },
  { name: 'Venus', texture: 'textures/venus.jpg', size: 0.4, distance: 5, desc: 'Planeta con atmósfera densa.' },
  { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.43, distance: 6.5, desc: 'Nuestro hogar azul.' },
  { name: 'Marte', texture: 'textures/mars.jpg', size: 0.35, distance: 8, desc: 'El planeta rojo.' },
  { name: 'Júpiter', texture: 'textures/jupiter.jpg', size: 1.2, distance: 11, desc: 'Gigante gaseoso con gran mancha roja.' },
  { name: 'Saturno', texture: 'textures/saturn.jpg', size: 1.0, distance: 14, desc: 'Famoso por sus anillos.' },
  { name: 'Urano', texture: 'textures/uranus.jpg', size: 0.7, distance: 17, desc: 'Gigante helado azul.' },
  { name: 'Neptuno', texture: 'textures/neptune.jpg', size: 0.7, distance: 20, desc: 'Vientos más rápidos del sistema solar.' },
  { name: 'Plutón', texture: 'textures/pluto.jpg', size: 0.18, distance: 23, desc: 'Planeta enano del cinturón de Kuiper.' }
];

const planets = [];

planetsData.forEach(data => {
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: loader.load(data.texture) });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = data.distance;
  mesh.userData = data;
  scene.add(mesh);
  planets.push(mesh);

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
});

// Sol con textura
const sunTex = loader.load('textures/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTex });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

camera.position.set(0, 5, 18);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('load', () => {
  document.getElementById('loading').style.display = 'none';
});
