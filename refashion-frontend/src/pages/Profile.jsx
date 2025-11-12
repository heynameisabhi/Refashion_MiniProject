import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig.js';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';

const defaultStats = {
  items_uploaded: 0,
  items_sold: 0,
  co2_saved_kg: 0,
};

const ProfilePage = () => {
  const { user, updateUserContext } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', bio: '', location: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await axiosInstance.get('/profile');
        setProfile(data);
        setForm({
          name: data?.name ?? '',
          email: data?.email ?? '',
          bio: data?.bio ?? '',
          location: data?.location ?? '',
        });
      } catch (err) {
        const message = err?.response?.data?.detail || 'Unable to load your profile.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!user?.guest) {
      fetchProfile().catch(() => setIsLoading(false));
    } else {
      setProfile({
        name: 'Guest User',
        email: 'guest@refashion.app',
        points: 0,
        stats: defaultStats,
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setError('');
    try {
      const { data } = await axiosInstance.put('/update_profile', form);
      setProfile((prev) => ({ ...prev, ...data }));
      updateUserContext({ ...(user ?? {}), ...data });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const message = err?.response?.data?.detail || 'Could not update profile. Please try again.';
      setError(message);
    }
  };

  const stats = profile?.stats ?? defaultStats;

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-600">Manage your account info and track your sustainability impact.</p>
      </header>

      {isLoading && (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow">
          <p className="text-sm text-gray-500">Loading your profile...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-sm text-red-600 shadow">
          {error}
        </div>
      )}

      {profile && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{profile.name ?? 'ReFashion Member'}</h2>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
              {!user?.guest && (
                <Button variant="secondary" onClick={() => setIsEditing((prev) => !prev)}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              )}
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-dark">
                You have saved approximately <strong>{stats.co2_saved_kg}</strong> kg of CO₂ by rehoming garments.
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-brand">{stats.items_uploaded}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Items uploaded</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-brand">{stats.items_sold}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Items exchanged</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-brand">{profile.points ?? 0}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Reward points</p>
                </div>
              </div>
            </div>
            {isEditing && (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 border-t border-gray-100 pt-6">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={form.bio}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <Button type="submit" size="lg" className="justify-self-start">
                  Save Changes
                </Button>
              </form>
            )}
            {successMessage && (
              <div className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-dark">
                {successMessage}
              </div>
            )}
          </div>
          <aside className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sustainability tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Repair garments before replacing them.</li>
                <li>• Prefer natural fibers and timeless cuts.</li>
                <li>• Share care instructions with new owners.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-dark">
              Need to update more details? Reach us at support@refashion.app and we will assist you.
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;

