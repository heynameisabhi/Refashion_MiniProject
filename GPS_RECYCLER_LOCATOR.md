# GPS-Based Recycler Locator System

## ✅ Implementation Complete!

A GPS-based system to find cloth recycling centers near you.

---

## 🎯 Features

### Frontend Features:
- ✅ **GPS Location Detection** - Automatically gets user's current location
- ✅ **Distance Calculation** - Shows distance to each recycler in km
- ✅ **Sort Options** - Sort by distance or rating
- ✅ **Contact Options** - Call, Email, or Get Directions
- ✅ **Verified Badge** - Shows which recyclers are verified
- ✅ **Accepted Items** - Displays what each recycler accepts
- ✅ **Opening Hours** - Shows when recyclers are open
- ✅ **Fallback Data** - Works even if backend is unavailable

### Backend Features:
- ✅ **Recycler Database** - Stores recycler information
- ✅ **Nearby Search** - Find recyclers within radius using Haversine formula
- ✅ **Verified Filter** - Get only verified recyclers
- ✅ **Rating System** - Recyclers have ratings
- ✅ **REST API** - Full CRUD operations

---

## 📍 How to Use

### Step 1: Access the Page
Go to: **http://localhost:5173/recyclers**

Or click **"Recyclers"** in the navbar

### Step 2: Allow Location Access
When prompted, click **"Allow"** to enable location services

### Step 3: View Recyclers
- See recyclers sorted by distance (closest first)
- View contact details, ratings, and accepted items
- Click **"Directions"** to open Google Maps
- Click **"Call"** to call the recycler
- Click **"Email"** to send an email

### Step 4: Sort Options
- **Sort by Distance** - Shows closest recyclers first (requires GPS)
- **Sort by Rating** - Shows highest-rated recyclers first

---

## 🗺️ GPS Technology

### Haversine Formula
Calculates the great-circle distance between two points on Earth:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};
```

### Browser Geolocation API
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    // Use location...
  },
  (error) => {
    // Handle error...
  }
);
```

---

## 📊 Sample Data

### Recyclers in Database:

1. **Green Recycling Center**
   - Location: 123 Eco Street, Bangalore
   - Coordinates: 12.9716°N, 77.5946°E
   - Rating: 4.5 ⭐
   - Verified: ✅
   - Accepts: Clothes, Textiles, Shoes, Bags
   - Hours: Mon-Sat: 9AM-6PM

2. **EcoFriendly Textiles**
   - Location: 456 Recycle Road, Bangalore
   - Coordinates: 12.9352°N, 77.6245°E
   - Rating: 4.8 ⭐
   - Verified: ✅
   - Accepts: Clothes, Textiles, Fabric Scraps
   - Hours: Mon-Fri: 10AM-5PM

3. **Sustainable Fashion Hub**
   - Location: 789 Green Avenue, Bangalore
   - Coordinates: 12.9141°N, 77.6411°E
   - Rating: 4.3 ⭐
   - Verified: ❌
   - Accepts: Clothes, Shoes, Accessories
   - Hours: Mon-Sun: 8AM-8PM

---

## 🔌 API Endpoints

### Get All Recyclers
```
GET http://localhost:8080/api/recyclers/all
```

Response:
```json
{
  "success": true,
  "message": "Recyclers retrieved successfully",
  "data": [
    {
      "recyclerId": 1,
      "name": "Green Recycling Center",
      "address": "123 Eco Street, Bangalore",
      "phoneNumber": "+91 98765 43210",
      "email": "contact@greenrecycling.com",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "rating": 4.5,
      "acceptedItems": ["Clothes", "Textiles", "Shoes", "Bags"],
      "openHours": "Mon-Sat: 9AM-6PM",
      "isVerified": true,
      "description": "Leading cloth recycling center in Bangalore"
    }
  ]
}
```

### Get Nearby Recyclers
```
GET http://localhost:8080/api/recyclers/nearby?latitude=12.9716&longitude=77.5946&radiusKm=10
```

Default radius: **10 km**

### Get Verified Recyclers Only
```
GET http://localhost:8080/api/recyclers/verified
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE recyclers (
  recycler_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(255),
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  rating DOUBLE DEFAULT 0.0,
  accepted_items TEXT,
  open_hours VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

---

## 🎨 UI Features

### Recycler Card Shows:
- ✅ Recycler name with verified badge
- ✅ Star rating
- ✅ Distance from user (if GPS enabled)
- ✅ Full address
- ✅ Phone number
- ✅ Email address
- ✅ Opening hours
- ✅ Accepted items (as tags)
- ✅ Action buttons (Directions, Call, Email)

### Color Coding:
- **Green** - Verified recyclers
- **Yellow** - Star ratings
- **Blue** - Brand color for primary actions

---

## 🔧 How to Add More Recyclers

### Via Database:
```sql
INSERT INTO recyclers (
  name, address, phone_number, email, 
  latitude, longitude, rating, 
  accepted_items, open_hours, is_verified, description
) VALUES (
  'Recycler Name',
  'Full Address',
  '+91 XXXXXXXXXX',
  'email@example.com',
  12.9716,
  77.5946,
  4.5,
  'Clothes,Textiles,Shoes',
  'Mon-Fri: 9AM-5PM',
  1,
  'Description here'
);
```

---

## 🐛 Troubleshooting

### Location Not Working:
1. Check browser permissions (Settings > Privacy > Location)
2. Make sure you're using HTTPS (or localhost)
3. Try clicking "Refresh Location" button

### No Recyclers Showing:
1. Check if Spring Boot is running (port 8080)
2. Verify database has recyclers: `SELECT * FROM recyclers;`
3. Check browser console for errors

### Distance Not Showing:
1. Make sure GPS is enabled
2. Click "Refresh Location" button
3. Check if latitude/longitude are valid

---

## 🚀 Future Enhancements

- [ ] Add map view with markers
- [ ] Add recycler reviews and comments
- [ ] Add photos of recycling centers
- [ ] Add booking/appointment system
- [ ] Add real-time availability status
- [ ] Add recycler search by name
- [ ] Add filter by accepted items
- [ ] Add user-submitted recyclers
- [ ] Add navigation integration (Uber, Ola)
- [ ] Add recycler operating status (Open/Closed)

---

## ✨ Success!

Your GPS-based recycler locator is now fully functional! Users can:
- Find recyclers near them
- See distances and ratings
- Get directions, call, or email recyclers
- Sort by distance or rating
- View verified recyclers
