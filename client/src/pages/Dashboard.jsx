import { useState } from "react";

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#7fbb32",
        padding: "40px",
      }}
    >
      <h1>Ride Booking Dashboard</h1>

      {/* Pickup */}
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

      {/* Drop */}
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

      {/* Ride Type */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
          maxWidth: "700px",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "20px",
          }}
        >
          Select Ride Type
        </label>

        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "50px" }}>🏍️</div>
            <h3>Bike</h3>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "50px" }}>🛺</div>
            <h3>Auto</h3>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "50px" }}>🚗</div>
            <h3>Car</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;