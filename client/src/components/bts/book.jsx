import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import Breadcrum from "../utils/breadcrum";
import "./book.css";
import add from "../../static/add.png";
import { AuthContext } from "../utils/authContext";
import AddTopic from "../addPops/addTopic";

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

function Book() {
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopicsCount, setSubTopicsCount] = useState([]);
  const [notesCount, setNotesCount] = useState([]);
  const [quesCount, setQuesCount] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showAdd, setShowAdd] = useState(1);

  const [recommendations, setRecommendations] = useState([]); 

  const location = useLocation();
  const navigate = useNavigate();

  const book_id = location.pathname.split("/")[3];
  const s_name = location.pathname.split("/")[2];

  useEffect(() => {
    setTimeout(() => {}, 5000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/book/${s_name}/${book_id}`);
        setBook(res.data[0]);
        setLevels(res.data);

        const resRec = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/recommend/book?id=${book_id}`);
        setRecommendations(resRec.data);
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
  }, [s_name, book_id]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/topics/${book_id}`);
      res.data.map(async (topic) => {
        // const res = await axios.get(`/subtopics/${topic.tid}?${book_id}`);
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/subtopic/${topic.tid}`);
        setSubTopicsCount((prev) => [...prev, res.data]);
        const resNote = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/notes/${topic.tid}`);
        setNotesCount((prev) => [...prev, resNote.data]);
      });
      setTopics(res.data);
      countQuestions(res.data);
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
  };

  const fetchStNum = async (topic_id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/subtopic/${topic_id}`);
      return res.data.count;
    } catch (error) {
      console.log(error);
    }
  };

  const countQuestions = async (topicsArray) => {
    try {
      topicsArray.map(async (topic) => {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/questions/${topic.tid}`);
        setQuesCount((prev) => [...prev, res.data]);
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

  useEffect(() => {
    fetchTopics().then(() => {
      setLoading(false);
    });
  }, [book_id]);

  const showState = (value,state) => {
    setShowAdd(value);
    if(state){
      fetchTopics();
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

  return (
    <>
      <>
        <Breadcrum pred_path="Book" pred_path_link="/books" path={book.bname} />
        {
          <section className="bookInf ">
            <div className="max-w-[986px] w-full mx-auto px-[4rem] textbooks_title__vCKfs">
              <div className="book-info-container h-[250px] flex justify-start py-[20px] p-[20px] fos-animate-me fadeIn delay-0_1">
                <div className="book-img-container w-[150px] mr-[30px]">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      book.coverimg != null
                        ? book.coverimg
                        : "/upload/cover/no-cover-img.jpeg"
                    }
                    alt=""
                  />
                </div>
                <div className="book-meta-container pr-[15px]">
                  <h1 className="book-title">{book.bname}</h1>
                  <h2 className="book-subtitle">
                    Useful for:{" "}
                    {levels.map((level) =>
                      level.bid === book.bid ? (
                        <Link to={`/books/${level.sl_name}`}>
                          {level.lname}.{" "}
                        </Link>
                      ) : null
                    )}
                  </h2>
                  <p className="book-description mt-[10px]">
                    {book.description}
                  </p>
                </div>
              </div>

              <div className="book-topics-info-container card content-sec">
                <div className="card-body">
                  <div className="row fos-animate-me fadeIn delay-0_1">
                    <div className="col-sm-6">
                      {topics.length > 0 && (
                        <h5 className="subs-title">Table of Contents</h5>
                      )}
                    </div>
                  </div>
                  {loading ? (
                    <div className="mb-[150px] pt-[100px]">
                      <LargeLoading />
                    </div>
                  ) : (
                    <>
                      {topics.length > 0 ? (
                        <>
                          <ul className="flex flex-wrap">
                            {topics.map((topicI, index) => (
                              <Link
                                to={`/topic/${topicI.st_name}/${topicI.tid}`}
                                className={"w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.025] fos-animate-me fadeIn delay-0_" + (index+1)}
                              >
                                <div className="ch-index">
                                  {index < 9 ? "0" + (index + 1) : index + 1}
                                </div>
                                <div className="ch-details">
                                  <h2
                                    className="ch-name"
                                    onClick={() =>
                                      navigate(
                                        `/topic/${topicI.st_name}/${topicI.tid}`
                                      )
                                    }
                                  >
                                    {topicI.tname == ""
                                      ? "Name of the Topic"
                                      : topicI.tname}
                                  </h2>
                                  <div className="ch-meta">
                                    <div className="ch-meta-item flex">
                                      <span>
                                        {subtopicsCount?.length > 0
                                          ? getUnique(
                                              subtopicsCount,
                                              "tid"
                                            ).map(
                                              (subtopic) =>
                                                subtopic.tid == topicI.tid &&
                                                (subtopic?.count == 1
                                                  ? "1 Lesson"
                                                  : subtopic?.count +
                                                    " Lessons")
                                            )
                                          : "__Lessons"}
                                      </span>
                                      <div className="ch-l-point"></div>
                                    </div>
                                    <div className="ch-meta-item flex">
                                      <span>
                                        {notesCount?.length > 0
                                          ? getUnique(notesCount, "tid").map(
                                              (note) =>
                                                note.tid == topicI.tid &&
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
                                        {quesCount?.length > 0
                                          ? getUnique(quesCount, "tid").map(
                                              (ques) =>
                                                ques.tid == topicI.tid &&
                                                (ques?.count == 1
                                                  ? "1 Question"
                                                  : ques?.count + " Questions")
                                            )
                                          : "__Questions"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <i className="ch-l-right fa fa-chevron-right"></i>
                              </Link>
                            ))}
                          </ul>
                          <div className="no-result-info fos-animate-me fadeInUp delay-0_1">
                            <div className="mt-[10px] mb-[10px] pb-[20px] flex justify-around">
                              <div className="flex items-center justify-start">
                                <div className="text-left ml-[10px]">
                                  <div className="text-gray-500">
                                    <div className="text-sm">
                                      Can't find the topic...?
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
                                      Add a new topic
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="no-result-info fos-animate-me bounceInUp delay-0_1">
                          <div className="mt-[100px] mb-[200px] pb-[20px] flex justify-around">
                            <div className="flex items-center justify-start">
                              <div className="text-left ml-[10px]">
                                <div className="text-gray-500">
                                  <div className="text-sm">
                                    No topics are here...!
                                  </div>
                                  <div
                                    onClick={() => showState(0)}
                                    className="text-sm add-book-no-res cursor-pointer text-blue-500 flex justify-around"
                                  >
                                    Add a new topic
                                  </div>
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

              <div className="book-topics-info-container card content-sec">
                <div className="card-body">
                  <div className="row fos-animate-me fadeIn delay-0_1">
                    <div className="col-sm-6">
                      {recommendations.length > 0 && (
                        <h5 className="subs-title">Recommendations</h5>
                      )}
                    </div>
                  </div>
                  {loading ? (
                    <div className="mb-[150px] pt-[100px]">
                      <LargeLoading />
                    </div>
                  ) : (
                    <>
                      {recommendations.length > 0 ? (
                        <>
                          <div className="books-container my-2">
                          <div className="grid grid-cols-5 gap-[40px] py-[15px]">
                            {recommendations.map((book, index) => (
                              <Link
                              to={`/book/${book.s_name}/${book.bid}`}
                              className={"transform transition duration-500 hover:scale-[1.025] fos-animate-me fadeIn delay-0_" + (index+1)}
                            >
                              <div className="oneContainer">
                                <img
                                  className="max-w-[130px] rounded-lg mb-[2px] w-[130px] max-h-[165px] h-[165px] object-cover"
                                  src={
                                    book.coverimg != null
                                      ? book.coverimg
                                      : "/upload/cover/no-cover-img.jpeg"
                                  }
                                  alt=""
                                />
                                <div>
                                  <div className="book-title">{book.bname}</div>
                                  {/* <div className="book-subtitle">
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
                                  </div> */}
                                </div>
                              </div>
                            </Link>
                            ))}
                            </div>
                            </div>
                        </>
                      ) : (
                        <div className="no-result-info fos-animate-me bounceInUp delay-0_1">
                          <div className="mt-[100px] mb-[200px] pb-[20px] flex justify-around">
                            <div className="flex items-center justify-start">
                              <div className="text-left ml-[10px]">
                                <div className="text-gray-500">
                                  <div className="text-sm">
                                    More context needed
                                  </div>
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
              
              {showAdd == 0 && <AddTopic showState={showState} />}
            </div>
          </section>
        }

        {/* Yo Subtopic halne ho vane paxi design garne */}
        <>
          {/*             
    <div className="container w-full md:max-w-3xl mx-auto pt-20">
      <div
        className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal"
        style={{ fontFamily: "Georgia,serif" }}
      >
        <div className="font-sans">
          <p className="text-base md:text-sm text-green-500 font-bold">
            &lt;{" "}
            <span onClick={()=>{navigate(-1)}} style={{cursor:"pointer"}}
              className="text-base md:text-sm text-green-500 font-bold no-underline hover:underline"
            >
              BACK TO PREV
            </span>
          </p>
          <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">
            {book.bname}
          </h1>
          <p className="text-sm md:text-base font-normal text-gray-600">
            Book for: {levels.map((level) => (level.lname + ' | '))}
          </p>
        </div>
        <p className="py-6">
          {book.description}
        </p>

        Yaha topics ko list banaune
        {topics.map((topicI) => {
          console.log('B')
          // console.log(topicI)
          return (<div><h1 onClick={()=>navigate(`/topic/${topicI.st_name}/${topicI.tid}`)} className="py-2 font-sans">{topicI.tname}</h1>
          {subtopics.map((subtopic) => {
            let returnval = ''
            console.log('I')
            // console.log(Object.keys(subtopic));
            for (var i=0; i<Object.keys(subtopic).length; i++){
              if (subtopic[`${i}`].topic === topicI.tid) {
                console.log('Yep');
              returnval += `<a href="/subtopic/${topicI.st_name}/${subtopic[`${i}`].sst_name}/${subtopic[`${i}`].stid}"><h2 className="py-1 text-blue-600 px-3">${subtopic[`${i}`].stname}</h2></a>`
              console.log(subtopic[`${i}`].stname);
              }
            }
            return parse(returnval);
          })}
          </div>)
        })}
      </div>
    </div> */}
        </>
      </>
    </>
  );
}

export default Book;
