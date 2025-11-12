from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

# --- Configuration ---
# IMPORTANT: Update this path to where your best.pt file is located!
MODEL_PATH = r"I:\D DRIVE\DESKTOP\best.pt"  # Using raw string for Windows paths

# --- Load the YOLOv8 Model ---
# Load your trained .pt model (this happens once when the server starts)
try:
	model = YOLO(MODEL_PATH)
	print(f"Successfully loaded model from: {MODEL_PATH}")
except Exception as e:
	print(f"Error loading model: {e}")
	model = None

# --- Initialize FastAPI ---
app = FastAPI(title="YOLOv8 Object Detection API")

# --- Configure CORS ---
app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://localhost:5173",
		"http://localhost:5174", 
		"http://localhost:5175",
		"http://localhost:3000"
	],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# --- Define the Detection Endpoint ---
@app.post("/detect/")
async def detect_objects(file: UploadFile = File(...)):
	"""
	Receives an image file, performs YOLOv8 object detection,
	and returns detected objects as JSON.
	"""
	if not model:
		raise HTTPException(status_code=500, detail="Model could not be loaded")

	# --- Read and Validate Image ---
	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="File provided is not an image.")

	try:
		# Read image content
		contents = await file.read()
		# Open image using Pillow
		img = Image.open(io.BytesIO(contents)).convert('RGB')  # Ensure image is RGB
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Error processing image file: {e}")
	finally:
		await file.close()  # Ensure file is closed

	# --- Run YOLOv8 Inference ---
	try:
		results = model(img)  # Run detection
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Error during model inference: {e}")

	# --- Process and Format Results ---
	detections = []
	if results:
		result = results[0]
		boxes = result.boxes

		for i in range(len(boxes)):
			box = boxes[i]
			class_id = int(box.cls)
			class_name = model.names.get(class_id, str(class_id)) if hasattr(model, 'names') else str(class_id)
			confidence = float(box.conf)
			bounding_box = box.xyxy[0].tolist()  # [xmin, ymin, xmax, ymax]

			detections.append({
				"class_id": class_id,
				"class_name": class_name,
				"confidence": confidence,
				"bounding_box": bounding_box
			})

	return {"detections": detections}

# --- (Optional) Simple root endpoint for testing ---
@app.get("/")
def read_root():
	return {"message": "YOLOv8 API is running!"}
