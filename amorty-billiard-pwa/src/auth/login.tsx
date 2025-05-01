import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import PageWrapper from '../components/wrapper';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Email dan Password wajib diisi!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Format email tidak valid.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.email === 'amorty@gmail.com') {
        alert('Login Admin berhasil!');
        navigate('/dashadmin');
      } else {
        alert('Login berhasil!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        alert('Akun tidak tersedia. Silakan daftar dulu.');
      } else {
        alert('Login gagal: ' + error.message);
      }
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
          <h3 className="text-center text-gray-300 text-lg font-medium mb-4">Silakan masuk ke akun Anda</h3>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
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
                placeholder="Password"
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
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-yellow-500 hover:underline transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
