// src/App.tsx
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes/app.routes';
import { Toaster } from 'react-hot-toast';
import NewBookingNotifier from './components/notification';
import { useEffect, useState } from 'react';

// Komponen yang memutuskan apakah akan menampilkan notifikasi
const ConditionalNotifier = () => {
  const location = useLocation();
  const [showNotifier, setShowNotifier] = useState(false);

  useEffect(() => {
    setShowNotifier(location.pathname.startsWith('/admin'));
  }, [location]);

  return showNotifier ? <NewBookingNotifier /> : null;
};

// Bungkus semua dalam BrowserRouter
const App = () => (
  <BrowserRouter>
    <Toaster position="top-center" />
    <ConditionalNotifier />
    <AppRoutes />
  </BrowserRouter>
);

export default App;
