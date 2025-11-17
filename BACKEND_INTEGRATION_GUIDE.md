# Backend Integration Guide

## Overview

The ReFashion application now supports **dual backend architecture**:

1. **FastAPI Backend** - Handles AI detection using YOLOv8
2. **Spring Boot Backend** - Handles data management, user accounts, and business logic

## Architecture

```
Frontend (React)
    ↓
┌─────────────────┬─────────────────┐
│   FastAPI       │   Spring Boot   │
│   Port: 8000    │   Port: 8080    │
│   AI Detection  │   Data & Users  │
└─────────────────┴─────────────────┘
    ↓                       ↓
YOLOv8 Model           MySQL Database
```

## Prerequisites

### 1. FastAPI Backend
- Python 3.14+
- YOLOv8 model file (`best.pt`)
- All dependencies from `requirements.txt`

### 2. Spring Boot Backend
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### 3. Frontend
- Node.js 18+
- npm or yarn

## Setup Instructions

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE refashiondb;
```

### 2. Start All Services

**Option A: Use the startup script (Windows)**
```bash
start-all-services.bat
```

**Option B: Manual startup**

Terminal 1 - FastAPI:
```bash
cd FastApi_For_Refashion
python -m uvicorn main:app --reload --port 8000
```

Terminal 2 - Spring Boot:
```bash
cd Refashion_backend/StartUP_Pitch/SpringBoot_GrowLoop/growloop-backend
./mvnw spring-boot:run
```

Terminal 3 - Frontend:
```bash
cd refashion-frontend
npm run dev
```

## Service URLs

- **Frontend**: http://localhost:5173
- **FastAPI**: http://localhost:8000
- **Spring Boot**: http://localhost:8080
- **FastAPI Docs**: http://localhost:8000/docs

## API Integration

### FastAPI Endpoints (AI Detection)
- `GET /` - Health check
- `POST /detect/` - Image detection

### Spring Boot Endpoints (Data Management)

#### Users
- `POST /api/users/register` - Register user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/exists` - Check if user exists

#### Bags
- `POST /api/bags/create` - Create bag
- `GET /api/bags/my-bags` - Get user's bags
- `GET /api/bags/my-bags/{purpose}` - Get bags by purpose
- `POST /api/bags/{bagId}/schedule-pickup` - Schedule pickup

#### Items
- `POST /api/items/bags/{bagId}` - Add item to bag
- `POST /api/items/recycle` - Add item for recycling
- `GET /api/items/my-items` - Get user's items
- `GET /api/items/marketplace` - Get marketplace items

## Frontend Integration

### API Services

1. **detectionService.js** - FastAPI integration
2. **springBootService.js** - Spring Boot integration
3. **axiosConfig.js** - General HTTP client

### Usage Example

```javascript
import { detectObjects } from './api/detectionService.js';
import { itemService } from './api/springBootService.js';

// 1. Detect with AI
const results = await detectObjects(imageFile);

// 2. Save to backend
await itemService.addForRecycling({
  name: 'T-Shirt',
  description: 'Cotton t-shirt',
  imageUrl: 'base64...',
});
```

## Configuration

### Frontend Environment Variables

Create `.env` in `refashion-frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SPRING_BOOT_URL=http://localhost:8080
```

### Spring Boot Configuration

Update `application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/refashiondb
spring.datasource.username=root
spring.datasource.password=root
```

## Testing the Integration

### 1. Check Backend Status
Go to: http://localhost:5173/settings

This page shows:
- ✅ FastAPI connection status
- ✅ Spring Boot connection status
- 🔧 Mock Firebase UID configuration
- 👤 User management tools

### 2. Test User Flow

1. **Upload Image** → FastAPI detects "resellable" or "recyclable"
2. **Add to Bag** → Spring Boot stores the item
3. **View in Marketplace** → Items appear from both backends

### 3. Database Verification

Check MySQL tables:
```sql
USE refashiondb;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM items;
SELECT * FROM bags;
```

## Troubleshooting

### Common Issues

**1. Spring Boot won't start**
- Check Java version: `java -version`
- Verify MySQL is running
- Check database exists: `SHOW DATABASES;`

**2. FastAPI connection failed**
- Verify Python dependencies: `pip install -r requirements.txt`
- Check model path in `main.py`
- Ensure port 8000 is free

**3. Frontend can't connect**
- Check CORS settings in both backends
- Verify ports in axios configuration
- Check browser console for errors

**4. Database connection failed**
- Verify MySQL credentials in `application.properties`
- Check if database `refashiondb` exists
- Test connection: `mysql -u root -p`

### Port Conflicts

If ports are in use, update:

**FastAPI**: Change port in uvicorn command
```bash
python -m uvicorn main:app --reload --port 8001
```

**Spring Boot**: Update `application.properties`
```properties
server.port=8081
```

**Frontend**: Update axios base URLs

## Development Workflow

### 1. Feature Development
1. Update Spring Boot entities/controllers
2. Update frontend API services
3. Test integration via Settings page

### 2. Database Changes
1. Update JPA entities
2. Spring Boot auto-creates tables
3. Test with sample data

### 3. AI Model Updates
1. Replace `best.pt` file
2. Restart FastAPI
3. Test detection accuracy

## Production Deployment

### Environment-Specific Configuration

**Development**:
- FastAPI: localhost:8000
- Spring Boot: localhost:8080
- MySQL: localhost:3306

**Production**:
- Use environment variables
- Configure proper CORS origins
- Use production database
- Enable HTTPS

## Benefits of Dual Backend

1. **Separation of Concerns**
   - AI/ML operations isolated in FastAPI
   - Business logic in Spring Boot

2. **Scalability**
   - Scale AI backend independently
   - Scale data backend based on load

3. **Technology Optimization**
   - Python for AI/ML tasks
   - Java for enterprise features

4. **Maintainability**
   - Clear boundaries between services
   - Independent deployment cycles