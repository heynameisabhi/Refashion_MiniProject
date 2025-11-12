import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig.js';
import ItemCard from '../components/ItemCard.jsx';
import Button from '../components/Button.jsx';
import { useBag } from '../hooks/useBag.js';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { bags, counts } = useBag();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ brand: 'all', category: 'all' });

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Try to fetch from backend first
        try {
          const { data } = await axiosInstance.get('/get_items');
          const backendItems = Array.isArray(data) ? data : data?.items ?? [];
          
          // Get local listings
          const localListings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
          
          // Combine both
          setItems([...localListings, ...backendItems]);
        } catch (err) {
          // If backend fails, just use local listings
          const localListings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
          setItems(localListings);
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

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-600">
            Discover community listings and give second-hand pieces a brand-new story.
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
              {filteredItems.map((item) => (
                <ItemCard key={item.id ?? `${item.title}-${item.brand}`} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MarketplacePage;

