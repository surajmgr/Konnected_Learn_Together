import React, { useContext, useEffect, useRef, useState } from "react";
import "./popup.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import moment from "moment";
import icon_add from "../../static/icon-add.png";
import "./inlineEditor.css";

// React Notification
import { Store } from "react-notifications-component";
import Loading from "../utils/loading";
import { AuthContext } from "../utils/authContext";
import LargeLoading from "../utils/largeLoading";

function AddAnswer(props) {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [entering, setEntering] = useState(1);
  const editorRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const qid = location.pathname.split("/")[3];
  const sq_name = location.pathname.split("/")[2];

  const [content, setContent] = useState(
    props.answer_info ? props.answer_info.body : ""
  );
  const [title, setTitle] = useState(
    props.answer_info ? props.answer_info.title : ""
  );

  useEffect(() => {}, []);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (content.length < 11) {
        Store.addNotification({
          title: "Length Error!",
          message: "Content is too short.",
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
        const res = props.answer_info
          ? await axios.put(`${process.env.REACT_APP_API_BASE_URL}/dbquestion/answer/${props.answer_info.aid}`, {
              content,
              question: qid,
              uid: currentUser.id,
              sq_name: sq_name,
            })
          : await axios.post(`${process.env.REACT_APP_API_BASE_URL}/dbquestion/answer`, {
              content,
              question: qid,
              uid: currentUser.id,
              sq_name: sq_name,
              date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            });
        setEntering(0);
        setTimeout(() => {
          props.showState(1, "reload");
        }, 700);
      }
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

  return (
    <>
      <div
        className={
          "active popup-outer z-10 fos-animate-me" +
          (entering == 1 ? " bounceIn delay-0_1" : " bounceOut delay-0_1")
        }
      >
        <div className="popup-box -mt-[160px] min-h-[429px]">
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
          <div className="flex mb-[20px] items-center">
            <img
              className="mt-[2px] !h-[50px] !w-[50px] object-cover !rounded-[0]"
              src={icon_add}
              alt=""
            />
            <div className="ml-2 text-adds leading-[21px]">
              <span className="text-[20px] name font-[700]">Answer Question</span>
              <div className="text-[12px] font-[500] -mt-[4px] profession">
                Spam can lead to ban
              </div>
            </div>
          </div>
          {loading && (
            <>
              <div className="loadingIcon flex justify-center pt-[100px]">
                <LargeLoading />
              </div>
            </>
          )}
          <>
            <div
              className={
                loading
                  ? "tiny-editor-container hidden"
                  : "tiny-editor-container fos-animate-me fadeIn delay-0_1"
              }
            >
              <Editor
                apiKey={
                  currentUser.tinymce != ""
                    ? currentUser.tinymce
                    : "2tud8euab7unk3ls7fzkmjr5v6jorty07irnabk7kio9mtob"
                }
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setLoading(false);
                  console.log("Initialized!");
                }}
                init={{
                  height: 250,
                  menubar: false,
                  resize: false,
                  branding: false,
                  placeholder: `Enable fullscreen for ease...`,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "fullscreen",
                    "media",
                    "table",
                    "wordcount",
                    "code",
                    "codesample",
                  ],
                  toolbar:
                    "bold italic forecolor | image codesample | alignleft aligncenter " +
                    "alignright alignjustify bullist numlist indent | " +
                    "removeformat code fullscreen",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  toolbar_mode: "sliding",
                  images_upload_url: `${process.env.REACT_APP_API_BASE_URL}/upload`,
                  images_upload_base_path: "",
                  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                  content_style: `
                    body {
                      background: #fff;
                    }
            
                    body p{
                      margin-top: 5px;
                      margin-bottom: 5px;
                      line-height: 19px;
                    }

                    code {
                      background-color: #272822 !important;
                      color: #f8f8f2 !important;
                      border-radius: 0.3rem !important;
                      padding: 4px 5px 5px !important;
                      white-space: nowrap !important;
                    }
                    
                    pre code {
                      white-space: inherit !important;
                    }
                    
                    pre {
                      background-color: #272822 !important;
                      padding: 5px !important;
                      border-radius: 0.3em !important;
                      color: #f8f8f2 !important;
                    }
                    `,
                }}
                value={content}
                onEditorChange={handleEditorChange}
              />
            </div>
            {!loading && (
              <div className="button fos-animate-me fadeIn delay-0_1">
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
                  onClick={handleSubmit}
                  className="send bg-[#6f93f6] hover:bg-[#275df1] h-fit leading-[1] !py-[9px] !px-[15px]"
                >
                  {props.answer_info ? "Edit Answer" : "Add Answer"}
                </button>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
}

export default AddAnswer;
