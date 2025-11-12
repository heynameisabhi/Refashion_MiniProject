import { useCallback, useRef, useState } from 'react';
import { detectObjects } from '../api/detectionService.js';
import Button from '../components/Button.jsx';

const DetectionPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const data = await detectObjects(file);
      setResults(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Object Detection</h1>
        <p className="text-sm text-gray-600">
          Upload an image to detect objects using YOLOv8 AI model
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Upload Image</h2>
          
          <div className="flex flex-col items-center space-y-4">
            {preview && (
              <div className="w-full overflow-hidden rounded-lg border border-gray-200">
                <img src={preview} alt="Preview" className="h-auto w-full object-contain" />
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="detectionFileUpload"
            />

            <div className="flex gap-3">
              <Button type="button" onClick={() => inputRef.current?.click()}>
                {file ? 'Choose Another' : 'Select Image'}
              </Button>
              
              {file && (
                <>
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                  <Button type="button" onClick={handleReset} variant="secondary">
                    Reset
                  </Button>
                </>
              )}
            </div>

            {file && (
              <p className="text-sm text-gray-600">
                Selected: <strong>{file.name}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Detection Results</h2>
          
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Found <strong>{results.detections?.length || 0}</strong> object(s)
              </p>

              {results.detections && results.detections.length > 0 ? (
                <div className="space-y-3">
                  {results.detections.map((detection, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {detection.class_name}
                        </span>
                        <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-dark">
                          {(detection.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Class ID: {detection.class_id}</p>
                        <p>
                          Box: [{detection.bounding_box.map(v => v.toFixed(1)).join(', ')}]
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.detections ? (
                <p className="text-sm text-gray-500">No objects detected in this image</p>
              ) : null}
            </div>
          )}

          {!results && !error && (
            <p className="text-sm text-gray-500">
              Upload and analyze an image to see detection results
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetectionPage;
