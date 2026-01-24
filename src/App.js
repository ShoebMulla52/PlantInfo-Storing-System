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
  let streamRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem("plants")) || [];
    setPlants(storedPlants);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("plants", JSON.stringify(plants));
  }, [plants]);

  // 📷 Open camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      alert("Camera access denied or not available");
    }
  };

  // ❌ Close camera
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setCameraOn(false);
  };

  // 📸 Capture photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);
    closeCamera();
  };

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
    setPlants(plants.filter(p => p.id !== id));
  };

  return (
    <div className="container">
      <h1>🌱 Plant Info Storage System</h1>

      <div className="form">
        <input placeholder="Plant Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Plant Type" value={type} onChange={e => setType(e.target.value)} />
        <input placeholder="Watering Schedule" value={watering} onChange={e => setWatering(e.target.value)} />

        {/* Upload */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {/* Camera buttons */}
        {!cameraOn ? (
          <button onClick={openCamera}>📷 Open Camera</button>
        ) : (
          <>
            <video ref={videoRef} autoPlay style={{ width: "100%", borderRadius: "6px" }} />
            <button onClick={capturePhoto}>📸 Capture</button>
            <button onClick={closeCamera}>❌ Close Camera</button>
          </>
        )}

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
      {plants.map(plant => (
        <div className="plant-card" key={plant.id}>
          <img src={plant.image} alt={plant.name} />
          <strong>Name:</strong> {plant.name} <br />
          <strong>Type:</strong> {plant.type} <br />
          <strong>Watering:</strong> {plant.watering} <br />
          <button onClick={() => deletePlant(plant.id)}>Delete</button>
        </div>
      ))}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;


