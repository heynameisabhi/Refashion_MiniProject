import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBag } from '../hooks/useBag.js';
import Button from '../components/Button.jsx';
import { recyclerService } from '../api/springBootService.js';

const BagPage = () => {
  const navigate = useNavigate();
  const { bags, removeFromBag, clearBag, counts } = useBag();
  const [activeTab, setActiveTab] = useState('resell');
  const [nearbyRecyclers, setNearbyRecyclers] = useState([]);
  const [loadingRecyclers, setLoadingRecyclers] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const tabs = [
    { id: 'resell', label: 'Resell', icon: '💰', count: counts.resell },
    { id: 'donation', label: 'Donation', icon: '❤️', count: counts.donation },
    { id: 'recycle', label: 'Recycle', icon: '♻️', count: counts.recycle },
  ];

  const currentItems = bags[activeTab] || [];

  // Load nearby recyclers when Recycle tab is active
  useEffect(() => {
    if (activeTab === 'recycle') {
      loadNearbyRecyclers();
    }
  }, [activeTab]);

  const loadNearbyRecyclers = () => {
    setLoadingRecyclers(true);
    
    if (!navigator.geolocation) {
      setLoadingRecyclers(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);

        try {
          const response = await recyclerService.getNearby(
            location.latitude,
            location.longitude,
            10 // 10km radius
          );
          
          if (response.success && response.data) {
            setNearbyRecyclers(response.data);
          }
        } catch (error) {
          console.error('Error loading recyclers:', error);
        } finally {
          setLoadingRecyclers(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoadingRecyclers(false);
      }
    );
  };

  const handleRemove = (itemId) => {
    removeFromBag(activeTab, itemId);
  };

  const handleClearAll = () => {
    if (window.confirm(`Are you sure you want to clear all items from ${activeTab}?`)) {
      clearBag(activeTab);
    }
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">My Bags</h1>
        <p className="text-sm text-gray-600">
          Organize your items for resale, donation, or recycling
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand-dark">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {currentItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-16 text-center">
            <div className="space-y-3">
              <p className="text-4xl">{tabs.find((t) => t.id === activeTab)?.icon}</p>
              <p className="text-lg font-semibold text-gray-900">
                No items in {activeTab} yet
              </p>
              <p className="text-sm text-gray-600">
                Upload and analyze items to add them to your bags
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {currentItems.length} item{currentItems.length !== 1 ? 's' : ''}
              </p>
              <Button variant="secondary" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {item.preview && (
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={item.preview}
                        alt={item.fileName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="font-semibold text-gray-900">{item.fileName}</p>
                      {item.detectedClass && (
                        <p className="text-sm text-gray-600">
                          Detected: {item.detectedClass}
                        </p>
                      )}
                      {item.confidence && (
                        <p className="text-xs text-gray-500">
                          Confidence: {(item.confidence * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {activeTab === 'resell' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate('/create-listing', { state: { item } })}
                        >
                          List Item
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show Recyclers for Recycle Tab */}
            {activeTab === 'recycle' && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Nearby Recyclers (within 10km)
                    </h2>
                    <p className="text-sm text-gray-600">
                      Contact these recyclers to drop off your items
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/recyclers')}
                  >
                    View All
                  </Button>
                </div>

                {loadingRecyclers ? (
                  <div className="rounded-2xl bg-white p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
                    <p className="mt-2 text-sm text-gray-600">Finding recyclers near you...</p>
                  </div>
                ) : nearbyRecyclers.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center">
                    <span className="text-4xl">📍</span>
                    <p className="mt-2 font-semibold text-gray-900">No recyclers found within 10km</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Try enabling location or view all recyclers
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate('/recyclers')}
                    >
                      View All Recyclers
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {nearbyRecyclers.slice(0, 4).map((recycler) => (
                      <div
                        key={recycler.recyclerId}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{recycler.name}</h3>
                            {recycler.isVerified && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          {recycler.distance && (
                            <span className="rounded-full bg-brand-light px-2 py-1 text-xs font-semibold text-brand-dark">
                              {recycler.distance} km
                            </span>
                          )}
                        </div>

                        <div className="mb-3 space-y-1 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <span>📍</span>
                            <span className="line-clamp-2">{recycler.address}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span>📞</span>
                            <a href={`tel:${recycler.phoneNumber}`} className="text-brand hover:underline">
                              {recycler.phoneNumber}
                            </a>
                          </p>
                          {recycler.openHours && (
                            <p className="flex items-center gap-2">
                              <span>🕒</span>
                              <span>{recycler.openHours}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${recycler.latitude},${recycler.longitude}`, '_blank')}
                            className="flex-1 rounded-xl bg-brand px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-dark"
                          >
                            Directions
                          </button>
                          <button
                            onClick={() => window.location.href = `tel:${recycler.phoneNumber}`}
                            className="flex-1 rounded-xl bg-green-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-600"
                          >
                            Call
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Show Recyclers for Empty Recycle Tab */}
        {currentItems.length === 0 && activeTab === 'recycle' && (
          <div className="mt-8 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Find Recyclers Near You
              </h2>
              <p className="text-sm text-gray-600">
                Once you add items to recycle, we'll show you nearby recycling centers
              </p>
            </div>
            <Button onClick={() => navigate('/recyclers')}>
              View Recycler Locations
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BagPage;
