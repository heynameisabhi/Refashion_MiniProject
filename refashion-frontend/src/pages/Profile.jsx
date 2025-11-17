import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { useRewards } from '../context/RewardsContext.jsx';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, points } = useRewards();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const purchases = history.filter(item => item.type === 'purchase');
  const totalSpent = purchases.reduce((sum, p) => sum + p.points, 0);
  const donations = history.filter(item => item.action === 'DONATION').length;
  const recycles = history.filter(item => item.action === 'RECYCLE').length;
  const resells = history.filter(item => item.action === 'RESELL').length;
  const listings = history.filter(item => item.action === 'CREATE_LISTING').length;

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-600">Manage your account, view purchases, and track your impact.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'purchases'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🛍️ My Purchases {purchases.length > 0 && `(${purchases.length})`}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-3xl font-bold text-white">
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user?.name || 'ReFashion Member'}</h2>
                <p className="text-sm text-gray-600">{user?.email || 'user@refashion.app'}</p>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-green-600">{recycles}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">♻️ Recycled</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-red-600">{donations}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">❤️ Donated</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-blue-600">{resells}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">💰 Resold</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-purple-600">{listings}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">📝 Listed</p>
            </div>
          </div>

          {/* Points and Purchases */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-brand">{points}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">💎 Reward Points</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-orange-600">{purchases.length}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">🛍️ Purchases</p>
            </div>
          </div>

          {/* Impact Message */}
          <div className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-dark">
            You have saved approximately <strong>{history.length * 2}</strong> kg of CO₂ by rehoming garments.
          </div>
        </div>
      )}

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          {/* Purchase Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-purple-50 p-6 text-center">
              <p className="text-3xl font-bold text-purple-600">{purchases.length}</p>
              <p className="mt-1 text-sm text-gray-600">Total Purchases</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-6 text-center">
              <p className="text-3xl font-bold text-red-600">{totalSpent}</p>
              <p className="mt-1 text-sm text-gray-600">Points Spent</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-6 text-center">
              <p className="text-3xl font-bold text-green-600">₹{(totalSpent * 0.1).toFixed(2)}</p>
              <p className="mt-1 text-sm text-gray-600">Total Value</p>
            </div>
          </div>

          {/* Purchases List */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Purchase History</h2>
              <Button variant="secondary" size="sm" onClick={() => navigate('/marketplace')}>
                Shop More
              </Button>
            </div>

            {purchases.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-6xl">🛍️</span>
                <p className="mt-4 text-lg font-semibold text-gray-900">No purchases yet</p>
                <p className="mt-2 text-sm text-gray-600">
                  Start shopping in the marketplace with your points!
                </p>
                <Button className="mt-4" onClick={() => navigate('/marketplace')}>
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.slice().reverse().map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🛍️</span>
                        <div>
                          <p className="font-medium text-gray-900">{purchase.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(purchase.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-red-600">
                        -{purchase.points} pts
                      </span>
                      <p className="text-xs text-gray-500">
                        ≈ ₹{(purchase.points * 0.1).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping Tips */}
          <div className="rounded-2xl border border-brand/30 bg-brand-light p-6">
            <h3 className="text-lg font-semibold text-brand-dark">💡 Shopping Tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-dark">
              <li>• Earn more points by uploading and recycling items</li>
              <li>• Check marketplace daily for new arrivals</li>
              <li>• 10 points = ₹1 shopping value</li>
              <li>• All purchases are eco-friendly and sustainable</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
