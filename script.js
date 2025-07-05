const planetData = {
  mercury: {
    color: "#b1b1b1",
    name: "Mercury",
    description: "The closest planet to the Sun."
  },
  venus: {
    color: "#c9aa88",
    name: "Venus",
    description: "Hot and covered in thick clouds."
  },
  earth: {
    color: "#2e8b57",
    name: "Earth",
    description: "Our home planet."
  },
  mars: {
    color: "#c1440e",
    name: "Mars",
    description: "The red planet."
  },
  jupiter: {
    color: "#e0b989",
    name: "Jupiter",
    description: "The largest planet in the Solar System."
  },
  saturn: {
    color: "#f4e2b0",
    name: "Saturn",
    description: "Known for its beautiful rings."
  },
  uranus: {
    color: "#aee9f1",
    name: "Uranus",
    description: "It rotates on its side."
  },
  neptune: {
    color: "#375eec",
    name: "Neptune",
    description: "The windiest planet."
  },
  pluto: {
    color: "#888",
    name: "Pluto",
    description: "A dwarf planet."
  }
};

document.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    const key = li.dataset.planet;
    const planet = document.getElementById("planet");
    const info = document.getElementById("planet-info");

    planet.style.background = planetData[key].color;
    info.innerHTML = `
      <h2>${planetData[key].name}</h2>
      <p>${planetData[key].description}</p>
    `;
  });
});
