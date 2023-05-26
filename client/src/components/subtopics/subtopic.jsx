import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import parse from "html-react-parser";
import KhaltiCheckout from "khalti-checkout-web";
// import config from "../khalti/khaltiConfig";
import Breadcrum from "../utils/breadcrum";
import editIcon from "../../static/editIcon1.png";
import deleteIcon from "../../static/delete.png";
import add from "../../static/add.png";
import "./subtopic.css";
import { Pagination } from "@mui/material";
import AddQuestion from "../addPops/addQuestion";

// Video Player
import { useDispatch } from "react-redux";
import { startVideoPlayer } from "../youtubePlayer/layout.js";

// React Notification
import { Store } from "react-notifications-component";
import Loading from "../utils/loading";
import LargeLoading from "../utils/largeLoading";
import ExplainGPT from "../explaingpt/explainGPT";
import YoutubePlayer from "../youtubePlayer/youtubePlayer";
import RecomVideos from "../youtubePlayer/recomVideos";

function getUnique(array, key) {
  if (typeof key !== "function") {
    const property = key;
    key = function (item) {
      return item[property];
    };
  }
  return Array.from(
    array
      .reduce(function (map, item) {
        const k = key(item);
        if (!map.has(k)) map.set(k, item);
        return map;
      }, new Map())
      .values()
  );
}

