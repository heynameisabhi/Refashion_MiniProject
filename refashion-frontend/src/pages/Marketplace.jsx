import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig.js';
import { itemService } from '../api/springBootService.js';
import ItemCard from '../components/ItemCard.jsx';
import Button from '../components/Button.jsx';
import { useBag } from '../hooks/useBag.js';
import { useRewards } from '../context/RewardsContext.jsx';
import useAuth from '../hooks/useAuth.js';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bags, counts } = useBag();
  const { points, deductPoints } = useRewards();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ brand: 'all', category: 'all' });
  const [purchasingItem, setPurchasingItem] = useState(null);

  const handlePurchase = async (item) => {
    if (!user || user.guest) {
      alert('Please login to make purchases');
      navigate('/login');
      return;
    }

    const itemPrice = Math.ceil(item.price * 10); // Convert price to points (₹1 = 10 points)
    
    if (points < itemPrice) {
      alert(`Insufficient points! You need ${itemPrice} points but have ${points} points.`);
      return;
    }

    if (window.confirm(`Purchase ${item.title} for ${itemPrice} points?`)) {
      try {
        setPurchasingItem(item.id);
        deductPoints(itemPrice, `Purchased ${item.title}`);
        alert(`Successfully purchased ${item.title}! ${itemPrice} points deducted.`);
        // Remove item from marketplace
        setItems(prev => prev.filter(i => i.id !== item.id));
      } catch (error) {
        alert('Purchase failed: ' + error.message);
      } finally {
        setPurchasingItem(null);
      }
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Get local listings (marketplace shows ALL items from ALL users)
        let localListings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
        
        // Ensure local listings have image_url (convert images array to image_url)
        localListings = localListings.map(item => ({
          ...item,
          image_url: item.image_url || (item.images && item.images[0]) || null
        }));
        
        // Try to fetch from Spring Boot backend
        try {
          const response = await itemService.getMarketplaceItems();
          console.log('Spring Boot marketplace response:', response);
          let backendItems = (response.success && Array.isArray(response.data)) ? response.data : [];
          
          // Transform Spring Boot items to match ItemCard format
          backendItems = backendItems.map(item => {
            // Generate placeholder image based on item type
            const getPlaceholderImage = (itemType) => {
              const type = (itemType || '').toLowerCase();
              if (type.includes('shirt') || type.includes('t-shirt')) {
                return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop';
              } else if (type.includes('jeans') || type.includes('pants')) {
                return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop';
              } else if (type.includes('dress')) {
                return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop';
              } else if (type.includes('jacket') || type.includes('coat')) {
                return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop';
              } else if (type.includes('shoe')) {
                return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop';
              } else {
                return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop';
              }
            };

            return {
              id: item.itemId,
              title: item.itemType || 'Item',
              brand: item.bagName || 'ReFashion',
              condition: item.grade || 'A',
              category: item.gender || 'Unisex',
              price: (item.loyaltyPoint || 0) / 10, // Convert points to price
              description: item.conditionDescription || 'No description',
              image_url: getPlaceholderImage(item.itemType),
              userId: item.contributorId,
              userName: item.contributorName,
              ageGroup: item.ageGroup,
              status: item.status
            };
          });
          
          // Combine local and backend items
          console.log('Local listings:', localListings.length, 'Backend items:', backendItems.length);
          const allItems = [...localListings, ...backendItems];
          console.log('Total items to display:', allItems.length);
          setItems(allItems);
        } catch (err) {
          console.error('Spring Boot backend error:', err);
          console.log('Spring Boot backend not available, using local items only');
          // If Spring Boot backend fails, try FastAPI backend
          try {
            const { data } = await axiosInstance.get('/get_items');
            const fastApiItems = Array.isArray(data) ? data : data?.items ?? [];
            setItems([...localListings, ...fastApiItems]);
          } catch (fastApiErr) {
            // If both backends fail, just use local listings
            setItems(localListings);
          }
        }
      } catch (err) {
        const message = 'Unable to load marketplace items.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const brands = useMemo(() => {
    const unique = new Set();
    items.forEach((item) => {
      if (item.brand) unique.add(item.brand);
    });
    return ['all', ...Array.from(unique)];
  }, [items]);

  const categories = useMemo(() => {
    const unique = new Set();
    items.forEach((item) => {
      if (item.category) unique.add(item.category);
    });
    return ['all', ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesBrand = filters.brand === 'all' || item.brand === filters.brand;
        const matchesCategory = filters.category === 'all' || item.category === filters.category;
        return matchesBrand && matchesCategory;
      }),
    [items, filters],
  );

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="space-y-8">
      {/* Resell Your Items Section */}
      {counts.resell > 0 && (
        <div className="rounded-3xl border-2 border-brand/30 bg-gradient-to-r from-brand/5 to-brand-light/20 p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                💰 Ready to List Your Items?
              </h2>
              <p className="text-sm text-gray-600">
                You have <strong>{counts.resell} item{counts.resell !== 1 ? 's' : ''}</strong> in your resell bag. Add details and list them!
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/bag')}>
              View My Resell Bag
            </Button>
          </div>
          
          {/* Preview of resell items */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {bags.resell.slice(0, 3).map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {item.preview && (
                  <img src={item.preview} alt={item.fileName} className="h-32 w-full object-cover" />
                )}
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-gray-700">{item.fileName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Balance Banner */}
      {user && !user.guest && (
        <div className="rounded-2xl border border-brand/30 bg-gradient-to-r from-brand-light to-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-sm font-medium text-gray-600">Your Wallet Balance</p>
                <p className="text-2xl font-bold text-brand">{points} Points</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/rewards')}>
              View Wallet
            </Button>
          </div>
        </div>
      )}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-600">
            Shop with your points! 10 points = ₹1
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            <span className="mr-2 font-medium text-gray-700">Brand</span>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="bg-transparent focus:outline-none"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === 'all' ? 'All' : brand}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            <span className="mr-2 font-medium text-gray-700">Category</span>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="bg-transparent focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All' : category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {isLoading && (
        <div className="grid place-items-center rounded-3xl border border-gray-100 bg-white p-12 shadow">
          <p className="text-sm text-gray-500">Loading marketplace items...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-sm text-red-600 shadow">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div>
          {filteredItems.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-brand/40 bg-white p-16 text-center shadow">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-900">No items match your filters yet.</p>
                <p className="text-sm text-gray-600">
                  Try adjusting the filters or check back soon for fresh arrivals.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const itemPrice = Math.ceil(item.price * 10); // Convert to points
                const canAfford = points >= itemPrice;
                
                return (
                  <article
                    key={item.id ?? `${item.title}-${item.brand}`}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-brand-light text-brand-dark">
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white shadow-lg">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </div>
                      <div className="absolute bottom-2 right-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900 shadow-lg">
                        {itemPrice} pts
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {item.description && (
                        <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        {item.brand && <span className="rounded-full bg-gray-100 px-2 py-1">{item.brand}</span>}
                        {item.condition && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 capitalize">{item.condition}</span>
                        )}
                        {item.category && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 capitalize">{item.category}</span>
                        )}
                      </div>
                      
                      {/* Purchase Button */}
                      <div className="mt-auto pt-3">
                        <Button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford || purchasingItem === item.id}
                          className="w-full"
                          variant={canAfford ? 'primary' : 'secondary'}
                        >
                          {purchasingItem === item.id ? (
                            'Processing...'
                          ) : canAfford ? (
                            `🛍️ Buy with ${itemPrice} Points`
                          ) : (
                            `Need ${itemPrice - points} more points`
                          )}
                        </Button>
                        {!canAfford && (
                          <p className="mt-1 text-center text-xs text-gray-500">
                            You have {points} points
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MarketplacePage;

