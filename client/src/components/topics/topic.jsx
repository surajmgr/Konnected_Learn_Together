import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrum from "../utils/breadcrum";
import "./topic.css";
import { AuthContext } from "../utils/authContext";
import add from "../../static/add.png";
import { Pagination } from "@mui/material";
import AddQuestion from "../addPops/addQuestion";
import editIcon from "../../static/editIcon1.png";
import deleteIcon from "../../static/delete.png";

// React Notification
import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";

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

function Topic() {
  const [topic, setTopic] = useState({});
  const [books, setBooks] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [notesCount, setNotesCount] = useState([]);
  const [contributorsCount, setContibutorsCount] = useState([]);
  const [openTab, setOpenTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState([]);
  const [showAdd, setShowAdd] = useState(1);
  const [showUpdateAdd, setShowUpdateAdd] = useState(1);
  const [showDelWarning, setShowDelWarning] = useState({ state: 1, qid: 0 });
  const { currentUser } = useContext(AuthContext);

  const colors = [
    "#2e9efb",
    "#c47ae0",
    "#fac865",
    "#76e199",
    "#ff627b",
    "#4edfe2",
    "#fd6f6f",
  ];
  const randomColor =
    "!text-[" + colors[Math.floor(Math.random() * colors.length)] + "]";

  // Pagination
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();
  const [question_info, setQuestionInfo] = useState({});
  const [ansCount, setAnsCount] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const topic_id = location.pathname.split("/")[3];
  const st_name = location.pathname.split("/")[2];

  useEffect(() => {
    currentPage.current = 1;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/topic/${st_name}/${topic_id}`);
        setTopic(res.data[0]);
        setBooks(res.data);
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
    fetchData();
  }, [st_name, topic_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subtopics/${topic_id}`);
        res.data.map(async (subtopic) => {
          const resNote = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/count/notes/${topic_id}/${subtopic.stid}`
          );
          setNotesCount((prev) => [...prev, resNote.data]);
          const resContributor = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/count/contributors/${subtopic.stid}`
          );
          setContibutorsCount((prev) => [...prev, resContributor.data]);
        });
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
            onScreen: true,
            showIcon: true,
          },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [topic_id]);

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
          onScreen: true,
          showIcon: true,
        },
      });
      setLoading(false);
    }
  };

  function handlePageClick(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    fetchQuestions();
  }

  const countAnswers = async (quesArray) => {
    try {
      quesArray.map(async (question) => {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/answers/${question.qid}`);
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
          onScreen: true,
          showIcon: true,
        },
      });
      setLoading(false);
    }
  };

  const showState = (value, state) => {
    setShowAdd(value);
    if (state) {
      fetchQuestions(topic.tid);
    }
  };

  const showUpdateState = (value, state) => {
    setShowUpdateAdd(value);
    if (state) {
      fetchQuestions(topic.tid);
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
      const res = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/dbquestion/post/${qid}`);
      setShowDelWarning({ state: 1, qid: 0 });
      fetchQuestions(topic.tid);
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

  console.log("Questions Here!");
  console.log(questions);

  return (
    <>
      <Breadcrum
        pred_path="Topic"
        pred_path_link="/topics"
        path={topic.tname}
      />
      <section className="topicInf ">
        <div className="max-w-[986px] w-full mx-auto px-[4rem] texttopics_title__vCKfs">
          <div className="fos-animate-me fadeIn delay-0_1">
            <div className="title-heading fos-animate-me fadeIn delay-0_1">
              <div className="title-heading-name">{topic.tname} </div>
            </div>
            <div className="horizontal-info">
              <div className="flex items-center justify-start flex-wrap fos-animate-me fadeIn delay-0_1">
                
                  {books.map((book, index) => index == 0 && <span className=" fos-animate-me fadeIn delay-0_1">{book.bname}</span>)}
                <div className="point"></div>

                {openTab == 1 && (
                  <>
                    {subTopics?.length == 1
                      ? <span className="fos-animate-me fadeIn delay-0_1">{"1 Lesson"}</span>
                      : <span className="fos-animate-me fadeIn delay-0_1">{subTopics?.length + " Lessons"}</span>}
                      </>
                )}
                {openTab == 2 && (
                  <span className="fos-animate-me fadeIn delay-0_1">
                    {total == 1 ? "1 Question" : total + " Questions"}
                  </span>
                )}
                {/* {books.map((book, index) => (((index+1) != books.length) ?
              <>
                <span>{book.bname} </span> <div className="point"></div>
              </>
                :
                <span>{book.bname}</span>))} */}
              </div>
            </div>
            <div className="tabs-container fos-animate-me fadeIn delay-0_1">
              <div className="tabs-item">
                <div
                  className={"tabs-tab " + (openTab === 1 ? "tabs-active" : "")}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                >
                  Lessons
                </div>
              </div>
              <div className="tabs-item">
                <div
                  className={"tabs-tab " + (openTab === 2 ? "tabs-active" : "")}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                    setLoading(true);
                    fetchQuestions(topic.tid);
                  }}
                >
                  Questions
                </div>
              </div>
              <div className="tabs-item">
                <div
                  className={"tabs-tab " + (openTab === 3 ? "tabs-active" : "")}
                  onClick={(e) => {
                    e.preventDefault();
                    // setOpenTab(3);
                  }}
                >
                  Reviews
                </div>
              </div>
            </div>
          </div>

          <div
            class={
              (openTab === 1 ? "block " : "hidden ") +
              "tp-container tp-container-active topic-topics-info-container card content-sec min-h-[450px]"
            }
          >
            {loading ? (
              <div className="mb-[150px] pt-[100px]">
                <LargeLoading />
              </div>
            ) : (
              <>
                {subTopics.length > 0 ? (
                  <>
                    <div className="card-body">
                      <div className="tp-title">Lessons</div>
                      <ul className="flex flex-wrap mb-[40px]">
                        {subTopics.map((subTopic, index) => (
                          <Link
                            to={`/subtopic/${topic.st_name}/${subTopic.sst_name}/${subTopic.stid}/${subTopic.tid}`}
                            className={
                              "w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className={"ch-index " + randomColor}>
                              {index < 9 ? "0" + (index + 1) : index + 1}
                            </div>
                            <div className="ch-details">
                              <h2 className="ch-name">{subTopic.stname}</h2>
                              <div className="ch-meta">
                                <div className="ch-meta-item flex">
                                  <span>
                                    {notesCount?.length > 0
                                      ? getUnique(notesCount, "stid").map(
                                          (note) =>
                                            note.stid == subTopic.stid &&
                                            (note?.count == 1
                                              ? "1 Note"
                                              : note?.count + " Notes")
                                        )
                                      : "__Notes"}
                                  </span>
                                  <div className="ch-l-point"></div>
                                </div>
                                <div className="ch-meta-item flex">
                                  <span>
                                    {contributorsCount?.length > 0
                                      ? getUnique(
                                          contributorsCount,
                                          "stid"
                                        ).map(
                                          (contributor) =>
                                            contributor.stid == subTopic.stid &&
                                            (contributor?.count == 1
                                              ? "1 Contributor"
                                              : contributor?.count +
                                                " Contributors")
                                        )
                                      : "__Contributors"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <i className="ch-l-right fa fa-chevron-right"></i>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="no-result-info fos-animate-me bounceInUp delay-0_1">
                    <div className="mt-[200px] pb-[20px] flex justify-around">
                      <div className="flex items-center justify-start">
                        <div className="text-left ml-[10px]">
                          <div className="text-gray-500">
                            <div className="text-sm">No lessons are here...!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
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
                      <div className="tp-title">List of Questions</div>
                      <ul className="flex flex-wrap">
                        {getUnique(questions, "qid").map((question, index) => (
                          <div
                            className={
                              "w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className={"ch-index " + "!text-[#76e199]"}>
                              {index == 9
                                ? `${currentPage.current + "0"}`
                                : `${parseInt(currentPage.current) - 1}` +
                                  `${index + 1}`}
                            </div>
                            <div className="ch-details">
                              <Link
                                to={`/question/${question.sq_name}/${question.qid}`}
                              >
                                <h2 className="ch-name">{question.qtitle}</h2>
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
                        ))}
                      </ul>
                    </div>
                    {pageCount > 1 && (
                      <Pagination
                        count={pageCount}
                        onChange={handlePageClick}
                        color="primary"
                        className="justify-center flex mb-5"
                      />
                    )}
                    <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                      <div className="mt-[10px] mb-[10px] pb-[20px] flex justify-around">
                        <div className="flex items-center justify-start">
                          <div className="text-left ml-[10px]">
                            <div className="text-gray-500">
                              <div className="text-sm">
                                Can't find the question...?
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
                  </>
                ) : (
                  <div className="no-result-info fos-animate-me bounceInUp delay-0_1">
                    <div className="mt-[200px] mb-[300px] pb-[20px] flex justify-around">
                      <div className="flex items-center justify-start">
                        <div className="text-left ml-[10px]">
                          <div className="text-gray-500">
                            <div className="text-sm">No questions are here...!</div>
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
            {showAdd == 0 && <AddQuestion showState={showState} />}
            {showUpdateAdd == 0 && (
              <AddQuestion
                showState={showUpdateState}
                question_info={question_info}
              />
            )}
            <div
              class={
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
                <div className="warning-heading-text border-b">Are you sure?</div>
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
          <div
            className={(openTab === 3 ? "block " : "hidden ") + "tp-container"}
          >
            {loading ? (
              <div className="mb-[150px] pt-[100px]">
                <LargeLoading />
              </div>
            ) : (
              <h1>Reviews</h1>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Topic;
