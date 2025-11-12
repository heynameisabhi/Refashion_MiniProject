import { useEffect, useMemo, useState } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import useAuth from '../hooks/useAuth.js';

const milestones = [50, 100, 200, 350, 500];

const RewardsPage = () => {
  const { user, refreshUser } = useAuth();
  const [points, setPoints] = useState(user?.points ?? 0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const syncPoints = async () => {
      if (!user?.guest) {
        setIsRefreshing(true);
        const refreshed = await refreshUser();
        if (refreshed?.points !== undefined) {
          setPoints(refreshed.points);
        }
        setIsRefreshing(false);
      }
    };
    syncPoints().catch(() => setIsRefreshing(false));
  }, [refreshUser, user]);

  useEffect(() => {
    if (user?.points !== undefined) {
      setPoints(user.points);
    }
  }, [user]);

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
                {isRefreshing
                  ? 'Refreshing your progress...'
                  : 'Earn 10 points for every successful upload.'}
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
            <h2 className="text-lg font-semibold text-gray-900">How to earn more</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Upload high-quality items weekly.</li>
              <li>• Share your listings on social media.</li>
              <li>• Engage with the community via swaps.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-dark">
            Bonus: Refer a friend and both receive +25 pts when they upload their first item.
          </div>
        </div>
      </div>

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

