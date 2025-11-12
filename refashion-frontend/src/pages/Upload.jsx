import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectObjects } from '../api/detectionService.js';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { useBag } from '../hooks/useBag.js';

const UploadPage = () => {
  const { user } = useAuth();
  const { addToBag } = useBag();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [detectionResults, setDetectionResults] = useState(null);
  const [isResellable, setIsResellable] = useState(false);
  const inputRef = useRef(null);

  const resetStatus = () => setStatus({ type: null, message: '' });

  const handleFileChange = useCallback((event) => {
    resetStatus();
    const nextFile = event.target.files?.[0];
    setFile(nextFile ?? null);
    setDetectionResults(null);
    
    // Create preview
    if (nextFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(nextFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    resetStatus();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setDetectionResults(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });
    setDetectionResults(null);
    
    try {
      // Call the detection API
      const results = await detectObjects(file);
      setDetectionResults(results);
      
      // Analyze results to determine if recyclable or resellable
      const detections = results.detections || [];
      
      if (detections.length === 0) {
        setStatus({
          type: 'warning',
          message: 'No clothing items detected. Please upload a clear image of your garment.',
        });
        setIsResellable(false);
      } else {
        // Determine category based on detected class name (not confidence)
        const hasResellable = detections.some(d => 
          d.class_name.toLowerCase().includes('resellable') || 
          d.class_name.toLowerCase() === 'resell'
        );
        const hasRecyclable = detections.some(d => 
          d.class_name.toLowerCase().includes('recyclable') || 
          d.class_name.toLowerCase() === 'recycle'
        );
        
        // If detected as "resellable", show resell/donate options
        // If detected as "recyclable", show only recycle option
        const resellable = hasResellable && !hasRecyclable;
        setIsResellable(resellable);
        
        setStatus({
          type: 'success',
          message: resellable 
            ? '✨ Great news! Your item is RESELLABLE!'
            : '♻️ Your item is RECYCLABLE!',
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        'Analysis failed. Please make sure the FastAPI backend is running on http://localhost:8000';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Upload Your Cloth</h1>
        <p className="text-sm text-gray-600">
          Share the story of your garment and give it a new life. Accepted formats: JPG, PNG, HEIC.
        </p>
        {user && (
          <div className="inline-flex items-center space-x-2 rounded-full bg-brand-light px-4 py-2 text-sm text-brand-dark">
            <span>Logged in as</span>
            <strong>{user.name ?? user.email}</strong>
          </div>
        )}
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6 rounded-3xl border border-dashed border-brand/40 bg-white p-8 shadow"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {preview ? (
              <div className="w-full overflow-hidden rounded-lg border-2 border-brand/20">
                <img src={preview} alt="Preview" className="h-64 w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-light text-brand">
                <span className="text-xl font-semibold">Upload</span>
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">Drag &amp; drop your cloth photo</p>
              <p className="mt-1 text-sm text-gray-500">High-quality photos help AI analyze better!</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <div className="flex flex-col items-center space-y-3">
              <Button type="button" onClick={() => inputRef.current?.click()}>
                {file ? 'Choose another file' : 'Browse Files'}
              </Button>
              {file && (
                <span className="text-sm text-gray-600">
                  Selected file: <strong>{file.name}</strong>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              AI will analyze if your item is recyclable or resellable
            </p>
            <Button type="submit" size="lg" disabled={isSubmitting || !file}>
              {isSubmitting ? 'Analyzing...' : 'Analyze Item'}
            </Button>
          </div>
          {status.type && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : status.type === 'warning'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {status.message}
            </div>
          )}
        </form>

        {/* Results Panel */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
          
          {detectionResults ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">
                  Detected Items: <strong>{detectionResults.detections?.length || 0}</strong>
                </p>
              </div>

              {detectionResults.detections && detectionResults.detections.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {detectionResults.detections.map((detection, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            {detection.class_name}
                          </span>
                          <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-dark">
                            {(detection.confidence * 100).toFixed(1)}% confident
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          {detection.class_name.toLowerCase().includes('resellable') || detection.class_name.toLowerCase() === 'resell'
                            ? '✨ Suitable for resale or donation'
                            : '♻️ Suitable for recycling'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-700">What would you like to do?</p>
                    
                    {isResellable ? (
                      <>
                        <div className="rounded-lg bg-green-50 p-3 text-xs text-green-700">
                          ✨ This item is in good condition! You can resell or donate it.
                        </div>
                        <div className="grid gap-2">
                          <Button
                            onClick={() => {
                              const topDetection = detectionResults.detections[0];
                              addToBag('resell', {
                                fileName: file.name,
                                preview,
                                detectedClass: topDetection.class_name,
                                confidence: topDetection.confidence,
                              });
                              setStatus({ type: 'success', message: '💰 Added to Resell bag!' });
                              setTimeout(() => navigate('/bag'), 1500);
                            }}
                            className="w-full"
                          >
                            💰 Add to Resell
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              const topDetection = detectionResults.detections[0];
                              addToBag('donation', {
                                fileName: file.name,
                                preview,
                                detectedClass: topDetection.class_name,
                                confidence: topDetection.confidence,
                              });
                              setStatus({ type: 'success', message: '❤️ Added to Donation bag!' });
                              setTimeout(() => navigate('/bag'), 1500);
                            }}
                            className="w-full"
                          >
                            ❤️ Add to Donation
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                          ♻️ This item is best suited for recycling.
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            const topDetection = detectionResults.detections[0];
                            addToBag('recycle', {
                              fileName: file.name,
                              preview,
                              detectedClass: topDetection.class_name,
                              confidence: topDetection.confidence,
                            });
                            setStatus({ type: 'success', message: '♻️ Added to Recycle bag!' });
                            setTimeout(() => navigate('/bag'), 1500);
                          }}
                          className="w-full"
                        >
                          ♻️ Add to Recycle
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Upload an image to see AI-powered analysis
                </p>
                <p className="text-xs text-gray-400">
                  Make sure the FastAPI backend is running
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadPage;

