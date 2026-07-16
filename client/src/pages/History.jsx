import { useEffect, useState } from "react";

function History() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
const [rideFilter, setRideFilter] = useState("All");

  const fetchBookings = () => {
    fetch("http://localhost:5000/api/bookings/history")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setBookings(bookings.filter((booking) => booking._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };
const filteredBookings = bookings.filter((booking) => {
  const matchesSearch =
    booking.pickup.toLowerCase().includes(search.toLowerCase()) ||
    booking.drop.toLowerCase().includes(search.toLowerCase());

  const matchesRide =
    rideFilter === "All" || booking.rideType === rideFilter;

  return matchesSearch && matchesRide;
});
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c381e",
        padding: "20px",
        fontFamily: "system-ui",
      }}
    >
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Booking History
      </h1>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search Pickup or Drop"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "10px",
      width: "250px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    }}
  />
<select
  value={rideFilter}
  onChange={(e) => setRideFilter(e.target.value)}
  style={{
    padding: "10px",
    borderRadius: "6px",
  }}
>
  <option value="All">All</option>
  <option value="Bike">Bike</option>
  <option value="Auto">Auto</option>
  <option value="Car">Car</option>
</select>
  </div>
      {bookings.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          No Bookings Found
        </div>
      ) : (
        filteredBookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3>{booking.rideType}</h3>

            <p>
              <strong>Pickup:</strong> {booking.pickup}
            </p>

            <p>
              <strong>Drop:</strong> {booking.drop}
            </p>

            <p>
              <strong>Distance:</strong> {booking.distance} km
            </p>

            <p>
              <strong>Fare:</strong> ₹{booking.fare}
            </p>

            <p>
              <strong>Duration:</strong> {booking.duration}
            </p>

            <p>
              <strong>Status:</strong> {booking.status}
            </p>

            <button
              onClick={() => handleDelete(booking._id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Delete Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;