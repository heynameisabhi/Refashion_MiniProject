import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RewardsContext = createContext(null);

const getStorageKey = (userId) => `refashion_rewards_${userId || 'guest'}`;

// Point values for different actions
const POINTS = {
  RECYCLE: 10,
  RESELL: 15,
  DONATION: 12,
  CREATE_LISTING: 20,
  COMPLETE_PROFILE: 25,
};

const getStoredRewards = (userId) => {
  if (typeof window === 'undefined') return { points: 0, history: [] };
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : { points: 0, history: [] };
  } catch {
    return { points: 0, history: [] };
  }
};

const saveRewards = (rewards, userId) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(rewards));
  }
};

export const RewardsProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rewards, setRewards] = useState({ points: 0, history: [] });

  // Load rewards when user changes
  useEffect(() => {
    const loadUserRewards = () => {
      const storedUser = localStorage.getItem('refashion_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const userId = user.id || user.email || 'guest';
          setCurrentUserId(userId);
          setRewards(getStoredRewards(userId));
        } catch {
          setCurrentUserId('guest');
          setRewards(getStoredRewards('guest'));
        }
      } else {
        setCurrentUserId('guest');
        setRewards(getStoredRewards('guest'));
      }
    };

    loadUserRewards();

    // Listen for storage changes (user login/logout)
    const handleStorageChange = (e) => {
      if (e.key === 'refashion_user') {
        loadUserRewards();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save rewards when they change
  useEffect(() => {
    if (currentUserId) {
      saveRewards(rewards, currentUserId);
    }
  }, [rewards, currentUserId]);

  const addPoints = useCallback((action, description) => {
    const pointsEarned = POINTS[action] || 0;
    
    setRewards((prev) => {
      const newHistory = [
        ...prev.history,
        {
          id: Date.now(),
          action,
          points: pointsEarned,
          description,
          timestamp: Date.now(),
        },
      ];

      return {
        points: prev.points + pointsEarned,
        history: newHistory,
      };
    });

    return pointsEarned;
  }, []);

  const resetPoints = useCallback(() => {
    setRewards({ points: 0, history: [] });
  }, []);

  const value = useMemo(
    () => ({
      points: rewards.points,
      history: rewards.history,
      addPoints,
      resetPoints,
      POINTS,
    }),
    [rewards, addPoints, resetPoints],
  );

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
