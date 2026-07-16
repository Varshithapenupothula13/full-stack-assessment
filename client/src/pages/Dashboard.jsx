import { useState, useEffect } from "react";
import axios from "axios";
import MapView from "../components/MapView";

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedRide, setSelectedRide] = useState("Car");
  const [bookings, setBookings] = useState([]);

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
    fetchHistory();
  }, []);

  const handleBookRide = async () => {
  if (!pickup || !drop) {
    alert("Please enter both Pickup and Drop locations!");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/bookings/create",
      {
        pickup,
        drop,
        rideType: selectedRide,
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

      handler: function () {
        alert("Payment Successful!");

        setPickup("");
        setDrop("");
        fetchHistory();
      },

      prefill: {
        name: "Customer",
        email: "customer@example.com",
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
    alert("Booking failed");
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

      const data = await response.json();
      if (response.ok) {
        alert("Status updated successfully!");
        fetchHistory();
      } else {
        alert(data.message || "Failed to update booking status");
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

      const data = await response.json();
      if (response.ok) {
        alert("Booking deleted successfully!");
        fetchHistory();
      } else {
        alert(data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c381e", padding: "25px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "25px" }}>Ride Booking</h1>
      <div style={{ display: "flex", gap: "25px", alignItems: "flex-start", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ width: "360px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0,0,0,0.25)" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>📍 Pickup Location</label>
            <input type="text" placeholder="Enter pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>🏁 Drop Location</label>
            <input type="text" placeholder="Enter drop location" value={drop} onChange={(e) => setDrop(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>
          <h3 style={{ textAlign: "center" }}>Select Ride Type</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div onClick={() => setSelectedRide("Bike")} style={{ flex: 1, border: selectedRide === "Bike" ? "2px solid #0d6efd" : "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer", background: selectedRide === "Bike" ? "#eef6ff" : "#fff" }}><div style={{ fontSize: "28px" }}>🏍️</div><p style={{ margin: "5px 0 0 0" }}>Bike</p></div>
            <div onClick={() => setSelectedRide("Auto")} style={{ flex: 1, border: selectedRide === "Auto" ? "2px solid #0d6efd" : "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer", background: selectedRide === "Auto" ? "#eef6ff" : "#fff" }}><div style={{ fontSize: "28px" }}>🛺</div><p style={{ margin: "5px 0 0 0" }}>Auto</p></div>
            <div onClick={() => setSelectedRide("Car")} style={{ flex: 1, border: selectedRide === "Car" ? "2px solid #0d6efd" : "1px solid #ddd", borderRadius: "8px", padding: "10px", textAlign: "center", cursor: "pointer", background: selectedRide === "Car" ? "#eef6ff" : "#fff" }}><div style={{ fontSize: "28px" }}>🚗</div><p style={{ margin: "5px 0 0 0" }}>Car</p></div>
          </div>
          <button onClick={handleBookRide} style={{ width: "100%", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>Book {selectedRide}</button>
        </div>
        <div style={{ flex: 1, background: "#fff", borderRadius: "12px", overflow: "hidden", height: "650px", boxShadow: "0 6px 15px rgba(0,0,0,0.25)" }}><MapView pickup={pickup} drop={drop} /></div>
      </div>
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
              <p><strong>Status:</strong> {booking.status}</p>
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