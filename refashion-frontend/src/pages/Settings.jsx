import { useState, useEffect } from 'react';
import Button from '../components/Button.jsx';
import { userService, setMockFirebaseUid } from '../api/springBootService.js';
import { checkApiStatus } from '../api/detectionService.js';

const SettingsPage = () => {
  const [springBootStatus, setSpringBootStatus] = useState('checking');
  const [fastApiStatus, setFastApiStatus] = useState('checking');
  const [mockUid, setMockUid] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkBackendStatus();
    loadMockUid();
  }, []);

  const checkBackendStatus = async () => {
    // Check FastAPI status
    try {
      await checkApiStatus();
      setFastApiStatus('connected');
    } catch (error) {
      setFastApiStatus('disconnected');
    }

    // Check Spring Boot status
    try {
      await userService.checkExists();
      setSpringBootStatus('connected');
    } catch (error) {
      setSpringBootStatus('disconnected');
    }
  };

  const loadMockUid = () => {
    const uid = localStorage.getItem('mock_firebase_uid') || 'guest-user-123';
    setMockUid(uid);
  };

  const handleUidChange = (e) => {
    setMockUid(e.target.value);
  };

  const saveMockUid = () => {
    setMockFirebaseUid(mockUid);
    alert('Mock Firebase UID saved!');
  };

  const testUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUserProfile(response);
      alert('User profile loaded successfully!');
    } catch (error) {
      alert('Failed to load user profile: ' + error.message);
    }
  };

  const createTestUser = async () => {
    try {
      const userData = {
        name: 'Test User',
        email: 'test@refashion.com',
        phoneNumber: '+1234567890',
        address: '123 Test Street, Test City',
      };
      
      const response = await userService.register(userData);
      alert('Test user created successfully!');
      setUserProfile(response);
    } catch (error) {
      alert('Failed to create test user: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'disconnected': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return '✅ Connected';
      case 'disconnected': return '❌ Disconnected';
      default: return '🔄 Checking...';
    }
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Settings & Backend Status</h1>
        <p className="text-sm text-gray-600">
          Configure and monitor your backend connections
        </p>
      </header>

      {/* Backend Status */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Backend Status</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">FastAPI (AI Detection)</h3>
              <p className="text-sm text-gray-600">http://localhost:8000</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fastApiStatus)}`}>
              {getStatusText(fastApiStatus)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Spring Boot (Data Management)</h3>
              <p className="text-sm text-gray-600">http://localhost:8080</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(springBootStatus)}`}>
              {getStatusText(springBootStatus)}
            </span>
          </div>
        </div>

        <Button onClick={checkBackendStatus} className="mt-4">
          Refresh Status
        </Button>
      </div>

      {/* Mock Firebase UID */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mock Firebase UID</h2>
        <p className="text-sm text-gray-600 mb-4">
          Set a mock Firebase UID for testing the Spring Boot backend
        </p>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={mockUid}
            onChange={handleUidChange}
            placeholder="Enter mock Firebase UID"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <Button onClick={saveMockUid}>Save</Button>
        </div>
      </div>

      {/* User Management */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={testUserProfile}>Load User Profile</Button>
            <Button onClick={createTestUser} variant="secondary">Create Test User</Button>
          </div>

          {userProfile && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-2">User Profile:</h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Instructions</h2>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-900">1. FastAPI Backend (AI Detection)</h3>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
cd FastApi_For_Refashion
python -m uvicorn main:app --reload --port 8000
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">2. Spring Boot Backend (Data Management)</h3>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
cd Refashion_backend/StartUP_Pitch/SpringBoot_GrowLoop/growloop-backend
./mvnw spring-boot:run
            </pre>
            <p className="mt-2 text-xs text-gray-500">
              Note: Make sure MySQL is running and create database 'refashiondb'
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">3. MySQL Database</h3>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
CREATE DATABASE refashiondb;
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;