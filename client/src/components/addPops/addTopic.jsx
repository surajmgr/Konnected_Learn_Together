import React, { useEffect, useState } from "react";
import "./popup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BooksFetch from "./booksFetch";
import SetSubTopics from "./setSubtopics";
import icon_add from "../../static/icon-add.png";

// React Notification
import { Store } from "react-notifications-component";
import Loading from "../utils/loading";
import LargeLoading from "../utils/largeLoading";

function AddTopic(props) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entering, setEntering] = useState(1);
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const [sendingBook, setSendingBook] = useState({});
  const [topicInputs, setTopicInputs] = useState({
    tname: "",
  });
  const [subTopicInputs, setSubTopicInputs] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const topicHandleChange = (e) => {
    setTopicInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.name);
    console.log(topicInputs);
  };

  const addTopic = async (e) => {
    e.preventDefault();
    try {
      console.log(sendingBook);
      console.log(subTopicInputs);
      // setBookInputs((prev) => ({ ...prev, blevel:sendingLevel }));
      if (topicInputs.tname.length < 5) {
        Store.addNotification({
          title: "Short topic!",
          message: "Topic must be longer than 5 letters.",
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
      } else if (topicInputs.tname.length > 40) {
        Store.addNotification({
          title: "Long topic!",
          message: "Topic must be shorter than 40 letters.",
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
      } else if (sendingBook.length == 0) {
        Store.addNotification({
          title: "Missing Book!",
          message: "At least one book must be associated.",
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
      } else if (Object.keys(subTopicInputs).length == 0) {
        Store.addNotification({
          title: "Missing Lesson!",
          message: "At least one lesson must be associated.",
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
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/topics/add-topic`,
          { objects: [topicInputs, sendingBook, subTopicInputs] },
          {
            withCredentials: true,
          }
        );
        Store.addNotification({
          title: "Successfull!",
          message: "Topics & Lessons are successfully added.",
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
        setEntering(0);
        setTimeout(() => {
          props.showState(1,"reload");
        }, 700);
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
      setLoading(false);
    }
  };

  const selectedBook = (selectedValue) => {
    setSendingBook(selectedValue);
  };

  const selectedSubTopic = (subtopics) => {
    setSubTopicInputs(subtopics);
  };

  return (
    <>
      <div
        className={
          "active popup-outer z-10 fos-animate-me" +
          (entering == 1 ? " bounceIn delay-0_1" : " bounceOut delay-0_1")
        }
      >
        <div className="popup-box -mt-[160px] min-h-[365px]">
          <i
            id="close"
            className="fa fa-close close"
            onClick={() => {
              setEntering(0);
              setTimeout(() => {
                props.showState(1);
              }, 700);
            }}
          ></i>
          <div className="flex mb-[20px] items-center fos-animate-me fadeIn delay-0_1">
            <img
              className="mt-[2px] !h-[50px] !w-[50px] object-cover !rounded-[0]"
              src={icon_add}
              alt=""
            />
            <div className="ml-2 text-adds">
              <span className="text-[20px] name font-[700]">Add Topic</span>
              <div className="text-[12px] font-[500] -mt-[4px] profession">
                Don't miss subtopics
              </div>
            </div>
          </div>
          <span className="text-red-600">{err}</span>
          {loading ? (
            <>
              <div className="loadingIcon flex justify-center pt-[85px]">
                <LargeLoading />
              </div>
            </>
          ) : (
            <div className="fos-animate-me fadeIn delay-0_1">
              <input
                type="text"
                name="tname"
                onChange={topicHandleChange}
                placeholder="Enter Title of the Topic"
                className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
              />
              <BooksFetch selectedBook={selectedBook} />
              <SetSubTopics selectedSubTopic={selectedSubTopic} />

              <div className="button">
                <button
                  id="close"
                  className="cancel bg-[#f082ac] hover:bg-[#ec5f95] h-fit leading-[1] !py-[9px] !px-[15px]"
                  onClick={(e) => {
                    e.preventDefault();
                    setEntering(0);
                    setTimeout(() => {
                      props.showState(1);
                    }, 700);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addTopic}
                  className="send bg-[#6f93f6] hover:bg-[#275df1] h-fit leading-[1] !py-[9px] !px-[15px]"
                >
                  Add Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddTopic;
