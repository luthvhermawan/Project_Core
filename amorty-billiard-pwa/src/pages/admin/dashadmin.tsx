import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { ref, onValue } from 'firebase/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LucideTable, CalendarDays, BadgeCheck, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../routes/protectedroute';

const DashboardAdmin: React.FC = () => {
  const [totalBooking, setTotalBooking] = useState(0);
  const [todayBooking, setTodayBooking] = useState(0);
  const [paidBooking, setPaidBooking] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingRef = ref(db, 'booking');
    onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      const bookings = Object.values(data || {});
      const today = new Date().toISOString().split('T')[0];

      setTotalBooking(bookings.length);
      setTodayBooking(bookings.filter((b: any) => b.date === today).length);
      setPaidBooking(bookings.filter((b: any) => b.paid).length);

      const dailyCount: Record<string, number> = {};
      bookings.forEach((b: any) => {
        if (!dailyCount[b.date]) dailyCount[b.date] = 0;
        dailyCount[b.date]++;
      });

      const formattedChartData = Object.keys(dailyCount).map(date => ({
        date,
        total: dailyCount[date],
      }));

      setChartData(formattedChartData);
    });
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 text-white min-h-screen bg-[#0a0a0a]">
        <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-4 flex items-center gap-4">
              <LucideTable size={36} className="text-yellow-400" />
              <div>
                <h2 className="text-sm">Total Booking</h2>
                <p className="text-2xl font-bold">{totalBooking}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white">
            <CardContent className="p-4 flex items-center gap-4">
              <CalendarDays size={36} className="text-yellow-400" />
              <div>
                <h2 className="text-sm">Booking Hari Ini</h2>
                <p className="text-2xl font-bold">{todayBooking}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white">
            <CardContent className="p-4 flex items-center gap-4">
              <BadgeCheck size={36} className="text-green-400" />
              <div>
                <h2 className="text-sm">Booking Terbayar</h2>
                <p className="text-2xl font-bold">{paidBooking}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white">
            <CardContent className="p-4 flex items-center gap-4">
              <BarChart3 size={36} className="text-blue-400" />
              <div>
                <h2 className="text-sm">Grafik Harian</h2>
                <p className="text-2xl font-bold">{chartData.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafik */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Grafik Booking Harian</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" allowDecimals={false} />
              <Tooltip cursor={{ fill: '#333' }} />
              <Bar dataKey="total" fill="#facc15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex gap-4">
          <Button
            className="bg-yellow-500 text-black hover:bg-yellow-400"
            onClick={() => navigate('/managebookings')}
          >
            Kelola Booking
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-600" disabled>
            Kelola Meja (coming soon)
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardAdmin;
