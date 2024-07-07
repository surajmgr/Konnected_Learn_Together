import React, { useContext, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../utils/authContext";
import axios from "axios";
import moment from "moment";
import "./createNote.css";
import LargeLoading from "../utils/largeLoading";
import { Store } from "react-notifications-component";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import ImageResize from "quill-image-resize-module-react";
import { ImageDrop } from "quill-image-drop-module";

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDrop", ImageDrop);

CreateNote.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "align"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

function CreateNote() {
  const state = useLocation().state;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [offline, isOffline] = useState(false);
  const [locked, setLocked] = useState(state?.is_locked || false);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const [content, setContent] = useState(state?.body || "");
  const [title, setTitle] = useState(state?.nname || "");
  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const subtopic_id = location.pathname.split("/")[3];
  const sst_name = location.pathname.split("/")[2];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (title.length < 3 || title.length > 500) {
        Store.addNotification({
          title: "Length Error!",
          message: "Title must be between 3 and 500 characters.",
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
      } else if (content.length < 100) {
        Store.addNotification({
          title: "Length Error!",
          message: "Content must be of 100 or more characters.",
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
        setLoading(true);
        const res = state
          ? await axios.put(
              `${process.env.REACT_APP_API_BASE_URL}/cnote/${state.nid}`,
              {
                title,
                content,
                subtopic: subtopic_id,
                uid: currentUser.id,
                isLocked: locked,
              }
            )
          : await axios.post(`${process.env.REACT_APP_API_BASE_URL}/cnote/`, {
              title,
              content,
              subtopic: subtopic_id,
              uid: currentUser.id,
              date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              isLocked: locked,
            });
        setLoading(false);
        navigate(-1);
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
          onScreen: true,
          showIcon: true,
        },
      });
      setLoading(false);
    }
  };

  const failedTinyMCE = (e) => {
    isOffline(true);
    Store.addNotification({
      title: "Connection failed!",
      message: "Loading offline editor...",
      type: "warning",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        showIcon: true,
      },
    });
    setLoading(false);
  };

  return (
    <>
      {!currentUser ? (
        <>{() => navigate(-1)}</>
      ) : (
        <section className="createNote min-h-[500px]">
          <>
            {loading ? (
              <div className="mt-[250px] pt-[50px]">
                <LargeLoading />
              </div>
            ) : (
              <div className="heading-container flex justify-between mt-[4rem]">
                <div className="title-container mx-auto w-[840px] my-[28px]">
                  <div className="title-wrapper min-h-[50px] flex justify-between">
                    <h1 className="title-input-container min-h-[50px] text-[28px] font-[600] w-[760px]">
                      <input
                        className="border-orange-500 px-1 py-2 rounded w-full !border-none focus:outline-none placeholder:text-[#999]"
                        placeholder="Add Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      ></input>
                    </h1>
                    <div className="status-code-container flex justify-between items-center my-auto ml-[16px] absolute top-30 -right-3">
                      <button
                        onClick={() => setLocked(!locked)}
                        className="text-gray-900 border border-gray-300 focus:outline-none hover:text-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                        style={{
                          backgroundColor: locked ? "#fff54a" : "#f0f0f0"
                        }}
                      >
                        $
                      </button>
                    </div>
                    <div className="status-code-container flex justify-between items-center my-auto ml-[16px]">
                      <button
                        onClick={handleSubmit}
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:text-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                      >
                        {state ? "Update" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className={
                (loading || offline ? "hidden " : "") +
                "editor-container w-[900px] flex justify-around mx-auto min-h-[550px] overflow-hidden"
              }
            >
              <Editor
                apiKey={
                  currentUser
                    ? currentUser.tinymce != ""
                      ? currentUser.tinymce
                      : "2tud8euab7unk3ls7fzkmjr5v6jorty07irnabk7kio9mtob"
                    : "2tud8euab7unk3ls7fzkmjr5v6jorty07irnabk7kio9mtob"
                }
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setLoading(false);
                }}
                onScriptsLoadError={failedTinyMCE}
                onModelLoadError={failedTinyMCE}
                onerror
                init={{
                  menubar: false,
                  width: 840,
                  height: 570,
                  placeholder: "Type / paste pre-formatted text",
                  resize: false,
                  branding: false,
                  skin: "snow",
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "code",
                    "codesample",
                  ],
                  toolbar:
                    "blocks | " +
                    "bold italic forecolor | image | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist | " +
                    "codesample code preview | outdent indent | removeformat undo redo | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  toolbar_mode: "sliding",
                  images_upload_url: `${process.env.REACT_APP_API_BASE_URL}/upload`,
                  images_upload_base_path: "",
                  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                  content_style: `
            body {
              background: #fff;
              max-width: 840px;
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

            {offline && (
              <div
                className={
                  (loading ? "hidden " : "") +
                  "react-quill editor-container w-[840px] flex justify-around mx-auto min-h-[550px]"
                }
              >
                <div className="w-full">
                  <ReactQuill
                    placeholder="Type / paste pre-formatted text"
                    modules={CreateNote.modules}
                    theme="snow"
                    value={content}
                    onChange={handleEditorChange}
                  />
                </div>
              </div>
            )}
          </>
        </section>
      )}
    </>
  );
}

export default CreateNote;
