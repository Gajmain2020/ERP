/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../../images/logo.png";
import jwtDecode from "jwt-decode";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isShowData = useLocation().pathname.split("/")[1];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setToken(
      localStorage.getItem("authToken") ? localStorage.getItem("authToken") : ""
    );
  }, [setToken]);

  useEffect(() => {
    if (token !== "") {
      const decode = jwtDecode(token);
      if (decode !== null) {
        setUser(decode);
      }
    }
  }, [token, isOpen]);

  if (isShowData === "show-data") {
    return;
  }

  function handleOptionClick(option) {
    navigate("/" + option);
  }

  function handleProfileClick() {
    alert("profile button clicked");
  }
  function handleLogoutClick() {
    setToken(() => "");
    setUser(() => null);
    localStorage.removeItem("authToken");
    setIsOpen(false);
    navigate("/");
  }

  return (
    <div>
      <nav className="bg-gray-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center w-full">
              <div
                onClick={() => navigate("/")}
                className="flex-shrink-0 rounded-full cursor-pointer hover:bg-gray-300 bg-gray-50"
              >
                <img className="h-16 w-16" src={LOGO} />
              </div>
              <div className="w-full flex hidden md:block">
                <div className="ml-4 flex gap-1">
                  <button
                    onClick={() => handleOptionClick("complaint")}
                    className="text-gray-300 hover:bg-gray-700 transition-all ease-in-out delay-150 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Complaint
                  </button>
                  <button
                    onClick={() => handleOptionClick("complaint")}
                    className="text-gray-300 hover:bg-gray-700 transition-all ease-in-out delay-150 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Contact
                  </button>
                  <div className="flex ml-auto gap-6 md:block">
                    {user === null ? (
                      <button
                        onClick={() => handleOptionClick("admin-login")}
                        className="transition-all ease-in-out delay-200 bg-gray-500 text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Admin Login
                      </button>
                    ) : (
                      <>
                        <div className="flex gap-4">
                          <span
                            onClick={() => handleProfileClick()}
                            className="w-10 h-10 cursor-pointer bg-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
                          >
                            {user.name[0].toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleLogoutClick()}
                            className="transition-all delay-150 ease-in-out bg-blue-200 text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleOptionClick("complaint");
                  }}
                  className="text-gray-300 hover:bg-gray-700 block transition-all ease-in-out delay-150 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Complaint
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleOptionClick("complaint");
                  }}
                  className="text-gray-300 hover:bg-gray-700 block transition-all ease-in-out delay-150 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </button>
                {user === null ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleOptionClick("admin-login");
                    }}
                    className="text-gray-300 hover:bg-gray-700 block hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Login
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleProfileClick();
                      }}
                      className="text-gray-300 hover:bg-gray-700 block hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogoutClick();
                        setIsOpen(false);
                      }}
                      className="text-gray-300 hover:bg-gray-700 block hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
}
