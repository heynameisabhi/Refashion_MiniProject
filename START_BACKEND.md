# How to Start the FastAPI Backend

## Quick Start

Open a terminal and run:

```bash
cd FastApi_For_Refashion
python -m uvicorn main:app --reload --port 8000
```

You should see output like:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Verify It's Running

Open your browser and visit:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

You should see:
```json
{"message": "YOLOv8 API is running!"}
```

## Common Issues

### Port Already in Use
If you see "Address already in use", try a different port:
```bash
python -m uvicorn main:app --reload --port 8001
```

Then update the frontend `.env` file:
```
VITE_API_BASE_URL=http://localhost:8001
```

### Model Not Found
If you see "Error loading model", update the `MODEL_PATH` in `main.py`:
```python
MODEL_PATH = r"I:\D DRIVE\DESKTOP\best.pt"  # Update this path
```

## Testing the API

You can test the detection endpoint using the interactive docs at http://localhost:8000/docs

Or use curl:
```bash
curl -X POST "http://localhost:8000/detect/" -F "file=@path/to/your/image.jpg"
```
