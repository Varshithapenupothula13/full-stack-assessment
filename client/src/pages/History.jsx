import { useEffect, useState } from "react";

function History() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
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
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <h2
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Booking History
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
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "12px",
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