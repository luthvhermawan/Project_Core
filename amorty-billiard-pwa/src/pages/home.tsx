import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bgImage from '../assets/Background.jpg';
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';

export default function HomePage() {
  return (
    <div className="text-white overflow-hidden">

      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="relative z-10 flex flex-col items-center justify-start text-center h-full px-4 pt-40"
        >
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400"
          >
            Selamat Datang di
          </motion.h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 65, damping: 15, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Amorty Billiards
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 max-w-xl text-lg text-gray-300"
          >
            Tempat terbaik untuk latihan dan reservasi meja billiard profesional.
            Coba sekarang dan rasakan kemudahannya!
          </motion.p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.9 }}
          >
            <Link to="/login">
              <button className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full shadow-lg transition">
                Pesan Sekarang
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Gallery Section */}
<div className="bg-black">
  <div className="py-16 px-6 md:px-20 bg-black bg-opacity-70">
    <h2 className="text-4xl font-bold text-yellow-500 text-center mb-12">
      Gallery
    </h2>

    {/* Banner Utama */}
    <div className="w-full mb-10 rounded-2xl overflow-hidden shadow-xl">
      <img
        src={img1}
        alt="Highlight Billiard"
        className="w-full h-[700px] object-cover"
      />
    </div>

    {/* Grid Gambar */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div className="overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition duration-300">
        <img
          src={img2}
          className="w-full h-56 object-cover"
        />
      </div>

      <div className="overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition duration-300">
        <img
          src={img3}
          className="w-full h-56 object-cover"
        />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition duration-300">
        <img
          src={img4}
          className="w-full h-56 object-cover"
        />
      </div>
        </div>
      </div>
    </div>
  </div>
  );
}
