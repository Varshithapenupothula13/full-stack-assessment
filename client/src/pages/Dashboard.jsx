import { useState } from "react";
import MapView from "../components/MapView";

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedRide, setSelectedRide] = useState("Car");

  const handleBookRide = async () => {
    if (!pickup || !drop) {
      alert("Please enter both Pickup and Drop locations!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pickup,
            drop,
            rideType: selectedRide,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c381e",
        padding: "25px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Ride Booking
      </h1>

      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "flex-start",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* LEFT SIDE FORM */}
        <div
          style={{
            width: "360px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          }}
        >
          {/* Pickup */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "6px",
              }}
            >
              📍 Pickup Location
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Drop */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "6px",
              }}
            >
              🏁 Drop Location
            </label>
            <input
              type="text"
              placeholder="Enter drop location"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <h3 style={{ textAlign: "center" }}>Select Ride Type</h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {/* Bike */}
            <div
              onClick={() => setSelectedRide("Bike")}
              style={{
                flex: 1,
                border: selectedRide === "Bike" ? "2px solid #0d6efd" : "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                background: selectedRide === "Bike" ? "#eef6ff" : "#fff",
              }}
            >
              <div style={{ fontSize: "28px" }}>🏍️</div>
              <p style={{ margin: "5px 0 0 0" }}>Bike</p>
            </div>

            {/* Auto */}
            <div
              onClick={() => setSelectedRide("Auto")}
              style={{
                flex: 1,
                border: selectedRide === "Auto" ? "2px solid #0d6efd" : "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                background: selectedRide === "Auto" ? "#eef6ff" : "#fff",
              }}
            >
              <div style={{ fontSize: "28px" }}>🛺</div>
              <p style={{ margin: "5px 0 0 0" }}>Auto</p>
            </div>

            {/* Car */}
            <div
              onClick={() => setSelectedRide("Car")}
              style={{
                flex: 1,
                border: selectedRide === "Car" ? "2px solid #0d6efd" : "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                background: selectedRide === "Car" ? "#eef6ff" : "#fff",
              }}
            >
              <div style={{ fontSize: "28px" }}>🚗</div>
              <p style={{ margin: "5px 0 0 0" }}>Car</p>
            </div>
          </div>

          <button
            onClick={handleBookRide}
            style={{
              width: "100%",
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Book {selectedRide}
          </button>
        </div>

        {/* RIGHT SIDE MAP */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            height: "650px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          }}
        >
          <MapView
          pickup={pickup}
          drop={drop}
         />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;