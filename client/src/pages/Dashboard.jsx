import { useState } from "react";

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >
      <h1>Ride Booking Dashboard</h1>

      {/* Pickup Location */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
          maxWidth: "500px",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Pickup Location
        </label>

        <input
          type="text"
          placeholder="Enter pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Drop Location */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
          maxWidth: "500px",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Drop Location
        </label>

        <input
          type="text"
          placeholder="Enter drop location"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;