function Subtopic() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [subtopic, setSubTopic] = useState({});
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [displayNote, setDisplayNote] = useState({});
  const [subTopics, setSubTopics] = useState([]);
  const [openTab, setOpenTab] = useState(1);
  const [showDonation, setShowDonation] = useState(1);
  const [showDelWarning, setShowDelWarning] = useState({ state: 1, qid: 0 });
  const [showNoteDelWarning, setShowNoteDelWarning] = useState({
    state: 1,
    nid: 0,
  });
  const [total, setTotal] = useState([]);
  const [showAdd, setShowAdd] = useState(1);
  const [showUpdateAdd, setShowUpdateAdd] = useState(1);

  // const dispatch = useDispatch();

  // Donation
  const [amount, setAmount] = useState(1000);
  const [donationMessage, setDonationMessage] = useState();
  const [err, setError] = useState(null);

  // Pagination
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();
  const [question_info, setQuestionInfo] = useState({});
  const [ansCount, setAnsCount] = useState([]);

  const handleChange = (e) => {
    if (e.target.value < 10) {
      setError("Amount should be more than Rs. 10.");
      setAmount(1000);
    } else {
      setError();
      setAmount(Number(e.target.value) * 100);
    }
  };

  const handleMessage = (e) => {
    setDonationMessage(e.target.value);
  };

  const updateBalance = async (amount, changereq) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/profile/update-balance?changereq=${changereq}`,
      {
        uid: displayNote["0"].uid,
        amount,
      },
      {
        withCredentials: true,
      }
    );
  };

  const addNotifications = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/profile/notifications/add`,
      {
        uid: displayNote["0"].uid,
        message: `${currentUser.name} has tipped you Rs. ${amount / 100}.`,
        link: `/user/${currentUser.username}`,
        read: "0",
      },
      {
        withCredentials: true,
      }
    );
  };

  // Khalti Donation Gateway
  let config = {
    publicKey: "test_public_key_0d4a87a28c164bc6ad0b5fc16cc29f7c",
    productIdentity: "pID",
    productName: "Donation Tip",
    productUrl: "http://localhost:3000",
    eventHandler: {
      onSuccess(payload) {
        // hit merchant api for initiating verfication
        console.log(payload);
        let data = {
          token: payload.token,
          amount: payload.amount,
        };
        updateBalance(data.amount / 100, "add");
        addNotifications();
        Store.addNotification({
          title: "Success!",
          message: "Payment Successfull.",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: false,
          },
        });
        setShowDonation(1);
      },
      onError(error) {
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
      },
      onClose() {
        console.log("widget is closing");
      },
    },
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
  };
  let checkout = new KhaltiCheckout(config);

  const location = useLocation();
  const navigate = useNavigate();

  const topic_id = location.pathname.split("/")[5];
  const subtopic_id = location.pathname.split("/")[4];
  const sst_name = location.pathname.split("/")[3];
  const st_name = location.pathname.split("/")[2];

  console.log(location);

  const nid = useLocation().search;

  useEffect(() => {
    currentPage.current = 1;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/subtopic/${st_name}/${sst_name}/${subtopic_id}`
        );
        console.log(res.data);
        setSubTopic(res.data[0]);
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
            onScreen: false,
          },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [st_name, sst_name, subtopic_id]);

  useEffect(() => {
    fetchNotes();
  }, [subtopic_id]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/notes/${subtopic_id}`
      );
      setNotes(res.data);
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
          onScreen: false,
        },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/subtopics/${topic_id}`
        );
        console.log(res.data);
        setSubTopics(res.data);
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
            onScreen: false,
          },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [topic_id]);

  useEffect(() => {
    fetchDisplayNotes();
  }, [subtopic_id]);

  const fetchDisplayNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/notes/display/${subtopic_id}${nid}`
      );
      console.log(res.data);
      setDisplayNote(res.data);
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
          onScreen: false,
        },
      });
      setLoading(false);
    }
  };

  const fetchQuestions = async (tid) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/dbquestion/${tid}?page=${currentPage.current}&limit=${limit}`
      );
      console.log(res.data);
      setPageCount(res.data.pageCount);
      setQuestions(res.data.result);
      countAnswers(res.data.result);
      setTotal(res.data.total);
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
          onScreen: false,
        },
      });
      setLoading(false);
    }
  };

  function handlePageClick(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    fetchQuestions(topic_id);
  }

  const countAnswers = async (quesArray) => {
    try {
      quesArray.map(async (question) => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/count/answers/${question.qid}`
        );
        setAnsCount((prev) => [...prev, res.data]);
      });
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
      setLoading(false);
    }
  };

  const showState = (value, state) => {
    setShowAdd(value);
    if (state) {
      fetchQuestions(topic_id);
    }
  };

  const showUpdateState = (value, state) => {
    setShowUpdateAdd(value);
    if (state) {
      fetchQuestions(topic_id);
    }
  };

  const upState = (qid, title, body) => {
    setQuestionInfo({
      qid,
      title,
      body,
    });
  };

  const handleDelete = async (qid) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/dbquestion/post/${qid}`
      );
      setShowDelWarning({ state: 1, qid: 0 });
      fetchQuestions(topic_id);
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
      setLoading(false);
    }
  };

  const handleNoteDelete = async (nid) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/cnote/${nid}`
      );
      setShowNoteDelWarning({ state: 1, nid: 0 });
      fetchDisplayNotes();
      fetchNotes();
    } catch (error) {
      console.log(error);
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
      setLoading(false);
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

  console.log(subtopic.stname + " - " + subtopic.tname);

  return (
    <>
      <Breadcrum
        pred_path_link={`/topic/${subtopic.st_name}/${subtopic.tid}`}
        pred_path={subtopic.tname}
        path={subtopic.stname}
      />
      <section className="subtopicInf ">
        {/* <YoutubePlayer /> */}
        <div className="max-w-[986px] w-full mx-auto px-[4rem] textsubtopics_title__vCKfs">
          <div className="title-heading fos-animate-me fadeIn delay-0_1">
            <div className="title-heading-name">
              {subtopic.stname ? subtopic.stname : "Title"}{" "}
            </div>
          </div>
          <div className="horizontal-info">
            {openTab == 1 && (
              <div className="flex items-center justify-start flex-wrap fos-animate-me fadeIn delay-0_1">
                {displayNote["0"] ? (
                  <>
                    <span>{displayNote["0"]?.nname}</span>
                    {currentUser?.id === displayNote["0"]?.uid && (
                      <>
                        <Link
                          to={`/addnote/${subtopic.st_name}/${subtopic.stid}/54/64?edit=2`}
                          state={displayNote["0"]}
                          className="img-icon"
                        >
                          <img src={editIcon} />
                        </Link>{" "}
                        <img
                          src={deleteIcon}
                          className="img-icon"
                          onClick={() =>
                            setShowNoteDelWarning({
                              state: 0,
                              nid: displayNote["0"].nid,
                            })
                          }
                        />
                      </>
                    )}
                  </>
                ) : (
                  <span>Note is not available!</span>
                )}
              </div>
            )}
            {openTab == 2 && (
              <div className="flex items-center justify-start flex-wrap fos-animate-me fadeIn delay-0_1">
                {total == 1 ? "1 Question" : total + " Questions"}
              </div>
            )}
          </div>
        </div>
        <div className="w-full mx-auto">
          <div className="tabs-container px-[300px] fos-animate-me fadeIn delay-0_1">
            <div className="tabs-item">
              <div
                className={"tabs-tab " + (openTab === 1 ? "tabs-active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
              >
                Learn
              </div>
            </div>
            <div className="tabs-item">
              <div
                className={"tabs-tab " + (openTab === 2 ? "tabs-active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                  setLoading(true);
                  fetchQuestions(topic_id);
                }}
              >
                Questions
              </div>
            </div>
          </div>
          <div className="note-content">
            <div
              className={
                (openTab === 1 ? "block " : "hidden ") +
                "tp-container tp-container-active subtopic-subtopics-info-container card content-sec"
              }
            >
              <div className="content-wrapper flex">
                <div className="note-content-main max-w-[100%] w-full">
                  {loading ? (
                    <div className="mb-[150px] pt-[100px]">
                      <LargeLoading />
                    </div>
                  ) : (
                    <>
                      {displayNote["0"] ? (
                        <>
                          <div className="note-display-main">
                            <h1 id="nname-introduction123">
                              {displayNote["0"]?.nname}
                            </h1>
                            {displayNote["0"]?.body != ""
                              ? parse("" + displayNote["0"]?.body)
                              : "Loading content..."}
                          </div>
                          <div className="author mt-3 mb-5 shadow p-5 rounded-md">
                            <div
                              className={
                                showDonation === 1
                                  ? "popup-outer z-10"
                                  : "active popup-outer z-10"
                              }
                            >
                              <div className="popup-box">
                                <i
                                  id="close"
                                  className="fa fa-close close"
                                  onClick={() => setShowDonation(1)}
                                ></i>
                                <div className="profile-text">
                                  <img
                                    src={
                                      displayNote["0"].avatar
                                        ? displayNote["0"].avatar
                                        : "/upload/avatar/no-cover-avatar.png"
                                    }
                                    alt={displayNote["0"].byname}
                                  />
                                  <div className="text">
                                    <span className="name">
                                      {displayNote["0"]?.byname}
                                    </span>
                                    <span className="profession">
                                      Top Contributor
                                    </span>
                                  </div>
                                </div>
                                <textarea
                                  placeholder="Enter your message"
                                  onChange={handleMessage}
                                ></textarea>
                                <span className="text-red-600">{err}</span>
                                <input
                                  type="text"
                                  name="amount"
                                  onChange={handleChange}
                                  placeholder="Enter the amount"
                                  className="block px-4 py-2 w-full mt-2 text-purple-700 bg-[#f3f3f3] border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                                <div className="button">
                                  <button
                                    id="close"
                                    className="cancel bg-[#f082ac] hover:bg-[#ec5f95]"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowDonation(1);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      checkout.show({ amount: amount });
                                    }}
                                    className="send bg-[#6f93f6] hover:bg-[#275df1]"
                                  >
                                    Send
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                showNoteDelWarning.state === 1
                                  ? "popup-outer z-10"
                                  : "active popup-outer z-10"
                              }
                            >
                              <div className="popup-box">
                                <i
                                  id="close"
                                  className="fa fa-close close"
                                  onClick={() =>
                                    setShowNoteDelWarning({ state: 1, nid: 0 })
                                  }
                                ></i>
                                <div className="warning-heading-text border-b">
                                  Are you sure?
                                </div>
                                <div className="warning-body-text text-sm">
                                  Do you really want to delete these records?
                                  This process cannot be undone.
                                </div>
                                <div className="button">
                                  <button
                                    id="close"
                                    className="cancel bg-[#6f93f6] hover:bg-[#275df1]"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowNoteDelWarning({
                                        state: 1,
                                        nid: 0,
                                      });
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNoteDelete(showNoteDelWarning.nid);
                                    }}
                                    className="send bg-[#f082ac] hover:bg-[#ec5f95]"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* {displayNote["0"]?.phone && <button>Donate</button>} */}
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <div className="text-gray-500">
                                  <div className="text-sm">
                                    <Link
                                      to={`/user/${displayNote["0"]?.username}`}
                                      title={displayNote["0"].byname}
                                      className="font-semibold text-[16px] leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
                                    >
                                      {displayNote["0"]?.byname}{" "}
                                    </Link>
                                    {displayNote["0"]?.phone && (
                                      <span
                                      title={`Tip for ${displayNote["0"].byname}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setShowDonation(0);
                                          setDonationMessage("");
                                        }}
                                        className="p-[4px] text-black text-sm bg-yellow-300 rounded-lg font-semibold cursor-pointer"
                                      >
                                        Tip me...!
                                      </span>
                                    )}
                                    <p>Top Contributor</p>
                                  </div>
                                </div>
                              </div>
                              <Link
                                      to={`/user/${displayNote["0"]?.username}`}
                                      title={displayNote["0"].byname}><img
                                className="w-12 h-12 rounded-full"
                                src={
                                  displayNote["0"].avatar
                                    ? displayNote["0"].avatar
                                    : "/upload/avatar/no-cover-avatar.png"
                                }
                                alt={displayNote["0"]?.byname}
                              /></Link>
                            </div>
                          </div>
                          {subtopic && (
                            <div className="recom-component fos-animate-me fadeIn delay-0_2 ml-[15px]">
                              <RecomVideos
                                term={subtopic.stname + " - " + subtopic.tname}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="add-banner bg-[#edf7ff] flex h-[80px] mb-[15px] px-[15px] py-[12px] w-[95%] mx-auto fos-animate-me fadeIn delay-0_1">
                            <img src={add} alt="" className="mr-[25px]" />
                            <div className="add-meta">
                              <div className="">Note is not available!</div>
                              <div
                                className="text-[#249efb] cursor-pointer p-[12px]"
                                onClick={() => {
                                  currentUser
                                    ? navigate(
                                        `/addnote/${subtopic.sst_name}/${subtopic.stid}/54/64`
                                      )
                                    : loginWarning();
                                }}
                              >
                                Add new note
                              </div>
                            </div>
                          </div>
                          {subtopic && (
                            <div className="recom-component fos-animate-me fadeIn delay-0_2 ml-[15px]">
                              <RecomVideos
                                term={subtopic.stname + " - " + subtopic.tname}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="note-content-side">
                  <section className="side-section">
                    <div className="side-section-body">
                      <div className="section-heading">
                        <h4>Related Lessons</h4>
                      </div>
                      <ul>
                        {loading ? (
                          <div className="mb-[150px] pt-[100px]">
                            <LargeLoading />
                          </div>
                        ) : (
                          <>
                            {subTopics.map((subTopic, index) => (
                              <li key={index+1}>
                                <span className="index text-[#ef6862]">
                                  {index < 9 ? "0" + (index + 1) : index + 1}
                                </span>
                                <Link
                                  to={`/subtopic/${subTopic.st_name}/${subTopic.sst_name}/${subTopic.stid}/${subtopic.tid}`}
                                >
                                  {subTopic.stname}
                                </Link>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>
                  </section>
                  {displayNote["0"] && (
                    <section className="side-section">
                      <div className="side-section-body">
                        <div className="section-heading">
                          <h4>Related Notes</h4>
                        </div>
                        <ul>
                          {loading ? (
                            <div className="mb-[150px] pt-[100px]">
                              <LargeLoading />
                            </div>
                          ) : (
                            <>
                              {notes.map((note, index) => (
                                <li className="max-w-[285px]">
                                  <span className="index text-[#249efb]">
                                    {index < 10 ? "0" + (index + 1) : index + 1}
                                  </span>
                                  <a
                                    href={`/subtopic/${subtopic.st_name}/${note.sst_name}/${note.stid}/${subtopic.tid}?nid=${note.nid}`}
                                  >
                                    {note.nname}
                                    <span className="text-gray-600 text-sm">
                                      {note?.byname != "Suraj Pulami"
                                        ? " - " + note?.byname
                                        : ""}
                                    </span>
                                  </a>
                                  {currentUser?.id === note.uid && (
                                    <>
                                      <Link
                                        to={`/addnote/${subtopic.st_name}/${note.stid}/54/64?edit=2`}
                                        state={note}
                                        className="img-icon"
                                      >
                                        <img src={editIcon} />
                                      </Link>{" "}
                                      <img
                                        src={deleteIcon}
                                        className="img-icon"
                                        onClick={() =>
                                          setShowNoteDelWarning({
                                            state: 0,
                                            nid: note.nid,
                                          })
                                        }
                                      />
                                      {/* Are you sure khale warning */}
                                    </>
                                  )}
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                        <div className="add-note-button">
                          <button
                            type="button"
                            className="border hover:text-blue-600 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mt-2"
                            onClick={() => {
                              currentUser
                                ? navigate(
                                    `/addnote/${subtopic.sst_name}/${subtopic.stid}/54/64`
                                  )
                                : loginWarning();
                            }}
                          >
                            Add new note
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
            <div
              className={
                (openTab === 2 ? "block " : "hidden ") +
                "tp-container min-h-[450px]"
              }
            >
              {loading ? (
                <div className="mb-[150px] pt-[100px]">
                  <LargeLoading />
                </div>
              ) : (
                <>
                  {questions.length > 0 ? (
                    <>
                      <div className="card-body">
                        <div className="tp-title fos-animate-me fadeIn delay-0_1">
                          List of Questions
                        </div>
                        <ul className="flex flex-wrap">
                          {getUnique(questions, "qid").map(
                            (question, index) => (
                              <div
                                className={
                                  "w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                                  (index + 1)
                                }
                              >
                                <div
                                  className={"ch-index " + "!text-[#76e199]"}
                                >
                                  {index == 9
                                    ? `${currentPage.current + "0"}`
                                    : `${parseInt(currentPage.current) - 1}` +
                                      `${index + 1}`}
                                </div>
                                <div className="ch-details">
                                  <Link
                                    to={`/question/${question.sq_name}/${question.qid}`}
                                  >
                                    <h2 className="ch-name">
                                      {question.qtitle}
                                    </h2>
                                  </Link>
                                  <div className="ch-meta justify-between">
                                    <div className="ch-meta-item flex">
                                      <span>
                                        {ansCount?.length > 0
                                          ? getUnique(ansCount, "qid").map(
                                              (ans) =>
                                                ans.qid == question.qid &&
                                                (ans?.count == 1
                                                  ? "1 Answer"
                                                  : ans?.count + " Answers")
                                            )
                                          : "__Answers"}
                                      </span>
                                      {currentUser?.id === question.quid && (
                                        <>
                                          <img
                                            src={editIcon}
                                            className="h-[16px] ml-[5px] mt-[2px] cursor-pointer"
                                            onClick={() => {
                                              upState(
                                                question.qid,
                                                question.qtitle,
                                                question.qbody
                                              );
                                              setShowUpdateAdd(0);
                                            }}
                                          />{" "}
                                          <img
                                            src={deleteIcon}
                                            className="h-[16px] ml-[5px] mt-[2px] cursor-pointer"
                                            onClick={() =>
                                              setShowDelWarning({
                                                state: 0,
                                                qid: question.qid,
                                              })
                                            }
                                          />
                                        </>
                                      )}
                                    </div>
                                    <div
                                      className={
                                        "ch-meta-item flex view-info items-center flex text-[14px] leading-[19px] " +
                                        "!text-[#76e199]"
                                      }
                                    >
                                      <Link
                                        to={`/question/${question.sq_name}/${question.qid}`}
                                      >
                                        <span>View Solution</span>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                      <div className="mt-[200px] mb-[300px] pb-[20px] flex justify-around">
                        <div className="flex items-center justify-start">
                          <div className="text-left ml-[10px]">
                            <div className="text-gray-500">
                              <div className="text-sm">
                                No questions are here...!
                              </div>
                              <div
                                onClick={() => {
                                  if (currentUser) {
                                    showState(0);
                                  } else {
                                    loginWarning();
                                  }
                                }}
                                className="text-sm add-book-no-res cursor-pointer text-blue-500 flex justify-around"
                              >
                                Add a new question
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {pageCount > 1 && (
                <Pagination
                  count={pageCount}
                  onChange={handlePageClick}
                  color="primary"
                  className="justify-center flex mb-5"
                />
              )}
              {questions.length != 0 && (
                <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                  <div className="mt-[10px] mb-[10px] pb-[20px] flex justify-around">
                    <div className="flex items-center justify-start">
                      <div className="text-left ml-[10px]">
                        <div className="text-gray-500">
                          <div className="text-sm">
                            Cant find the question...?
                          </div>
                          <div
                            onClick={() => {
                              if (currentUser) {
                                showState(0);
                              } else {
                                loginWarning();
                              }
                            }}
                            className="text-sm add-book-no-res cursor-pointer text-blue-500 flex justify-around"
                          >
                            Add a new question
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showAdd == 0 && <AddQuestion showState={showState} />}
              {showUpdateAdd == 0 && (
                <AddQuestion
                  showState={showUpdateState}
                  question_info={question_info}
                />
              )}
              <div
                className={
                  showDelWarning.state === 1
                    ? "popup-outer z-10"
                    : "active popup-outer z-10"
                }
              >
                <div className="popup-box">
                  <i
                    id="close"
                    className="fa fa-close close"
                    onClick={() => setShowDelWarning({ state: 1, qid: 0 })}
                  ></i>
                  <div className="warning-heading-text border-b">
                    Are you sure?
                  </div>
                  <div className="warning-body-text text-sm">
                    Do you really want to delete these records? This process
                    cannot be undone.
                  </div>
                  <div className="button">
                    <button
                      id="close"
                      className="cancel bg-[#6f93f6] hover:bg-[#275df1]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDelWarning({ state: 1, qid: 0 });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(showDelWarning.qid);
                      }}
                      className="send bg-[#f082ac] hover:bg-[#ec5f95]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ExplainGPT
          topicinfo={{ topic: subtopic.tname, subtopic: subtopic.stname }}
        />
      </section>
    </>
  );
}

export default Subtopic;
