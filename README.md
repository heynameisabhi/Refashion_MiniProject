# ReFashion - Sustainable Fashion Platform

A full-stack web application for sustainable fashion that enables users to recycle, resell, and donate clothing items while earning rewards.

## 🌟 Features

### Core Features
- **Item Upload & Detection** - AI-powered clothing detection and categorization
- **Three Action Paths**:
  - ♻️ Recycle - Find nearby recycling centers
  - 💰 Resell - List items in marketplace
  - ❤️ Donate - Contribute to charity
- **Rewards System** - Earn points for sustainable actions
- **Wallet & Purchases** - Buy marketplace items with points
- **GPS Recycler Locator** - Find cloth recyclers within 10km
- **User Authentication** - Secure login and signup with MySQL storage

### Advanced Features
- **Marketplace** - Browse and purchase items with points
- **My Bags** - Organize items by category (Recycle/Resell/Donate)
- **Profile Dashboard** - Track activities, purchases, and impact
- **Transaction History** - Complete record of earnings and spending
- **Nearby Recyclers** - GPS-based recycler search with contact info

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API calls
- **Context API** - State management

### Backend
- **Spring Boot** - Java backend framework
- **MySQL** - Database
- **FastAPI** - Python ML service (optional)
- **Hibernate/JPA** - ORM

