import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';

import {
  FiHome,
  FiBook,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiCamera,
  FiGrid,
  FiInfo,
  FiUser,
} from 'react-icons/fi';

import logo from '../assets/Logoo.png';

type MenuItem = {
  to: string;
  label: string;
  icon?: React.ReactNode;
};

const Navbar: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard =
    location.pathname.includes('dashboard') ||
    location.pathname.includes('booking') ||
    location.pathname.includes('history') ||
    location.pathname.includes('dashadmin') ||
    location.pathname.includes('managebookings') ||
    location.pathname.includes('scanner');

  const isAdmin = user?.email === 'amorty@gmail.com';

  const adminMenu: MenuItem[] = [
    { to: '/dashadmin', icon: <FiHome />, label: 'Dashboard' },
    { to: '/managebookings', icon: <FiSettings />, label: 'Manage Booking' },
    { to: '/scanner', icon: <FiCamera />, label: 'Scan QR' },
    { to: '/logout', icon: <FiLogOut />, label: 'Logout' },
  ];

  const userMenu: MenuItem[] = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/booking', icon: <FiBook />, label: 'Booking' },
    { to: '/history', icon: <FiClipboard />, label: 'History' },
    { to: '/logout', icon: <FiLogOut />, label: 'Logout' },
  ];

  const guestMenu: MenuItem[] = [
    { to: '/', label: 'Home', icon: <FiHome /> },
    { to: '/feature', label: 'Fitur', icon: <FiGrid /> },
    { to: '/about', label: 'About', icon: <FiInfo /> },
    { to: '/login', label: 'Login', icon: <FiUser /> },
  ];

  const getMenu = () => {
    if (loading) return [];
    if (!user) return guestMenu;
    if (isAdmin) return adminMenu;
    return userMenu;
  };

  const bottomNavMenu = isAdmin ? adminMenu : userMenu;

  if (loading) return null;

  return (
    <>
      {/* Navbar Atas */}
      <nav className="bg-black px-6 py-3 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Amorty Logo"
            className="h-full max-h-[64px] w-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          {getMenu().map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-1 font-bold transition-colors ${
                    isActive ? 'text-yellow-400' : 'text-[#b09745]'
                  } hover:text-yellow-400`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger Mobile (Guest Only) */}
        {!user && (
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#b09745] md:hidden text-2xl"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        )}
      </nav>

      {/* Mobile Sidebar Guest */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-2/3 max-w-[250px] h-full bg-black text-white shadow-lg z-50 p-6 flex flex-col gap-4 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <img src={logo} alt="Logo" className="h-8" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-xl"
          >
            <FiX />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {guestMenu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 border-b border-white pb-2 hover:text-yellow-400 text-[#b09745]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="text-lg">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Navbar Mobile */}
      {user && isDashboard && (
        <div className="fixed bottom-0 left-0 right-0 bg-black p-2 flex justify-around items-center text-white shadow-md md:hidden z-50">
          {bottomNavMenu.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center text-xs transition-colors ${
                  isActive ? 'text-yellow-400' : 'text-[#b09745]'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Navbar;
