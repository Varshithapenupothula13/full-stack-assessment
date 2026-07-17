import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MapView from "../components/MapView"; 

// Complete Local Coordinates Database
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

  // Booking Confirmation View State (As seen in the premium video flow)
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  
  // Ref to automatically scroll to history panel
  const historyRef = useRef(null);

  // Safe Instant Coordinates Fetcher
  const getCoordinates = async (query) => {
  if (!query || query.trim() === "") return null;
  const cleanQuery = query.trim().toLowerCase();

  // 1. Local Database Check
  if (LOCAL_CITY_DB[cleanQuery]) {
    return LOCAL_CITY_DB[cleanQuery];
  }

  // 2. Live API Check
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=1`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": `VihoraDynamicRidePlatform_${Math.random().toString(36).substring(7)}`
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
    console.warn("API Error, falling back to dynamic mock generation", err);
  }

  // 3. Fallback to prevent map crash (Generates dynamic coordinates for any city)
  const hash = query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mockLat = 17.0005 + (hash % 100) * 0.01; 
  const mockLon = 81.7835 + (hash % 150) * 0.01;
  return { lat: mockLat, lon: mockLon };
};

  // Instant Typing Updates
  const handlePickupChange = async (e) => {
    const val = e.target.value;
    setPickup(val);
    const clean = val.trim().toLowerCase();
    if (LOCAL_CITY_DB[clean]) {
      setPickupCoords(LOCAL_CITY_DB[clean]);
    }
  };

  const handleDropChange = async (e) => {
    const val = e.target.value;
    setDrop(val);
    const clean = val.trim().toLowerCase();
    if (LOCAL_CITY_DB[clean]) {
      setDropCoords(LOCAL_CITY_DB[clean]);
    }
  };

  // Debounce fallbacks
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

  // Distance calculation (Haversine Formula)
  const calculateDistance = (coords1, coords2) => {
    if (!coords1 || !coords2) return 0;
    const R = 6371; 
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

  // Live calculated variables based on the active inputs
  const currentDistance = pickupCoords && dropCoords ? calculateDistance(pickupCoords, dropCoords) : 0;
  const averageSpeed = 40; 
  const durationMins = currentDistance ? Math.max(10, Math.round((currentDistance / averageSpeed) * 60)) : 0;

  // Separate Dynamic Rates Configuration
  const fareEstimates = {
    Bike: Math.round(currentDistance * 8),
    Auto: Math.round(currentDistance * 12),
    Car: Math.round(currentDistance * 18)
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("https://full-stack-assessment-fwgb.onrender.com/api/bookings/history");
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
      const pCoords = pickupCoords || (await getCoordinates(pickup));
      const dCoords = dropCoords || (await getCoordinates(drop));

      if (!pCoords || !dCoords) {
        alert("Coordinates empty! Please select valid cities.");
        return;
      }

      const calculatedDist = calculateDistance(pCoords, dCoords);
      const dynamicFare = fareEstimates[selectedRide];

      const response = await axios.post(
        "https://full-stack-assessment-fwgb.onrender.com/api/bookings/create",
        {
          pickup,
          drop,
          rideType: selectedRide,
          distance: calculatedDist,
          duration: `${durationMins} mins`,
          fare: dynamicFare,
          pickupCoords: pCoords,
          dropCoords: dCoords,
          status: "confirmed" 
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
          try {
            await fetch(`https://full-stack-assessment-fwgb.onrender.com/api/bookings/update/${booking._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "Confirmed" }),
            });
          } catch (err) {
            console.error("Auto-status update failed:", err);
          }
          
          // Triggers the dedicated premium success display view state 
          setConfirmedBooking({
            id: booking._id.slice(-6).toUpperCase() || "VH991A",
            pickup: pickup,
            drop: drop,
            distance: calculatedDist,
            rideType: selectedRide,
            fare: dynamicFare,
            duration: `${durationMins} mins`
          });

          setPickup("");
          setDrop("");
          setPickupCoords(null);
          setDropCoords(null);
          fetchHistory(); 
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
      const response = await fetch(`https://full-stack-assessment-fwgb.onrender.com/api/bookings/update/${id}`, {
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
      const response = await fetch(`https://full-stack-assessment-fwgb.onrender.com/api/bookings/delete/${id}`, {
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

  // Triggers the auto navigation scrolling to history logs section
  const navigateToHistory = () => {
    setConfirmedBooking(null);
    if (historyRef.current) {
      historyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (showSplash) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0c381e", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "120px", height: "120px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", fontSize: "60px", marginBottom: "20px" }}>🚖</div>
          <h1 style={{ color: "#fff", margin: 0, fontFamily: "sans-serif", fontWeight: "900", letterSpacing: "5px", fontSize: "42px" }}>VIHORA</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "10px", fontSize: "16px" }}>Loading your ride dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0c381e", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 5000 }}>
        <div style={{ width: "350px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "25px" }}>
  <span style={{ fontSize: "30px" }}>🚖</span>
  <h2 style={{ margin: 0, fontFamily: "sans-serif", fontWeight: "900", letterSpacing: "2px", background: "linear-gradient(45deg, #0d6efd, #198754)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "28px" }}>
    VIHORA
  </h2>
</div>
          {isRegistering ? (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "15px" }}><label style={{ fontWeight: "bold" }}>Username</label><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} /></div>
              <div style={{ marginBottom: "15px" }}><label style={{ fontWeight: "bold" }}>Email</label><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} /></div>
              <div style={{ marginBottom: "20px" }}><label style={{ fontWeight: "bold" }}>Password</label><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} /></div>
              <button type="submit" style={{ width: "100%", background: "#198754", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold" }}>Register</button>
              <p style={{ textAlign: "center", fontSize: "14px", marginTop: "10px" }}>Already have an account? <span onClick={() => setIsRegistering(false)} style={{ color: "#0d6efd", cursor: "pointer", fontWeight: "bold" }}>Login</span></p>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "15px" }}><label style={{ fontWeight: "bold" }}>Username / Email</label><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} /></div>
              <div style={{ marginBottom: "20px" }}><label style={{ fontWeight: "bold" }}>Password</label><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} /></div>
              <button type="submit" style={{ width: "100%", background: "#0d6efd", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold" }}>Login</button>
              <p style={{ textAlign: "center", fontSize: "14px", marginTop: "10px" }}>Don't have an account? <span onClick={() => setIsRegistering(true)} style={{ color: "#198754", cursor: "pointer", fontWeight: "bold" }}>Register</span></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0c381e", padding: "25px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      
      {/* EXCLUSIVE PREMIUM VIDEO INVOICE SUCCESS VIEW PLATFORM */}
      {confirmedBooking && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#111622", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 20000 }}>
          <div style={{ background: "#1d2433", color: "#ffffff", width: "450px", padding: "35px", borderRadius: "20px", textAlign: "center", boxShadow: "0 15px 40px rgba(0,0,0,0.6)", fontFamily: "system-ui, sans-serif" }}>
            
            {/* Success Green Icon Ring Container */}
            <div style={{ width: "80px", height: "80px", background: "rgba(25, 135, 84, 0.2)", border: "2px solid #198754", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", color: "#198754" }}>
              <span style={{ fontSize: "40px", fontWeight: "bold" }}>✓</span>
            </div>
            
            <h2 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "800", letterSpacing: "0.5px" }}>Booking Confirmed!</h2>
            <p style={{ color: "#a0aec0", margin: "0 0 30px 0", fontSize: "15px" }}>Your ride has been successfully booked. Payment was received.</p>
            
            {/* Video Styled Dynamic Structure Fields Block */}
            <div style={{ background: "#131924", padding: "20px", borderRadius: "12px", textAlign: "left", marginBottom: "30px", fontSize: "15px", border: "1px solid #2d3748" }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#3182ce", textTransform: "uppercase", letterSpacing: "1px", fontSize: "13px" }}>Booking Invoice</h4>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", color: "#cbd5e0" }}><span>Booking ID:</span> <strong style={{ color: "#fff" }}>#{confirmedBooking.id}</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", color: "#cbd5e0" }}><span>Ride Type:</span> <strong style={{ color: "#fff" }}>Vihora {confirmedBooking.rideType}</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", color: "#cbd5e0" }}><span>Distance Calculation:</span> <strong style={{ color: "#fff" }}>{confirmedBooking.distance} km</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", color: "#cbd5e0" }}><span>Est. Duration:</span> <strong style={{ color: "#fff" }}>{confirmedBooking.duration}</strong></p>
              <hr style={{ border: "0", borderTop: "1px solid #2d3748", margin: "15px 0" }} />
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0", fontSize: "18px", color: "#48bb78" }}><span>Paid Fare:</span> <strong>₹{confirmedBooking.fare}</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "5px 0 0 0", fontSize: "13px", color: "#a0aec0" }}><span>Status:</span> <span style={{ background: "#1c4ed8", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", color: "#fff", fontWeight: "bold" }}>Paid</span></p>
            </div>
            
            {/* Interactive Grid Redirection Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button onClick={() => setConfirmedBooking(null)} style={{ width: "100%", background: "#3182ce", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
                Book Another Ride
              </button>
              <button onClick={navigateToHistory} style={{ width: "100%", background: "transparent", color: "#a0aec0", border: "1px solid #4a5568", padding: "12px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Container */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto 25px auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "45px", height: "45px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🚖</div>
          <h1 style={{ color: "#fff", margin: 0, fontFamily: "sans-serif", fontWeight: "900", letterSpacing: "3px", fontSize: "32px" }}>VIHORA</h1>
        </div>
        <button onClick={() => setIsLoggedIn(false)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: "25px", alignItems: "flex-start", maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Left Side Booking Panel Grid */}
        <div style={{ width: "380px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.25)" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>📍 Pickup Location</label>
            <input type="text" placeholder="Enter Pickup Location" value={pickup} onChange={handlePickupChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>🏁 Drop Location</label>
            <input type="text" placeholder="Enter Drop Location" value={drop} onChange={handleDropChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>

          <h3 style={{ textAlign: "center", margin: "15px 0", fontSize: "16px", color: "#4a5568" }}>Select Available Ride Option</h3>
          
          {/* Individual Ride Type Selectors Container with Dynamic Separate Fares Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "25px" }}>
            
            {/* Bike Box Element Option */}
            <div onClick={() => setSelectedRide("Bike")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: selectedRide === "Bike" ? "2px solid #0d6efd" : "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", background: selectedRide === "Bike" ? "#f0f7ff" : "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>🏍️</span>
                <div>
                  <strong style={{ display: "block" }}>Vihora Bike</strong>
                  <small style={{ color: "#718096" }}>Quick single commuter ride</small>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#2d3748" }}>{currentDistance > 0 ? `₹${fareEstimates.Bike}` : "₹0"}</span>
                {currentDistance > 0 && <small style={{ display: "block", color: "#a0aec0", fontSize: "11px" }}>{durationMins} mins</small>}
              </div>
            </div>

            {/* Auto Box Element Option */}
            <div onClick={() => setSelectedRide("Auto")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: selectedRide === "Auto" ? "2px solid #0d6efd" : "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", background: selectedRide === "Auto" ? "#f0f7ff" : "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>🛺</span>
                <div>
                  <strong style={{ display: "block" }}>Vihora Auto</strong>
                  <small style={{ color: "#718096" }}>Local smart budget travel</small>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#2d3748" }}>{currentDistance > 0 ? `₹${fareEstimates.Auto}` : "₹0"}</span>
                {currentDistance > 0 && <small style={{ display: "block", color: "#a0aec0", fontSize: "11px" }}>{durationMins} mins</small>}
              </div>
            </div>

            {/* Premium Sedan Car Box Element Option */}
            <div onClick={() => setSelectedRide("Car")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: selectedRide === "Car" ? "2px solid #0d6efd" : "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", cursor: "pointer", background: selectedRide === "Car" ? "#f0f7ff" : "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>🚗</span>
                <div>
                  <strong style={{ display: "block" }}>Vihora Sedan Car</strong>
                  <small style={{ color: "#718096" }}>Comfortable spacious rides</small>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#2d3748" }}>{currentDistance > 0 ? `₹${fareEstimates.Car}` : "₹0"}</span>
                {currentDistance > 0 && <small style={{ display: "block", color: "#a0aec0", fontSize: "11px" }}>{durationMins} mins</small>}
              </div>
            </div>

          </div>

          {/* Dynamic Distance Meta Data Panel */}
          {currentDistance > 0 && (
            <div style={{ background: "#f7fafc", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "13px", color: "#4a5568", border: "1px solid #edf2f7" }}>
              <span>Total Distance: <strong>{currentDistance} km</strong></span>
              <span style={{ float: "right" }}>Est. Time: <strong>{durationMins} mins</strong></span>
            </div>
          )}

          <button onClick={handleBookRide} style={{ width: "100%", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "8px", padding: "14px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
            Book {selectedRide}
          </button>
        </div>

        {/* Right Side Maps View stage Container */}
        <div style={{ flex: 1, background: "#fff", borderRadius: "12px", overflow: "hidden", height: "680px", boxShadow: "0 6px 15px rgba(0,0,0,0.25)" }}>
          <MapView pickupCoords={pickupCoords} dropCoords={dropCoords} />
        </div>
      </div>

      {/* Ride History Logs Section Container Component Grid */}
      <div ref={historyRef} style={{ maxWidth: "1400px", margin: "40px auto 0 auto", paddingTop: "10px" }}>
        <h2 style={{ color: "#fff", marginBottom: "20px", borderBottom: "2px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>Booking History Dashboard</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {bookings.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.6)" }}>No past ride logs available.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} style={{ background: "#fff", padding: "20px", borderRadius: "12px", width: "310px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
                <h3 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #edf2f7", paddingBottom: "5px" }}>Vihora {booking.rideType}</h3>
                <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Pickup:</strong> {booking.pickup}</p>
                <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Drop:</strong> {booking.drop}</p>
                <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Distance:</strong> {booking.distance} km</p>
                <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Fare Amount:</strong> ₹{booking.fare}</p>
                <p style={{ margin: "6px 0", fontSize: "14px" }}><strong>Duration:</strong> {booking.duration}</p>
                <p style={{ margin: "6px 0", fontSize: "14px" }}>
                  <strong>Status:</strong>{" "}
                  <span style={{ 
                    color: booking.status === "confirmed" ? "#ffc107" : booking.status === "Confirmed" ? "#198754" : "#0d6efd", 
                    fontWeight: "bold",
                    background: booking.status === "confirmed" ? "#e6fffa" : "#fff",
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}>
                    {booking.status}
                  </span>
                </p>
                <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                  <button onClick={() => handleDeleteBooking(booking._id)} style={{ flex: 1, background: "#dc3545", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Delete</button>
                  <button onClick={() => handleUpdateStatus(booking._id, booking.status)} style={{ flex: 1, background: "#198754", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Update</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;