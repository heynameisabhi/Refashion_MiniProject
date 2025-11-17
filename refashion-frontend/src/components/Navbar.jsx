import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { useBag } from '../hooks/useBag.js';

const navItems = [
  { to: '/upload', label: 'Upload' },
  { to: '/bag', label: 'My Bags', showBadge: true },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/recyclers', label: 'Recyclers' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { counts } = useBag();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-brand text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center space-x-2 text-left"
          onClick={() => navigate('/upload')}
        >
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand">
            ReFashion
          </span>
          <span className="hidden text-sm font-medium text-brand-light sm:block">
            Giving clothes a second life
          </span>
        </button>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'relative rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-150',
                  isActive ? 'bg-white text-brand' : 'hover:bg-white/20',
                ].join(' ')
              }
            >
              {item.label}
              {item.showBadge && counts.total > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {counts.total}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          {user?.name && (
            <span className="hidden text-sm font-medium sm:inline-flex">
              Hi, {user.name.split(' ')[0]}
            </span>
          )}
          <Button variant="secondary" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

