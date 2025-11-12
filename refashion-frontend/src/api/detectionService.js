import axiosInstance from './axiosConfig.js';

/**
 * Send an image file to the FastAPI backend for object detection
 * @param {File} file - The image file to analyze
 * @returns {Promise<Object>} Detection results with class names, confidence, and bounding boxes
 */
export const detectObjects = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/detect/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Check if the API is running
 * @returns {Promise<Object>} API status message
 */
export const checkApiStatus = async () => {
  const response = await axiosInstance.get('/');
  return response.data;
};
