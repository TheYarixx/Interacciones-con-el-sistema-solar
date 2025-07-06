const planetsData = [
  {
    name: 'Mercurio',
    texture: 'textures/mercury.jpg',
    size: 0.3,
    distance: 2.5,
    desc: 'Mercurio es el planeta más cercano al Sol, sin atmósfera significativa y con temperaturas que varían entre -180 °C y 430 °C.'
  },
  {
    name: 'Venus',
    texture: 'textures/venus.jpg',
    size: 0.6,
    distance: 4,
    desc: 'Venus es el segundo planeta y tiene una atmósfera densa principalmente de dióxido de carbono; es el más cálido debido a un efecto invernadero extremo.'
  },
  {
    name: 'Tierra',
    texture: 'textures/earth.jpg',
    size: 0.65,
    distance: 5.5,
    desc: 'La Tierra es nuestro planeta, rico en agua líquida y con biodiversidad; su atmósfera protege la vida y modera el clima.'
  },
  {
    name: 'Marte',
    texture: 'textures/mars.jpg',
    size: 0.5,
    distance: 7,
    desc: 'Marte, el planeta rojo, tiene el monte Olimpo (la montaña más alta del sistema solar) y evidencia de agua helada en los polos.'
  },
  {
    name: 'Júpiter',
    texture: 'textures/jupiter.jpg',
    size: 1.2,
    distance: 9,
    desc: 'Júpiter es el gigante gaseoso más grande. Su Gran Mancha Roja es una tormenta más grande que la Tierra y tiene más de 79 lunas.'
  },
  {
    name: 'Saturno',
    texture: 'textures/saturn.jpg',
    size: 1.0,
    distance: 11,
    desc: 'Saturno es famoso por sus espectaculares anillos de hielo y polvo. Tiene más de 150 lunas, incluyendo Titán, con atmósfera densa.'
  },
  {
    name: 'Urano',
    texture: 'textures/uranus.jpg',
    size: 0.9,
    distance: 13,
    desc: 'Urano es un gigante helado con una inclinación extrema: gira casi de costado, provocando estaciones extremas.'
  },
  {
    name: 'Neptuno',
    texture: 'textures/neptune.jpg',
    size: 0.85,
    distance: 15,
    desc: 'Neptuno tiene los vientos más fuertes del sistema solar y un tono azul intenso causado por metano en su atmósfera.'
  },
  {
    name: 'Plutón',
    texture: 'textures/pluto.jpg',
    size: 0.3,
    distance: 17,
    desc: 'Plutón es un planeta enano en el cinturón de Kuiper. Tiene una gran luna llamada Caronte y una atmósfera tenue.'
  }
];

const sunTexture = loader.load('textures/sun.jpg');
