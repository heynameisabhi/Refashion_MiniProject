import axios from 'axios';

// Create separate axios instance for Spring Boot backend
const springBootInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Firebase UID (for now we'll use a mock)
springBootInstance.interceptors.request.use((config) => {
  // For now, we'll use a mock Firebase UID
  // In a real app, this would come from Firebase Auth
  const mockFirebaseUid = localStorage.getItem('mock_firebase_uid') || 'guest-user-123';
  config.headers['Firebase-UID'] = mockFirebaseUid;
  return config;
});

// User Services
export const userService = {
  // Login user
  login: async (credentials) => {
    const response = await springBootInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await springBootInstance.post('/auth/signup', userData);
    return response.data;
  },

  // Get user profile
  getProfile: async (token) => {
    const response = await springBootInstance.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await springBootInstance.put('/users/profile', userData);
    return response.data;
  },

  // Check if user exists
  checkExists: async () => {
    const response = await springBootInstance.get('/users/exists');
    return response.data;
  },
};

// Bag Services
export const bagService = {
  // Create a new bag
  create: async (bagData) => {
    const response = await springBootInstance.post('/bags/create', bagData);
    return response.data;
  },

  // Get user's bags
  getUserBags: async () => {
    const response = await springBootInstance.get('/bags/my-bags');
    return response.data;
  },

  // Get bags by purpose (RESALE, DONATION)
  getBagsByPurpose: async (purpose) => {
    const response = await springBootInstance.get(`/bags/my-bags/${purpose}`);
    return response.data;
  },

  // Get bag by ID
  getBagById: async (bagId) => {
    const response = await springBootInstance.get(`/bags/${bagId}`);
    return response.data;
  },

  // Schedule pickup
  schedulePickup: async (bagId) => {
    const response = await springBootInstance.post(`/bags/${bagId}/schedule-pickup`);
    return response.data;
  },
};

// Item Services
export const itemService = {
  // Add item to bag
  addToBag: async (bagId, itemData) => {
    const response = await springBootInstance.post(`/items/bags/${bagId}`, itemData);
    return response.data;
  },

  // Add item for recycling
  addForRecycling: async (itemData) => {
    const response = await springBootInstance.post('/items/recycle', itemData);
    return response.data;
  },

  // Get items in a bag
  getBagItems: async (bagId) => {
    const response = await springBootInstance.get(`/items/bags/${bagId}`);
    return response.data;
  },

  // Get user's items
  getUserItems: async () => {
    const response = await springBootInstance.get('/items/my-items');
    return response.data;
  },

  // Get user's recycling items
  getRecyclingItems: async () => {
    const response = await springBootInstance.get('/items/my-recycling');
    return response.data;
  },

  // Get marketplace items
  getMarketplaceItems: async () => {
    const response = await springBootInstance.get('/items/marketplace');
    return response.data;
  },
};

// Recycler Services
export const recyclerService = {
  // Get all recyclers
  getAll: async () => {
    const response = await springBootInstance.get('/recyclers/all');
    return response.data;
  },

  // Get nearby recyclers
  getNearby: async (latitude, longitude, radiusKm = 10) => {
    const response = await springBootInstance.get('/recyclers/nearby', {
      params: { latitude, longitude, radiusKm }
    });
    return response.data;
  },

  // Get verified recyclers only
  getVerified: async () => {
    const response = await springBootInstance.get('/recyclers/verified');
    return response.data;
  },
};

// Helper function to set mock Firebase UID
export const setMockFirebaseUid = (uid) => {
  localStorage.setItem('mock_firebase_uid', uid);
};

export default springBootInstance;