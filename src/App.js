import React, { useEffect, useState, useRef } from "react";
import Login from "./Login";

function App() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [watering, setWatering] = useState("");
  const [image, setImage] = useState(null);
  const [wateringInterval, setWateringInterval] = useState("");
  const [fertilizeInterval, setFertilizeInterval] = useState("");
  const [reminders, setReminders] = useState([]);

  // Auth state (persisted to localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");
  const [user, setUser] = useState(() => localStorage.getItem("user") || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

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

  // Request Notification permission (optional) — non-blocking
  useEffect(() => {
    if ("Notification" in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const markWatered = (id) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, nextWatering: new Date(Date.now() + p.wateringInterval * 24 * 60 * 60 * 1000).toISOString() }
          : p
      )
    );
  };

  const markFertilized = (id) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, nextFertilize: new Date(Date.now() + p.fertilizeInterval * 24 * 60 * 60 * 1000).toISOString() }
          : p
      )
    );
  };

  // Check reminders periodically and send optional browser notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const due = plants.filter(
        (p) =>
          (p.nextWatering && new Date(p.nextWatering) <= now) ||
          (p.nextFertilize && new Date(p.nextFertilize) <= now)
      );

      setReminders(due);

      // Send notifications for due items (permission required)
      due.forEach((p) => {
        if ("Notification" in window && Notification.permission === 'granted') {
          if (p.nextWatering && new Date(p.nextWatering) <= now) {
            new Notification(`Water ${p.name}`, { body: 'Time to water your plant.' });
          }
          if (p.nextFertilize && new Date(p.nextFertilize) <= now) {
            new Notification(`Fertilize ${p.name}`, { body: 'Time to fertilize your plant.' });
          }
        }
      });
    };

    checkReminders();
    const id = setInterval(checkReminders, 60 * 1000); // check every minute
    return () => clearInterval(id);
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
    if (!name || !type || !image) {
      alert("Please fill all required fields and add an image");
      return;
    }

    const wi = wateringInterval ? parseInt(wateringInterval, 10) : 7; // default 7 days
    const fi = fertilizeInterval ? parseInt(fertilizeInterval, 10) : 30; // default 30 days
    const now = new Date();
    const nextWatering = new Date(now.getTime() + wi * 24 * 60 * 60 * 1000).toISOString();
    const nextFertilize = new Date(now.getTime() + fi * 24 * 60 * 60 * 1000).toISOString();

    setPlants([
      ...plants,
      {
        id: Date.now(),
        name,
        type,
        watering,
        image,
        wateringInterval: wi,
        fertilizeInterval: fi,
        nextWatering,
        nextFertilize,
      },
    ]);

    setName("");
    setType("");
    setWatering("");
    setImage(null);
    setWateringInterval("");
    setFertilizeInterval("");
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
        <div ref={menuRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: "600" }}>Welcome back, {user}</span>

          <button
            className="menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen((s) => !s)}
          >
            ⋯
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <button className="logout-btn" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {reminders.length > 0 && (
        <div className="reminder-banner">
          <strong>Reminders:</strong>
          <ul>
            {reminders.map((r) => (
              <li key={r.id}>
                {r.name} — {r.nextWatering && new Date(r.nextWatering) <= new Date() ? 'Water now' : ''} {r.nextFertilize && new Date(r.nextFertilize) <= new Date() ? 'Fertilize now' : ''}
                <span style={{ marginLeft: 8 }}>
                  {r.nextWatering && new Date(r.nextWatering) <= new Date() && <button onClick={() => markWatered(r.id)}>Mark Watered</button>}
                  {r.nextFertilize && new Date(r.nextFertilize) <= new Date() && <button onClick={() => markFertilized(r.id)}>Mark Fertilized</button>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          placeholder="Watering notes (e.g., 'Keep moist')"
          value={watering}
          onChange={(e) => setWatering(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            min="1"
            placeholder="Water every (days)"
            value={wateringInterval}
            onChange={(e) => setWateringInterval(e.target.value)}
          />
          <input
            type="number"
            min="1"
            placeholder="Fertilize every (days)"
            value={fertilizeInterval}
            onChange={(e) => setFertilizeInterval(e.target.value)}
          />
        </div>

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
      {plants.map((plant) => {
        const nextWater = plant.nextWatering ? new Date(plant.nextWatering) : null;
        const nextFert = plant.nextFertilize ? new Date(plant.nextFertilize) : null;
        const now = new Date();
        const waterDue = nextWater && nextWater <= now;
        const fertDue = nextFert && nextFert <= now;
        return (
          <div className="plant-card" key={plant.id}>
            <img src={plant.image} alt={plant.name} />
            <strong>Name:</strong> {plant.name} <br />
            <strong>Type:</strong> {plant.type} <br />
            <strong>Watering:</strong> {plant.watering} <br />
            <strong>Next Water:</strong> {nextWater ? nextWater.toLocaleDateString() : '—'} {waterDue && <span className="due">Due</span>}<br />
            <strong>Next Fertilize:</strong> {nextFert ? nextFert.toLocaleDateString() : '—'} {fertDue && <span className="due">Due</span>}<br />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button onClick={() => markWatered(plant.id)}>Mark Watered</button>
              <button onClick={() => markFertilized(plant.id)}>Mark Fertilized</button>
              <button onClick={() => deletePlant(plant.id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App; 




