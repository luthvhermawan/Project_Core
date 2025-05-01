import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        console.log("Berhasil logout");
        navigate("/"); // redirect ke landing page
      } catch (error) {
        console.error("Gagal logout:", error);
        alert("Logout gagal, coba lagi!");
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold text-gray-700">Sedang logout...</p>
    </div>
  );
};

export default Logout;
