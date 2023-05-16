import React, { useRef, useState } from "react";
import TextSelector from "./get-selected-text.js";
import "./explainGPT.css";
import LargeLoading from "../utils/largeLoading.jsx";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../utils/authContext.js";

// React Notifications
import { Store } from "react-notifications-component";

const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content: "",
};

function ExplainGPT(props) {
  const { currentUser} = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GPT! Ask me anything!",
      sentTime: "just now",
      sender: "GPT",
    },
  ]);
  const API_KEY = (currentUser) ? ((currentUser.gpt !== "" && currentUser.gpt ) ? currentUser.gpt : process.env.REACT_APP_GPT) : process.env.REACT_APP_GPT;

  const [info, setInfo] = useState({});
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  const [isTyping, setIsTyping] = useState(false);
  const [popRes, setPopRes] = useState(0);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToGPT(newMessages);
  };

  async function processMessageToGPT(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "GPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages,
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.error) {
          Store.addNotification({
            title: "Error!",
            message: data.error.code,
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
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "GPT",
          },
        ]);
        setInfo({ content: data.choices[0].message.content });
        setIndex(0);
        setIsTyping(false);
      }).catch((error,data) => {
        Store.addNotification({
          title: "Error!",
          message: data,
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
      });
  }

  const markHandler = (html, text) => {
    console.log("text 🦄", text);
  };

  const copyText = (html, text) => {
    navigator.clipboard.writeText(text);
  };

  const searchGoogle = (html, text) => {
    const searchUrl =
      "https://www.google.com/search?q=" + text.replaceAll(" ", "+");
    window.open(searchUrl, "_blank", "rel=noopener noreferrer");
  };

  const elaborateEng = (html, text) => {
    setText("");
    setPopRes(1);
    systemMessage.content =
      "Act as an educator who can explain anything in simple way so as even a ten year old can understand. Takes topic, subtopic and sentence as input and replies in english.";
    handleSend(
      `In the topic '${props.topicinfo.topic}' and subtopic '${props.topicinfo.subtopic}', explain the meaning of sentence: ` +
        text
    );
  };

  const elaborateNep = (html, text) => {
    setText("")
    setPopRes(1);
    systemMessage.content =
      "Act as a nepali educator who can explain anything in simple way so as even a ten year old can understand, but only in nepali. Takes topic, subtopic and sentence as input and replies in nepali.";
    handleSend(
      `In the topic '${props.topicinfo.topic}' and subtopic '${props.topicinfo.subtopic}', explain the meaning of sentence: ` +
        text
    );
  };

  const removeMessages = () => {
    setText("");
    setMessages([
      {
        message: "Hello, I'm GPT! Ask me anything!",
        sentTime: "just now",
        sender: "GPT",
      },
    ]);
    setPopRes(0);
  };

  useEffect(() => {
    if(!isTyping && info.content){
      if (index < info.content.length) {
        setTimeout(() => {
          setText(text + info.content[index]);
          setIndex(index + 1);
        }, 30);
      }
    }
  }, [info.content, isTyping, index]);

  return (
    <>
      <TextSelector
        events={[
          {
            text: "Copy",
            handler: copyText,
          },
          {
            text: "Search google",
            handler: searchGoogle,
          },
          {
            text: "Highlight text",
            handler: markHandler,
          },
          {
            text: "Elaborate in eng",
            handler: elaborateEng,
          },
          {
            text: "नेपालीमा व्याख्या गर्नुहोस्",
            handler: elaborateNep,
          },
        ]}
        color={"yellow"}
        colorText={true}
        unmark={true}
        unmarkText="Remove"
      />
      <div
        class={
          popRes == 1
            ? "active popup-outer top-[20px] z-10"
            : "popup-outer z-10"
        }
      >
        <div className="popup-box min-h-[290px] max-h-[400px] max-w-[500px]">
          <i
            id="close"
            className="fa fa-close close"
            onClick={() => setPopRes(0)}
          ></i>
          <div className="warning-heading-text border-b">Brief Explaination</div>
          <div className="warning-body-text text-sm border-2 rounded-lg overflow-y-scroll overflow-x-scroll min-h-[150px] max-h-[250px] p-[15px]">
            {isTyping ? <div className="mt-[30px]"><LargeLoading /></div> : text}
          </div>
          <div className="button">
            <button
              onClick={removeMessages}
              className="send mt-[12px] bg-[#f082ac] hover:bg-[#ec5f95]"
            >
              Delete History
            </button>
            <button
              id="close"
              className="cancel mt-[12px] bg-[#6f93f6] hover:bg-[#275df1]"
              onClick={(e) => setPopRes(0)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ExplainGPT;
