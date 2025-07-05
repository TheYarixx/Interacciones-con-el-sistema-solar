// main.js
const canvas = document.getElementById('canvas');
const infoPanel = document.getElementById('info-panel');
const nameEl = document.getElementById('planet-name');
const descEl = document.getElementById('planet-desc');
const buttons = document.getElementById('planet-buttons');

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(0, 0, 0);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const planetsData = [
  { name: 'Venus', texture: 'textures/venus.jpg', size: 0.6, distance: 3, desc: 'Planeta con atmósfera densa.' },
  { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.65, distance: 4, desc: 'Nuestro hogar azul.' },
  { name: 'Marte', texture: 'textures/mars.jpg', size: 0.5, distance: 5, desc: 'El planeta rojo.' },
];

let planets = [];

const loader = new THREE.TextureLoader();

planetsData.forEach((data, i) => {
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

const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

camera.position.set(0, 5, 12);
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
