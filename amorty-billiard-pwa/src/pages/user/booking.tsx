import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase/firebase';
import { ref, set, onValue, runTransaction, remove } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import PaymentModal from '../../components/payment';
import { CheckCircle, XCircle } from 'lucide-react';

interface BookingData {
  bookingId?: string;
  name: string;
  table: number;
  date: string;
  time: string;
  duration: number;
}

interface BookingWithPaymentProps {
  initialData?: BookingData;
}

const BookingWithPayment: React.FC<BookingWithPaymentProps> = ({ initialData }) => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookedTables, setBookedTables] = useState<BookingData[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const getTodayDateWIB = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 7 * 3600000);
    const yyyy = wib.getFullYear();
    const mm = (wib.getMonth() + 1).toString().padStart(2, '0');
    const dd = wib.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = getTodayDateWIB();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedTable(initialData.table);
      setTime(initialData.time);
      setDuration(initialData.duration);
    }

    const bookingsRef = ref(db, 'booking');
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      const bookings: BookingData[] = [];
      if (data) {
        for (let id in data) {
          if (data[id].date === today) {
            bookings.push({ ...data[id], bookingId: id });
          }
        }
      }
      setBookedTables(bookings);
    });

    return () => unsubscribe();
  }, [today, initialData]);

  const isTableAvailable = (table: number, time: string, duration: number) => {
    if (!time) return true;
    const [startHour, startMinute] = time.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = start + duration * 60;

    for (const b of bookedTables) {
      if (b.table === table && (!initialData || b.bookingId !== initialData.bookingId)) {
        const [bStartHour, bStartMinute] = b.time.split(':').map(Number);
        const bStart = bStartHour * 60 + bStartMinute;
        const bEnd = bStart + b.duration * 60;

        if (start < bEnd && end > bStart) {
          return false;
        }
      }
    }
    return true;
  };

  const handleConfirmBooking = () => {
    if (!selectedTable || !time || !duration || !name) {
      return alert('Lengkapi semua data');
    }
    if (!isTableAvailable(selectedTable, time, duration)) {
      return alert('Meja sudah dibooking pada jam tersebut');
    }
    setShowSummary(true);
  };

  const handlePayment = async (method: string) => {
    setPaymentMethod(method);
    const totalPrice = duration * 32000;
    setAmount(totalPrice);

    if (user && selectedTable !== null) {
      const lockKey = `${today}-${selectedTable}-${time.replace(':', '-')}`;
      const lockRef = ref(db, `bookingLock/${lockKey}`);

      try {
        const result = await runTransaction(lockRef, (currentData) => {
          if (currentData === null || (initialData && currentData.lockedBy === user.uid)) {
            return { lockedBy: user.uid, timestamp: Date.now() };
          }
          return;
        });

        if (result.committed) {
          const bookingId = initialData?.bookingId || uuidv4();
          const newBookingRef = ref(db, `booking/${bookingId}`);

          await runTransaction(newBookingRef, (currentData) => {
            if (currentData === null) {
              return {
                uid: user.uid,
                name,
                date: today,
                time,
                table: selectedTable,
                duration,
                paymentMethod: method,
                paid: true,
                price: totalPrice,
                rescheduled: false,
              };
            }
            return;
          });

          if (initialData?.bookingId && initialData.table !== selectedTable) {
            const oldLockKey = `${today}-${initialData.table}-${initialData.time.replace(':', '-')}`;
            await remove(ref(db, `bookingLock/${oldLockKey}`));
          }

          alert(
            `✅ Booking ${initialData ? 'berhasil diperbarui' : 'berhasil dilakukan'}!\n` +
            `Nama: ${name}\nMeja: ${selectedTable}\nTanggal: ${today}\nJam: ${time} selama ${duration} jam\n` +
            `Metode Pembayaran: ${method}\nTotal: Rp${totalPrice.toLocaleString('id-ID')}`
          );

          setShowPaymentModal(true);
          setName('');
          setSelectedTable(null);
          setTime('');
          setDuration(1);
          setShowSummary(false);
        } else {
          alert('Gagal booking. Slot sudah diambil orang lain.');
        }
      } catch (error) {
        console.error('Error booking:', error);
        alert('Terjadi kesalahan saat booking. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#0a0a0a] text-white">
      <h1 className="text-2xl font-extrabold mb-6 text-center text-yellow-400">
        {initialData ? 'Edit Booking' : 'Reservasi Meja'}
      </h1>
  
      <div className="grid gap-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Nama Pemesan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded bg-[#1c1c1c] border border-yellow-500 text-white placeholder-gray-400"
        />
  
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="p-3 rounded bg-[#1c1c1c] border border-yellow-500 text-white"
        />
  
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="p-3 rounded bg-[#1c1c1c] border border-yellow-500 text-white"
        >
          {[1, 2, 3, 4].map((hour) => (
            <option key={hour} value={hour}>
              {hour} Jam
            </option>
          ))}
        </select>
  
        <div>
          <p className="text-lg font-semibold text-yellow-400 mb-2">Pilih Meja</p>
          <div className="grid grid-cols-5 gap-3">
            {[...Array(30)].map((_, i) => {
              const tableNum = i + 1;
              const isAvailable = isTableAvailable(tableNum, time, duration);
              const isSelected = selectedTable === tableNum;
  
              return (
                <button
                  key={tableNum}
                  onClick={() => isAvailable && setSelectedTable(tableNum)}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-bold transition duration-200 ${
                    isAvailable
                      ? isSelected
                        ? 'bg-yellow-400 text-black border-yellow-500'
                        : 'bg-[#1c1c1c] text-white border-yellow-600 hover:bg-yellow-500 hover:text-black'
                      : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                  }`}
                >
                  <span>Meja {tableNum}</span>
                  {isAvailable ? (
                    <CheckCircle className="w-5 h-5 mt-1 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 mt-1 text-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
  
        <button
          onClick={handleConfirmBooking}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-4 rounded mt-4 shadow-md transition duration-200"
        >
          {initialData ? 'Update Booking' : 'Booking Sekarang'}
        </button>

        {showSummary && (
          <div className="mt-6 p-4 bg-[#1c1c1c] border border-yellow-600 rounded-lg shadow-md text-white space-y-4">
            <h2 className="text-xl font-bold text-yellow-400">Rincian Pemesanan</h2>
            <ul className="text-sm space-y-1">
              <li>Nama: <span className="text-yellow-300 font-semibold">{name}</span></li>
              <li>Tanggal: <span className="text-yellow-300 font-semibold">{today}</span></li>
              <li>Jam: <span className="text-yellow-300 font-semibold">{time}</span></li>
              <li>Durasi: <span className="text-yellow-300 font-semibold">{duration} Jam</span></li>
              <li>Meja: <span className="text-yellow-300 font-semibold">{selectedTable}</span></li>
              <li>Total Harga: <span className="text-yellow-300 font-semibold">Rp{(duration * 32000).toLocaleString('id-ID')}</span></li>
            </ul>

            <div className="pt-4">
              <p className="text-yellow-400 font-semibold mb-2">Pilih Metode Pembayaran</p>
              <div className="grid grid-cols-2 gap-3">
                {['GoPay', 'Dana', 'LinkAja', 'OVO'].map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePayment(method)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded w-full transition duration-150"
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal method={paymentMethod} amount={amount} onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
};

export default BookingWithPayment;