### Database
- **MySQL 8.0+**
- Tables: users, bags, items, recyclers

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Java JDK** (17 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven** (3.6+) - Usually comes with Java
- **MySQL** (8.0+) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/heynameisabhi/Refashion_MiniProject.git
cd Refashion_MiniProject
```

### 2. Database Setup

#### Start MySQL Server
Make sure MySQL is running on your system.

#### Create Database
```sql
CREATE DATABASE refashiondb;
USE refashiondb;
```

The tables will be created automatically by Spring Boot on first run.

#### Configure Database Connection
Edit: `Refashion_backend/StartUP_Pitch/SpringBoot_GrowLoop/growloop-backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/refashiondb
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

**Note:** Change `username` and `password` to match your MySQL credentials.

### 3. Backend Setup (Spring Boot)

#### Navigate to Backend Directory
```bash
cd Refashion_backend/StartUP_Pitch/SpringBoot_GrowLoop/growloop-backend
```

#### Install Dependencies & Run
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**Windows Users:** Use `mvnw.cmd` instead of `./mvnw`

The backend will start on: **http://localhost:8080**

#### Verify Backend is Running
Open browser and go to: http://localhost:8080/api/auth/login
You should see a JSON response (even if it's an error, it means the server is running).

### 4. Frontend Setup (React)

#### Open New Terminal
Keep the backend running and open a new terminal.

#### Navigate to Frontend Directory
```bash
cd refashion-frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

The frontend will start on: **http://localhost:5173**

### 5. Optional: FastAPI ML Service

If you want to use the AI detection service:

```bash
cd FastApi_For_Refashion
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

The ML service will run on: **http://localhost:8000**

---

## 🎮 Running the Application

### Quick Start (All Services)

**Option 1: Manual Start**
1. Start MySQL Server
2. Start Spring Boot Backend (Terminal 1)
3. Start React Frontend (Terminal 2)
4. (Optional) Start FastAPI (Terminal 3)

**Option 2: Using Batch File (Windows)**
```bash
start-all-services.bat
```

### Access the Application

1. **Open Browser**: http://localhost:5173
2. **Sign Up**: Create a new account
3. **Start Using**: Upload items, earn points, shop marketplace!

---

## 📖 User Guide

### Getting Started

#### 1. Create Account
- Go to: http://localhost:5173/signup
- Enter name, email, password
- Click "Sign Up"
- You'll be auto-logged in

#### 2. Upload Items
- Click "Upload" in navbar
- Upload clothing images
- AI detects item type
- Choose action: Recycle/Resell/Donate

#### 3. Earn Points
- **Recycle**: +10 points per item
- **Resell**: +15 points per item
- **Donate**: +12 points per item
- **Create Listing**: +20 points

#### 4. Shop Marketplace
- Browse items from all users
- Buy with your points (10 points = ₹1)
- Items delivered to you

#### 5. Find Recyclers
- Click "Recyclers" in navbar
- Allow location access
- See recyclers within 10km
- Get directions, call, or email

---

## 🗂️ Project Structure

```
Refashion_MiniProject/
├── refashion-frontend/          # React Frontend
│   ├── src/
│   │   ├── api/                 # API services
│   │   ├── components/          # Reusable components
│   │   ├── context/             # Context providers
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Page components
│   │   └── App.jsx              # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── Refashion_backend/           # Spring Boot Backend
│   └── StartUP_Pitch/
│       └── SpringBoot_GrowLoop/
│           └── growloop-backend/
│               ├── src/main/java/com/growloop/
│               │   ├── controller/      # REST controllers
│               │   ├── entity/          # Database entities
│               │   ├── repository/      # JPA repositories
│               │   ├── service/         # Business logic
│               │   └── authentication/  # Auth DTOs
│               ├── src/main/resources/
│               │   └── application.properties
│               └── pom.xml
│
├── FastApi_For_Refashion/       # Python ML Service (Optional)
│   ├── main.py
│   └── requirements.txt
│
└── README.md                    # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Items
- `GET /api/items/marketplace` - Get marketplace items
- `POST /api/items/bags/{bagId}` - Add item to bag
- `GET /api/items/my-items` - Get user's items

### Bags
- `POST /api/bags/create` - Create new bag
- `GET /api/bags/my-bags` - Get user's bags
- `POST /api/bags/{bagId}/schedule-pickup` - Schedule pickup

### Recyclers
- `GET /api/recyclers/all` - Get all recyclers
- `GET /api/recyclers/nearby?latitude={lat}&longitude={lon}&radiusKm=10` - Get nearby recyclers
- `GET /api/recyclers/verified` - Get verified recyclers only

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(255),
  email_id VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  address_text TEXT,
  loyalty_point_balance INT DEFAULT 0,
  latitude DOUBLE,
  longitude DOUBLE,
  created_at DATETIME,
  updated_at DATETIME,
  is_premium BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE
);
```

### Bags Table
```sql
CREATE TABLE bags (
  bag_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  bag_name VARCHAR(255),
  purpose ENUM('RESALE', 'DONATION', 'RECYCLE'),
  status ENUM('OPEN', 'AWAITING_PICKUP', 'COLLECTED', 'CLOSED'),
  total_items INT DEFAULT 0,
  points_awarded INT DEFAULT 0,
  delivery_charge DOUBLE DEFAULT 50.0,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Items Table
```sql
CREATE TABLE items (
  item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bag_id BIGINT NOT NULL,
  contributor_id BIGINT NOT NULL,
  item_type VARCHAR(100) NOT NULL,
  condition_description TEXT,
  gender VARCHAR(20),
  age_group VARCHAR(20),
  grade ENUM('A', 'B', 'PENDING'),
  status ENUM('PENDING_QC', 'APPROVED', 'REJECTED'),
  loyalty_point DECIMAL(10,2) DEFAULT 0,
  added_at DATETIME,
  FOREIGN KEY (bag_id) REFERENCES bags(bag_id),
  FOREIGN KEY (contributor_id) REFERENCES users(user_id)
);
```

### Recyclers Table
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

## 🧪 Testing

### Test User Credentials
- **Email**: testuser@example.com
- **Password**: Any password (for demo)

### Test Flow
1. **Sign Up** → Create account
2. **Upload** → Upload 5 items
3. **Recycle** → Add all to recycle (+50 points)
4. **Marketplace** → Buy item with points
5. **Profile** → View purchase history
6. **Recyclers** → Find nearby centers

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
```bash
# Solution: Check if port 8080 is in use
netstat -ano | findstr :8080
# Kill the process or change port in application.properties
```

**Problem**: Database connection error
```bash
# Solution: Verify MySQL is running
mysql -u root -p
# Check credentials in application.properties
```

### Frontend Issues

**Problem**: Frontend won't start
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Problem**: API calls failing
```bash
# Solution: Check if backend is running
curl http://localhost:8080/api/auth/login
# Verify CORS is enabled in Spring Boot
```

### Common Issues

**Issue**: "No recyclers found"
- **Solution**: Make sure you've allowed location access in browser
- Check if recyclers exist in database within 10km

**Issue**: "Insufficient points"
- **Solution**: Upload more items to earn points
- Each recycle action gives +10 points

**Issue**: Marketplace images not showing
- **Solution**: Images are loaded from Unsplash CDN
- Check internet connection

---

## 📊 Features Overview

### Wallet System
- **Earn Points**: Upload and categorize items
- **Spend Points**: Purchase marketplace items
- **Conversion**: 10 points = ₹1
- **Transaction History**: Track all activities

### GPS Recycler Locator
- **Location-Based**: Find recyclers within 10km
- **Contact Info**: Phone, email, address
- **Directions**: Open in Google Maps
- **Verified Badge**: Trusted recyclers marked

### Marketplace
- **Browse Items**: See all Grade A approved items
- **Purchase**: Buy with points
- **Images**: Placeholder images from Unsplash
- **Filters**: Sort by brand, category

### Profile Dashboard
- **Activity Stats**: Recycled, donated, resold counts
- **Purchase History**: All your orders
- **Points Balance**: Current wallet balance
- **Impact Tracking**: CO₂ saved calculation

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created for educational purposes.

---

## 👥 Team

- **Developer**: Abhi
- **Project**: Mini Project - Sustainable Fashion Platform
- **Institution**: SODE

---

## 📞 Support

For issues or questions:
- **Email**: support@refashion.app
- **GitHub Issues**: [Create an issue](https://github.com/heynameisabhi/Refashion_MiniProject/issues)

---

## 🎉 Acknowledgments

- Unsplash for placeholder images
- Spring Boot community
- React community
- All contributors

---

## 📅 Version History

- **v1.0.0** (Nov 2025) - Initial release
  - User authentication
  - Item upload and categorization
  - Marketplace with points system
  - GPS recycler locator
  - Wallet and purchase system
  - Profile dashboard

---

**Made with ❤️ for a sustainable future**
