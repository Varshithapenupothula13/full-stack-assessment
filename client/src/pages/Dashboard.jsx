import { useState } from "react";

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedRide, setSelectedRide] = useState("Car"); // Default selection

  const handleBookRide = () => {
    if (!pickup || !drop) {
      alert("Please enter both Pickup and Drop locations!");
      return;
    }
    alert(`Booking a ${selectedRide} from "${pickup}" to "${drop}"!`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c381e",
        padding: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Container size modified (360px) */}
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "15px",
            color: "#fff",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)"
          }}
        >
          Ride Booking
        </h1>

        {/* Pickup */}
        <div
          style={{
            background: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              fontSize: "14px",
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
              padding: "8px",
              fontSize: "13px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Drop */}
        <div
          style={{
            background: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              fontSize: "14px",
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
              padding: "8px",
              fontSize: "13px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Ride Type Selection with Emojis */}
        <div
          style={{
            background: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <h3
            style={{
              textAlign: "center",
              fontSize: "16px",
              margin: "0 0 10px 0",
            }}
          >
            Select Ride Type
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            {/* Bike */}
            <div
              onClick={() => setSelectedRide("Bike")}
              style={{
                flex: 1,
                border: selectedRide === "Bike" ? "2px solid #0d6efd" : "1px solid #ddd",
                background: selectedRide === "Bike" ? "#f0f7ff" : "#fff",
                borderRadius: "6px",
                padding: "8px 5px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "28px" }} role="img" aria-label="Bike">🏍️</span>
              <p
                style={{
                  marginTop: "4px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  margin: "4px 0 0 0"
                }}
              >
                Bike
              </p>
            </div>

            {/* Auto */}
            <div
              onClick={() => setSelectedRide("Auto")}
              style={{
                flex: 1,
                border: selectedRide === "Auto" ? "2px solid #0d6efd" : "1px solid #ddd",
                background: selectedRide === "Auto" ? "#f0f7ff" : "#fff",
                borderRadius: "6px",
                padding: "8px 5px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "28px" }} role="img" aria-label="Auto">🛺</span>
              <p
                style={{
                  marginTop: "4px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  margin: "4px 0 0 0"
                }}
              >
                Auto
              </p>
            </div>

            {/* Car */}
            <div
              onClick={() => setSelectedRide("Car")}
              style={{
                flex: 1,
                border: selectedRide === "Car" ? "2px solid #0d6efd" : "1px solid #ddd",
                background: selectedRide === "Car" ? "#f0f7ff" : "#fff",
                borderRadius: "6px",
                padding: "8px 5px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "28px" }} role="img" aria-label="Car">🚗</span>
              <p
                style={{
                  marginTop: "4px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  margin: "4px 0 0 0"
                }}
              >
                Car
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleBookRide}
            style={{
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
            }}
          >
            Book {selectedRide}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;