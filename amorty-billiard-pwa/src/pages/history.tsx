import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { CheckCircle2, ClockIcon } from 'lucide-react';

const History: React.FC = () => {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const bookingQuery = query(ref(db, 'booking'), orderByChild('uid'), equalTo(user.uid));

      onValue(bookingQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const bookings = Object.values(data);
          const sorted = bookings.sort(
            (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setHistory(sorted);
        } else {
          setHistory([]); // kalo null amanin
        }
      });
    }
  }, [user]);

  return (
    <div className="p-6 md:p-10 text-white bg-[#0a0a0a] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Riwayat Reservasi</h1>

      {history.length === 0 ? (
        <p className="text-gray-400">Belum ada histori booking.</p>
      ) : (
        <div className="grid gap-4">
          {history.map((booking, index) => (
            <div
              key={index}
              className="bg-gray-800 border-l-4 p-4 rounded-xl shadow-md transition-transform hover:scale-[1.01] border-yellow-500"
            >
              <div className="flex items-center gap-2 text-sm mb-2">
                {new Date(booking.date) < new Date() ? (
                  <>
                    <CheckCircle2 className="text-green-500" size={18} />
                    <span className="text-green-400">Selesai</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="text-yellow-400" size={18} />
                    <span className="text-yellow-300">Mendatang</span>
                  </>
                )}
              </div>

              <div className="text-sm space-y-1 text-gray-300">
                <p>🧑 Nama : {booking.name}</p>
                <p>📅 Tanggal : {booking.date}</p>
                <p>🕒 Jam Mulai : {booking.time}</p>
                <p>🎱 Meja : {booking.table}</p>
                <p>⏳ Durasi : {booking.duration} Jam</p>
                <p>💸 Harga : Rp {booking.price.toLocaleString()}</p>
                <p>💳 Metode Bayar : {booking.paymentMethod}</p>
                <p>
                  📌 Status :{' '}
                  <span className={`font-semibold ${booking.paid ? 'text-green-400' : 'text-red-400'}`}>
                    {booking.paid ? 'Sudah Dibayar' : 'Belum Dibayar'}
                  </span>
                </p>
              </div>

              {booking.notes && (
                <p className="mt-2 text-sm text-gray-300 italic">Catatan: {booking.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
