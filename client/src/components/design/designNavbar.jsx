import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import logoCut from "../../static/logo-cut.png";
import "./dn.css";
import { Store } from "react-notifications-component";
import CartTable from "../subtopics/CartTable";

function DesignNavbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [feeds, setFeeds] = useState([]);
  const [hasUnread, setHasUnread] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileDp, showPrflDp] = useState(0);
  const [notifications, showNotifications] = useState(0);
  const [cart, showCart] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const refOne = useRef(null);
  const refTwo = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const p_name = location.pathname.split("/")[1];

  useEffect(() => {
    if (currentUser) {
      document.addEventListener("click", handleOutsideClick, true);
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [isOnline]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/profile/${currentUser.username}`
      );
      setUser(res.data);
      fetchFeeds(res.data.uid);
    } catch (error) {
      Store.addNotification({
        title: "Error!",
        message: error.response.data,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: true,
          showIcon: true,
        },
      });
    }
  };

  const fetchFeeds = async (uid) => {
    const resFeed = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/profile/notifications/${uid}?limit=10`
    );
    setFeeds(resFeed.data.result);
    resFeed.data.result.map((feed) => {
      if (feed.read == "0") {
        setHasUnread(1);
      }
    });
  };

  const handleOutsideClick = (e) => {
    if (refOne.current) {
      if (!refOne.current.contains(e.target)) {
        showPrflDp(0);
      }
    }
    if (refTwo.current) {
      if (!refTwo.current.contains(e.target)) {
        showNotifications(0);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?query=${searchTerm}`, { state: { tab: 2 } });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Poppins"
        rel="stylesheet"
      />
      <nav
        className={
          "navbar relative h-auto min-h-[54px] z-10 top-0 sticky flex flex-col lg:flex-row justify-between px-4 lg:px-[120px] py-3 border-b items-center bg-white tracking-[0.5px]" +
          (isOnline ? " font-poppins" : "")
        }
        style={{ boxShadow: "1px 0px 5px #7b8f981f" }}
      >
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center">
            <img
              src={logoCut}
              onClick={() => navigate("/")}
              className="mr-2 w-[48px] cursor-pointer"
              alt=""
            />
            <h1
              onClick={() => navigate("/")}
              className="text-xl text-gray-800 cursor-pointer"
            >
              KonnectEd
            </h1>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu and Desktop Navigation */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row w-full lg:w-auto items-center gap-4 mt-4 lg:mt-0`}>
          <ul className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
            <Link
              to="/"
              className={
                p_name == ""
                  ? "w-full lg:w-auto text-center px-2 py-1 bg-[#f1f0f3] rounded-lg"
                  : "w-full lg:w-auto text-center px-2 py-1"
              }
            >
              Home
            </Link>
            <Link
              to="/books"
              className={
                p_name == "books" || p_name == "book"
                  ? "w-full lg:w-auto text-center px-2 py-1 bg-[#f1f0f3] rounded-lg"
                  : "w-full lg:w-auto text-center px-2 py-1"
              }
            >
              Textbooks
            </Link>
            <Link
              to="/topics"
              className={
                p_name == "topics" ||
                p_name == "topic" ||
                p_name == "subtopic" ||
                p_name == "addnote"
                  ? "w-full lg:w-auto text-center px-2 py-1 bg-[#f1f0f3] rounded-lg"
                  : "w-full lg:w-auto text-center px-2 py-1"
              }
            >
              Topics
            </Link>
          </ul>

          {/* Search Bar */}
          <div className="w-full lg:w-auto px-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-full lg:w-[450px] h-[35px] bg-gray-50 text-gray-900 text-sm rounded-xl block pl-10 p-2.5 focus:outline-none"
                placeholder="Search for books and topics"
                required
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center justify-center w-full lg:w-auto space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-4">
                  {/* Cart Icon */}
                  <div
                    onClick={() => {
                      cart == 1 ? showCart(0) : showCart(1);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="cart">
                      <svg
                        fill="#000000"
                        height="20px"
                        width="20px"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 902.86 902.86"
                      >
                        <g>
                          <g>
                            <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path>
                            <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Notifications Icon */}
                  <div
                    onClick={() => {
                      notifications == 1
                        ? showNotifications(0)
                        : showNotifications(1);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="notif">
                      <svg
                        fill="#000"
                        height="20px"
                        width="20px"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 611.999 611.999"
                      >
                        {/* ... (keep existing notification SVG) ... */}
                      </svg>
                      {hasUnread == 1 && (
                        <span className="z-10 notif-unread absolute bg-red-500 w-[10px] h-[10px] rounded-[50%] bottom-[25px] ml-[12px]"></span>
                      )}
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div
                    onClick={() => (profileDp == 1 ? showPrflDp(0) : showPrflDp(1))}
                    className="flex text-sm rounded-full cursor-pointer"
                  >
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={
                        user.avatar
                          ? user.avatar
                          : currentUser.avatar
                          ? currentUser.avatar
                          : "/upload/avatar/no-cover-avatar.png"
                      }
                      alt="user photo"
                    />
                  </div>
                </div>

                {/* Keep existing dropdown menus */}
                {/* ... (keep cart popup, notifications dropdown, and profile dropdown) ... */}
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  className="px-4 py-2"
                  to="/login"
                  state={{ path: location.pathname }}
                >
                  Sign In
                </Link>
                <Link
                  className="px-4 py-2 bg-[#4353FF] hover:bg-[#2a3cff] text-sm text-white rounded-xl transition duration-200"
                  to="/signup"
                  state={{ path: location.pathname }}
                >
                  Get Started
                  <svg
                    className="ml-[3px] inline"
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* ... (keep existing arrow SVG) ... */}
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Keep existing notification and profile dropdowns */}
      {/* ... (keep remaining JSX for dropdowns) ... */}
    </>
  );
}

export default DesignNavbar;