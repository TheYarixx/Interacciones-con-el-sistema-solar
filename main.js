const canvas = document.getElementById('canvas');
const infoPanel = document.getElementById('info-panel');
const nameEl = document.getElementById('planet-name');
const descEl = document.getElementById('planet-desc');
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const goToSelect = document.getElementById('planet-selector');
const toggleOrbits = document.getElementById('toggle-orbits');
const toggleLunas = document.getElementById('toggle-moons');

let isMusicPlaying = true;
toggleBtn.onclick = () => {
  isMusicPlaying ? music.pause() : music.play();
  toggleBtn.textContent = isMusicPlaying ? '🔇 Música' : '🔊 Música';
  isMusicPlaying = !isMusicPlaying;
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x404040));
scene.add(new THREE.PointLight(0xffffff, 1.5));

const loader = new THREE.TextureLoader();
const planets = [];
const orbitMeshes = [];
const moonGroups = [];
let showLunas = true;
let selectedPlanet = null;

const planetsData = [
  { name: 'Mercurio', texture: 'textures/mercury.jpg', size: 0.3, distance: 3.5, orbitSpeed: 0.03, desc: 'Mercurio es el planeta más cercano al Sol y el más pequeño.' },
  { name: 'Venus', texture: 'textures/venus.jpg', size: 0.35, distance: 5, orbitSpeed: 0.015, desc: 'Venus tiene una atmósfera muy densa y caliente.' },
  { name: 'Tierra', texture: 'textures/earth.jpg', size: 0.38, distance: 6.5, orbitSpeed: 0.01, desc: 'La Tierra es el único planeta conocido con vida.' },
  { name: 'Marte', texture: 'textures/mars.jpg', size: 0.3, distance: 8, orbitSpeed: 0.008, desc: 'Marte es conocido como el Planeta Rojo.' },
  { name: 'Júpiter', texture: 'textures/jupiter.jpg', size: 0.8, distance: 10, orbitSpeed: 0.004, desc: 'Júpiter es el planeta más grande del sistema solar.' },
  { name: 'Saturno', texture: 'textures/saturn.jpg', size: 0.7, distance: 12.5, orbitSpeed: 0.003, desc: 'Saturno tiene anillos espectaculares y muchas lunas.' },
  { name: 'Urano', texture: 'textures/uranus.jpg', size: 0.5, distance: 14.5, orbitSpeed: 0.002, desc: 'Urano rota de lado y es un gigante helado.' },
  { name: 'Neptuno', texture: 'textures/neptune.jpg', size: 0.5, distance: 16.5, orbitSpeed: 0.0015, desc: 'Neptuno tiene vientos extremos y un color azul intenso.' },
  { name: 'Plutón', texture: 'textures/pluto.jpg', size: 0.2, distance: 18.5, orbitSpeed: 0.001, desc: 'Plutón es un planeta enano con una órbita excéntrica.' }
];

const moonsData = {
  'Tierra': [{ name: 'Luna', texture: 'textures/moons/luna.jpg', size: 0.1, distance: 0.6 }],
  'Marte': [
    { name: 'Fobos', texture: 'textures/moons/fobos.jpg', size: 0.05, distance: 0.4 },
    { name: 'Deimos', texture: 'textures/moons/deimos.jpg', size: 0.03, distance: 0.6 }
  ],
  'Júpiter': [{ name: 'Europa', texture: 'textures/moons/europa.jpg', size: 0.08, distance: 1.2 }],
  'Saturno': [{ name: 'Titán', texture: 'textures/moons/titan.jpg', size: 0.1, distance: 1.3 }],
  'Urano': [{ name: 'Titania', texture: 'textures/moons/titania.jpg', size: 0.09, distance: 1.0 }],
  'Neptuno': [{ name: 'Tritón', texture: 'textures/moons/triton.jpg', size: 0.08, distance: 0.9 }]
};

const totalToLoad = planetsData.length + 1 + Object.values(moonsData).flat().length;
let loaded = 0;

function checkLoaded() {
  loaded++;
  if (loaded >= totalToLoad) {
    document.getElementById('loading').style.display = 'none';
  }
}

// 🌞 Sol
loader.load(
  'textures/sun.jpg',
  texture => {
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    scene.add(sun);
    checkLoaded();
  },
  undefined,
  () => {
    console.warn('No se cargó el Sol');
    checkLoaded();
  }
);

// 🌍 Planetas
planetsData.forEach(data => {
  loader.load(
    data.texture,
    texture => {
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { ...data, angle: Math.random() * Math.PI * 2 };
      orbitGroup.add(mesh);
      planets.push({ mesh, data });

      const orbit = new THREE.Mesh(
        new THREE.RingGeometry(data.distance - 0.01, data.distance + 0.01, 64),
        new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide })
      );
      orbit.rotation.x = Math.PI / 2;
      orbitMeshes.push(orbit);
      scene.add(orbit);

      const moonGroup = new THREE.Group();
      moonGroup.visible = showLunas;
      moonGroups.push(moonGroup);
      scene.add(moonGroup);

      const planetMoons = moonsData[data.name] || [];
      planetMoons.forEach((moon, index) => {
        loader.load(
          moon.texture,
          moonTex => {
            const moonMesh = new THREE.Mesh(
              new THREE.SphereGeometry(moon.size, 16, 16),
              new THREE.MeshStandardMaterial({ map: moonTex })
            );
            moonMesh.userData = {
              angle: Math.random() * Math.PI * 2,
              distance: moon.distance,
              planetMesh: mesh,
              speed: 0.05 + index * 0.01
            };
            moonGroup.add(moonMesh);
            checkLoaded();
          },
          undefined,
          () => {
            console.warn(`No se cargó la luna: ${moon.texture}`);
            checkLoaded();
          }
        );
      });

      const option = document.createElement('option');
      option.value = data.name;
      option.textContent = data.name;
      goToSelect.appendChild(option);

      checkLoaded();
    },
    undefined,
    () => {
      console.warn(`No se cargó el planeta: ${data.texture}`);
      checkLoaded();
    }
  );
});

camera.position.set(0, 5, 20);
controls.update();

// UI
let showOrbits = true;
toggleOrbits.onchange = () => {
  showOrbits = toggleOrbits.checked;
  orbitMeshes.forEach(o => o.visible = showOrbits);
};

toggleLunas.onchange = () => {
  showLunas = toggleLunas.checked;
  moonGroups.forEach(g => g.visible = showLunas);
};

goToSelect.onchange = () => {
  const name = goToSelect.value;
  const planet = planets.find(p => p.data.name === name);
  if (planet) {
    selectedPlanet = planet.mesh;
    nameEl.textContent = planet.data.name;
    descEl.textContent = planet.data.desc;
    infoPanel.style.display = 'block';
  }
};

// Animación
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(obj => {
    const { mesh, data } = obj;
    mesh.userData.angle += data.orbitSpeed;
    mesh.position.x = Math.cos(mesh.userData.angle) * data.distance;
    mesh.position.z = Math.sin(mesh.userData.angle) * data.distance;
    mesh.rotation.y += 0.01;
  });

  moonGroups.forEach(group => {
    group.children.forEach(moon => {
      moon.userData.angle += moon.userData.speed;
      const planet = moon.userData.planetMesh;
      moon.position.x = planet.position.x + Math.cos(moon.userData.angle) * moon.userData.distance;
      moon.position.z = planet.position.z + Math.sin(moon.userData.angle) * moon.userData.distance;
    });
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
