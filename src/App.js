import React, { useEffect, useRef, useState } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [watering, setWatering] = useState("");
  const [image, setImage] = useState(null);

  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🌱 Load plants from localStorage
  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem("plants")) || [];
    setPlants(storedPlants);
  }, []);

  // 💾 Save plants to localStorage
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

  // 📷 Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      alert("Camera access denied");
    }
  };

  // ❌ Stop camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOn(false);
  };

  // 📸 Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);

    stopCamera();
  };

  // ➕ Add plant
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

  // 🗑 Delete plant
  const deletePlant = (id) => {
    setPlants(plants.filter((p) => p.id !== id));
  };

  return (
    <div className="container">
      <h1>🌱 Plant Info Storage System</h1>

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

        {/* 📁 Upload Image */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {/* 📷 Camera Section */}
        {!cameraOn && (
          <button onClick={startCamera}>📷 Open Camera</button>
        )}

        {cameraOn && (
          <>
            <video
              ref={videoRef}
              autoPlay
              style={{
                width: "100%",
                marginTop: "10px",
                borderRadius: "6px",
              }}
            />
            <button onClick={capturePhoto}>📸 Capture</button>
            <button onClick={stopCamera}>❌ Cancel</button>
          </>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* 🖼 Image Preview */}
        {image && (
          <img
            src={image}
            alt="Preview"
            style={{
              width: "100%",
              marginTop: "10px",
              borderRadius: "6px",
            }}
          />
        )}

        <button onClick={addPlant}>Add Plant</button>
      </div>

      <h2>Stored Plants</h2>

      {plants.map((plant) => (
        <div className="plant-card" key={plant.id}>
          <img src={plant.image} alt={plant.name} />
          <p><strong>Name:</strong> {plant.name}</p>
          <p><strong>Type:</strong> {plant.type}</p>
          <p><strong>Watering:</strong> {plant.watering}</p>
          <button onClick={() => deletePlant(plant.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;




