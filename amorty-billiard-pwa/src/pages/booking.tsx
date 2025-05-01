import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import { ref, set, onValue } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import PaymentModal from '../components/payment';

interface BookingData {
  name: string;
  table: number;
  date: string;
  time: string;
  duration: number;
}

const BookingWithPayment: React.FC = () => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState<number>(1);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookedTables, setBookedTables] = useState<BookingData[]>([]);

  const today = new Date().toISOString().split('T')[0];

  // Ambil semua booking aktif
  useEffect(() => {
    const bookingsRef = ref(db, 'booking');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      const bookings: BookingData[] = [];
      for (let id in data) {
        if (data[id].date === today) {
          bookings.push(data[id]);
        }
      }
      setBookedTables(bookings);
    });
  }, []);

  // Cek bentrok jadwal
  const isTableAvailable = (table: number, time: string, duration: number) => {
    const start = parseInt(time.split(':')[0]);
    const end = start + duration;
    for (const b of bookedTables) {
      if (b.table === table) {
        const bStart = parseInt(b.time.split(':')[0]);
        const bEnd = bStart + b.duration;
        if (start < bEnd && end > bStart) {
          return false; // bentrok
        }
      }
    }
    return true;
  };

  const handleConfirmBooking = () => {
    if (!selectedTable || !time || !duration) return alert('Lengkapi semua data');
    if (!isTableAvailable(selectedTable, time, duration)) {
      return alert('Meja sudah dibooking pada jam tersebut');
    }
    setShowPopup(true);
  };

  const handlePayment = (method: string) => {
  setPaymentMethod(method);
  const totalPrice = duration * 32000;
  setAmount(totalPrice);

  if (user) {
    const bookingId = uuidv4();
    const newBookingRef = ref(db, `booking/${bookingId}`);

    set(newBookingRef, {
      uid: user.uid,
      email: user.email,
      name,
      table: selectedTable,
      date: today,
      time,
      duration,
      price: totalPrice,
      paid: true,
      paymentMethod: method,
    });

    alert(`Booking berhasil menggunakan ${method}`);
    setShowPopup(false);
    setShowPaymentModal(true);

    // reset form habis booking
    setName('');
    setSelectedTable(null);
    setTime('');
    setDuration(1);
    }
  };

  return (
    <div className="p-6 text-white bg-[#0a0a0a] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reservasi Meja</h1>

      <div className="grid gap-4 max-w-md mx-auto">
        <input
        type="text"
        placeholder="Nama Pemesan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded bg-gray-800 border border-gray-600"
        />
        <input
          type="time"
          className="p-2 rounded bg-gray-800 border border-gray-600"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 border border-gray-600"
        >
          {[1, 2, 3, 4].map((hour) => (
            <option key={hour} value={hour}>{hour} Jam</option>
          ))}
        </select>
        <select
          value={selectedTable || ''}
          onChange={(e) => setSelectedTable(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="" disabled>Pilih Meja</option>
          {[...Array(30)].map((_, i) => {
            const tableNum = i + 1;
            const isAvailable = isTableAvailable(tableNum, time, duration);
            return (
              <option key={tableNum} value={tableNum} disabled={!isAvailable}>
                {`Meja ${tableNum}`} {isAvailable ? '' : ' - Tidak Tersedia'}
              </option>
            );
          })}
        </select>

        <button
          onClick={handleConfirmBooking}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded"
        >
          Booking Sekarang
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <button onClick={() => handlePayment('GoPay')}>GoPay</button>
          <button onClick={() => handlePayment('Dana')}>Dana</button>
          <button onClick={() => handlePayment('OVO')}>OVO</button>
          <button onClick={() => setShowPopup(false)}>Tutup</button>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal
          method={paymentMethod}
          amount={amount}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default BookingWithPayment;
