import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import { recyclerService } from '../api/springBootService.js';

const RecyclerLocatorPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // distance or rating

  // Sample recycler data (in production, this would come from backend)
  const sampleRecyclers = [
    {
      id: 1,
      name: 'Green Recycling Center',
      address: '123 Eco Street, Green City',
      phone: '+91 98765 43210',
      email: 'contact@greenrecycling.com',
      latitude: 12.9716,
      longitude: 77.5946,
      rating: 4.5,
      acceptedItems: ['Clothes', 'Textiles', 'Shoes', 'Bags'],
      openHours: 'Mon-Sat: 9AM-6PM',
      verified: true
    },
    {
      id: 2,
      name: 'EcoFriendly Textiles',
      address: '456 Recycle Road, Eco Town',
      phone: '+91 98765 43211',
      email: 'info@ecofriendly.com',
      latitude: 12.9352,
      longitude: 77.6245,
      rating: 4.8,
      acceptedItems: ['Clothes', 'Textiles', 'Fabric Scraps'],
      openHours: 'Mon-Fri: 10AM-5PM',
      verified: true
    },
    {
      id: 3,
      name: 'Sustainable Fashion Hub',
      address: '789 Green Avenue, Sustainability City',
      phone: '+91 98765 43212',
      email: 'hello@sustainablefashion.com',
      latitude: 12.9141,
      longitude: 77.6411,
      rating: 4.3,
      acceptedItems: ['Clothes', 'Shoes', 'Accessories'],
      openHours: 'Mon-Sun: 8AM-8PM',
      verified: false
    }
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        loadRecyclers(location);
      },
      (error) => {
        setError('Unable to get your location. Please enable location services.');
        console.error('Geolocation error:', error);
        setIsLoading(false);
        // Load recyclers without distance calculation
        loadRecyclers(null);
      }
    );
  };

  // Load recyclers and calculate distances
  const loadRecyclers = async (location) => {
    setIsLoading(true);
    
    try {
      let response;
      
      // Try to fetch from backend API
      if (location) {
        response = await recyclerService.getNearby(
          location.latitude,
          location.longitude,
          10 // 10km radius
        );
      } else {
        response = await recyclerService.getAll();
      }

      let recyclersData = response.success ? response.data : [];
      
      // If backend fails or returns empty, use sample data
      if (recyclersData.length === 0) {
        console.log('Using sample recycler data');
        recyclersData = sampleRecyclers.map(recycler => {
          if (location) {
            const distance = calculateDistance(
              location.latitude,
              location.longitude,
              recycler.latitude,
              recycler.longitude
            );
            return { ...recycler, distance: distance.toFixed(2) };
          }
          return { ...recycler, distance: null };
        });
      }

      // Sort by distance or rating
      if (sortBy === 'distance' && location) {
        recyclersData.sort((a, b) => parseFloat(a.distance || 0) - parseFloat(b.distance || 0));
      } else if (sortBy === 'rating') {
        recyclersData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setRecyclers(recyclersData);
    } catch (error) {
      console.error('Error loading recyclers:', error);
      // Fallback to sample data
      let recyclersData = sampleRecyclers.map(recycler => {
        if (location) {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            recycler.latitude,
            recycler.longitude
          );
          return { ...recycler, distance: distance.toFixed(2) };
        }
        return { ...recycler, distance: null };
      });
      setRecyclers(recyclersData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadRecyclers(userLocation);
    }
  }, [sortBy]);

  const openInMaps = (recycler) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${recycler.latitude},${recycler.longitude}`;
    window.open(url, '_blank');
  };

  const callRecycler = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const emailRecycler = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Cloth Recyclers Near You</h1>
          <p className="mt-2 text-gray-600">
            Find verified cloth recycling centers in your area
          </p>
        </div>

        {/* Location Status */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              {userLocation ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Location Enabled</p>
                    <p className="text-sm text-gray-600">
                      Showing recyclers within <span className="font-semibold text-brand">10 km</span> radius
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Location Disabled</p>
                    <p className="text-sm text-gray-600">
                      Enable location to see recyclers within 10 km
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={getUserLocation} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh Location'}
            </Button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSortBy('distance')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              sortBy === 'distance'
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={!userLocation}
          >
            Sort by Distance
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              sortBy === 'rating'
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sort by Rating
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Recyclers List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Finding recyclers near you...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recyclers.map((recycler) => (
              <div
                key={recycler.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {recycler.name}
                      </h3>
                      {recycler.verified && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1">
                      <span className="text-yellow-600">⭐</span>
                      <span className="text-sm font-semibold text-yellow-700">
                        {recycler.rating}
                      </span>
                    </div>
                  </div>

                  {/* Distance */}
                  {recycler.distance && (
                    <div className="mb-4 flex items-center gap-2 text-brand">
                      <span className="text-xl">📍</span>
                      <span className="font-semibold">{recycler.distance} km away</span>
                    </div>
                  )}

                  {/* Address */}
                  <div className="mb-4 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <span className="text-lg">📍</span>
                      <span>{recycler.address}</span>
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="mb-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">📞</span>
                      <span>{recycler.phone}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">✉️</span>
                      <span className="truncate">{recycler.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">🕒</span>
                      <span>{recycler.openHours}</span>
                    </p>
                  </div>

                  {/* Accepted Items */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold text-gray-700">Accepts:</p>
                    <div className="flex flex-wrap gap-1">
                      {recycler.acceptedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-brand-light px-2 py-1 text-xs text-brand-dark"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openInMaps(recycler)}
                      className="rounded-xl bg-brand px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-dark"
                    >
                      Directions
                    </button>
                    <button
                      onClick={() => callRecycler(recycler.phone)}
                      className="rounded-xl bg-green-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-600"
                    >
                      Call
                    </button>
                    <button
                      onClick={() => emailRecycler(recycler.email)}
                      className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600"
                    >
                      Email
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recyclers.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center">
            <span className="text-6xl">🔍</span>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No recyclers found
            </h3>
            <p className="mt-2 text-gray-600">
              Try enabling location services or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecyclerLocatorPage;
