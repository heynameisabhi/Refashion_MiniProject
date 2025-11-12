import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBag } from '../hooks/useBag.js';
import Button from '../components/Button.jsx';

const BagPage = () => {
  const navigate = useNavigate();
  const { bags, removeFromBag, clearBag, counts } = useBag();
  const [activeTab, setActiveTab] = useState('resell');

  const tabs = [
    { id: 'resell', label: 'Resell', icon: '💰', count: counts.resell },
    { id: 'donation', label: 'Donation', icon: '❤️', count: counts.donation },
    { id: 'recycle', label: 'Recycle', icon: '♻️', count: counts.recycle },
  ];

  const currentItems = bags[activeTab] || [];

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
          </>
        )}
      </div>
    </section>
  );
};

export default BagPage;
