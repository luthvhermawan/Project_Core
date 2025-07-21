import { Outlet } from 'react-router-dom';
import NewBookingNotif from '../components/notification';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Notifikasi Baru */}
      <NewBookingNotif />

      {/* Navbar Admin */}
      <Navbar />

      {/* Konten Halaman */}
      <main className="flex-grow p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
