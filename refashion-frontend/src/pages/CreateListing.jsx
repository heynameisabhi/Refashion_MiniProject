import { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { useBag } from '../hooks/useBag.js';
import { useRewards } from '../context/RewardsContext.jsx';

const CreateListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { removeFromBag } = useBag();
  const { addPoints } = useRewards();
  const fileInputRef = useRef(null);

  // Get the item from navigation state
  const bagItem = location.state?.item;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    size: '',
    condition: 'good',
    category: '',
  });

  const [images, setImages] = useState(bagItem?.preview ? [bagItem.preview] : []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.price || !formData.description) {
      setError('Please fill in all required fields (Title, Price, Description)');
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would send to your backend API
      // For now, we'll store in localStorage as marketplace items
      const listing = {
        id: `listing-${Date.now()}`,
        ...formData,
        images,
        createdAt: Date.now(),
        detectedClass: bagItem?.detectedClass,
      };

      // Get user ID
      const storedUser = localStorage.getItem('refashion_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.id || user?.email || 'guest';

      // Add user info to listing
      listing.userId = userId;
      listing.userName = user?.name || 'Anonymous';
      listing.userEmail = user?.email || '';

      // Get existing listings
      const existingListings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
      existingListings.push(listing);
      localStorage.setItem('marketplace_listings', JSON.stringify(existingListings));

      // Remove from resell bag
      if (bagItem?.id) {
        removeFromBag('resell', bagItem.id);
      }

      // Award points for creating listing
      const pointsEarned = addPoints('CREATE_LISTING', `Created listing: ${formData.title}`);
      console.log(`🎉 You earned ${pointsEarned} points for creating a listing!`);

      // Navigate to marketplace
      navigate('/marketplace', { state: { message: 'Listing created successfully!' } });
    } catch (err) {
      setError('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bagItem) {
    return (
      <section className="space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center shadow">
          <p className="text-lg font-semibold text-gray-900">No item selected</p>
          <p className="mt-2 text-sm text-gray-600">
            Please select an item from your resell bag to create a listing
          </p>
          <Button className="mt-4" onClick={() => navigate('/bag')}>
            Go to My Bags
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Create Listing</h1>
        <p className="text-sm text-gray-600">
          Add details about your item to list it in the marketplace
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Images Section */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Images</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img src={img} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
                    Main
                  </span>
                )}
              </div>
            ))}
            
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-brand hover:bg-brand-light/20"
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="mt-1 text-xs text-gray-500">Add Image</p>
                </div>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500">
            Add up to 5 images. First image will be the main photo.
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Vintage Denim Jacket"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the item, its condition, and why you love it..."
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Levi's"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., M, L, XL"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Select category</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="dresses">Dresses</option>
                <option value="outerwear">Outerwear</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="new">New with tags</option>
                <option value="like-new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/bag')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreateListingPage;
