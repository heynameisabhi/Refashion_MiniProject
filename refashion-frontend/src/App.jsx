import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import UploadPage from './pages/Upload.jsx';
import MarketplacePage from './pages/Marketplace.jsx';
import RewardsPage from './pages/Rewards.jsx';
import ProfilePage from './pages/Profile.jsx';
import DetectionPage from './pages/Detection.jsx';
import BagPage from './pages/Bag.jsx';
import CreateListingPage from './pages/CreateListing.jsx';
import SettingsPage from './pages/Settings.jsx';
import useAuth from './hooks/useAuth.js';

const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/upload" replace />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/detection" element={<DetectionPage />} />
          <Route path="/bag" element={<BagPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

