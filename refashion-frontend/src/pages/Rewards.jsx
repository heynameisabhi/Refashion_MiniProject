import { useMemo } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import useAuth from '../hooks/useAuth.js';
import { useRewards } from '../context/RewardsContext.jsx';

const milestones = [50, 100, 200, 350, 500];

const RewardsPage = () => {
  const { user } = useAuth();
  const { points, history, POINTS } = useRewards();

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

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Rewards &amp; Impact</h1>
        <p className="text-sm text-gray-600">
          Track your sustainability points. Upload more garments to unlock exclusive rewards and badges.
        </p>
      </header>

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
    </section>
  );
};

export default RewardsPage;

