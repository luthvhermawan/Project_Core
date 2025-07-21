import PageWrapper from "../../components/wrapper";
import { FaCalendarCheck, FaHistory, FaMobileAlt, FaBell } from 'react-icons/fa';

const features = [
  {
    title: 'Reservasi Online',
    description: 'Pesan meja billiard secara real-time dengan waktu yang fleksibel.',
    icon: <FaCalendarCheck className="text-4xl text-yellow-400 mb-4" />,
  },
  {
    title: 'PWA Support',
    description: 'Bisa diakses tanpa install aplikasi, cukup dari browser saja.',
    icon: <FaMobileAlt className="text-4xl text-yellow-400 mb-4" />,
  },
  {
    title: 'Riwayat Pemesanan',
    description: 'Pantau histori pemesanan kamu untuk jadwal rutin latihan.',
    icon: <FaHistory className="text-4xl text-yellow-400 mb-4" />,
  },
  {
    title: 'Notifikasi Real-time',
    description: 'Dapatkan update saat reservasi dikonfirmasi atau diubah.',
    icon: <FaBell className="text-4xl text-yellow-400 mb-4" />,
  },
];

const Feature = () => (
  <PageWrapper>
    <div className="min-h-screen text-white px-6 md:px-20 py-12 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl">
      <h1 className="text-4xl font-bold text-yellow-500 mb-10">Fitur Unggulan</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#1a1e2e] rounded-xl p-6 shadow-lg hover:scale-105 hover:bg-[#2a2f43] transition-all duration-300"
          >
            <div className="flex flex-col items-start">
              {feature.icon}
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </PageWrapper>
);

export default Feature;