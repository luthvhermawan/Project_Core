import { Outlet } from "react-router-dom";
import NavbarUser from "../components/navbar";
import Footer from "../components/footer";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <NavbarUser />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
