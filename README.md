# ReFashion - Sustainable Fashion Marketplace

A full-stack web application that uses AI to classify clothing items as recyclable or resellable, helping users make sustainable fashion choices.

## 🌟 Features

### 1. AI-Powered Detection
- Upload clothing images for instant AI analysis
- YOLOv8 model classifies items as "resellable" or "recyclable"
- Real-time confidence scores and bounding boxes

### 2. Smart Bag System
- **Resell Bag**: For high-quality items ready to sell
- **Donation Bag**: For items to donate
- **Recycle Bag**: For items to recycle
- Automatic categorization based on AI detection

### 3. Marketplace Listing
- Create detailed listings with multiple images (up to 5)
- Add price, description, brand, size, category, and condition
- Browse all listings in the marketplace
- Filter by brand, category, and condition

### 4. User Authentication
- Login/Sign up system
- Guest mode for quick access
- Protected routes for authenticated users

## 🚀 Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **React Router** 6.28.0 - Navigation
- **Axios** 1.7.7 - HTTP client
- **Tailwind CSS** 3.4.14 - Styling
- **Vite** 5.4.10 - Build tool

### Backend
- **FastAPI** 0.120.1 - Python web framework
- **YOLOv8** (Ultralytics 8.3.221) - Object detection
- **Pillow** 12.0.0 - Image processing
- **Uvicorn** 0.38.0 - ASGI server

## 📦 Installation

### Prerequisites
- Python 3.14+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the FastAPI directory:
```bash
cd FastApi_For_Refashion
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Update the model path in `main.py`:
```python
MODEL_PATH = r"path/to/your/best.pt"
```

4. Start the server:
```bash
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd refashion-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage

### 1. Upload & Analyze
1. Go to the Upload page
2. Upload a clothing image
3. Click "Analyze Item"
4. AI will classify it as resellable or recyclable

### 2. Add to Bags
- **If Resellable**: Choose "Add to Resell" or "Add to Donation"
- **If Recyclable**: Click "Add to Recycle"

### 3. Create Listing (Resellable Items Only)
1. Go to "My Bags" → Resell tab
2. Click "List Item" on any item
3. Add multiple images
4. Fill in details (title, price, description, etc.)
5. Click "Create Listing"

### 4. Browse Marketplace
- View all listings
- Filter by brand, category, condition
- See prices and descriptions

## 📁 Project Structure

```
Refashion_webApp/
├── FastApi_For_Refashion/          # Backend
│   ├── main.py                     # FastAPI app
│   └── requirements.txt            # Python dependencies
│
├── refashion-frontend/             # Frontend
│   ├── src/
│   │   ├── api/                    # API services
│   │   ├── components/             # React components
│   │   ├── context/                # Context providers
│   │   ├── hooks/                  # Custom hooks
│   │   └── pages/                  # Page components
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔧 Configuration

### Environment Variables (Frontend)

Create a `.env` file in `refashion-frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### CORS Configuration (Backend)

The backend is configured to allow requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:3000`

## 📝 API Endpoints

### GET `/`
Health check endpoint
```json
{
  "message": "YOLOv8 API is running!"
}
```

### POST `/detect/`
Upload an image for object detection
- **Request**: `multipart/form-data` with `file` field
- **Response**:
```json
{
  "detections": [
    {
      "class_id": 0,
      "class_name": "resellable",
      "confidence": 0.85,
      "bounding_box": [x1, y1, x2, y2]
    }
  ]
}
```

## 🎨 Features in Detail

### Bag System
- **localStorage persistence**: Items survive page refresh
- **Real-time badge counts**: See total items in navbar
- **Independent actions**: Each bag operates separately

### Listing System
- **Multi-image upload**: Up to 5 images per listing
- **Form validation**: Required fields enforced
- **localStorage storage**: Listings persist locally
- **Marketplace integration**: Listings appear immediately

### AI Detection
- **Class-based logic**: Uses AI classification, not confidence
- **Smart button display**: Shows only relevant options
- **Visual feedback**: Color-coded messages for each category

## 🐛 Troubleshooting

### Backend Issues
- **Model not loading**: Check `MODEL_PATH` in `main.py`
- **Port in use**: Change port in uvicorn command
- **CORS errors**: Verify frontend URL in CORS configuration

### Frontend Issues
- **Network errors**: Ensure backend is running on port 8000
- **Items not persisting**: Check browser localStorage
- **Images not uploading**: Verify file format (JPG, PNG, HEIC)

## 📚 Documentation

Additional documentation files:
- `BAG_SYSTEM_FEATURES.md` - Bag system details
- `LISTING_SYSTEM_GUIDE.md` - Marketplace listing guide
- `CONNECTION_GUIDE.md` - Frontend-backend connection
- `QUICK_START_GUIDE.md` - Quick start instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a mini-project for educational purposes.

## 👥 Authors

- [@heynameisabhi](https://github.com/heynameisabhi)

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- FastAPI framework
- React and Vite communities
- Tailwind CSS

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for sustainable fashion
