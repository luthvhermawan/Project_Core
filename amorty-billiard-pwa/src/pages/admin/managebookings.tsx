import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { ref, onValue, remove, update } from 'firebase/database';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Badge from '../../components/ui/badge';
import Input from '../../components/ui/input';
import { Download, Search, Trash2, CheckCheck, CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '../../routes/protectedroute';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  played?: boolean;
}

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const bookingRef = ref(db, 'booking');
    onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      const bookingList: BookingItem[] = data
        ? Object.keys(data).map((key) => {
            const item = data[key] || {};
            return {
              id: key,
              uid: item.uid ?? '',
              email: item.email ?? '',
              name: item.name ?? '',
              table: item.table ?? 0,
              date: item.date ?? '',
              time: item.time ?? '',
              duration: item.duration ?? 0,
              price: item.price ?? 0,
              paid: item.paid ?? false,
              paymentMethod: item.paymentMethod ?? '',
              played: item.played ?? false,
            };
          })
        : [];

      const sortedBookings = bookingList.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });

      setBookings(sortedBookings);
    });
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin hapus booking ini?')) {
      remove(ref(db, `booking/${id}`));
    }
  };

  const togglePaidStatus = (id: string, currentStatus: boolean) => {
    update(ref(db, `booking/${id}`), { paid: !currentStatus });
  };

  const markAsPlayed = (id: string) => {
    update(ref(db, `booking/${id}`), { played: true });
  };

  const filteredBookings = bookings.filter((b) =>
    `${b.name} ${b.email} ${b.table}`.toLowerCase().includes(search.toLowerCase())
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Booking', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Nama', 'Email', 'Tanggal', 'Waktu', 'Meja', 'Durasi', 'Harga', 'Status']],
      body: bookings.map((b) => [
        b.name,
        b.email,
        b.date,
        b.time,
        b.table.toString(),
        `${b.duration} jam`,
        `Rp${Number(b.price).toLocaleString()}`,
        b.paid ? 'Sudah Bayar' : 'Belum Bayar',
      ]),
    });
    doc.save('laporan-booking.pdf');
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 min-h-screen bg-[#0a0a0a] text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Input
              placeholder="Cari nama/email/meja..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64"
            />
            <Button variant="outline">
              <Search size={16} />
            </Button>
            <Button onClick={exportPDF} className="bg-green-600 hover:bg-green-500 text-white">
              <Download className="mr-2" size={16} /> Export PDF
            </Button>
          </div>
        </div>

        {(() => {
          try {
            if (filteredBookings.length === 0) {
              return <p className="text-gray-400">Tidak ada booking ditemukan.</p>;
            }

            return (
              <div className="grid gap-4">
                {filteredBookings.map((b) => (
                  <Card key={b.id} className="bg-gray-900">
                    <CardContent className="p-4 grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h2 className="text-xl font-bold text-yellow-400">{b.name}</h2>
                        <p className="text-gray-400">{b.email}</p>
                        <p><strong>Tanggal:</strong> {b.date}</p>
                        <p><strong>Durasi:</strong> {b.duration} jam</p>
                        <p><strong>Harga:</strong> Rp{Number(b.price).toLocaleString()}</p>
                      </div>
                      <div>
                        <p><strong>Waktu:</strong> {b.time}</p>
                        <p><strong>Meja:</strong> {b.table ?? '-'}</p>
                        <p><strong>Metode:</strong> {b.paymentMethod || '-'}</p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <Badge variant={b.paid ? 'success' : 'warning'}>
                            {b.paid ? 'Sudah Bayar' : 'Belum Bayar'}
                          </Badge>
                        </p>
                        {b.played && (
                          <p>
                            <strong>Aktivitas:</strong>{' '}
                            <Badge variant="secondary">Sudah Bermain</Badge>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end items-center">
                        <Button
                          onClick={() => togglePaidStatus(b.id, b.paid)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-yellow-400 text-black hover:bg-yellow-300"
                        >
                          <CheckCheck size={16} />
                          {b.paid ? 'Batalkan Bayar' : 'Tandai Bayar'}
                        </Button>

                        <Button
                          onClick={() => markAsPlayed(b.id)}
                          disabled={b.played}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 size={16} />
                          {b.played ? 'Done' : 'Acc'}
                        </Button>

                        <Button
                          onClick={() => handleDelete(b.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-yellow-400 text-black hover:bg-yellow-300"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          } catch (err) {
            console.error('🔥 Error saat render bookings:', err);
            return <p className="text-red-500">Terjadi kesalahan saat menampilkan booking.</p>;
          }
        })()}
      </div>
    </ProtectedRoute>
  );
};

export default ManageBookings;
