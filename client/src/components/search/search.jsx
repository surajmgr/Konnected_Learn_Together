import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Breadcrum from "../utils/breadcrum";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import add from "../../static/add.png";
import { Pagination } from "@mui/material";
import "./search.css";
import AddBook from "../addPops/addBook";
import LargeLoading from "../utils/largeLoading";

// React Notification
import { Store } from "react-notifications-component";

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

function Search() {
  const state = useLocation().state;
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState([]);
  const [levels, setLevels] = useState([]);
  const [books, setBooks] = useState([]);
  const [subtopicsCount, setSubTopicsCount] = useState([]);
  const [notesCount, setNotesCount] = useState([]);
  const [total, setTotal] = useState([]);
  const [openTab, setOpenTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(1);
  const { currentUser } = useContext(AuthContext);

  // Pagination
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const colors = [
    "#2e9efb",
    "#c47ae0",
    "#fac865",
    "#76e199",
    "#ff627b",
    "#4edfe2",
    "#fd6f6f",
  ];
  const randomColor = "!text-[#fac865]";
  const bookList = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const tag = location.search;

  useEffect(() => {
    currentPage.current = 1;
    if (state) {
      if (state.tab == 1) {
        setOpenTab(1);
        getPaginatedTopics();
      } else if (state.tab == 2) {
        setOpenTab(2);
        getPaginatedLessons();
      } else if (state.tab == 3) {
        setOpenTab(3);
        getPaginatedBooks();
      } else {
        setOpenTab(1);
        getPaginatedTopics();
      }
    } else {
      getPaginatedTopics();
    }
  }, []);

  function handlePageClick(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    getPaginatedTopics();
  }

  function handlePageClickLesson(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    getPaginatedLessons();
  }

  function handlePageClickBook(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    getPaginatedBooks();
  }

  async function getPaginatedTopics() {
    try {
      setLoading(true)
      const res = await axios.get(
        `/dbsearch${tag}&cat=topic&page=${currentPage.current}&limit=${limit}`
      );
      setPageCount(res.data.pageCount);
      res.data.result.map(async (topic) => {
        const res = await axios.get(`/count/subtopic/${topic.tid}`);
        setSubTopicsCount((prev) => [...prev, res.data]);
      });
      setTopics(res.data.result);
      setTotal(res.data.total);
      setLoading(false)
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
  }

  async function getPaginatedLessons() {
    try {
      setLoading(true)
      const res = await axios.get(
        `/dbsearch${tag}&cat=subtopic&page=${currentPage.current}&limit=${limit}`
      );
      setPageCount(res.data.pageCount);
      res.data.result.map(async (subtopic) => {
        const res = await axios.get(`/count/notes/1/${subtopic.stid}`);
        setNotesCount((prev) => [...prev, res.data]);
      });
      setSubTopics(res.data.result);
      setTotal(res.data.total);
      setLoading(false)
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
  }

  async function getPaginatedBooks() {
    try {
      setLoading(true)
      const res = await axios.get(
        `/dbsearch${tag}&cat=book&page=${currentPage.current}&limit=${limit}`
      );
      setPageCount(res.data.pageCount);
      setBooks(res.data.result);
      setLevels(res.data.result);
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
  }

  const showState = (value) => {
    setShowAdd(value);
  };

  console.log("State Here!");
  console.log(state);

  return (
    <>
      <Breadcrum path="Search" />
      <section className="topicInf ">
        <div class="max-w-[986px] w-full mx-auto px-[4rem] texttopics_title__vCKfs">
          <div className="title-heading fos-animate-me fadeIn delay-0_1">
            <div className="title-heading-name">Search Results</div>
          </div>
          <div className="horizontal-info fos-animate-me fadeIn delay-0_1">
            <div className="flex items-center justify-start flex-wrap">
              {total} Search Results for&nbsp;
              {openTab === 1 && (
                <span className="fos-animate-me fadeIn delay-0_1">Topics</span>
              )}
              {openTab === 2 && (
                <span className="fos-animate-me fadeIn delay-0_1">Lessons</span>
              )}
              {openTab === 3 && (
                <span className="fos-animate-me fadeIn delay-0_1">Books</span>
              )}
            </div>
          </div>
          <div className="tabs-container fos-animate-me fadeIn delay-0_1">
            <div className="tabs-item">
              <div
                className={"tabs-tab " + (openTab === 1 ? "tabs-active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setOpenTab(1);
                  currentPage.current = 1;
                  getPaginatedTopics();
                }}
              >
                Topics
              </div>
            </div>
            <div className="tabs-item">
              <div
                className={"tabs-tab " + (openTab === 2 ? "tabs-active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setOpenTab(2);
                  currentPage.current = 1;
                  getPaginatedLessons();
                }}
              >
                Lessons
              </div>
            </div>
            <div className="tabs-item">
              <div
                className={"tabs-tab " + (openTab === 3 ? "tabs-active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setOpenTab(3);
                  currentPage.current = 1;
                  getPaginatedBooks();
                }}
              >
                Books
              </div>
            </div>
          </div>

          <div
            class={
              (openTab === 1 ? "block " : "hidden ") +
              "tp-container tp-container-active topic-topics-info-container card content-sec min-h-[900px]"
            }
          >
            {loading ? (
              <div className="mt-[150px] pt-[50px]">
                <LargeLoading />
              </div>
            ) : (
              <>
                {topics.length > 0 ? (
                  <>
                    <div class="card-body">
                      <div className="tp-title fos-animate-me fadeIn delay-0_1">
                        List of Topics
                      </div>
                      <ul className="flex flex-wrap">
                        {getUnique(topics, "tid").map((topic, index) => (
                          <Link
                            to={`/topic/${topic.st_name}/${topic.tid}`}
                            className={
                              "w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className={"ch-index " + randomColor}>
                              {index == 9
                                ? `${index + 1}`
                                : `${parseInt(currentPage.current) - 1}` +
                                  `${index + 1}`}
                            </div>
                            <div className="ch-details">
                              <h2 className="ch-name">{topic.topic_name}</h2>
                              <div className="ch-meta justify-between">
                                <div className="ch-meta-item flex">
                                  <span>
                                    {subtopicsCount?.length > 0
                                      ? getUnique(subtopicsCount, "tid").map(
                                          (subtopic) =>
                                            subtopic.tid == topic.tid &&
                                            (subtopic?.count == 1
                                              ? "1 Lesson"
                                              : subtopic?.count + " Lessons")
                                        )
                                      : "__Lessons"}
                                  </span>
                                </div>
                                <div
                                  className={
                                    "ch-meta-item flex view-info items-center flex text-[14px] leading-[19px] " +
                                    randomColor
                                  }
                                >
                                  <span>View Topic</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </ul>
                    </div>
                    {pageCount > 1 && (
                      <Pagination
                        count={pageCount}
                        onChange={handlePageClick}
                        color="primary"
                        className="justify-center flex mb-5 fos-animate-me fadeIn delay-0_10"
                      />
                    )}
                  </>
                ) : (
                  <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                    <div class="mt-[200px] pb-[20px] flex justify-around">
                      <div class="flex items-center justify-start">
                        <div class="text-left ml-[10px]">
                          <div class="text-gray-500">
                            <div class="text-sm">No topics matched...!</div>
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
              "tp-container min-h-[900px]"
            }
          >
            {loading ? (
              <div className="mt-[150px] pt-[50px]">
                <LargeLoading />
              </div>
            ) : (
              <>
                {subtopics.length > 0 ? (
                  <>
                    <div class="card-body">
                      <div className="tp-title fos-animate-me fadeIn delay-0_1">
                        List of Lessons
                      </div>
                      <ul className="flex flex-wrap">
                        {getUnique(subtopics, "stid").map((subTopic, index) => (
                          <Link
                            to={`/subtopic/${subTopic.st_name}/${subTopic.sst_name}/${subTopic.stid}/${subTopic.tid}`}
                            className={
                              "w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className={"ch-index " + randomColor}>
                              {index == 9
                                ? `${index + 1}`
                                : `${parseInt(currentPage.current) - 1}` +
                                  `${index + 1}`}
                            </div>
                            <div className="ch-details">
                              <h2 className="ch-name">
                                {subTopic.subtopic_name}
                              </h2>
                              <div className="ch-meta justify-between">
                                <div className="ch-meta-item flex">
                                  <span>
                                    {notesCount?.length > 0
                                      ? getUnique(notesCount, "stid").map(
                                          (subtopic) =>
                                            subtopic.stid == subTopic.stid &&
                                            (subtopic?.count == 1
                                              ? "1 Note"
                                              : subtopic?.count + " Notes")
                                        )
                                      : "__Notes"}
                                  </span>
                                </div>
                                <div
                                  className={
                                    "ch-meta-item flex view-info items-center flex text-[14px] leading-[19px] " +
                                    randomColor
                                  }
                                >
                                  <span>View Lesson</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </ul>
                    </div>
                    {pageCount > 1 && (
                      <Pagination
                        count={pageCount}
                        onChange={handlePageClickLesson}
                        color="primary"
                        className="justify-center flex mb-5 fos-animate-me fadeIn delay-0_10"
                      />
                    )}
                  </>
                ) : (
                  <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                    <div class="mt-[200px] pb-[20px] flex justify-around">
                      <div class="flex items-center justify-start">
                        <div class="text-left ml-[10px]">
                          <div class="text-gray-500">
                            <div class="text-sm">No lessons matched...!</div>
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
              (openTab === 3 ? "block " : "hidden ") +
              "tp-container min-h-[900px]"
            }
          >
            {loading ? (
              <div className="mt-[150px] pt-[50px]">
                <LargeLoading />
              </div>
            ) : (
              <>
                {books.length > 0 ? (
                  <>
                    <div className="books-container my-2">
                      <div className="grid grid-cols-5 gap-[40px] py-[15px]">
                        {getUnique(books, "bid").map((book) => (
                          <Link
                            to={`/book/${book.s_name}/${book.bid}`}
                            className="transform transition duration-500 hover:scale-[1.025]"
                          >
                            <div className="oneContainer">
                              <img
                                className="max-w-[140px] rounded-lg mb-[10px] w-[140px] max-h-[195px] h-[195px] object-cover"
                                src={
                                  book.coverimg != null
                                    ? book.coverimg
                                    : "/upload/cover/no-cover-img.jpeg"
                                }
                                alt=""
                              />
                              <div>
                                <div className="book-title">{book.bname}</div>
                                <div className="book-subtitle">
                                  Author: {book.author}
                                </div>
                                <div className="book-level">
                                  Level:{" "}
                                  {levels.map((level) =>
                                    level.bid === book.bid ? (
                                      <Link to={`/books/${level.sl_name}`}>
                                        {level.lname}.{" "}
                                      </Link>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {pageCount > 1 && (
                      <Pagination
                        count={pageCount}
                        onChange={handlePageClickBook}
                        color="primary"
                        className="justify-center flex mb-5 fos-animate-me fadeIn delay-0_10"
                      />
                    )}
                    {currentUser && (
                      <div className="add-banner bg-[#edf7ff] flex h-[80px] my-[15px] px-[15px] py-[12px] w-full">
                        <img src={add} alt="" className="mr-[25px]" />
                        <div className="add-meta">
                          <div className="">Can't find the textbook?</div>
                          <div
                            className="text-[#249efb] cursor-pointer p-[12px]"
                            onClick={() => showState(0)}
                          >
                            Add your book
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                    <div class="mt-[200px] pb-[20px] flex justify-around">
                      <div class="flex items-center justify-start">
                        <div class="text-left ml-[10px]">
                          <div class="text-gray-500">
                            <div class="text-sm">No books matched...!</div>
                            <div
                              onClick={() => showState(0)}
                              className="text-sm add-book-no-res cursor-pointer text-blue-500 flex justify-around"
                            >
                              Add your book
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {showAdd == 0 && <AddBook showState={showState} />}
          </div>
        </div>
      </section>
    </>
  );
}

export default Search;
