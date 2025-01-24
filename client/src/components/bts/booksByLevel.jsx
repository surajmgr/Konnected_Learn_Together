import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import Breadcrum from "../utils/breadcrum";
import { AuthContext } from "../utils/authContext";
import add from "../../static/add.png";
import AddBook from "../addPops/addBook";

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

function BooksByLevel() {
  const [books, setBooks] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [levels, setLevels] = useState([]);
  const [showAdd, setShowAdd] = useState(1);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [limit, setLimit] = useState(15);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const sl_name = location.pathname.split("/")[2];

  useEffect(() => {
    currentPage.current = 1;
    getPaginatedBooks();
  }, [sl_name]);

  function handlePageClick(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    getPaginatedBooks();
  }

  async function getPaginatedBooks() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/books/${sl_name}?page=${currentPage.current}&limit=${limit}`
      );
      setPageCount(res.data.pageCount);
      setBooks(res.data.result);
      setLevels(res.data.result);
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
      <Breadcrum path="Text Books" />
      <section className="course-content mb-[25px]">
        <div className="max-w-[986px] w-full mx-auto px-[4rem] textbooks_title__vCKfs">
          <div className="list-heading">
            <div className="flex justify-between">
              Text Books{" "}
              <div className="col-lg-6">
                <div className="show-filter add-course-info">
                  <form action="#">
                    <div className="row gx-2 items-center">
                      <div className="col-md-6 col-item"></div>
                      <div className="col-md-6 col-lg-6 col-item">
                        <div className=" search-group">
                          <i
                            className="fa fa-search feather-search pl-[3px]"
                            aria-hidden="true"
                          ></i>
                          <input
                            type="text"
                            className="form-control focus:outline-none focus:border-[#2e9efb]"
                            placeholder="Search for books"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="level-rec mt-2">
              <button
                type="button"
                className="text-white bg-[#259efb] font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                {books[0]?.lname}
              </button>
              <button
                type="button"
                onClick={() => navigate("/books/grade-1")}
                className="text-black bg-[#f3f3f3] font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Junior Class: One
              </button>
              <button
                type="button"
                onClick={() => navigate("/books/grade-5")}
                className="text-black bg-[#f3f3f3] font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Middle Class: Five
              </button>
              <button
                type="button"
                onClick={() => navigate("/books/grade-12-science")}
                className="text-black bg-[#f3f3f3] font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Grade 12 Science
              </button>
            </div>
          </div>
          {loading ? (
            <div className="my-[250px] pt-[50px]">
              <LargeLoading />
            </div>
          ) : (
            <div className="books-container my-2">
              <div className="grid grid-cols-5 gap-[40px] py-[15px]">
                {getUnique(books, "bid").map((book, index) => (
                  <Link
                    to={`/book/${book.s_name}/${book.bid}`}
                    className={"transform transition duration-500 hover:scale-[1.025] fos-animate-me fadeIn delay-0_" + (index+1)}
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
                        <div className="book-subtitle">Author: {book.author}</div>
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
          )}
          {showAdd == 0 && <AddBook showState={showState} />}
          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              onChange={handlePageClick}
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
                  onClick={() => {
                    if (currentUser) {
                      showState(0);
                    } else {
                      loginWarning();
                    }
                  }}
                  className="text-[#249efb] cursor-pointer p-[12px]"
                >
                  Add your book
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BooksByLevel;
