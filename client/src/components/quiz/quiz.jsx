import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import Breadcrum from "../utils/breadcrum";
import parse from "html-react-parser";
import "../topics/topics.css";
import "../questions/question.css";

// React Notification
import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";
import {
  BarChartsBySubtopic,
  BubbleChart,
  CHART_COLORS,
  DoughnutChart,
  FullColorDoughnut,
  QuizReport,
  RoundedBarChart,
  transparentize,
} from "./quiz_o";

function Quiz() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [topic, setTopic] = useState({});
  const [involvedSubtopics, setInvolvedSubtopics] = useState([]);

  const [answerReturn, setAnswerReturn] = useState({});
  const [answerChecked, setAnswerChecked] = useState(false);
  const [data, setData] = useState({});

  const [userAnswer, setUserAnswer] = useState([]);

  const [currentState, setCurrentState] = useState("quiz");

  const location = useLocation();
  const navigate = useNavigate();

  const tname = location.pathname.split("/")[2];
  const tid = location.pathname.split("/")[3];

  const colors = [
    "#2e9efb",
    "#c47ae0",
    "#fac865",
    "#76e199",
    "#ff627b",
    "#4edfe2",
    "#fd6f6f",
  ];
  const randomColor = `!text-[${colors[tid % colors.length]}]`;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
    } else {
      fetchQuestions();
      // setLoading(true);
    }
  }, []);

  const fetchQuestions = async () => {
    try {
      const resd = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/subtopics/${tid}`
      );

      if (resd.data.length === 0) {
        navigate("/404");
      }

      const topic = {
        id: resd.data[0].tid,
        // replace more than one space with a single space, hyphen with space, and capitalize the first letter of each word
        name: resd.data[0].tname
          .replace(/\s\s+/g, " ")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        st_name: resd.data[0].st_name,
      };
      setTopic(topic);

      // remove unwanted fields from each subtopic. Necessary: stname, stid, sst_name
      const subtopics = resd.data.map((subtopic) => {
        return {
          id: subtopic.stid,
          name: subtopic.stname,
          sst_name: subtopic.sst_name,
        };
      });
      setSubtopics(subtopics);

      const res = await axios.post("http://localhost:8000/quiz/start", {
        topic_id: parseInt(topic.id),
        student_id: currentUser.id,
        already_attempted: [],
        total_questions: 15,
      });

      // append subtopic details to each question
      const questions = res.data.map((question) => {
        const subtopic = subtopics.find(
          (subtopic) => subtopic.id === question.subtopic_id
        );
        if (!subtopic) {
          return {
            ...question,
            st_name: "Not Found",
            name: "Not Found",
          };
        }
        return {
          ...question,
          st_name: subtopic.sst_name,
          name: subtopic.name,
        };
      });
      console.log(questions);
      setQuestions(questions);

      // get involved subtopics, name of all subtopics involved in the quiz, must be unique
      const involvedSubtopics = [
        ...new Set(questions.map((question) => question.name)),
      ];
      setInvolvedSubtopics(involvedSubtopics);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswer = (qid, answer, optionLabel) => {
    // alert(qid + " " + answer);
    if (answerChecked) {
      return;
    }
    setUserAnswer((prev) => {
      const newAnswer = prev.filter((ans) => ans.qid !== qid);
      newAnswer.push({ qid, answer, optionLabel });
      return newAnswer;
    });
  };

  const submitQuiz = async () => {
    if (!currentUser) {
      loginWarning();
      return;
    }

    if (userAnswer.length < questions.length) {
      Store.addNotification({
        title: "Incomplete!",
        message: "Please answer all the questions",
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
      return;
    }

    try {
      const user_answers = {};
      userAnswer.forEach((ans) => {
        user_answers[ans.qid] = ans.answer;
      });
      const res = await axios.post("http://localhost:8000/quiz/check", {
        student_id: currentUser.id,
        user_answers,
      });

      // Let's generate a random response for now
      // from userAnswer, get the qid and answer
      // const correct = [];
      // const incorrect = [];
      // const new_theta = {};
      // userAnswer.forEach((ans) => {
      //   // randomly generate correct or incorrect
      //   const answerToPush = {
      //     qid: ans.qid,
      //     // get the correct answer from the question
      //     answer: questions.find((question) => question.id === ans.qid).answer,
      //   };
      //   if (ans.answer === answerToPush.answer) {
      //     correct.push(answerToPush);
      //   } else {
      //     incorrect.push(answerToPush);
      //   }
      //   new_theta[ans.qid] = Math.random();
      // });

      // const res = {
      //   correct,
      //   incorrect,
      //   new_theta,
      // };

      setAnswerReturn(res.data);
      setData(res.data);
      setAnswerChecked(true);

      Store.addNotification({
        title: "Quiz Submitted!",
        message: "Check your result",
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
    } catch (error) {
      console.log(error);
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

  const getCategory = (theta) => {
    if (theta <= -1.0) return { label: "Very Low", color: "#dc3545" };
    if (theta <= 0.0) return { label: "Low", color: "#ffc107" };
    if (theta <= 0.5) return { label: "Moderate", color: "#28a745" };
    if (theta <= 1.0) return { label: "High", color: "#007bff" };
    return { label: "Very High", color: "#28a745" };
  };

  const data_o = {
    correct: [
      {
        qid: 1,
        answer: "Define the problem state and the initial state.",
        a: 0.12,
        b: 0.55,
        c: 0.33,
        subtopic: 284667,
        new_theta: 0.22,
      },
      {
        qid: 2,
        answer: "Linear",
        a: 0.19,
        b: 1.35,
        c: -0.85,
        subtopic: 284712,
        new_theta: 0.31,
      },
      {
        qid: 3,
        answer: "Exponential",
        a: -0.18,
        b: 0.13,
        c: 0.32,
        subtopic: 284793,
        new_theta: 0.95,
      },
      {
        qid: 4,
        answer: "Define the problem state and the initial state.",
        a: 1.98,
        b: 1.25,
        c: -0.88,
        subtopic: 285295,
        new_theta: 0.12,
      },
      {
        qid: 5,
        answer: "Linear",
        a: -0.14,
        b: 0.18,
        c: 0.29,
        subtopic: 285169,
        new_theta: 1.4,
      },
      {
        qid: 6,
        answer:
          "A problem where the solution must satisfy a set of constraints.",
        a: 0.87,
        b: 1.28,
        c: -0.89,
        subtopic: 285031,
        new_theta: -0.85,
      },
      {
        qid: 7,
        answer: "Exponential",
        a: -0.16,
        b: 0.16,
        c: 0.34,
        subtopic: 284667,
        new_theta: -0.19,
      },
    ],
    incorrect: [
      {
        qid: 8,
        answer: "Linear",
        a: 0.88,
        b: 1.25,
        c: -0.85,
        subtopic: 284712,
        new_theta: -0.28,
      },
      {
        qid: 9,
        answer: "Define the problem state and the initial state.",
        a: -0.12,
        b: 0.12,
        c: 0.29,
        subtopic: 284793,
        new_theta: -2.8,
      },
      {
        qid: 10,
        answer: "Exponential",
        a: 0.95,
        b: 1.3,
        c: -0.91,
        subtopic: 285295,
        new_theta: 0.13,
      },
      {
        qid: 11,
        answer:
          "A problem where the solution must satisfy a set of constraints.",
        a: 0.89,
        b: 1.27,
        c: -0.92,
        subtopic: 285169,
        new_theta: -0.35,
      },
      {
        qid: 12,
        answer: "Exponential",
        a: -0.55,
        b: 0.48,
        c: 0.35,
        subtopic: 285031,
        new_theta: 0.98,
      },
      {
        qid: 13,
        answer: "Define the problem state and the initial state.",
        a: 0.95,
        b: 1.32,
        c: -0.88,
        subtopic: 284667,
        new_theta: -0.18,
      },
      {
        qid: 14,
        answer: "Exponential",
        a: -0.17,
        b: 0.14,
        c: 0.33,
        subtopic: 284712,
        new_theta: 1.4,
      },
      {
        qid: 15,
        answer:
          "A problem where the solution must satisfy a set of constraints.",
        a: 0.91,
        b: 1.26,
        c: -0.89,
        subtopic: 284793,
        new_theta: -0.91,
      },
      {
        qid: 16,
        answer: "Define the problem state and the initial state.",
        a: 0.13,
        b: 0.59,
        c: 0.42,
        subtopic: 285295,
        new_theta: -1.25,
      },
      {
        qid: 17,
        answer: "Exponential",
        a: -0.22,
        b: 0.2,
        c: 0.4,
        subtopic: 285169,
        new_theta: 2.4,
      },
      {
        qid: 18,
        answer: "Linear",
        a: 0.82,
        b: 1.15,
        c: -0.75,
        subtopic: 285031,
        new_theta: -0.88,
      },
      {
        qid: 19,
        answer: "Define the problem state and the initial state.",
        a: -0.18,
        b: 0.11,
        c: 0.27,
        subtopic: 284667,
        new_theta: -1.18,
      },
      {
        qid: 20,
        answer: "Exponential",
        a: 0.97,
        b: 1.28,
        c: -0.93,
        subtopic: 284712,
        new_theta: 0.98,
      },
    ],
    subtopic: {
      284667: {
        old_theta: 0.1,
        history: { correct: 5, total: 15, theta: 0.18 }, // new theta
        info: { name: "Artificial Intelligence", sst_name: "ai-intelligence" },
      },
      284712: {
        old_theta: 0.33,
        history: { correct: 4, total: 14, theta: 0.33 },
        info: {
          name: "Foundations of AI: Logic",
          sst_name: "foundations-ai",
        },
      },
      284793: {
        old_theta: 0.8,
        history: { correct: 3, total: 10, theta: 0.98 },
        info: { name: "Game Theory", sst_name: "game-theory" },
      },
      285295: {
        old_theta: -1.15,
        history: { correct: 1, total: 5, theta: -0.15 },
        info: {
          name: "Machine Learning Basics",
          sst_name: "ml-basics",
        },
      },
      285169: {
        old_theta: -1.2,
        history: { correct: 2, total: 6, theta: -0.35 },
        info: { name: "Search Algorithms", sst_name: "search-algorithms" },
      },
      285031: {
        old_theta: 1.5,
        history: { correct: 1, total: 4, theta: -0.88 },
        info: { name: "Optimization Problems", sst_name: "optimization" },
      },
    },
  };

  return (
    <>
      <Breadcrum
        pred_path_link={`/topic/${topic.st_name}/${topic.id}`}
        pred_path={currentState === "report" ? "Quiz Report" : "Quiz"}
        path={topic.name}
      />
      {currentState === "report" ? (
        <>
          <section className="topic-content mb-[25px]">
            <div className="max-w-[986px] w-full mx-auto px-[4rem] topics_title__vCKfs">
              <div className="list-heading fos-animate-me fadeIn delay-0_1 ml-[5px]">
                <div className="text-[30px] my-[10px] font-[600] leading-[34px] -ml-[5px]">
                  Your Quiz Report
                  <span className="text-[#999] text-[15px] font-[500] leading-[19.12px] block ml-[5px] mt-[5px]">
                    for {topic.name}
                  </span>
                </div>
                <section className="my-4 text-[16px] font-[500] leading-[19.12px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#333] mb-2">
                        <span className="font-[700]">User Name:</span>{" "}
                        {currentUser.name}
                      </p>
                      <p className="text-[#333] mb-2">
                        <span className="font-bold">Email:</span>{" "}
                        {currentUser.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#333] mb-2">
                        <span className="font-bold">Date:</span>{" "}
                        {/* date in January 15, 2025 */}
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[#333] mb-2">
                        <span className="font-bold">Score:</span>{" "}
                        {/* {answerReturn.correct.length} / {questions.length} */}
                        5/10
                      </p>
                    </div>
                  </div>
                </section>
                <section className="mb-6 text-[16px] font-[500] leading-[25.12px]">
                  <table
                    style={{
                      borderColor: "rgb(54 162 235)",
                    }}
                    className="w-full table-auto border-collapse border text-left"
                  >
                    <thead>
                      <tr
                        className={
                          "text-[16px] font-[500] leading-[25.12px] border px-4 py-2 bg-[#f8f9fa] text-[#333] "
                        }
                      >
                        <th className="border px-4 py-2">Subtopic</th>
                        <th className="border px-4 py-2">Old Ability</th>
                        <th className="border px-4 py-2">New Ability</th>
                        <th className="border px-4 py-2">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.subtopic &&
                        Object.keys(data.subtopic).map((s) => {
                          return {
                            name: data.subtopic[s].info.name,
                            theta: data.subtopic[s].history.theta,
                            old_theta: data.subtopic[s].old_theta,
                          };
                        })
                      .map((subtopic) => {
                        const category = getCategory(subtopic.theta);
                        const changeIndicator =
                          subtopic.theta < subtopic.old_theta
                            ? { s: "↓", color: "#dc3545" } // Indicates theta has decreased
                            : subtopic.theta > subtopic.old_theta
                            ? { s: "↑", color: "#28a745" } // Indicates theta has increased
                            : { s: "=", color: "#333" }; // Indicates theta has remained the same

                        return (
                          <tr key={subtopic.name}>
                            <td className="border px-4 py-2">
                              {subtopic.name}
                            </td>
                            <td className="border px-4 py-2">
                              {subtopic.old_theta.toFixed(2)}
                            </td>
                            <td className="border px-4 py-2">
                              {subtopic.theta.toFixed(2)}
                            </td>
                            <td
                              className="border px-4 py-2"
                              style={{ color: category.color, fontWeight: 500 }}
                            >
                              {category.label}{" "}
                              <span style={{ color: changeIndicator.color }}>
                                {changeIndicator.s}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
                <section className="my-4 text-[16px] font-[500] leading-[19.12px]">
                  <div className="flex mb-4">
                    <div className="flex-1 mr-4">
                      <div className="p-4 bg-[#f8f9fa40] rounded-lg mb-4">
                        <div className="text-[20px] my-[10px] font-[600] leading-[25.12px]">
                          Accuracy Overview
                        </div>
                        <div className="text-[#333] mb-2 flex flex-row space-x-4 max-w-[345px] mx-auto">
                          <div
                            style={{ width: "150px", height: "125px" }}
                            className="mt-[20px]"
                          >
                            <FullColorDoughnut
                              label="Correct"
                              data={data.correct.length}
                              insidetext="Correct"
                              color={CHART_COLORS.green}
                            />
                          </div>
                          <div
                            style={{ width: "150px", height: "125px" }}
                            className="mt-[20px] ml-10"
                          >
                            <FullColorDoughnut
                              label="Incorrect"
                              data={data.incorrect.length}
                              insidetext="Incorrect"
                              color={CHART_COLORS.red}
                            />
                          </div>
                        </div>
                        <div
                          style={{ width: "150px", height: "125px" }}
                          className="mt-[20px] mx-auto"
                        >
                          <DoughnutChart data={data} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="p-4 bg-[#f8f9fa40] rounded-lg mb-4">
                        <div className="text-[20px] my-[10px] font-[600] leading-[25.12px]">
                          Correct vs Total
                        </div>
                        <div
                          style={{ width: "auto", height: "280px" }}
                          className="mt-[20px] mx-auto"
                        >
                          <QuizReport data={data} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="p-4 ml-4 bg-[#f8f9fa40] rounded-lg">
                      <div className="text-[20px] my-[10px] font-[600] leading-[25.12px]">
                        Question Details
                      </div>
                      <div
                        style={{ width: "100%", height: "100%", minHeight: "500px" }}
                        className="mt-[20px] mx-auto"
                      >
                        <BarChartsBySubtopic data={data} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="p-4 ml-4 bg-[#f8f9fa40] rounded-lg">
                      <div className="text-[20px] my-[10px] font-[600] leading-[25.12px]">
                        Performance Overview
                      </div>
                      <div
                        style={{ width: "auto", height: "auto" }}
                        className="mt-[20px] mx-auto"
                      >
                        <BubbleChart data={data} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="p-4 ml-4 bg-[#f8f9fa40] rounded-lg">
                      <div className="text-[20px] my-[10px] font-[600] leading-[25.12px]">
                        Ability Changes by Subtopic
                      </div>
                      <div
                        style={{ width: "auto", height: "500px" }}
                        className="mt-[20px] mx-auto"
                      >
                        <RoundedBarChart data={data} />
                      </div>
                    </div>
                  </div>
                </section>
                <span className="text-[#999] text-[14px] font-[500] leading-[19.12px] block"></span>
              </div>
              <div className="pb-[16px] pt-[25px]"></div>
            </div>
          </section>
        </>
      ) : (
        <div className="topics-container my-2 min-h-[500px]">
          {loading ? (
            <div className="mt-[150px] pt-[50px]">
              <LargeLoading />
            </div>
          ) : (
            <>
              <section className="topic-content mb-[25px]">
                <div className="max-w-[986px] w-full mx-auto px-[4rem] topics_title__vCKfs">
                  <div className="list-heading fos-animate-me fadeIn delay-0_1">
                    <div className="flex items-center text-[20px]">
                      {topic.name}
                    </div>
                    <span className="text-[#999] text-[14px] font-[500] leading-[19.12px] block">
                      The following questions are based on the subtopics of this
                      topic, and the involved subtopics are:{" "}
                      {involvedSubtopics
                        .slice(0, involvedSubtopics.length - 1)
                        .join(", ")}{" "}
                      and {involvedSubtopics.slice(-1)}
                    </span>
                  </div>
                  <div className="pb-[16px] pt-[25px]">
                    {questions.length > 0 ? (
                      <>
                        {questions.map((question, index) => (
                          <div
                            className={
                              "w-full pb-[20px] pr-[5px] fos-animate-me fadeIn delay-0_" +
                              (index + 1)
                            }
                          >
                            <div className="border-b pb-0 mt-0 transition duration-300">
                              <div className="text-black text-[16px] tracing-[1px]">
                                <div className="horiz-wrapper">
                                  <div className="horiz-container border-b pb-[16px]">
                                    <div className="horiz-wrap-ch flex flex-start">
                                      <div
                                        className={
                                          "ch-index leading-[19.12px] " +
                                          randomColor
                                        }
                                      >
                                        {(index + 1 < 10 ? "0" : "") +
                                          (index + 1)}
                                      </div>
                                      <div className="-mt-[1px] answer-side leading-[19.12px] overflow-scroll w-full">
                                        <div className="solution-title">
                                          <div className="flex items-center justify-between flex-wrap text-sm text-[#999]">
                                            <span>{question.name}</span>
                                            <Link to={`/user/${question.name}`}>
                                              <span className="text-sm text-[#999]">
                                                {(question.difficulty <= 0
                                                  ? "Easy"
                                                  : question.difficulty <= 2
                                                  ? "Moderate"
                                                  : "Hard") +
                                                  ", " +
                                                  (question.discrimination <= 1
                                                    ? "Minimal"
                                                    : question.discrimination <=
                                                      2
                                                    ? "Moderate"
                                                    : "Refined") +
                                                  ", " +
                                                  (question.guessing <= 0.2
                                                    ? "Definitive"
                                                    : question.guessing <= 0.4
                                                    ? "Balanced"
                                                    : "Uncertain")}
                                              </span>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="ques-body rounded-lg pb-[10px] pt-[7px] text-[16px] font-[500] leading-[25.12px] max-h-[100vh] overflow-y-scroll text-[17px]">
                                          {question.question != ""
                                            ? parse("" + question.question)
                                            : "ERROR: Question not found"}

                                          <div className="options text-[16px] mt-[10px] leading-[19.12px]">
                                            {question.options.map(
                                              (option, index) => (
                                                <div
                                                  className={
                                                    "option horiz-wrap-ch flex flex-start cursor-pointer py-[10px] px-[15px] rounded-lg -ml-[15px] " +
                                                    (userAnswer.find(
                                                      (ans) =>
                                                        ans.qid ===
                                                          question.id &&
                                                        ans.answer === option
                                                    )
                                                      ? answerChecked
                                                        ? answerReturn.correct.find(
                                                            (ans) =>
                                                              ans.qid ===
                                                              question.id
                                                          )
                                                          ? "bg-[#d4edda]"
                                                          : "bg-[#f8d7da]"
                                                        : "bg-[#e9f3ff]"
                                                      : answerChecked
                                                      ? answerReturn.incorrect.find(
                                                          (ans) =>
                                                            ans.qid ===
                                                            question.id
                                                        ) &&
                                                        answerReturn.incorrect.find(
                                                          (ans) =>
                                                            ans.qid ===
                                                            question.id
                                                        ).answer === option
                                                        ? "bg-[#d4edda]"
                                                        : ""
                                                      : "hover:bg-[#f5f5f5]")
                                                  }
                                                  onClick={() =>
                                                    handleAnswer(
                                                      question.id,
                                                      option,
                                                      String.fromCharCode(
                                                        65 + index
                                                      )
                                                    )
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      "option-letter ch-index leading-[19.12px] mr-[10px]" +
                                                      (userAnswer.find(
                                                        (ans) =>
                                                          ans.qid ===
                                                            question.id &&
                                                          ans.answer === option
                                                      )
                                                        ? answerChecked
                                                          ? answerReturn.correct.find(
                                                              (ans) =>
                                                                ans.qid ===
                                                                question.id
                                                            )
                                                            ? " text-[#28a745]"
                                                            : " text-[#dc3545]"
                                                          : " text-[#007bff]"
                                                        : answerChecked
                                                        ? answerReturn.incorrect.find(
                                                            (ans) =>
                                                              ans.qid ===
                                                              question.id
                                                          ) &&
                                                          answerReturn.incorrect.find(
                                                            (ans) =>
                                                              ans.qid ===
                                                              question.id
                                                          ).answer === option
                                                          ? " text-[#28a745]"
                                                          : " text-[#999]"
                                                        : " text-[#999]")
                                                    }
                                                  >
                                                    {String.fromCharCode(
                                                      65 + index
                                                    )}
                                                  </div>
                                                  <div className="option-text text-[#333]">
                                                    {option}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        {
                                          // if user has answered the question, show the answer
                                          userAnswer.find(
                                            (ans) => ans.qid === question.id
                                          ) && (
                                            <div className="min-h-[20px]">
                                              <div
                                                className={
                                                  "text-[#999] text-[14px] font-[500] leading-[19.12px] " +
                                                  (answerChecked
                                                    ? answerReturn.correct.find(
                                                        (ans) =>
                                                          ans.qid ===
                                                          question.id
                                                      )
                                                      ? "text-[#28a745]"
                                                      : "text-[#dc3545]"
                                                    : "text-[#007bff]")
                                                }
                                              >
                                                Your answer:{" "}
                                                {
                                                  userAnswer.find(
                                                    (ans) =>
                                                      ans.qid === question.id
                                                  ).optionLabel
                                                }
                                                {answerChecked ? (
                                                  answerReturn.correct.find(
                                                    (ans) =>
                                                      ans.qid === question.id
                                                  ) ? (
                                                    <div className="inline-block ml-[10px] text-[#28a745] text-[14px] font-[500] leading-[19.12px]">
                                                      {/* check svg */}
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 inline-block"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm-1.414 14.586l-3.793-3.793 1.414-1.414 2.379 2.379 4.793-4.793 1.414 1.414-6.207 6.207z"
                                                        />
                                                      </svg>
                                                    </div>
                                                  ) : (
                                                    <div className="inline-block ml-[10px] text-[#28a745] text-[14px] font-[500] leading-[19.12px]">
                                                      Correct Answer:{" "}
                                                      {String.fromCharCode(
                                                        65 +
                                                          question.options.findIndex(
                                                            (option) =>
                                                              option ===
                                                              answerReturn.incorrect.find(
                                                                (ans) =>
                                                                  ans.qid ===
                                                                  question.id
                                                              ).answer
                                                          )
                                                      )}
                                                    </div>
                                                  )
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="text-center mt-[20px]">
                          {answerChecked ? (
                            <button
                              onClick={() =>
                                navigate(`/topic/${topic.st_name}/${topic.id}`)
                              }
                              className="btn btn-primary"
                            >
                              Go Back
                            </button>
                          ) : (
                            <button
                              onClick={submitQuiz}
                              className="btn btn-primary"
                            >
                              Submit Quiz
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-[#999] text-[14px] font-[500] leading-[19.12px]">
                        No answers found
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      )}
      <div className="text-center mt-[20px]">
        {!answerChecked ? (
          <button
            onClick={() =>
              navigate(`/topic/${topic.st_name}/${topic.id}`)
            }
            className="btn btn-primary"
          >
            Go Back
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentState(currentState === "quiz" ? "report" : "quiz")
            }
            className="btn btn-primary"
          >
            {currentState === "quiz" ? "View Report" : "Back to Quiz"}
          </button>
        )}
      </div>
    </>
  );
}

export default Quiz;
