import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { bagService, itemService } from '../api/springBootService.js';
import { useRewards } from './RewardsContext.jsx';

const BagContext = createContext(null);

const getStorageKey = (userId) => `refashion_bags_${userId || 'guest'}`;

const getStoredBags = (userId) => {
  if (typeof window === 'undefined') return { recycle: [], resell: [], donation: [] };
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : { recycle: [], resell: [], donation: [] };
  } catch {
    return { recycle: [], resell: [], donation: [] };
  }
};

const saveBags = (bags, userId) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(bags));
  }
};

export const BagProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [bags, setBags] = useState({ recycle: [], resell: [], donation: [] });
  const { addPoints } = useRewards();

  // Load bags when user changes
  useEffect(() => {
    const loadUserBags = () => {
      const storedUser = localStorage.getItem('refashion_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const userId = user.id || user.email || 'guest';
          setCurrentUserId(userId);
          setBags(getStoredBags(userId));
        } catch {
          setCurrentUserId('guest');
          setBags(getStoredBags('guest'));
        }
      } else {
        setCurrentUserId('guest');
        setBags(getStoredBags('guest'));
      }
    };

    loadUserBags();

    // Listen for storage changes (user login/logout)
    const handleStorageChange = (e) => {
      if (e.key === 'refashion_user') {
        loadUserBags();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save bags when they change
  useEffect(() => {
    if (currentUserId) {
      saveBags(bags, currentUserId);
    }
  }, [bags, currentUserId]);

  const addToBag = useCallback(async (category, item) => {
    try {
      if (category === 'recycle') {
        // Add directly to recycling (no bag needed)
        await itemService.addForRecycling({
          name: item.fileName,
          description: `Detected as ${item.detectedClass}`,
          imageUrl: item.preview,
          detectedClass: item.detectedClass,
          confidence: item.confidence,
        });
      } else {
        // For resell and donation, we need to create/use bags
        // For now, we'll also keep the local storage approach
        // but in a real implementation, you'd create bags in the backend
      }

      // Update local storage for immediate UI feedback
      setBags((prev) => {
        const itemWithTimestamp = { ...item, addedAt: Date.now(), id: `${category}-${Date.now()}` };
        
        return {
          ...prev,
          [category]: [...prev[category], itemWithTimestamp],
        };
      });

      // Award points based on category
      const pointsEarned = addPoints(
        category.toUpperCase(),
        `Added ${item.fileName} to ${category}`
      );

      // Show notification (optional)
      if (typeof window !== 'undefined' && pointsEarned > 0) {
        console.log(`🎉 You earned ${pointsEarned} points!`);
      }
    } catch (error) {
      console.error('Failed to add item to backend:', error);
      // Still update local storage even if backend fails
      setBags((prev) => {
        const itemWithTimestamp = { ...item, addedAt: Date.now(), id: `${category}-${Date.now()}` };
        
        return {
          ...prev,
          [category]: [...prev[category], itemWithTimestamp],
        };
      });

      // Still award points even if backend fails
      addPoints(
        category.toUpperCase(),
        `Added ${item.fileName} to ${category}`
      );
    }
  }, [addPoints]);

  const removeFromBag = useCallback((category, itemId) => {
    setBags((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== itemId),
    }));
  }, []);

  const clearBag = useCallback((category) => {
    setBags((prev) => ({
      ...prev,
      [category]: [],
    }));
  }, []);

  const moveItem = useCallback((fromCategory, toCategory, itemId) => {
    setBags((prev) => {
      const item = prev[fromCategory].find((i) => i.id === itemId);
      if (!item) return prev;

      return {
        ...prev,
        [fromCategory]: prev[fromCategory].filter((i) => i.id !== itemId),
        [toCategory]: [...prev[toCategory], { ...item, id: `${toCategory}-${Date.now()}` }],
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      bags,
      addToBag,
      removeFromBag,
      clearBag,
      moveItem,
      counts: {
        recycle: bags.recycle.length,
        resell: bags.resell.length,
        donation: bags.donation.length,
        total: bags.recycle.length + bags.resell.length + bags.donation.length,
      },
    }),
    [bags, addToBag, removeFromBag, clearBag, moveItem],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};
