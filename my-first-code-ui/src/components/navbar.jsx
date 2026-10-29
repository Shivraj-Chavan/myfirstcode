import { useState, useEffect } from "react";
import LoginModal from "./loginModal";
const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("role");

  localStorage.removeItem("user");

  setIsLoggedIn(false);

  window.location.href = "/";
};

  return (
    <>
      <nav className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-600">
          MyFirstCode
        </h1>

        <div>
          {!isLoggedIn ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Profile
            </button>
          ) : (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {showModal && (
        <LoginModal
          setShowModal={setShowModal}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
};

export default Navbar;