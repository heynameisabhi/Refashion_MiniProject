import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const BagContext = createContext(null);

const STORAGE_KEY = 'refashion_bags';

const getStoredBags = () => {
  if (typeof window === 'undefined') return { recycle: [], resell: [], donation: [] };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { recycle: [], resell: [], donation: [] };
  } catch {
    return { recycle: [], resell: [], donation: [] };
  }
};

const saveBags = (bags) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bags));
  }
};

export const BagProvider = ({ children }) => {
  const [bags, setBags] = useState(getStoredBags);

  useEffect(() => {
    saveBags(bags);
  }, [bags]);

  const addToBag = useCallback((category, item) => {
    setBags((prev) => {
      const itemWithTimestamp = { ...item, addedAt: Date.now(), id: `${category}-${Date.now()}` };
      
      return {
        ...prev,
        [category]: [...prev[category], itemWithTimestamp],
      };
    });
  }, []);

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
