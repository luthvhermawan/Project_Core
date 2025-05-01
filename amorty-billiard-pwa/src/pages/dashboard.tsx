import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CalendarDays, PhoneCall, Bell, Info, CheckCircle, XCircle } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db, auth } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Dialog } from "@headlessui/react";

interface BookingData {
  id: string;
  uid: string;
  email: string;
  name: string;
  table: number;
  date: string;
  time: string;
  duration: number;
  paid: boolean;
}

const UserDashboard = () => {
  const [user] = useAuthState(auth);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeBooking, setActiveBooking] = useState<BookingData | null>(null);

  const notifications = [
    "Promo Baru: Diskon 10% booking malam ini!",
    "Booking Meja 3 kamu sebentar lagi giliran!",
  ];

  // Update current time tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Ambil semua booking realtime
  useEffect(() => {
    const bookingsRef = ref(db, "booking");
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allBookings = Object.entries(data).map(([id, booking]: any) => ({
          id,
          ...booking,
        }));
        setBookings(allBookings);
      } else {
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cek booking aktif user realtime
  useEffect(() => {
    const bookingsRef = ref(db, "booking");
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userBookings = Object.entries(data)
          .map(([id, booking]: any) => ({ id, ...booking }))
          .filter((b: any) => b.uid === user?.uid);

        const now = new Date();
        const currentBooking = userBookings.find((b: any) => {
          const startTime = new Date(`${b.date}T${b.time}`);
          const endTime = new Date(startTime.getTime() + b.duration * 60 * 60 * 1000);
          return now >= startTime && now < endTime;
        });

        setActiveBooking(currentBooking || null);
      } else {
        setActiveBooking(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Cek status meja
  const checkTableStatus = (tableNum: number) => {
    const now = currentTime;
    const activeBooking = bookings.find((b) => {
      if (b.table !== tableNum) return false;
      const startTime = new Date(`${b.date}T${b.time}`);
      const endTime = new Date(startTime.getTime() + b.duration * 60 * 60 * 1000);
      return now >= startTime && now < endTime;
    });
    return activeBooking || null;
  };

  const handleTableClick = (tableNum: number) => {
    const booking = checkTableStatus(tableNum);
    if (booking) {
      setSelectedBooking(booking);
      setShowModal(true);
    }
  };

  return (
    <div className="p-6 space-y-8 text-white bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-2">
        🎱 Selamat Datang,{" "}
        {user?.displayName || (user?.email ? user.email.split("@")[0] : "Player")}!
      </h1>
      <p className="text-gray-400 text-sm">Siap main dan jadi jawara hari ini?</p>

      {/* Notifikasi */}
      <Card className="bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-lg">
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell size={20} /> Notifikasi
          </h2>
          <ul className="space-y-1">
            {notifications.map((note, i) => (
              <li key={i} className="text-sm">• {note}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Arena Meja */}
      <div>
        <h2 className="text-3xl font-bold mb-4">🎱 Arena Meja Saat Ini</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {[...Array(30)].map((_, i) => {
            const tableNum = i + 1;
            const activeBooking = checkTableStatus(tableNum);
            return (
              <div
                key={i}
                onClick={() => activeBooking && handleTableClick(tableNum)}
                className={`border-2 rounded-2xl p-4 text-center cursor-pointer transition duration-300 ${
                  activeBooking
                    ? " border-yellow-500 hover:bg-yellow-700"
                    : "bg-black border-yellow-500 hover:bg-yellow-700"
                }`}
              >
                <p className="font-semibold text-lg">Meja {tableNum}</p>
                <span className="flex justify-center items-center gap-1 mt-2 text-sm">
                  {activeBooking ? (
                    <>
                      <XCircle size={16} className="text-red-500" />
                      <span className="text-yellow-500 font-medium">Dipakai</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="text-yellow-500 font-medium">Tersedia</span>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kontak Admin */}
      <Card className="bg-gradient-to-r from-black via-yellow-700 to-black shadow-lg">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-bold flex items-center gap-2 justify-center">
            <PhoneCall size={20} /> Butuh Bantuan?
          </h2>
          <p className="mt-2 text-sm">Hubungi admin via WhatsApp kalau ada kendala booking.</p>
          <Button className="mt-4 bg-black text-white hover:bg-yellow-700 transition">
            Chat Admin
          </Button>
        </CardContent>
      </Card>

      {/* Modal Detail Booking */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#0a0a0a] text-white rounded-xl p-6 max-w-sm w-full border border-yellow-700">
            <Dialog.Title className="text-xl font-bold flex items-center gap-2 mb-4">
              <Info size={22} /> Info Booking Meja
            </Dialog.Title>
            {selectedBooking && (
              <div className="space-y-2 text-sm">
                <p>👤 Pemesan: {selectedBooking.name}</p>
                <p>🎱 Meja: {selectedBooking.table}</p>
                <p>🕒 Mulai: {selectedBooking.time}</p>
                <p>⏳ Durasi: {selectedBooking.duration} Jam</p>
              </div>
            )}
            <Button
              className="w-full bg-yellow-600 text-black mt-6 hover:bg-yellow-400 transition"
              onClick={() => setShowModal(false)}
            >
              Tutup
            </Button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
