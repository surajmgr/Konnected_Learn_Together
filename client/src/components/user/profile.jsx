import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import "./profile.css";
import "../addPops/popup.css";
import edit_profile from "../../static/edit-info.png";

// React Notification
import { Store } from "react-notifications-component";
import Loading from "../utils/loading";
import LargeLoading from "../utils/largeLoading";
import { Pagination, TablePagination } from "@mui/material";

function Profile() {
  const [openTab, setOpenTab] = useState(1);
  const [editProfile, showEditProfile] = useState(1);
  const [user, setUser] = useState({});
  const [feeds, setFeeds] = useState([]);
  const [hasUnread, setHasUnread] = useState(0);
  const [follow, setFollow] = useState({});
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [noteContributions, setNoteContributions] = useState({});
  const [file, setCover] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const hiddenFileInput = useRef(null);
  const { currentUser, updateExistingUser } = useContext(AuthContext);

  // Pagination
  const [limit, setLimit] = useState(15);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const [userInputs, setUserInputs] = useState({
    uname: "",
    bio: "",
    phone: "",
    tinymce: "",
    gpt: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const username = location.pathname.split("/")[2];

  useEffect(() => {
    currentPage.current = 1;
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/profile/${username}`);
      setUser(res.data);
      fetchFeeds(res.data.uid);
      getFollowing(res.data.uid);
      getFollower(res.data.uid);
      getNoteContributions(res.data.uid);
      // Updating Existing User Data
      if (currentUser.id == res.data.uid) {
        updateExistingUser({
          id: res.data.uid,
          name: res.data.uname,
          username: res.data.username,
          email: res.data.email,
          avatar: res.data.avatar,
          bio: res.data.bio,
          phone: res.data.phone,
          tinymce: res.data.tinymce,
          gpt: res.data.gpt,
          level: res.data.level,
          rank: res.data.rank,
          points: res.data.upoints,
        });
      }
      userInputs.uname = res.data.uname;
      userInputs.bio = res.data.bio ? res.data.bio : "";
      userInputs.phone = res.data.phone ? res.data.phone : "";
      userInputs.tinymce = res.data.tinymce ? res.data.tinymce : "";
      userInputs.gpt = res.data.gpt ? res.data.gpt : "";
      const resFollow = await axios.get(
        `/profile/settings/follow/?following=${res.data.uid}&follower=${currentUser.id}`
      );
      setFollow(resFollow.data);
      setLoading(false);
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
      setLoading(false);
    }
  };

  const fetchFeeds = async (uid) => {
    const resFeed = await axios.get(
      `/profile/notifications/${uid}?page=${currentPage.current}&limit=${limit}`
    );
    setFeeds(resFeed.data.result);
    setPageCount(resFeed.data.pageCount);
    resFeed.data.result.map((feed) => {
      if (feed.read == "0") {
        setHasUnread(1);
      }
    });
  };

  function handlePageClick(e, page) {
    currentPage.current = page;
    fetchFeeds(user.uid);
  }

  const updateReadFeed = async (changereq) => {
    const res = await axios.post(
      `/profile/notifications?changereq=${changereq}`,
      {
        uid: currentUser.id,
      },
      {
        withCredentials: true,
      }
    );
    fetchFeeds(user.uid);
  };

  const removeFollow = async () => {
    try {
      const res = await axios.delete(
        `/profile/settings/follow/?following=${user.uid}&follower=${currentUser.id}`
      );
      Store.addNotification({
        title: "Successfull!",
        message: `You have unfollowed ${user.uname}.`,
        type: "success",
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
      setFollow(0);
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
      setLoading(false);
    }
  };

  const doFollow = async () => {
    try {
      const res = await axios.post(
        "/profile/settings/follow",
        { follower: currentUser.id, following: user.uid },
        {
          withCredentials: true,
        }
      );
      Store.addNotification({
        title: "Successfull!",
        message: `You are now following ${user.uname}.`,
        type: "success",
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
      setFollow(1);
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
      setLoading(false);
    }
  };

  const getFollowing = async (uid) => {
    try {
      setLoading(true);
      const res = await axios.get(`/profile/followings/${uid}`);
      setFollowings(res.data);
      setLoading(false);
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
      setLoading(false);
    }
  };

  const getFollower = async (uid) => {
    try {
      setLoading(true);
      const res = await axios.get(`/profile/followers/${uid}`);
      setFollowers(res.data);
      setLoading(false);
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
      setLoading(false);
    }
  };

  const getNoteContributions = async (uid) => {
    try {
      const res = await axios.get(`/count/contributions/${uid}`);
      setNoteContributions(res.data);
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
          onScreen: false,
        },
      });
    }
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    setUserInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file); // Change to file for server upload
      // ImgBB
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=813193a847a3b03c944209bdbe5daaa3",
        formData
      );
      return res.data.data;

      // For Multer Upload from server
      // const res = await axios.post("/profile/upload-avatar/1", formData);
      // const path = res.data;
      // return path;
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
          onScreen: false,
        },
      });
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      console.log(userInputs);
      if (userInputs.uname.length < 3 || userInputs.uname.length > 40) {
        Store.addNotification({
          title: "Length Error!",
          message: "Name must be between 3 and 40 characters.",
          type: "warning",
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
      } else if (userInputs.bio.length > 255) {
        Store.addNotification({
          title: "Length Error!",
          message: "Bio must be less than 255 characters.",
          type: "warning",
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
      } else if (
        userInputs.phone.length !== 0 &&
        userInputs.phone.length !== 10
      ) {
        Store.addNotification({
          title: "Length Error!",
          message: "Contact number must be of 10 characters",
          type: "warning",
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
      } else {
        const fileUrl = async (imgUrl) => {
          const res = await axios.post(
            `/profile/update/${username}/${currentUser.id}`,
            {
              uname: userInputs.uname,
              bio: userInputs.bio ? userInputs.bio : "",
              avatar: imgUrl,
              phone: userInputs.phone ? userInputs.phone : "",
              tinymce: userInputs.tinymce ? userInputs.tinymce : "",
              gpt: userInputs.gpt ? userInputs.gpt : "",
            },
            {
              withCredentials: true,
            }
          );
          Store.addNotification({
            title: "Successfull!",
            message: "Profile has been updated.",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
              showIcon: true,
            },
          });
          showEditProfile(1);
          fetchProfile();
        };

        if (file) {
          if (parseInt(file.size) / 1024 ** 2 > 5) {
            Store.addNotification({
              title: "Size Error!",
              message: "Profile picture must not exceed 5 MB.",
              type: "warning",
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
          } else {
            upload()
              .then((data) => {
                fileUrl(data.url); // for ImgBB
                // fileUrl(data); // for Server
              })
              .catch((err) => {
                Store.addNotification({
                  title: "Error!",
                  message: err.message,
                  type: "warning",
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
              });
          }
        } else {
          fileUrl(avatarUrl);
        }
      }
    } catch (error) {
      Store.addNotification({
        title: "Error!",
        message: error.message,
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

  const loginWarning = () => {
    Store.addNotification({
      title: "Login Please!",
      message: null,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: false,
      },
    });
  };

  const apiWarning = () => {
    Store.addNotification({
      title: "API keys must be authorized",
      message:
        "For Tiny MCE, please authorize domain too. More details on footnotes config.",
      type: "info",
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
  };

  const openEditUser = (e) => {
    e.preventDefault();
    showEditProfile(0);
    setAvatarUrl(user.avatar);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const removeFile = () => {
    setAvatarUrl("");
    setCover(null);
  };

  return (
    <div className="profile-box">
      <div className="header__wrapper">
        <div className="header-img"></div>
        <div className="cols__container">
          <div className="left__col">
            <div className="img__container">
              <img
                src={
                  user.avatar
                    ? user.avatar
                    : "/upload/avatar/no-cover-avatar.png"
                }
                alt={user.uname}
              />
              <span></span>
            </div>
            <h2>{user.uname}</h2>
            <p>{"@" + user.username + " - " + user.rank}</p>
            <p>{user.email}</p>

            <ul className="about w-[350px] fos-animate-me fadeIn delay-0_1">
              <li>
                <span>
                  {followers.length.toLocaleString() +
                    `${Math.floor(Math.random() * 90 + 10)}`}
                </span>
                Followers
              </li>
              <li>
                {currentUser ? (
                  currentUser.username == username ? (
                    <>
                      <span>
                        Rs.{" "}
                        {user.balance ? user.balance.toLocaleString() : "00"}
                      </span>
                      My Balance
                    </>
                  ) : (
                    <>
                      <span>
                        {followings.length.toLocaleString() +
                          `${Math.floor(Math.random() * 90 + 10)}`}
                      </span>
                      Following
                    </>
                  )
                ) : (
                  <>
                    <span>
                      {followings.length.toLocaleString() +
                        `${Math.floor(Math.random() * 90 + 10)}`}
                    </span>
                    Following
                  </>
                )}
              </li>
              <li>
                <span>
                  {parseInt(
                    noteContributions.count +
                      `${Math.floor(Math.random() * 90 + 10)}`
                  ).toLocaleString()}
                </span>
                Contributions
              </li>
            </ul>

            <div className="content fos-animate-me fadeIn delay-0_1">
              {user.bio ? (
                <p>{user.bio}</p>
              ) : (
                <p>
                  Hello, everyone! I'm {user.uname}. I would be delighted to
                  introduce myself, but currently I would like to keep my bio
                  deserted and will update at a later date.
                </p>
              )}

              <ul>
                <li>
                  <i className="fab fa-twitter"></i>
                </li>
                <i className="fab fa-pinterest"></i>
                <i className="fab fa-facebook"></i>
                <i className="fab fa-dribbble"></i>
              </ul>
            </div>
          </div>
          <div className="right__col fos-animate-me fadeIn delay-0_1">
            <nav>
              <div className="tabs-profile-container">
                <div className="tabs-profile-item">
                  <div
                    className={
                      "tabs-profile-tab " +
                      (openTab === 1 ? "tabs-profile-active" : "")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(1);
                    }}
                  >
                    Recent Feeds
                  </div>
                </div>
                <div className="tabs-profile-item">
                  <div
                    className={
                      "tabs-profile-tab " +
                      (openTab === 2 ? "tabs-profile-active" : "")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                  >
                    Followings
                  </div>
                </div>
                <div className="tabs-profile-item">
                  <div
                    className={
                      "tabs-profile-tab " + (openTab === 3 ? "tabs-active" : "")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(3);
                    }}
                  >
                    Followers
                  </div>
                </div>
              </div>
              {currentUser ? (
                currentUser.username == username ? (
                  <div
                    onClick={openEditUser}
                    className="mt-0 bg-[#2e9efb] text-white px-[25px] py-[10px] rounded-lg cursor-pointer font-poppins"
                  >
                    Edit Profile
                  </div>
                ) : follow != 0 ? (
                  <div
                    onClick={removeFollow}
                    className="mt-0 bg-[#2e9efb] text-white px-[25px] py-[10px] rounded-lg cursor-pointer font-poppins"
                  >
                    Unfollow
                  </div>
                ) : (
                  <div
                    onClick={doFollow}
                    className="mt-0 bg-[#2e9efb] text-white px-[25px] py-[10px] rounded-lg cursor-pointer font-poppins"
                  >
                    Follow
                  </div>
                )
              ) : (
                <div
                  onClick={loginWarning}
                  className="mt-0 bg-[#2e9efb] text-white px-[25px] py-[10px] rounded-lg cursor-pointer font-poppins"
                >
                  Follow
                </div>
              )}
            </nav>

            {openTab == 1 && (
              <div className="side-container">
                <div className="follow-container w-full">
                  <div
                    className="max-h-[293px] z-50 h-full border my-4 pb-[10px] text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow  font-poppins "
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
                        {currentUser &&
                          currentUser.id == user.uid &&
                          (hasUnread == 1 ? (
                            <span
                              onClick={() => {
                                updateReadFeed("readAll");
                                setHasUnread(0);
                              }}
                              className="ml-[5px] text-black p-[4px] bg-yellow-300 rounded-lg cursor-pointer text-[10px] leading-[1.25rem]"
                            >
                              Mark all as read
                            </span>
                          ) : (
                            <span
                              onClick={() => {
                                updateReadFeed("unreadAll");
                                setHasUnread(1);
                              }}
                              className="ml-[5px] text-black p-[4px] bg-yellow-300 rounded-lg cursor-pointer text-[10px] leading-[1.25rem]"
                            >
                              Unread All
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="overflow-y-scroll max-h-[217px]">
                      {feeds.length > 0 ? (
                        feeds.map((feed, index) => (
                          <>
                            <Link
                              to={feed.link}
                              className={
                                "block px-4 py-[9px] border-b w-[99%] flex transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                                (index + 1)
                              }
                            >
                              <div className="content-notif flex items-center">
                                <span
                                  className={
                                    feed.read == "1"
                                      ? "text-gray-500 mr-[15px] text-[30px] -ml-[8px] font-thin"
                                      : "text-blue-500 mr-[15px] text-[30px] -ml-[8px] font-thin"
                                  }
                                >
                                  #
                                </span>
                              </div>
                              <div className="content-notif items-center">
                                <span className="text-gray-900 items-centeroverflow-hidden text-ellipsis line-clamp-2 text-[14px] leading-[1.25rem]">
                                  <span>{feed.content}</span>
                                </span>
                              </div>
                            </Link>
                          </>
                        ))
                      ) : (
                        <div className="follow-item border-b p-[20px]">
                          <div className="flex items-center justify-start">
                            <div className="text-left ml-[10px]">
                              <div className="text-gray-500">
                                <div className="text-sm">
                                  The feed is deserted at the moment...!
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {pageCount > 1 && (
                        <div className="flex justify-around">
                          <Pagination
                            count={pageCount}
                            onChange={handlePageClick}
                            variant="outlined"
                            shape="rounded"
                            color="primary"
                            className="!p-[5px] my-[5px] gap-[10px] fos-animate-me fadeIn delay-0_9"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {openTab == 2 && (
              <div className="side-container">
                <div className="follow-container h-full w-full">
                  {loading ? (
                    <div className="pt-[50px]">
                      <LargeLoading />
                    </div>
                  ) : (
                    <>
                      {followings.length > 0 ? (
                        followings.map((user, index) => (
                          <div
                            className={
                              "follow-item border-b p-[20px] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className="flex items-center justify-start">
                              <img
                                className="w-12 h-12 rounded-full"
                                src={
                                  user.avatar
                                    ? user.avatar
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt={user.uname}
                              />
                              <div className="text-left ml-[10px]">
                                <div className="text-gray-500">
                                  <div className="text-sm">
                                    <Link
                                      to={`/user/${user.username}`}
                                      className="font-semibold text-[16px] leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
                                    >
                                      {user.uname}{" "}
                                    </Link>
                                    <Link
                                      href={`/user/${user.username}`}
                                      className="p-[4px] text-black text-sm bg-yellow-300 rounded-lg font-semibold cursor-pointer"
                                    >
                                      @{user.username}
                                    </Link>
                                    <p>{user.email}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="follow-item border-b p-[20px]">
                          <div className="flex items-center justify-start">
                            <div className="text-left ml-[10px]">
                              <div className="text-gray-500">
                                <div className="text-sm">
                                  Not following anyone at the moment...!
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            {openTab == 3 && (
              <div className="side-container">
                <div className="follow-container h-full w-full">
                  {loading ? (
                    <div className="pt-[50px]">
                      <LargeLoading />
                    </div>
                  ) : (
                    <>
                      {followers.length > 0 ? (
                        followers.map((user, index) => (
                          <div
                            className={
                              "follow-item border-b p-[20px] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className="flex items-center justify-start">
                              <img
                                className="w-12 h-12 rounded-full"
                                src={
                                  user.avatar
                                    ? user.avatar
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt={user.uname}
                              />
                              <div className="text-left ml-[10px]">
                                <div className="text-gray-500">
                                  <div className="text-sm">
                                    <Link
                                      to={`/user/${user.username}`}
                                      className="font-semibold text-[16px] leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
                                    >
                                      {user.uname}{" "}
                                    </Link>
                                    <Link
                                      to={`/user/${user.username}`}
                                      className="p-[4px] text-black text-sm bg-yellow-300 rounded-lg font-semibold cursor-pointer"
                                    >
                                      @{user.username}
                                    </Link>
                                    <p>{user.email}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="follow-item border-b p-[20px]">
                          <div className="flex items-center justify-start">
                            <div className="text-left ml-[10px]">
                              <div className="text-gray-500">
                                <div className="text-sm">
                                  No followers at the moment...!
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {editProfile == 0 && (
        <>
          <div className="active popup-outer z-10 !fixed">
            <div className="popup-box -mt-[200px] min-h-[365px]">
              <i
                id="close"
                className="fa fa-close close"
                onClick={() => {
                  showEditProfile(1);
                }}
              ></i>
              <div className="flex mb-[20px] items-center">
                <img
                  className="mt-[2px] !h-[50px] !w-[50px] object-cover !rounded-[0]"
                  src={edit_profile}
                  alt=""
                />
                <div className="ml-2 -mt-[4px] text-adds">
                  <span className="text-[20px] name font-[700]">
                    Edit Profile Details
                  </span>
                  <div className="text-[12px] font-[500] -mt-[4px] profession leading-[1]">
                    Don't close without saving.
                  </div>
                </div>
              </div>
              {loading ? (
                <>
                  <div className="loadingIcon flex justify-center pt-[85px]">
                    <LargeLoading />
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="uname"
                    onChange={handleChange}
                    value={userInputs.uname}
                    placeholder="Enter your name"
                    className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
                  />
                  <div
                    className="fileUpload cursor-pointer"
                    onClick={handleClick}
                  >
                    <div className="uploadRef text-sm block mt-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500">
                      <div className="flex justify-between">
                        <div className="up-left px-4 py-2 text-[#9ea4b0] max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                          {file
                            ? file.name
                            : avatarUrl == "" || !avatarUrl
                            ? "Choose a profile pic..."
                            : avatarUrl.slice(25, 300)}
                        </div>
                        <div className="up-right px-4 py-2 bg-[#6f94f6] text-white rounded-md">
                          Browse
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={(e) => setCover(e.target.files[0])}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                  {avatarUrl && (avatarUrl !== "" || file) && (
                    <span
                      onClick={removeFile}
                      className="remove-span leading-[1] p-1 cursor-pointer"
                    >
                      Remove
                    </span>
                  )}
                  <div className="textarea-w-count relative">
                    <textarea
                      name="bio"
                      onChange={handleChange}
                      value={userInputs.bio}
                      placeholder="Enter your bio here..."
                      className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
                    />
                    <span className="char-count leading-[1] p-1 bg-[#f3f3f3] border-t border-l rounded">
                      {userInputs.bio.length} / 255 Characters
                    </span>
                  </div>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    value={userInputs.phone}
                    placeholder="Enter your contact number"
                    className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
                  />
                  <div className="flex justify-between">
                    <input
                      type="text"
                      name="tinymce"
                      onChange={handleChange}
                      onFocus={apiWarning}
                      value={userInputs.tinymce}
                      placeholder="Tiny MCE API"
                      className="text-sm block px-4 py-2 mb-3 w-full mr-[1px] bg-[#f3f3f3] border rounded-md focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="gpt"
                      onChange={handleChange}
                      onFocus={apiWarning}
                      value={userInputs.gpt}
                      placeholder="Open AI API"
                      className="text-sm block px-4 py-2 mb-3 w-full ml-[1px] bg-[#f3f3f3] border rounded-md focus:border-blue-500"
                    />
                  </div>

                  <div className="button">
                    <button
                      id="close"
                      className="cancel bg-[#f082ac] hover:bg-[#ec5f95] h-fit leading-[1] !py-[9px] !px-[15px]"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditProfile(1);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateUser}
                      className="send bg-[#6f93f6] hover:bg-[#275df1] h-fit leading-[1] !py-[9px] !px-[15px]"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
