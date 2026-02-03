import React, { useEffect, useState } from "react";
import Login from "./Login";

function App() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [watering, setWatering] = useState("");
  const [image, setImage] = useState(null);

  // Auth state (persisted to localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");
  const [user, setUser] = useState(() => localStorage.getItem("user") || "");

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUser(username);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser("");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
  };

  // Load from localStorage
  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem("plants")) || [];
    setPlants(storedPlants);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("plants", JSON.stringify(plants));
  }, [plants]);

  // 📁 Upload image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addPlant = () => {
    if (!name || !type || !watering || !image) {
      alert("Please fill all fields and add an image");
      return;
    }

    setPlants([
      ...plants,
      {
        id: Date.now(),
        name,
        type,
        watering,
        image,
      },
    ]);

    setName("");
    setType("");
    setWatering("");
    setImage(null);
  };

  const deletePlant = (id) => {
    setPlants(plants.filter((p) => p.id !== id));
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <div className="header-row">
        <h1>🌱 Plant Info Storing System</h1>
        <div>
          <span style={{ marginRight: "12px", fontWeight: "600" }}>Welcome, {user}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="form">
        <input
          placeholder="Plant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Plant Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          placeholder="Watering Schedule"
          value={watering}
          onChange={(e) => setWatering(e.target.value)}
        />

        {/* Image upload only */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {/* Preview */}
        {image && (
          <img
            src={image}
            alt="Preview"
            style={{ width: "100%", marginTop: "10px", borderRadius: "6px" }}
          />
        )}

        <button onClick={addPlant}>Add Plant</button>
      </div>

      <h2>Stored Plants</h2>
      {plants.map((plant) => (
        <div className="plant-card" key={plant.id}>
          <img src={plant.image} alt={plant.name} />
          <strong>Name:</strong> {plant.name} <br />
          <strong>Type:</strong> {plant.type} <br />
          <strong>Watering:</strong> {plant.watering} <br />
          <button onClick={() => deletePlant(plant.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App; 




