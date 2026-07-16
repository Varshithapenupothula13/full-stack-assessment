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
        fontFamily: "system-ui, -apple-system, sans-serif",
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

      <div
        style={{
          width: "100%",
          maxWidth: "750px",
          margin: "auto",
        }}
      >
        <h2
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "28px",
          }}
        >
          Your Booking History
        </h2>

        {bookings.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            No bookings found.
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div
              key={booking._id || index}
              style={{
                background: "#1f2937",
                color: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "22px",
                    }}
                  >
                    Booking #{index + 1}
                  </h3>

                  <p
                    style={{
                      marginTop: "6px",
                      color: "#cbd5e1",
                      fontSize: "13px",
                    }}
                  >
                    {booking.createdAt 
                      ? new Date(booking.createdAt).toLocaleString() 
                      : new Date().toLocaleString()}
                  </p>
                </div>

                <span
                  style={{
                    background: "#f59e0b",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Pending
                </span>
              </div>

              <p style={{ marginBottom: "10px" }}>
                📍 <strong>Pickup:</strong> {booking.pickup}
              </p>

              <p style={{ marginBottom: "10px" }}>
                🏁 <strong>Drop:</strong> {booking.drop}
              </p>

              {/* Part 2 Code Starts Here */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #374151",
                  marginTop: "15px",
                  paddingTop: "15px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#cbd5e1",
                    }}
                  >
                    Ride Type
                  </p>
                  <strong>{booking.rideType}</strong>
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#cbd5e1",
                    }}
                  >
                    Distance
                  </p>
                  <strong>{booking.distance} km</strong>
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#cbd5e1",
                    }}
                  >
                    Fare
                  </p>
                  <strong style={{ color: "#22c55e" }}>₹{booking.fare ? booking.fare.toFixed(2) : "0.00"}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;