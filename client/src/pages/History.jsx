import { useEffect, useState } from "react";

function History() {
  const [bookings, setBookings] = useState([]);

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
    fetchHistory();
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === "Pending" ? "Confirmed" : "Completed";
      const response = await fetch(`https://full-stack-assessment-fwgb.onrender.com/api/bookings/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Status updated successfully!");
        fetchHistory();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      const response = await fetch(`https://full-stack-assessment-fwgb.onrender.com/api/bookings/delete/${id}`, {
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
      alert("Server Error");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h2 
        style={{ 
          color: "#432c46", 
          marginBottom: "30px", 
          textAlign: "center", 
          fontFamily: "sans-serif",
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        Ride Booking History
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {bookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              background: "#dfdfdf",
              padding: "20px",
              borderRadius: "12px",
              width: "100%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              fontFamily: "sans-serif",
              boxSizing: "border-box",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
              {booking.rideType}
            </h3>
            <p><strong>Pickup:</strong> {booking.pickup}</p>
            <p><strong>Drop:</strong> {booking.drop}</p>
            <p><strong>Distance:</strong> {booking.distance} km</p>
            <p><strong>Fare:</strong> ₹{booking.fare}</p>
            <p><strong>Duration:</strong> {booking.duration}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px", maxWidth: "300px" }}>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                style={{
                  flex: 1,
                  background: "#dc3545",
                  color: "#f0e9e9",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete Booking
              </button>
              <button
                onClick={() => handleUpdateStatus(booking._id, booking.status)}
                style={{
                  flex: 1,
                  background: "#198754",
                  color: "#ece5e5",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;