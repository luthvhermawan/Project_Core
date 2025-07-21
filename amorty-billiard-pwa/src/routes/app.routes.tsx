import { Routes, Route } from 'react-router-dom';
import LandpageLayout from '../layouts/landpagelayout';
import UserLayout from '../layouts/userpagelayout';
import AdminLayout from '../layouts/adminpagelayout';

import Login from '../auth/login';
import Register from '../auth/register';
import Dashboard from '../pages/user/dashboard';
import Booking from '../pages/user/booking';
import History from '../pages/user/history';
import Home from '../pages/landpage/home';
import Logout from '../auth/logout';
import About from '../pages/landpage/about';
import Features from '../pages/landpage/features';
import Admin from '../pages/admin/dashadmin';
import ManageBookings from '../pages/admin/managebookings';

import ProtectedRoute from './protectedroute';

const AppRoutes = () => (
  <Routes>

    {/* Landpage routes */}
    <Route path="/" element={<LandpageLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="register" element={<Register />} />
      <Route path="about" element={<About />} />
      <Route path="feature" element={<Features />} />
    </Route>

    {/* User protected routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="booking" element={<Booking />} />
      <Route path="history" element={<History />} />
    </Route>

    {/* Admin protected routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashadmin" element={<Admin />} />
      <Route path="managebookings" element={<ManageBookings />} />
    </Route>

  </Routes>
);

export default AppRoutes;
