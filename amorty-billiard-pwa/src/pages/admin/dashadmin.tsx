import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { ref, onValue, off } from 'firebase/database';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {  
  LucideTable,
  CalendarDays,
  BadgeCheck, 
  BarChart3,
  BellRing,
  Sun,
  Moon, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Booking = { 
  date: string; 
  paid: boolean;
  totalPrice: number; 
};

const DashboardAdmin: React.FC = () => { 
  const [totalBooking, setTotalBooking] = useState(0);
  const [todayBooking, setTodayBooking] = useState(0);
  const [paidBooking, setPaidBooking] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [income, setIncome] = useState(0);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('week');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const navigate = useNavigate();

  const getFilteredData = (bookings: Booking[]) => {
    const now = new Date();
    return bookings.filter((b) => {
      const bDate = new Date(b.date);
      if (isNaN(bDate.getTime())) return false;
      if (filter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return bDate >= weekAgo;
      } else if (filter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return bDate >= monthAgo;
      }
      return true;
    });
  };

  useEffect(() => {
    const bookingRef = ref(db, 'booking');

    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      const bookings: Booking[] = Object.values(data || {});
      const today = new Date().toISOString().split('T')[0];

      setTotalBooking(bookings.length);
      setTodayBooking(bookings.filter((b) => b.date === today).length);
      setPaidBooking(bookings.filter((b) => b.paid).length);

      const totalIncome = bookings
        .filter((b) => b.paid && b.totalPrice)
        .reduce((acc, b) => acc + b.totalPrice, 0);
      setIncome(totalIncome);

      const filtered = getFilteredData(bookings);
      const dailyCount: Record<string, number> = {};
      filtered.forEach((b) => {
        if (b.date) {
          dailyCount[b.date] = (dailyCount[b.date] || 0) + 1;
        }
      });

      const formattedChartData = Object.keys(dailyCount).map((date) => ({
        date,
        total: dailyCount[date],
      }));
      setChartData(formattedChartData);
    };

    onValue(bookingRef, handleData);
    return () => off(bookingRef);
  }, [filter]);

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="outline"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="ml-2">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<LucideTable size={36} className="text-yellow-400" />} label="Total Booking" value={totalBooking} />
        <StatCard icon={<CalendarDays size={36} className="text-yellow-400" />} label="Booking Hari Ini" value={todayBooking} />
        <StatCard icon={<BadgeCheck size={36} className="text-green-400" />} label="Booking Terbayar" value={paidBooking} />
        <StatCard icon={<BarChart3 size={36} className="text-blue-400" />} label="Grafik Harian" value={chartData.length} />
        <StatCard icon={<BellRing size={36} className="text-purple-400" />} label="Total Pendapatan" value={`Rp ${income.toLocaleString()}`} />
      </div>

      {/* Filter */}
      <div className="mb-4">
        <span className="mr-2 font-medium">Filter Grafik:</span>
        {['week', 'month', 'all'].map((opt) => (
          <Button
            key={opt}
            variant={filter === opt ? 'default' : 'outline'}
            className="mr-2"
            onClick={() => setFilter(opt as any)}
          >
            {opt === 'week' ? 'Minggu Ini' : opt === 'month' ? 'Bulan Ini' : 'Semua'}
          </Button>
        ))}
      </div>

      {/* Chart */}
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

      {/* Action Buttons */}
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
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <Card className="bg-gray-900 text-white">
    <CardContent className="p-4 flex items-center gap-4">
      {icon}
      <div>
        <h2 className="text-sm">{label}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default DashboardAdmin;
