import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase/firebase';
import {
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
  get,
} from 'firebase/database';
import { CheckCircle2, ClockIcon, TimerIcon } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const getBookingStatus = (bookingDate: string, bookingTime: string, duration: number) => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wibNow = new Date(utc + 7 * 3600000);

  const [hours, minutes] = bookingTime.split(':').map(Number);
  const bookingStart = new Date(`${bookingDate}T${bookingTime}:00+07:00`);
  const bookingEnd = new Date(bookingStart.getTime() + duration * 60 * 60000);

  if (wibNow < bookingStart) {
    return 'Mendatang';
  } else if (wibNow >= bookingStart && wibNow < bookingEnd) {
    return 'Sedang Berlangsung';
  } else {
    return 'Selesai';
  }
};

const History: React.FC = () => {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState('');

  useEffect(() => {
    if (user) {
      const bookingQuery = query(ref(db, 'booking'), orderByChild('uid'), equalTo(user.uid));
      onValue(bookingQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const bookings = Object.entries(data).map(([key, val]: any) => ({ ...val, key }));
          const sorted = bookings.sort((a: any, b: any) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeB.getTime() - dateTimeA.getTime();
          });
          setHistory(sorted);
        } else {
          setHistory([]);
        }
      });
    }
  }, [user]);

  const handleOpenReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
    setNewDuration(booking.duration);
    setShowModal(true);
  };

  const checkAvailability = async (
    table: string,
    newDate: string,
    newTime: string,
    duration: number
  ): Promise<boolean> => {
    const bookingsRef = ref(db, 'booking');
    const snapshot = await get(bookingsRef);
    if (!snapshot.exists()) return true;

    const data = snapshot.val();
    const newStart = new Date(`${newDate}T${newTime}:00+07:00`);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 60000);

    for (const key in data) {
      const b = data[key];
      if (b.table === table && b.date === newDate && key !== selectedBooking.key) {
        const bStart = new Date(`${b.date}T${b.time}:00+07:00`);
        const bEnd = new Date(bStart.getTime() + b.duration * 60 * 60000);
        if (newStart < bEnd && newEnd > bStart) {
          return false;
        }
      }
    }

    return true;
  };

  const handleReschedule = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    const isAvailable = await checkAvailability(selectedBooking.table, newDate, newTime, newDuration);

    if (!isAvailable) {
      setNotif('Waktu baru bentrok dengan booking lain.');
      setLoading(false);
      return;
    }

    await update(ref(db, `booking/${selectedBooking.key}`), {
      date: newDate,
      time: newTime,
      duration: newDuration,
      rescheduled: true,
    });

    setNotif('Reschedule berhasil!');
    setShowModal(false);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10 text-white bg-[#0a0a0a] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#FFD700]">Riwayat Reservasi</h1>
  
      {notif && <p className="text-sm text-green-400 mb-4">{notif}</p>}
  
      {history.length === 0 ? (
        <p className="text-gray-400">Belum ada histori booking.</p>
      ) : (
        <div className="grid gap-4">
          {history.map((booking, index) => {
            const status = getBookingStatus(booking.date, booking.time, booking.duration);
  
            return (
              <div
                key={index}
                className="bg-[#111111] border-l-4 p-4 rounded-xl shadow-md transition-transform hover:scale-[1.01] border-[#FFD700]"
              >
                <div className="flex items-center gap-2 text-sm mb-2">
                  {status === 'Selesai' ? (
                    <>
                      <CheckCircle2 className="text-green-500" size={18} />
                      <span className="text-green-400">Selesai</span>
                    </>
                  ) : status === 'Sedang Berlangsung' ? (
                    <>
                      <TimerIcon className="text-blue-400" size={18} />
                      <span className="text-blue-300">Sedang Berlangsung</span>
                    </>
                  ) : (
                    <>
                      <ClockIcon className="text-[#FFD700]" size={18} />
                      <span className="text-[#FFD700]">Mendatang</span>
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
                    📌 Status Bayar :{' '}
                    <span className={`font-semibold ${booking.paid ? 'text-green-400' : 'text-red-400'}`}>
                      {booking.paid ? 'Sudah Dibayar' : 'Belum Dibayar'}
                    </span>
                  </p>
                </div>
  
                {status === 'Mendatang' && (
                  <button
                    onClick={() => handleOpenReschedule(booking)}
                    disabled={booking.rescheduled}
                    className={`mt-3 text-sm px-4 py-1.5 rounded-full font-semibold ${
                      booking.rescheduled
                        ? 'bg-red-600 text-white cursor-not-allowed'
                        : 'bg-[#FFD700] hover:bg-yellow-400 text-black'
                    }`}
                  >
                    {booking.rescheduled ? 'Rescheduling Completed' : 'Reschedule'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
  
      {/* Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1c1c1c] p-6 rounded-xl w-full max-w-md text-white">
            <Dialog.Title className="text-lg font-bold mb-4 text-[#FFD700]">Reschedule Booking</Dialog.Title>
  
            <label className="text-sm block mb-2">Tanggal Baru</label>
            <input
              type="date"
              className="w-full p-2 rounded bg-gray-800 text-white mb-3"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
  
            <label className="text-sm block mb-2">Jam Baru</label>
            <input
              type="time"
              className="w-full p-2 rounded bg-gray-800 text-white mb-3"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
  
            <label className="text-sm block mb-2">Durasi Baru (jam)</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-800 text-white mb-4"
              min={1}
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
            />
  
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleReschedule}
                disabled={loading}
                className="bg-[#FFD700] px-4 py-2 rounded text-black font-semibold hover:bg-yellow-400"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );  
};

export default History;
