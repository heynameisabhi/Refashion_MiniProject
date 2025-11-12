# Frontend-Backend Connection Guide

## Setup Instructions

### 1. Start the FastAPI Backend

```bash
cd FastApi_For_Refashion
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 2. Start the Frontend

```bash
cd refashion-frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## How It Works

### Backend (FastAPI)
- **Endpoint**: `POST /detect/`
- **Purpose**: Accepts image files and returns object detection results using YOLOv8
- **CORS**: Configured to allow requests from `http://localhost:5173` and `http://localhost:3000`

### Frontend (React + Vite)
- **API Service**: `src/api/detectionService.js` - Handles communication with FastAPI
- **Detection Page**: `src/pages/Detection.jsx` - UI for uploading images and viewing results
- **Proxy**: Vite is configured to proxy `/api/*` requests to `http://localhost:8000`

## Using the Detection Feature

1. Navigate to `/detection` in your app (after logging in)
2. Click "Select Image" to choose an image file
3. Click "Analyze" to send the image to the FastAPI backend
4. View the detection results showing:
   - Detected object class names
   - Confidence scores
   - Bounding box coordinates

## API Integration Example

```javascript
import { detectObjects } from './api/detectionService.js';

// In your component
const handleAnalyze = async (imageFile) => {
  try {
    const results = await detectObjects(imageFile);
    console.log(results.detections);
  } catch (error) {
    console.error('Detection failed:', error);
  }
};
```

## Environment Variables

You can customize the API URL by creating a `.env` file in the frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Troubleshooting

- **CORS errors**: Make sure the FastAPI server is running and CORS is properly configured
- **Connection refused**: Verify both servers are running on the correct ports
- **Model not loading**: Check the `MODEL_PATH` in `FastApi_For_Refashion/main.py`
