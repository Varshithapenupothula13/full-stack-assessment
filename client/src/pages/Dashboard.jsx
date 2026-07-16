import { useState, useEffect } from "react";
import axios from "axios";
import MapView from "../components/MapView"; 

// Complete Local Coordinates Database (Adding Hyderabad & Visakhapatnam too!)
const LOCAL_CITY_DB = {
  rajahmundry: { lat: 17.0005, lon: 81.7835 },
  rajamundry: { lat: 17.0005, lon: 81.7835 },
  rajamahendravaram: { lat: 17.0005, lon: 81.7835 },
  nidadavole: { lat: 16.9088, lon: 81.6669 },
  nidadavolu: { lat: 16.9088, lon: 81.6669 },
  tanuku: { lat: 16.7570, lon: 81.6853 },
  kakinada: { lat: 16.9891, lon: 82.2475 },
  ravulapalem: { lat: 16.7490, lon: 81.8443 },
  bhimavaram: { lat: 16.5449, lon: 81.5212 },
  palakollu: { lat: 16.5242, lon: 81.7289 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
  vizag: { lat: 17.6868, lon: 83.2185 },
  visakhapatnam: { lat: 17.6868, lon: 83.2185 }
};

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedRide, setSelectedRide] = useState("Car");
  const [bookings, setBookings] = useState([]);

  // Coordinate States
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);

  // Safe Instant Coordinates Fetcher
  const getCoordinates = async (query) => {
    if (!query || query.trim() === "") return null;
    const cleanQuery = query.trim().toLowerCase();

    // Check Local Cache First (Instant & No API Call)
    if (LOCAL_CITY_DB[cleanQuery]) {
      return LOCAL_CITY_DB[cleanQuery];
    }

    // Fallback Online API
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=1`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "VihoraRideApp_v5" 
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          };
        }
      }
    } catch (err) {
      console.warn("API Error, couldn't fetch coordinates", err);
    }

    return null;
  };

  // Instant Typing Updates (No Debounce lag for Local Database!)
  const handlePickupChange = async (e) => {
    const val = e.target.value;
    setPickup(val);
    
    // Check if local DB has it instantly
    const clean = val.trim().toLowerCase();
    if (LOCAL_CITY_DB[clean]) {
      setPickupCoords(LOCAL_CITY_DB[clean]);
    }
  };

  const handleDropChange = async (e) => {
    const val = e.target.value;
    setDrop(val);
    
    // Check if local DB has it instantly
    const clean = val.trim().toLowerCase();
    if (LOCAL_CITY_DB[clean]) {
      setDropCoords(LOCAL_CITY_DB[clean]);
    }
  };

  // Debounce fallback only for non-local cities
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const clean = pickup.trim().toLowerCase();
      if (pickup.trim() !== "" && !LOCAL_CITY_DB[clean]) {
        const coords = await getCoordinates(pickup);
        if (coords) setPickupCoords(coords);
      } else if (pickup.trim() === "") {
        setPickupCoords(null);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [pickup]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const clean = drop.trim().toLowerCase();
      if (drop.trim() !== "" && !LOCAL_CITY_DB[clean]) {
        const coords = await getCoordinates(drop);
        if (coords) setDropCoords(coords);
      } else if (drop.trim() === "") {
        setDropCoords(null);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [drop]);

  // Distance calculation using Haversine Formula
  const calculateDistance = (coords1, coords2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const dLon = ((coords2.lon - coords1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return parseFloat(dist.toFixed(2));
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings/history");
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both Username and Password!");
      return;
    }
    
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
      setIsLoggedIn(true);
    }, 2500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill all the registration fields!");
      return;
    }
    alert("Registration successful! Please login now.");
    setIsRegistering(false);
    setPassword("");
  };

  const handleBookRide = async () => {
    if (!pickup || !drop) {
      alert("Please enter both Pickup and Drop locations!");
      return;
    }

    try {
      // Direct coordinate fallback logic checks
      const pCoords = pickupCoords || (await getCoordinates(pickup));
      const dCoords = dropCoords || (await getCoordinates(drop));

      if (!pCoords || !dCoords) {
        alert("Coordinates empty! Please select valid cities.");
        return;
      }

      const calculatedDist = calculateDistance(pCoords, dCoords);
      const averageSpeed = 40; 
      const durationHrs = calculatedDist / averageSpeed;
      const durationMins = Math.max(10, Math.round(durationHrs * 60)); 

      let ratePerKm = 10;
      if (selectedRide === "Bike") ratePerKm = 8;
      if (selectedRide === "Auto") ratePerKm = 12;
      if (selectedRide === "Car") ratePerKm = 18;
      
      const dynamicFare = Math.round(calculatedDist * ratePerKm);

      const response = await axios.post(
        "http://localhost:5000/api/bookings/create",
        {
          pickup,
          drop,
          rideType: selectedRide,
          distance: calculatedDist,
          duration: `${durationMins} mins`,
          fare: dynamicFare,
          pickupCoords: pCoords,
          dropCoords: dCoords,
          status: "Pending" // Initial state, will update on Payment Success
        }
      );

      const { booking, order, key } = response.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Vihora",
        description: "Ride Booking Payment",
        order_id: order.id,

        handler: async function () {
          alert("Payment Successful!");
          try {
            // Force dynamic automatic background status sync to Confirmed
            await fetch(`http://localhost:5000/api/bookings/update/${booking._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Confirmed" }),
            });
          } catch (err) {
            console.error("Auto-status update failed:", err);
          }
          
          setPickup("");
          setDrop("");
          setPickupCoords(null);
          setDropCoords(null);
          fetchHistory(); // Triggers reload to update card with "Confirmed" and correct Fare!
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          });
        },

        prefill: {
          name: username || "Customer",
          email: email || "customer@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#0d6efd",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("Booking failed. Check server/backend configuration!");
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === "Pending" ? "Confirmed" : "Completed";
      const response = await fetch(`http://localhost:5000/api/bookings/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        alert("Status updated successfully!");
        fetchHistory();
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Booking deleted successfully!");
        fetchHistory();
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const LogoIcon = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
      <div style={{ width: "70px", height: "70px", background: "linear-gradient(135deg, #0d6efd, #198754)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", fontSize: "35px" }}>
        🚖
      </div>
      <h2 style={{ margin: "10px 0 0 0", fontFamily: "sans-serif", fontWeight: "900", letterSpacing: "2px", background: "linear-gradient(45deg, #0d6efd, #198754)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "28px" }}>
        VIHORA
      </h2>
    </div>
  );

  if (showSplash) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0c381e", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "system-ui, sans-serif", zIndex: 9999 }}>
        <style>{`
          #root, body, html {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            background-color: #0c381e !important;
          }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "120px", height: "120px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", fontSize: "60px", marginBottom: "20px" }}>
            🚖
          </div>
          <h1 style={{ color: "#fff", margin: 0, fontFamily: "sans-serif", fontWeight: "900", letterSpacing: "5px", fontSize: "42px", textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}>
            VIHORA
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "10px", fontSize: "16px", letterSpacing: "1px" }}>Loading your ride dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0c381e", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
        <style>{`
          #root, body, html {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            background-color: #0c381e !important;
          }
        `}</style>
        <div style={{ width: "350px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
          <LogoIcon />
          {isRegistering ? (
            <div>
              <form onSubmit={handleRegister} style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Username</label>
                  <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Email</label>
                  <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Password</label>
                  <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
                <button type="submit" style={{ width: "100%", background: "#198754", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "15px" }}>Register</button>
              </form>
              <p style={{ textAlign: "center", margin: 0, fontSize: "14px" }}>
                Already have an account?{" "}
                <span onClick={() => { setIsRegistering(false); setPassword(""); }} style={{ color: "#0d6efd", cursor: "pointer", fontWeight: "bold" }}>Login</span>
              </p>
            </div>
          ) : (
            <div>
              <form onSubmit={handleLogin} style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Username</label>
                  <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Password</label>
                  <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
                <button type="submit" style={{ width: "100%", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "15px" }}>Login</button>
              </form>
              <p style={{ textAlign: "center", margin: 0, fontSize: "14px" }}>
                Don't have an account?{" "}
                <span onClick={() => { setIsRegistering(true); setPassword(""); }} style={{ color: "#198754", cursor: "pointer", fontWeight: "bold" }}>Register</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0c381e", padding: "25px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <style>{`
        #root, body, html {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          background-color: #0c381e !important;
        }
      `}</style>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto 25px auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "45px", height: "45px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }}>🚖</div>
          <h1 style={{ color: "#fff", margin: 0, fontFamily: "sans-serif", fontWeight: "900", letterSpacing: "3px", fontSize: "32px" }}>VIHORA</h1>
        </div>
        <button onClick={() => setIsLoggedIn(false)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: "25px", alignItems: "flex-start", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Input Panel */}
        <div style={{ width: "360px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.25)" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>📍 Pickup Location</label>
            <input type="text" placeholder="Enter Pickup Location" value={pickup} onChange={handlePickupChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>🏁 Drop Location</label>
            <input type="text" placeholder="Enter Drop Location" value={drop} onChange={handleDropChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>

          <h3 style={{ textAlign: "center", margin: "15px 0" }}>Select Ride Type</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div onClick={() => setSelectedRide("Bike")} style={{ flex: 1, border: selectedRide === "Bike" ? "2px solid #0d6efd" : "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer", background: selectedRide === "Bike" ? "#eef6ff" : "#fff" }}><div style={{ fontSize: "28px" }}>🏍️</div><p style={{ margin: "5px 0 0 0" }}>Bike</p></div>
            <div onClick={() => setSelectedRide("Auto")} style={{ flex: 1, border: selectedRide === "Auto" ? "2px solid #0d6efd" : "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer", background: selectedRide === "Auto" ? "#eef6ff" : "#fff" }}><div style={{ fontSize: "28px" }}>🛺</div><p style={{ margin: "5px 0 0 0" }}>Auto</p></div>
            <div onClick={() => setSelectedRide("Car")} style={{ flex: 1, border: selectedRide === "Car" ? "2px solid #0d6efd" : "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer", background: selectedRide === "Car" ? "#eef6ff" : "#fff" }}><div style={{ fontSize: "28px" }}>🚗</div><p style={{ margin: "5px 0 0 0" }}>Car</p></div>
          </div>
          <button onClick={handleBookRide} style={{ width: "100%", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>Book {selectedRide}</button>
        </div>

        {/* Dynamic Map Component */}
        <div style={{ flex: 1, background: "#fff", borderRadius: "12px", overflow: "hidden", height: "650px", boxShadow: "0 6px 15px rgba(0,0,0,0.25)" }}>
          <MapView pickupCoords={pickupCoords} dropCoords={dropCoords} />
        </div>
      </div>

      {/* History panel */}
      <div style={{ maxWidth: "1400px", margin: "30px auto 0 auto" }}>
        <h2 style={{ color: "#fff", marginBottom: "15px" }}>Booking History</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {bookings.map((booking) => (
            <div key={booking._id} style={{ background: "#fff", padding: "20px", borderRadius: "12px", width: "300px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", fontFamily: "sans-serif" }}>
              <h3 style={{ margin: "0 0 10px 0", textAlign: "center" }}>{booking.rideType}</h3>
              <p><strong>Pickup:</strong> {booking.pickup}</p>
              <p><strong>Drop:</strong> {booking.drop}</p>
              <p><strong>Distance:</strong> {booking.distance} km</p>
              <p><strong>Fare:</strong> ₹{booking.fare}</p>
              <p><strong>Duration:</strong> {booking.duration}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ 
                  color: booking.status === "Pending" ? "#ffc107" : booking.status === "Confirmed" ? "#198754" : "#0d6efd", 
                  fontWeight: "bold" 
                }}>
                  {booking.status}
                </span>
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button onClick={() => handleDeleteBooking(booking._id)} style={{ flex: 1, background: "#dc3545", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>Delete Booking</button>
                <button onClick={() => handleUpdateStatus(booking._id, booking.status)} style={{ flex: 1, background: "#198754", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>Update Status</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;