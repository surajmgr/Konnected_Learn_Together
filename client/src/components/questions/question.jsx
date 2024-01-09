import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import { Pagination } from "@mui/material";
import parse from "html-react-parser";
import Breadcrum from "../utils/breadcrum";
import CountUp from "react-countup";
import "../topics/topics.css";
import "./question.css";
import upvote from "../../static/upvote.png";
import upvoted from "../../static/upvoted.png";
import downvote from "../../static/downvote.png";
import downvoted from "../../static/downvoted.png";
import editIcon from "../../static/editIcon1.png";
import deleteIcon from "../../static/delete.png";

// React Notification
import { Store } from "react-notifications-component";
import AddAnswer from "../addPops/addAnswer";
import LargeLoading from "../utils/largeLoading";
import TypingEffect from "./typingEffect";

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

function Question() {
  const { currentUser } = useContext(AuthContext);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState([]);
  const [subtopicsCount, setSubTopicsCount] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(1);
  const [showUpdateAdd, setShowUpdateAdd] = useState(1);
  const [showDelWarning, setShowDelWarning] = useState({ state: 1, aid: 0 });
  const [gptLoading, setGptLoading] = useState(true);
  const [gptResponse, setGptResponse] = useState("");
  const [showGPT, setShowGPT] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const ques_id = location.pathname.split("/")[3];
  const sq_name = location.pathname.split("/")[2];

  // Pagination
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();
  const [answer_info, setAnswerInfo] = useState({});

  const colors = [
    "#2e9efb",
    "#c47ae0",
    "#fac865",
    "#76e199",
    "#ff627b",
    "#4edfe2",
    "#fd6f6f",
  ];
  const randomColor = "!text-[#5bc376]";

  useEffect(() => {
    currentPage.current = 1;
    fetchQuestion();
    getAnswers();
  }, []);

  function handlePageClick(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    getAnswers();
  }

  async function getAnswers() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/dbquestion/answers/${ques_id}/1?page=${currentPage.current}&limit=${limit}`
      );
      setPageCount(res.data.pageCount);
      getVotes(res.data.result);
      setAnswers(res.data.result);
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

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dbquestion/${sq_name}/${ques_id}`);
      setQuestion(res.data);
      setLoading(false);
      await handleUserQuestion(res.data.qtitle);
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

  const getVotes = async (answersArray) => {
    try {
      setVotes([]);
      answersArray.map(async (answer) => {
        const res = currentUser
          ? await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/votes/${answer.aid}?uid=${currentUser.id}`)
          : await axios.get(`${process.env.REACT_APP_API_BASE_URL}/count/votes/${answer.aid}?uid=null`);
        setVotes((prev) => [...prev, res.data]);
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

  const updateVotes = async (aid, uid, changereq) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/dbquestion/update-vote`,
        {
          aid,
          uid,
          changereq,
        },
        {
          withCredentials: true,
        }
      );
      getVotes(answers);
      console.log("Votes Here!");
      console.log(votes);
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

  const showState = (value,state) => {
    setShowAdd(value);
    if(state){
      getAnswers();
    }
  };

  const showUpdateState = (value,state) => {
    setShowUpdateAdd(value);
    if(state){
      getAnswers();
    }
  };

  const upState = (aid, body) => {
    setAnswerInfo({
      aid,
      body,
    });
  };

  const handleDelete = async (aid) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/dbquestion/answer/${aid}`);
      setShowDelWarning({ state: 1, aid: 0 });
      getAnswers();
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

  async function getChatGPTResponse(question) {
    const API_KEY = (currentUser) ? ((currentUser.gpt !== "" && currentUser.gpt ) ? currentUser.gpt : process.env.REACT_APP_GPT) : process.env.REACT_APP_GPT;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    // Construct the request body
    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: question },
      ],
    };
  
    try {
      // Make the POST request to OpenAI API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestBody),
      });
  
      // Check if the request was successful
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        // Extract and return the assistant's reply
        return responseData.choices[0]?.message?.content || '';
      } else {
        // Handle error cases
        console.error('Error fetching data from OpenAI API:', response.statusText);
        return 'Error fetching data from OpenAI API';
      }
    } catch (error) {
      console.error('Error:', error.message);
      return 'Error';
    }
  }

  async function handleUserQuestion(question) {
    const chatGPTResponse = await getChatGPTResponse(question);
    setGptResponse(chatGPTResponse);
    setGptLoading(false);
  }

  console.log("Votes Here!");
  console.log(votes);

  return (
    <>
      <Breadcrum
        pred_path_link={`/topic/${question.st_name}/${question.tid}`}
        pred_path={question.tname}
        path={question.qtitle}
      />
      <section className="topic-content mb-[25px]">
        <div className="max-w-[986px] w-full mx-auto px-[4rem] topics_title__vCKfs">
          <div className="list-heading fos-animate-me fadeIn delay-0_1">
            <div className="flex items-center text-[20px]">Question
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setShowGPT(true)} height="16" width="16" className="ml-[5px] text-blue-500 cursor-pointer" fill="currentColor" viewBox="0 0 512 512"><path d="M464 6.1c9.5-8.5 24-8.1 33 .9l8 8c9 9 9.4 23.5 .9 33l-85.8 95.9c-2.6 2.9-4.1 6.7-4.1 10.7V176c0 8.8-7.2 16-16 16H384.2c-4.6 0-8.9 1.9-11.9 5.3L100.7 500.9C94.3 508 85.3 512 75.8 512c-8.8 0-17.3-3.5-23.5-9.8L9.7 459.7C3.5 453.4 0 445 0 436.2c0-9.5 4-18.5 11.1-24.8l111.6-99.8c3.4-3 5.3-7.4 5.3-11.9V272c0-8.8 7.2-16 16-16h34.6c3.9 0 7.7-1.5 10.7-4.1L464 6.1zM432 288c3.6 0 6.7 2.4 7.7 5.8l14.8 51.7 51.7 14.8c3.4 1 5.8 4.1 5.8 7.7s-2.4 6.7-5.8 7.7l-51.7 14.8-14.8 51.7c-1 3.4-4.1 5.8-7.7 5.8s-6.7-2.4-7.7-5.8l-14.8-51.7-51.7-14.8c-3.4-1-5.8-4.1-5.8-7.7s2.4-6.7 5.8-7.7l51.7-14.8 14.8-51.7c1-3.4 4.1-5.8 7.7-5.8zM87.7 69.8l14.8 51.7 51.7 14.8c3.4 1 5.8 4.1 5.8 7.7s-2.4 6.7-5.8 7.7l-51.7 14.8L87.7 218.2c-1 3.4-4.1 5.8-7.7 5.8s-6.7-2.4-7.7-5.8L57.5 166.5 5.8 151.7c-3.4-1-5.8-4.1-5.8-7.7s2.4-6.7 5.8-7.7l51.7-14.8L72.3 69.8c1-3.4 4.1-5.8 7.7-5.8s6.7 2.4 7.7 5.8zM208 0c3.7 0 6.9 2.5 7.8 6.1l6.8 27.3 27.3 6.8c3.6 .9 6.1 4.1 6.1 7.8s-2.5 6.9-6.1 7.8l-27.3 6.8-6.8 27.3c-.9 3.6-4.1 6.1-7.8 6.1s-6.9-2.5-7.8-6.1l-6.8-27.3-27.3-6.8c-3.6-.9-6.1-4.1-6.1-7.8s2.5-6.9 6.1-7.8l27.3-6.8 6.8-27.3c.9-3.6 4.1-6.1 7.8-6.1z"/></svg>
            </div>
          </div>
          <div className="mt-[5px] fos-animate-me fadeIn delay-0_1">
            <div className="flex items-center justify-start flex-wrap text-[18px]">
              <span className="leading-[21px] py-[8px]">{question?.qtitle}</span>
            </div>
          </div>
          <div className="ques-body border-b rounded-lg pb-[5px] text-[#999] text-[14px] font-[500] leading-[19.12px] max-h-[300px] overflow-y-scroll fos-animate-me fadeIn delay-0_1">
            {question.qbody != "" ? parse("" + question.qbody) : ""}
            <div
              onClick={() => {
                if (currentUser) {
                  showState(0);
                } else {
                  loginWarning();
                }
              }}
              className="text-sm float-right add-book-no-res cursor-pointer text-blue-500"
            >
              Answer this question
            </div>
          </div>
          <div className="answer-btn"></div>
          <div className="topics-container my-2 min-h-[500px]">
            {loading ? (
              <div className="mt-[150px] pt-[50px]">
                <LargeLoading />
              </div>
            ) : (
              <>
            {answers.length > 0 ? (
              <div className="pb-[16px] pt-[25px]">
              {showGPT && <div className={"w-full pb-[20px] pr-[5px] fos-animate-me fadeIn delay-0_1"}>
                <div className="border-b pb-0 mt-0 transition duration-300">
                  <div className="text-black text-[16px] tracing-[1px]">
                    <div className="horiz-wrapper">
                      <div className="horiz-container border-b pb-[16px]">
                        <div className="horiz-wrap-ch flex flex-start">
                          <div
                            className={
                              "ch-index leading-[19.12px] " + randomColor
                            }
                          >
                            01
                            </div>
                          <div className="-mt-[1px] answer-side leading-[19.12px] overflow-scroll w-full">
                            <div className="solution-title">
                              <div className="flex items-center justify-between flex-wrap text-[18px]">
                                <span>Solution</span>
                                <Link to={`https://chat.openai.com`}><span className="text-sm text-[#999]">
                                  @chatgpt
                                </span></Link> 
                              </div>
                            </div>
                            <div className="ques-body rounded-lg pb-[10px] pt-[7px] text-[14px] font-[500] leading-[19.12px] max-h-[100vh] overflow-y-scroll">
                              {
                                gptLoading ? <div className="mt-[10px]"><LargeLoading /></div> : <TypingEffect text= {gptResponse.replaceAll("\n", "<br>")} />
                              }
                            </div>
                            <div className="min-h-[20px]">
                              <div className="edit-delete-container rounded-lg -ml-[7px] items-center float-left">
                                <div className="flex items-center vote-wrapper">
                                  <div className="edit flex items-center ">
                                    <span
                                      onClick={() => {
                                        
                                      }}
                                      className="text-[#999] text-[13px] leading-[19px] ml-[8px] cursor-pointer "
                                    >
                                      {" "}
                                      Edit
                                    </span>
                                  </div>
                                  <div className="delete flex items-center ">
                                    <span
                                    className="text-[#999] text-[13px] leading-[19px] ml-[8px] cursor-pointer "
                                    >
                                      {" "}
                                      Delete
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="vote-container rounded-lg px-[22px] items-center float-right">
                                  <div className="flex items-center vote-wrapper">
                                    <div className="upvote flex items-center min-w-[37px]">
                                      <picture>
                                        <img
                                          loading="lazy"
                                          src={upvote}
                                          width="20"
                                          height="19"
                                          alt="upvote"
                                        />
                                      </picture>
                                      <span className="text-[#999] text-[14px] leading-[19px] ml-[8px]">
                                        {" "}
                                        0
                                      </span>
                                    </div>
                                    <div className="downvote flex items-center ml-[10px] min-w-[37px]">
                                      <picture>
                                        <img
                                          loading="lazy"
                                          src={downvote}
                                          width="20"
                                          height="19"
                                          alt="downvote"
                                        />
                                      </picture>
                                      <span className="text-[#999] text-[14px] leading-[19px] ml-[8px]">
                                        {" "}
                                        0
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
                {answers.map((answer, index) => (
                  <div className={"w-full pb-[20px] pr-[5px] fos-animate-me fadeIn delay-0_" + (index+1)}>
                    <div className="border-b pb-0 mt-0 transition duration-300">
                      <div className="text-black text-[16px] tracing-[1px]">
                        <div className="horiz-wrapper">
                          <div className="horiz-container border-b pb-[16px]">
                            <div className="horiz-wrap-ch flex flex-start">
                              <div
                                className={
                                  "ch-index leading-[19.12px] " + randomColor
                                }
                              >
                                {index == 9
                                  ? `${currentPage.current + "0"}`
                                  : `${parseInt(currentPage.current) - 1}` +
                                    `${index + (showGPT ? 2 : 1)}`}
                              </div>
                              <div className="-mt-[1px] answer-side leading-[19.12px] overflow-scroll w-full">
                                <div className="solution-title">
                                  <div className="flex items-center justify-between flex-wrap text-[18px]">
                                    <span>Solution</span>
                                    <Link to={`/user/${answer.username}`}><span className="text-sm text-[#999]">
                                      @{answer.username}
                                    </span></Link> 
                                  </div>
                                </div>
                                <div className="ques-body rounded-lg pb-[10px] pt-[7px] text-[14px] font-[500] leading-[19.12px] max-h-[100vh] overflow-y-scroll">
                                  {answer.abody != ""
                                    ? parse("" + answer.abody)
                                    : question.tname}
                                </div>
                                <div className="min-h-[20px]">
                                  {(currentUser?.id == answer.auid) &&
                                    <div className="edit-delete-container rounded-lg -ml-[7px] items-center float-left">
                                    <div className="flex items-center vote-wrapper">
                                      <div className="edit flex items-center ">
                                        <span
                                          onClick={() => {
                                            upState(answer.aid, answer.abody);
                                            setShowUpdateAdd(0);
                                          }}
                                          className="text-[#999] text-[13px] leading-[19px] ml-[8px] cursor-pointer "
                                        >
                                          {" "}
                                          Edit
                                        </span>
                                      </div>
                                      <div className="delete flex items-center ">
                                        <span
                                          onClick={() =>
                                            setShowDelWarning({
                                              state: 0,
                                              aid: answer.aid,
                                            })
                                          }
                                          className="text-[#999] text-[13px] leading-[19px] ml-[8px] cursor-pointer "
                                        >
                                          {" "}
                                          Delete
                                        </span>
                                      </div>
                                    </div>
                                  </div>}
                                  {votes.length > 0 ? (
                                    getUnique(votes, "aid").map(
                                      (vote) =>
                                        vote.aid == answer.aid && (
                                          <div className="vote-container rounded-lg px-[22px] items-center float-right">
                                            <div className="flex items-center vote-wrapper">
                                              <div className="upvote flex items-center min-w-[37px] cursor-pointer">
                                                {vote.status == "up" ? (
                                                  <picture>
                                                    <img
                                                      loading="lazy"
                                                      src={upvoted}
                                                      onClick={() => {
                                                        currentUser
                                                          ? updateVotes(
                                                              answer.aid,
                                                              currentUser.id,
                                                              "rmupvote"
                                                            )
                                                          : loginWarning();
                                                      }}
                                                      width="20"
                                                      height="19"
                                                      alt="upvoted"
                                                    />
                                                  </picture>
                                                ) : (
                                                  <picture>
                                                    <img
                                                      loading="lazy"
                                                      src={upvote}
                                                      onClick={() => {
                                                        currentUser
                                                          ? updateVotes(
                                                              answer.aid,
                                                              currentUser.id,
                                                              "up"
                                                            )
                                                          : loginWarning();
                                                      }}
                                                      width="20"
                                                      height="19"
                                                      alt="upvote"
                                                    />
                                                  </picture>
                                                )}
                                                <span className="text-[#999] text-[14px] leading-[19px] ml-[8px]">
                                                  {" "}
                                                  <CountUp end={vote.upvote} />
                                                </span>
                                              </div>
                                              <div className="downvote flex items-center ml-[10px] min-w-[37px] cursor-pointer">
                                                {vote.status == "down" ? (
                                                  <picture>
                                                    <img
                                                      loading="lazy"
                                                      src={downvoted}
                                                      onClick={() => {
                                                        currentUser
                                                          ? updateVotes(
                                                              answer.aid,
                                                              currentUser.id,
                                                              "rmdownvote"
                                                            )
                                                          : loginWarning();
                                                      }}
                                                      width="20"
                                                      height="19"
                                                      alt="downvoted"
                                                    />
                                                  </picture>
                                                ) : (
                                                  <picture>
                                                    <img
                                                      loading="lazy"
                                                      src={downvote}
                                                      onClick={() => {
                                                        currentUser
                                                          ? updateVotes(
                                                              answer.aid,
                                                              currentUser.id,
                                                              "down"
                                                            )
                                                          : loginWarning();
                                                      }}
                                                      width="20"
                                                      height="19"
                                                      alt="downvote"
                                                    />
                                                  </picture>
                                                )}
                                                <span className="text-[#999] text-[14px] leading-[19px] ml-[8px]">
                                                  {" "}
                                                  <CountUp
                                                    end={vote.downvote}
                                                  />
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                    )
                                  ) : (
                                    <div className="vote-container rounded-lg px-[22px] items-center float-right">
                                      <div className="flex items-center vote-wrapper">
                                        <div className="upvote flex items-center min-w-[37px]">
                                          <picture>
                                            <img
                                              loading="lazy"
                                              src={upvote}
                                              width="20"
                                              height="19"
                                              alt="upvote"
                                            />
                                          </picture>
                                          <span className="text-[#999] text-[14px] leading-[19px] ml-[8px]">
                                            {" "}
                                            0
                                          </span>
                                        </div>
                                        <div className="downvote flex items-center ml-[10px] min-w-[37px]">
                                          <picture>
                                            <img
                                              loading="lazy"
                                              src={downvote}
                                              onClick={() => {
                                                currentUser
                                                  ? updateVotes(
                                                      answer.aid,
                                                      currentUser.id,
                                                      "down"
                                                    )
                                                  : loginWarning();
                                              }}
                                              width="20"
                                              height="19"
                                              alt="downvote"
                                            />
                                          </picture>
                                          <span className="text-[#999] text-[14px] leading-[19px] ml-[8px]">
                                            {" "}
                                            0
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-result-info">
                <div className="mt-[200px] mb-[300px] pb-[20px] flex justify-around">
                  <div className="flex items-center justify-start">
                    <div className="text-left ml-[10px]">
                      <div className="text-gray-500">
                        <div className="text-sm">No answers are here...!</div>
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
                          Be the first to answer
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
                className="justify-center flex mb-5 fos-animate-me fadeIn delay-0_9"
              />
            )}
            {showAdd == 0 && <AddAnswer showState={showState} />}
            {showUpdateAdd == 0 && (
              <AddAnswer
                showState={showUpdateState}
                answer_info={answer_info}
              />
            )}
            <div
              class={
                showDelWarning.state === 1
                  ? "popup-outer z-10"
                  : "active popup-outer z-10"
              }
            >
              <div className="popup-box leading-[25px]">
                <i
                  id="close"
                  className="fa fa-close close"
                  onClick={() => setShowDelWarning({ state: 1, aid: 0 })}
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
                      setShowDelWarning({ state: 1, aid: 0 });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(showDelWarning.aid);
                    }}
                    className="send bg-[#f082ac] hover:bg-[#ec5f95]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {answers.length > 0 && (
              <div className="no-result-info">
                <div className="my-[10px] pb-[20px] flex justify-around">
                  <div className="flex items-center justify-start">
                    <div className="text-left ml-[10px]">
                      <div className="text-gray-500">
                        <div className="text-sm">
                          Can't find the correct answer...?
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
                          Add a new answer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Question;
