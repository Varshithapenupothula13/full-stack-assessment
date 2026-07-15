import { useState } from "react";

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#7fbb32",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Ride Booking Dashboard
      </h1>

      {/* Pickup */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          margin: "15px auto",
          maxWidth: "380px",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
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
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Drop */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          margin: "15px auto",
          maxWidth: "380px",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
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
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Ride Type */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          margin: "15px auto",
          maxWidth: "380px",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "15px",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Select Ride Type
        </label>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "32px" }}>🏍️</div>
            <h4>Bike</h4>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "32px" }}>🛺</div>
            <h4>Auto</h4>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "32px" }}>🚗</div>
            <h4>Car</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;