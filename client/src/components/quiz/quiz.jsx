import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import Breadcrum from "../utils/breadcrum";
import "../topics/topics.css";
import "../questions/question.css";

// React Notification
import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";

function Quiz() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const tname = location.pathname.split("/")[2];
  const tid = location.pathname.split("/")[3];

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, []);

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
      <Breadcrum
        pred_path_link={`/topic/${"question.st_name"}/${"question.tid"}`}
        pred_path={"question.tname"}
        path={"question.qtitle"}
      />
      <section className="topic-content mb-[25px]">
        <div className="max-w-[986px] w-full mx-auto px-[4rem] topics_title__vCKfs">
          <div className="list-heading fos-animate-me fadeIn delay-0_1">
            <div className="flex items-center text-[20px]">
              Question
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                className="ml-[5px] text-blue-500 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M464 6.1c9.5-8.5 24-8.1 33 .9l8 8c9 9 9.4 23.5 .9 33l-85.8 95.9c-2.6 2.9-4.1 6.7-4.1 10.7V176c0 8.8-7.2 16-16 16H384.2c-4.6 0-8.9 1.9-11.9 5.3L100.7 500.9C94.3 508 85.3 512 75.8 512c-8.8 0-17.3-3.5-23.5-9.8L9.7 459.7C3.5 453.4 0 445 0 436.2c0-9.5 4-18.5 11.1-24.8l111.6-99.8c3.4-3 5.3-7.4 5.3-11.9V272c0-8.8 7.2-16 16-16h34.6c3.9 0 7.7-1.5 10.7-4.1L464 6.1zM432 288c3.6 0 6.7 2.4 7.7 5.8l14.8 51.7 51.7 14.8c3.4 1 5.8 4.1 5.8 7.7s-2.4 6.7-5.8 7.7l-51.7 14.8-14.8 51.7c-1 3.4-4.1 5.8-7.7 5.8s-6.7-2.4-7.7-5.8l-14.8-51.7-51.7-14.8c-3.4-1-5.8-4.1-5.8-7.7s2.4-6.7 5.8-7.7l51.7-14.8 14.8-51.7c1-3.4 4.1-5.8 7.7-5.8zM87.7 69.8l14.8 51.7 51.7 14.8c3.4 1 5.8 4.1 5.8 7.7s-2.4 6.7-5.8 7.7l-51.7 14.8L87.7 218.2c-1 3.4-4.1 5.8-7.7 5.8s-6.7-2.4-7.7-5.8L57.5 166.5 5.8 151.7c-3.4-1-5.8-4.1-5.8-7.7s2.4-6.7 5.8-7.7l51.7-14.8L72.3 69.8c1-3.4 4.1-5.8 7.7-5.8s6.7 2.4 7.7 5.8zM208 0c3.7 0 6.9 2.5 7.8 6.1l6.8 27.3 27.3 6.8c3.6 .9 6.1 4.1 6.1 7.8s-2.5 6.9-6.1 7.8l-27.3 6.8-6.8 27.3c-.9 3.6-4.1 6.1-7.8 6.1s-6.9-2.5-7.8-6.1l-6.8-27.3-27.3-6.8c-3.6-.9-6.1-4.1-6.1-7.8s2.5-6.9 6.1-7.8l27.3-6.8 6.8-27.3c.9-3.6 4.1-6.1 7.8-6.1z" />
              </svg>
            </div>
          </div>
          <div className="mt-[5px] fos-animate-me fadeIn delay-0_1">
            <div className="flex items-center justify-start flex-wrap text-[18px]">
              <span className="leading-[21px] py-[8px]">
                question?.qtitle
              </span>
            </div>
          </div>
          <div className="ques-body border-b rounded-lg pb-[5px] text-[#999] text-[14px] font-[500] leading-[19.12px] max-h-[300px] overflow-y-scroll fos-animate-me fadeIn delay-0_1">
            {currentUser ? "Topic" : "Please login to see the question"}
            <div className="text-sm float-right add-book-no-res cursor-pointer text-blue-500">
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
                <div className="no-result-info">
                  <div className="mt-[200px] mb-[300px] pb-[20px] flex justify-around">
                    <div className="flex items-center justify-start">
                      <div className="text-left ml-[10px]">
                        <div className="text-gray-500">
                          <div className="text-sm">No answers are here...!</div>
                          <div
                            onClick={() => {
                              if (currentUser) {
                                console.log("Answer");
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
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Quiz;
