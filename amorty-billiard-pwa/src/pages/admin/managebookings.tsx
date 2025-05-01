import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { ref, onValue, remove, update } from 'firebase/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '../../routes/protectedroute';

interface BookingItem {
  id: string;
  uid: string;
  email: string;
  name: string;
  table: number;
  date: string;
  time: string;
  duration: number;
  price: number;
  paid: boolean;
  paymentMethod: string;
}

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    const bookingRef = ref(db, 'booking');
    onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      const bookingList: BookingItem[] = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];

      // Urutkan dari terbaru ke terlama
      const sortedBookings = bookingList.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime(); // descending
      });

      setBookings(sortedBookings);
    });
  }, []);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Yakin hapus booking ini?');
    if (confirmDelete) {
      remove(ref(db, `booking/${id}`));
    }
  };

  const togglePaidStatus = (id: string, currentStatus: boolean) => {
    update(ref(db, `booking/${id}`), {
      paid: !currentStatus,
    });
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 text-white min-h-screen bg-[#0a0a0a]">
        <h1 className="text-3xl font-bold mb-6">Manages Booking</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-400">Belum ada booking.</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-gray-900 text-white">
                <CardContent className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{booking.name}</h2>
                    <p className="text-sm text-gray-400">Email: {booking.email}</p>
                    <p className="text-sm text-gray-400">Tanggal: {booking.date}</p>
                    <p className="text-sm text-gray-400">Waktu: {booking.time}</p>
                    <p className="text-sm text-gray-400">Meja: {booking.table}</p>
                    <p className="text-sm text-gray-400">
                      Status:{' '}
                      <span
                        className={
                          booking.paid ? 'text-green-400' : 'text-yellow-400'
                        }
                      >
                        {booking.paid ? 'Sudah Bayar' : 'Belum Bayar'}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className={`${
                        booking.paid
                          ? 'bg-gray-600 hover:bg-gray-500'
                          : 'bg-green-500 hover:bg-green-400 text-black'
                      }`}
                      onClick={() => togglePaidStatus(booking.id, booking.paid)}
                    >
                      {booking.paid ? 'Batalkan Bayar' : 'Tandai Sudah Bayar'}
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-400"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ManageBookings;
