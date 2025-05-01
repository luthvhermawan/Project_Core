// src/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import bgImage from '../assets/Background.jpg';
import Navbar from '../components/navbar';

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Outlet />
        </main>

        <footer className="bg-black bg-opacity-70 text-white text-center py-4">
          <p>&copy; {new Date().getFullYear()} Amorty Billiards Training Ground. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
