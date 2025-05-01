import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/layout';
import Login from '../auth/login';
import Register from '../auth/register';
import Dashboard from '../pages/dashboard';
import Booking from '../pages/booking';
import History from '../pages/history';
import Home from '../pages/home';
import Logout from '../auth/logout';
import About from '../pages/about';
import Features from '../pages/features';
import Admin from '../pages/admin/dashadmin';
import ManageBookings from '../pages/admin/managebookings';
import ProtectedRoute from './protectedroute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/feature" element={<Features />} />

      {/* User protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Admin protected routes */}
      <Route
        path="/dashadmin"
        element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/managebookings"
        element={
          <ProtectedRoute adminOnly>
            <ManageBookings />
          </ProtectedRoute>
        }
      />
    </Route>
  </Routes>
);

export default AppRoutes;
