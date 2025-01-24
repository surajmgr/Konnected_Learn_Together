import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import logoCut from "../../static/logo-cut.png";
import { useIntersection } from "../utils/onScreen";

// React Notification
import { Store } from "react-notifications-component";

function DesignNavbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [feeds, setFeeds] = useState([]);
  const [hasUnread, setHasUnread] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileDp, showPrflDp] = useState(0);
  const [notifications, showNotifications] = useState(0);
  const refOne = useRef(null);
  const refTwo = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const p_name = location.pathname.split("/")[1];
  console.log(p_name);

  useEffect(() => {
    if (currentUser) {
      document.addEventListener("click", handleOutsideClick, true);
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile/${currentUser.username}`);
      setUser(res.data);
      fetchFeeds(res.data.uid)
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
    resFeed.data.result.map((feed)=>{
      if(feed.read == "0"){
        setHasUnread(1);
      }
    })
  }

  const updateReadFeed = async (changereq) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/profile/notifications?changereq=${changereq}`,
      {
        uid: currentUser.id
      },
      {
        withCredentials: true,
      }
    );
    fetchFeeds(user.uid);
  }

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
      window.location.href = `/search?query=${searchTerm}`;
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Poppins"
        rel="stylesheet"
      ></link>
      {/* <header className="w-full"> */}
      <nav
        className="navbar h-[54px] z-10 top-0 sticky flex justify-between lg:px-[120px] py-3 border-b items-center bg-white font-poppins tracking-[0.5px]"
        style={{ boxShadow: "1px 0px 5px #7b8f981f" }}
      >
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
          <ul className="flex ml-[30px] items-center space-x-4">
            <Link
              to="/"
              className={
                p_name == ""
                  ? "lg:inline-block px-2 py-1 bg-[#f1f0f3] rounded-lg"
                  : "lg:inline-block px-2 py-1"
              }
            >
              Home
            </Link>
            <Link
              to="/books"
              className={
                p_name == "books" || p_name == "book"
                  ? "lg:inline-block px-2 py-1 bg-[#f1f0f3] rounded-lg"
                  : "lg:inline-block px-2 py-1"
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
                  ? "lg:inline-block px-2 py-1 bg-[#f1f0f3] rounded-lg"
                  : "lg:inline-block px-2 py-1"
              }
            >
              Topics
            </Link>
          </ul>
        </div>
        <div className="ml-[10px] flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
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
              className="w-[450px] h-[35px] bg-gray-50 text-gray-900 text-sm rounded-xl block pl-10 p-2.5 focus:outline-none"
              placeholder="Search for books and topics"
              required
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="" ref={refOne}></div>
          <div className="" ref={refTwo}></div>
          {currentUser ? (
            <>
              <div
                onClick={() => {
                  notifications == 1
                    ? showNotifications(0)
                    : showNotifications(1);
                }}
                className="mr-3 text-sm rounded-full cursor-pointer mr-[20px]"
              >
                <div className="notif">
                  <svg
                    fill="#000"
                    height="20px"
                    width="20px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 611.999 611.999"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203 C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578 c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626 h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856 c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626 C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32 c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082 c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826 c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485 c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"></path>{" "}
                            <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258 c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258 C323.259,126.96,315.532,119.235,306.001,119.235z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                  {(hasUnread == 1) &&
                  <span className="z-10 notif-unread absolute bg-red-500 w-[10px] h-[10px] rounded-[50%] bottom-[25px] ml-[12px]"></span>
                  }
                  </div>
              </div>
              <div ref={refTwo}>
                {notifications == 1 && (
                  <div
                    className="overflow-scroll max-h-[293px] z-50 border fixed top-[37px] right-[120px] my-4 pb-[10px] text-base list-none bg-white divide-y divide-gray-100 rounded-lg  shadow fos-animate-me fadeIn delay-0_1"
                    id="user-dropdown"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-lg font-semibold text-gray-900 w-[155px] whitespace-nowrap overflow-hidden text-ellipsis">
                        Latest Feeds
                      </span>
                      <div className="span-below">
                        <span className="text-sm  text-gray-500 truncate w-[155px] whitespace-nowrap overflow-hidden text-ellipsis">
                          Includes activity
                        </span>
                        {(hasUnread == 1) ? (
                          <span onClick={()=>{
                            updateReadFeed("readAll");
                            setHasUnread(0);
                            }} className="ml-[5px] text-black p-[4px] bg-yellow-300 rounded-lg cursor-pointer text-[10px] leading-[1.25rem] transform transition duration-500 hover:scale-[1.01]">
                            Mark all as read
                          </span>
                        ) : (
                          <span onClick={()=>{
                            updateReadFeed("unreadAll");
                            setHasUnread(1);
                            }} className="ml-[5px] text-black p-[4px] bg-yellow-300 rounded-lg cursor-pointer text-[10px] leading-[1.25rem] transform transition duration-500 hover:scale-[1.01]">
                            Unread All
                          </span>
                        )}
                      </div>
                    </div>
                    {feeds.map((feed) => (
                      <Link to={feed.link} className="block px-4 py-[9px] border-b w-[300px] flex transform transition duration-500 hover:scale-[1.01]">
                        <span className={(feed.read == "1") ? "text-gray-500 mr-[4px] text-[20px] -ml-[8px]" : "text-blue-500 mr-[4px] text-[20px] -ml-[8px]"}>
                          #
                        </span>
                        <span className="text-sm text-gray-900 overflow-hidden text-ellipsis line-clamp-1">
                          {feed.content}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div
                onClick={() => (profileDp == 1 ? showPrflDp(0) : showPrflDp(1))}
                className="flex mr-3 text-sm rounded-full md:mr-0 cursor-pointer"
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
              <div ref={refOne}>
                {profileDp == 1 && (
                  <div
                    className="z-50 border fixed top-[37px] right-[120px] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow fos-animate-me fadeIn delay-0_1"
                    id="user-dropdown"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 w-[155px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {user.uname
                          ? user.uname
                          : currentUser.name
                          ? currentUser.name
                          : "KonnectEd User"}
                      </span>
                      <span className="block text-sm  text-gray-500 truncate w-[155px] whitespace-nowrap overflow-hidden text-ellipsis">
                        @
                        {user.username
                          ? user.username
                          : currentUser.username
                          ? currentUser.username
                          : "KonnectEd User"}
                      </span>
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <Link
                          to={
                            user.username
                              ? `/user/${user?.username}`
                              : `/user/${currentUser?.username}`
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <div
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Sign out
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {/* <Link
              className="lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 font-semibold"
              to=""
              onClick={handleLogout}
            >
              Sign Out
            </Link> */}
            </>
          ) : (
            <div className="flex items-center">
              <Link
                className="lg:inline-block lg:ml-auto py-2 px-6"
                to="/login"
                state={{path: location.pathname}}
              >
                Sign In
              </Link>
              <Link
                className="lg:inline-block py-2 px-6 bg-[#4353FF] hover:bg-[#2a3cff] text-sm text-white rounded-xl transition duration-200"
                to="/signup"
                state={{path: location.pathname}}
              >
                Get Started {"  "}
                <svg
                  className="ml-[3px] inline"
                  width="17"
                  height="18"
                  viewBox="0 0 17 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_204_5)">
                    <path
                      d="M13.0772 8.12201L8.22134 3.26611L9.35233 2.13512L16.1391 8.92186L15.5736 9.48736L9.35233 15.7086L8.22134 14.5776L13.0772 9.72172H0.142029V8.12201H13.0772Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_204_5">
                      <rect
                        width="16"
                        height="16.7969"
                        fill="white"
                        transform="translate(0.140564 0.92334)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default DesignNavbar;
