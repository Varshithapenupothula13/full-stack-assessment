# 🚖 VIHORA - Full Stack Ride Booking Application

## 📌 Overview

VIHORA is a Full Stack Ride Booking Application built using React, Node.js, Express.js, MongoDB, Razorpay, and OpenStreetMap. Users can enter pickup and drop locations, view the route on the map, calculate distance and fare dynamically, complete payment using Razorpay Test Mode, and view booking history.

---

# ✨ Features

- User Login & Registration Interface
- Pickup and Drop Location Input
- Interactive Map using OpenStreetMap (Leaflet)
- Live Route Display
- Dynamic Distance Calculation using Haversine Formula
- Estimated Travel Time Calculation
- Dynamic Fare Calculation
- Multiple Ride Options
  - 🏍 Bike
  - 🛺 Auto
  - 🚗 Car
- Razorpay Test Payment Integration
- Booking Confirmation Screen
- Booking History
- Update Booking Status
- Delete Booking
- Responsive User Interface

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- Axios
- HTML5
- CSS3
- Leaflet
- OpenStreetMap

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Payment

- Razorpay Test Mode

---

# 📂 Project Structure

```
client/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── App.jsx
 │   └── main.jsx

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── index.js
 └── package.json
```

---

# 🚀 API Endpoints

### Create Booking

POST

```
/api/bookings/create
```

### Get Booking History

GET

```
/api/bookings/history
```

### Update Booking Status

PUT

```
/api/bookings/update/:id
```

### Delete Booking

DELETE

```
/api/bookings/delete/:id
```

---

# 🌐 Live Demo

### Frontend

https://vihora.netlify.app

### Backend

https://full-stack-assessment-fwgb.onrender.com

---

# 💳 Payment Integration

- Razorpay Test Mode
- Dynamic Order Creation
- Secure Payment Popup
- Booking Confirmation after Successful Payment

---

# 🗺 Map Features

- OpenStreetMap
- Leaflet.js
- Live Pickup & Drop Markers
- Dynamic Route Display
- Distance Calculation

---

# 📊 Database

The application stores:

- Pickup Location
- Drop Location
- Ride Type
- Distance
- Fare
- Duration
- Booking Status
- Created Date & Time

---

# 🔮 Future Enhancements

- User Authentication
- Ride Cancellation
- Driver Assignment
- Email Notifications
- User Profile
- Online Ride Tracking

---

# 👩‍💻 Developed By

**Varshitha**

# 📄 License

This project is developed for learning and assessment purposes.
