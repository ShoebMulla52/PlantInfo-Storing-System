import React, { useEffect, useState } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [watering, setWatering] = useState("");
  const [image, setImage] = useState(null);

  // Load plants from localStorage
  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem("plants")) || [];
    setPlants(storedPlants);
  }, []);

  // Save plants to localStorage whenever plants change
  useEffect(() => {
    localStorage.setItem("plants", JSON.stringify(plants));
  }, [plants]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result); // Base64 string
      reader.readAsDataURL(file);
    }
  };

  const addPlant = () => {
    if (!name || !type || !watering || !image) {
      alert("Please fill all fields and select an image");
      return;
    }

    const newPlant = {
      id: Date.now(),
      name,
      type,
      watering,
      image,
    };

    setPlants([...plants, newPlant]);
    setName("");
    setType("");
    setWatering("");
    setImage(null);
    document.getElementById("imageInput").value = ""; // reset file input
  };

  const deletePlant = (id) => {
    setPlants(plants.filter((plant) => plant.id !== id));
  };

  return (
    <div className="container">
      <h1>🌱 Plant Info Storage System</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Plant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Plant Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <input
          type="text"
          placeholder="Watering Schedule"
          value={watering}
          onChange={(e) => setWatering(e.target.value)}
        />

        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <button onClick={addPlant}>Add Plant</button>
      </div>

      <h2>Stored Plants</h2>
      <div id="plantList">
        {plants.map((plant) => (
          <div className="plant-card" key={plant.id}>
            {plant.image && (
              <img
                src={plant.image}
                alt={plant.name}
                style={{ width: "100%", borderRadius: "6px" }}
              />
            )}
            <strong>Name:</strong> {plant.name} <br />
            <strong>Type:</strong> {plant.type} <br />
            <strong>Watering:</strong> {plant.watering} <br />
            <button onClick={() => deletePlant(plant.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

