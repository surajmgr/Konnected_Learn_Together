import React, { useContext, useEffect, useRef, useState } from "react";
import "./popup.css";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LevelsFetch from "./levelsFetch";
import icon_add from "../../static/icon-add.png";

// React Notification
import { Store } from "react-notifications-component";
import Loading from "../utils/loading";
import { AuthContext } from "../utils/authContext";
import LargeLoading from "../utils/largeLoading";

function AddBook(props) {
  const { currentUser } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [file, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState(null);
  const hiddenFileInput = useRef(null);
  const [entering, setEntering] = useState(1);

  const navigate = useNavigate();

  const [sendingLevel, setSendingLevel] = useState({});
  const [bookInputs, setBookInputs] = useState({
    bname: "",
    bdescription: "",
    bauthor: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    setBookInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.name);
    console.log(bookInputs);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/books/upload-cover", formData);
      const path = res.data;
      return path;
    } catch (error) {
      console.log(error.message);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      console.log(sendingLevel);
      console.log(bookInputs);
      if (bookInputs.bname.length < 5 || bookInputs.bname.length > 40) {
        Store.addNotification({
          title: "Length Error!",
          message: "Book's name must be between 5 and 40 characters.",
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
      } else if (
        bookInputs.bdescription.length < 100 ||
        bookInputs.bdescription.length > 550
      ) {
        Store.addNotification({
          title: "Length Error!",
          message: "Description must be between 100 and 550 characters.",
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
      } else if (Object.keys(sendingLevel).length == 0) {
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
      } else if (
        bookInputs.bauthor.length < 3 ||
        bookInputs.bauthor.length > 50
      ) {
        Store.addNotification({
          title: "Length Error!",
          message: "Author's name must be between 3 and 50 characters.",
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
      } else if (!file) {
        Store.addNotification({
          title: "Upload Error!",
          message: "Cover image needed to add a book.",
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
        const fileUrl = async (imgUrl) => {
          const res = await axios.post(
            "/books/add-book",
            {
              objects: [bookInputs, sendingLevel],
              coverImg: file ? imgUrl : "",
              date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              uid: currentUser ? currentUser.id : 1,
            },
            {
              withCredentials: true,
            }
          );
          Store.addNotification({
            title: "Successfull!",
            message:
              "Book has been pushed for request. Please wait at least 24hrs for approval.",
            type: "success",
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
          setEntering(0);
          setTimeout(() => {
            props.showState(1);
          }, 700);
        };

        upload()
          .then((data) => {
            console.log(data);
            fileUrl(data);
          })
          .catch((err) => console.log(err.message));
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
    }
  };

  const selectedLevel = (selectedValue) => {
    setSendingLevel(selectedValue);
  };

  return (
    <>
      <div
        className={
          "active popup-outer z-10 !fixed fos-animate-me" +
          (entering == 1 ? " bounceIn delay-0_1" : " bounceOut delay-0_1")
        }
      >
        <div class="popup-box -mt-[200px] min-h-[531px]">
          <i
            id="close"
            class="fa fa-close close"
            onClick={() => {
              setEntering(0);
              setTimeout(() => {
                props.showState(1);
              }, 700);
            }}
          ></i>
          <div class="flex mb-[20px] items-center">
            <img
              className="mt-[2px] !h-[50px] !w-[50px] object-cover !rounded-[0]"
              src={icon_add}
              alt=""
            />
            <div class="ml-2 -mt-[4px] text-adds">
              <span class="text-[20px] name font-[700]">Add Your Book</span>
              <div class="text-[12px] font-[500] -mt-[4px] profession leading-[1]">
                Book needs 24hrs to verify.
              </div>
            </div>
          </div>
          <span className="text-red-600">{err}</span>
          {loading ? (
            <>
              <div className="loadingIcon flex justify-center pt-[150px]">
                <LargeLoading />
              </div>
            </>
          ) : (
            <div className="fos-animate-me fadeIn delay-0_1">
              <input
                type="text"
                name="bname"
                onChange={handleChange}
                value={bookInputs.bname}
                placeholder="Enter Title of the Book"
                className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
              />
              <div className="fileUpload cursor-pointer" onClick={handleClick}>
                <div className="uploadRef flex justify-between text-sm block my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500">
                  <div className="up-left px-4 py-2 text-[#9ea4b0] max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {file ? file.name : "Choose a cover photo..."}
                  </div>
                  <div className="up-right px-4 py-2 bg-[#6f94f6] text-white rounded-md">
                    Browse
                  </div>
                </div>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={(e) => setCover(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {/* <input
                type="file"
                id="file"
                name=""
                className="!block px-4 py-2 w-full text-sm text-gray-900 border bg-[#f3f3f3] border rounded-md cursor-pointer bg-gray-50"
                onChange={(e) => setCover(e.target.files[0])}
              /> */}
              <div class="textarea-w-count relative">
                <textarea
                  name="bdescription"
                  onChange={handleChange}
                  value={bookInputs.bdescription}
                  placeholder="Enter description of the Book"
                  className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
                />
                <span class="char-count leading-[1] p-1 bg-[#f3f3f3] border-t border-l rounded">
                  {bookInputs.bdescription.length} / 550 Characters
                </span>
              </div>
              <LevelsFetch selectedLevel={selectedLevel} />

              <input
                type="text"
                name="bauthor"
                onChange={handleChange}
                value={bookInputs.bauthor}
                placeholder="Enter the name of author"
                className="text-sm block px-4 py-2 my-3 w-full mt-2 bg-[#f3f3f3] border rounded-md focus:border-blue-500"
              />

              <div class="button">
                <button
                  id="close"
                  class="cancel bg-[#f082ac] hover:bg-[#ec5f95] h-fit leading-[1] !py-[9px] !px-[15px]"
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
                  onClick={addBook}
                  class="send bg-[#6f93f6] hover:bg-[#275df1] h-fit leading-[1] !py-[9px] !px-[15px]"
                >
                  Add Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddBook;
