import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import PageWrapper from '../components/wrapper';
import { FiMail, FiLock } from 'react-icons/fi';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Email dan Password wajib diisi!');
      return;
    }

    // Email harus huruf kecil semua
    if (email !== email.toLowerCase()) {
      alert('Invalid email.');
      return;
    }

    // Format email valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Format email tidak valid.');
      return;
    }

    // Password minimal 8 karakter, kombinasi huruf dan angka
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Password minimal 8 karakter dan harus mengandung huruf dan angka.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registrasi berhasil!');
      navigate('/login');
    } catch (error: any) {
      alert('Gagal daftar: ' + error.message);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-start justify-center min-h-screen bg-[#0a0a0a] px-4 pt-24">
        <div className="bg-black bg-opacity-50 backdrop-blur-md p-7 rounded-2xl shadow-lg w-full max-w-sm transition-all duration-300 hover:shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-yellow-500 text-xl font-bold tracking-wide">Amorty Billiards</h2>
            <p className="text-gray-400 text-sm">Training Ground</p>
          </div>

          {/* Title */}
          <h3 className="text-center text-gray-300 text-lg font-medium mb-4">Buat akun baru Anda</h3>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email (huruf kecil semua)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                required
              />
              <FiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password (min 8 karakter, huruf & angka)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                required
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
            >
              Register
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-yellow-500 hover:underline transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
