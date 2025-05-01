import PageWrapper from "../components/wrapper";

const About = () => (
  <PageWrapper>
    <div className="min-h-screen text-white px-6 md:px-20 py-12 bg-black bg-opacity-60 backdrop-blur-md rounded-xl">
      <h1 className="text-4xl font-bold text-yellow-500 mb-6">Tentang Amorty Billiards</h1>
      <p className="text-lg leading-relaxed mb-6">
        <strong>Amorty Billiards Training Ground</strong> adalah tempat latihan biliar profesional yang menyediakan layanan pemesanan meja secara online, dirancang untuk mendukung pertumbuhan atlet biliar dan pecinta hobi dengan cara yang modern dan efisien.
      </p>
      <p className="text-lg leading-relaxed mb-6">
        Kami percaya bahwa olahraga biliar bukan hanya permainan, melainkan sebuah seni yang membutuhkan tempat latihan yang tepat, komunitas yang kuat, dan teknologi yang mendukung. Maka dari itu, kami mengembangkan sistem reservasi digital yang memudahkan kamu memesan meja biliar secara real-time.
      </p>
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Kenapa Memilih Amorty?</h2>
        <ul className="list-disc list-inside text-white space-y-2">
          <li>Akses mudah melalui <strong>Progressive Web App (PWA)</strong>.</li>
          <li>Booking meja biliar <strong>tanpa harus install aplikasi</strong>.</li>
          <li>Sistem digital yang cepat, aman, dan ramah pengguna.</li>
          <li>Tempat nyaman, ideal untuk latihan maupun bersantai.</li>
          <li>Komunitas pemain yang suportif dan berkembang.</li>
        </ul>
      </div>
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-black mb-2">Visi & Misi</h2>
        <p className="text-black">
          Visi kami adalah menjadi pusat pelatihan biliar berbasis teknologi terbaik di Indonesia. Misi kami adalah memberikan layanan yang modern, fleksibel, dan menjangkau seluruh kalangan melalui sistem digital yang praktis dan efisien.
        </p>
      </div>
      <footer className="text-center text-sm mt-16 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Amorty Billiards Training Ground. All rights reserved.
      </footer>
    </div>
  </PageWrapper>
);

export default About;
