import { useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import toast from 'react-hot-toast';

const NewBookingNotif: React.FC = () => {
  const prevCountRef = useRef<number | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const bookingRef = ref(db, 'booking');
    const unsubscribe = onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      const bookings = data ? Object.values(data) : [];
      const bookingCount = bookings.length;

      if (!isFirstLoad.current && prevCountRef.current !== null && bookingCount > prevCountRef.current) {
        toast.success('Booking baru masuk!');
      }

      prevCountRef.current = bookingCount;
      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default NewBookingNotif;
