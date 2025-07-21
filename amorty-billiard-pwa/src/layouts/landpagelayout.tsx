import React from 'react';
import { Outlet } from 'react-router-dom';
import bgImage from '../assets/Background.jpg';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const LandpageLayout: React.FC = () => {
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

        <Footer /> {/* ← ini bro, tinggal panggil komponen Footer-nya */}
      </div>
    </div>
  );
};

export default LandpageLayout;
