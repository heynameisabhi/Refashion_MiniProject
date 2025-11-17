import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { useRewards } from '../context/RewardsContext.jsx';

const milestones = [50, 100, 200, 350, 500];

const RewardsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { points, history, POINTS } = useRewards();
  const [activeTab, setActiveTab] = useState('overview'); // overview, wallet, transactions

  const nextMilestone = useMemo(() => {
    const upcoming = milestones.find((m) => m > points);
    return upcoming ?? (points > 0 ? points + 100 : 50);
  }, [points]);

  const previousMilestone = useMemo(() => {
    const reversed = [...milestones].reverse().find((m) => m <= points);
    return reversed ?? 0;
  }, [points]);

  const progressValue = points - previousMilestone;
  const progressMax = nextMilestone - previousMilestone;

  // Calculate wallet balance (points that can be used for purchases)
  const walletBalance = points;
  const pointsToRupees = (pts) => pts * 0.1; // 1 point = ₹0.10

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Rewards &amp; Wallet</h1>
        <p className="text-sm text-gray-600">
          Track your points, manage your wallet, and shop in the marketplace.
        </p>
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
          Overview
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'wallet'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          💰 Wallet
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📜 Transactions
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-brand/30 bg-white p-8 shadow lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-brand-dark">
                Total points
              </span>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-5xl font-bold text-brand">{points}</span>
                <span className="text-sm text-gray-500">pts</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Earn points for every action you take!
              </p>
            </div>
            <div className="rounded-3xl bg-brand-light px-6 py-4 text-sm text-brand-dark">
              <p className="font-semibold">Next milestone: {nextMilestone} pts</p>
              <p>Unlock eco-badges and marketplace perks.</p>
            </div>
          </div>
          <div className="mt-8">
            <ProgressBar value={progressValue} max={progressMax || 1} />
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-wide text-gray-500">
              <span>{previousMilestone} pts</span>
              <span>{nextMilestone} pts</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">How to earn points</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Recycle items: <strong>+{POINTS.RECYCLE} pts</strong></li>
              <li>• Resell items: <strong>+{POINTS.RESELL} pts</strong></li>
              <li>• Donate items: <strong>+{POINTS.DONATION} pts</strong></li>
              <li>• Create listing: <strong>+{POINTS.CREATE_LISTING} pts</strong></li>
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-dark">
            💡 Tip: Create listings to earn the most points!
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {history.slice(-10).reverse().map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-brand">+{activity.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="grid gap-4 md:grid-cols-2">
        {milestones.map((milestone) => {
          const achieved = points >= milestone;
          return (
            <div
              key={milestone}
              className={`rounded-3xl border px-6 py-5 shadow transition ${
                achieved
                  ? 'border-brand bg-brand-light text-brand-dark'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Milestone {milestone} pts</h3>
                  <p className="text-sm">
                    {achieved ? 'Unlocked! Enjoy your sustainable perks.' : 'Keep going! You are close.'}
                  </p>
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {achieved ? 'Achieved' : 'In progress'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <div className="rounded-3xl border border-brand/30 bg-gradient-to-br from-brand to-brand-dark p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest opacity-90">
                  Wallet Balance
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-5xl font-bold">{walletBalance}</span>
                  <span className="text-xl opacity-90">points</span>
                </div>
                <p className="mt-2 text-sm opacity-80">
                  ≈ ₹{pointsToRupees(walletBalance).toFixed(2)} shopping value
                </p>
              </div>
              <div className="text-6xl opacity-20">💰</div>
            </div>
          </div>

          {/* Conversion Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Point Value</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>• 1 Point = ₹0.10</p>
                <p>• 10 Points = ₹1.00</p>
                <p>• 100 Points = ₹10.00</p>
                <p>• 1000 Points = ₹100.00</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">How to Use</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>✓ Browse marketplace items</p>
                <p>✓ Click "Buy with Points"</p>
                <p>✓ Points deducted automatically</p>
                <p>✓ Item delivered to you</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => navigate('/marketplace')} className="w-full">
                🛍️ Shop Marketplace
              </Button>
              <Button variant="secondary" onClick={() => navigate('/upload')} className="w-full">
                📤 Earn More Points
              </Button>
            </div>
          </div>

          {/* Wallet Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-green-50 p-6 text-center">
              <p className="text-3xl font-bold text-green-600">{history.length}</p>
              <p className="mt-1 text-sm text-gray-600">Total Transactions</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{walletBalance}</p>
              <p className="mt-1 text-sm text-gray-600">Available Points</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {history.reduce((sum, h) => sum + h.points, 0)}
              </p>
              <p className="mt-1 text-sm text-gray-600">Lifetime Earned</p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
            
            {history.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-6xl">📜</span>
                <p className="mt-4 text-lg font-semibold text-gray-900">No transactions yet</p>
                <p className="mt-2 text-sm text-gray-600">
                  Start earning points by uploading items!
                </p>
                <Button className="mt-4" onClick={() => navigate('/upload')}>
                  Upload Items
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.slice().reverse().map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {transaction.type === 'purchase' ? '🛍️' : '✨'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg font-semibold ${
                          transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {transaction.type === 'purchase' ? '-' : '+'}
                        {transaction.points} pts
                      </span>
                      {transaction.type === 'purchase' && (
                        <p className="text-xs text-gray-500">
                          ≈ ₹{pointsToRupees(transaction.points).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default RewardsPage;

