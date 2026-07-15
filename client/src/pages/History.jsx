import { useEffect, useState } from "react";

function History() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings/history")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c381e",
        padding: "20px",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 30px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Ride Booking</h2>

        <div
          style={{
            display: "flex",
            gap: "25px",
            fontSize: "16px",
          }}
        >
          <span style={{ cursor: "pointer" }}>Book Ride</span>
          <span style={{ cursor: "pointer", fontWeight: "bold" }}>
            My Bookings
          </span>
        </div>
      </div>

      {/* History */}
      <div style={{ width: "100%", maxWidth: "700px", margin: "auto" }}>
        <h2
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Your Booking History
        </h2>

        {bookings.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            No bookings found.
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              <h3>{booking.rideType}</h3>

              <p>
                <strong>Pickup:</strong> {booking.pickup}
              </p>

              <p>
                <strong>Drop:</strong> {booking.drop}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;