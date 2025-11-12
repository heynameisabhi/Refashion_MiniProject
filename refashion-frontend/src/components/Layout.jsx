import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
    <footer className="bg-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} ReFashion</span>
        <span>Sustainable fashion starts with mindful choices.</span>
      </div>
    </footer>
  </div>
);

export default Layout;

