import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import { Pagination } from "@mui/material";
import Breadcrum from "../utils/breadcrum";
import "./levels.css";
import LargeLoading from "../utils/largeLoading";

// React Notification
import { Store } from "react-notifications-component";

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

function Levels() {
  const { currentUser } = useContext(AuthContext);
  const [levels, setlevels] = useState([]);
  const [total, setTotal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  let search;

  // Pagination
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const colors = [
    "#2e9efb",
    "#c47ae0",
    "#fac865",
    "#76e199",
    "#ff627b",
    "#4edfe2",
    "#fd6f6f",
  ];
  const randomColor = "!text-[#fdae40]";

  useEffect(() => {
    currentPage.current = 1;
    getPaginatedlevels();
  }, []);

  function handlePageClick(e, page) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentPage.current = page;
    getPaginatedlevels();
  }

  async function getPaginatedlevels() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/levels${
          search ? search + "&" : "?"
        }page=${currentPage.current}&limit=${limit}`
      );
      setPageCount(res.data.pageCount);
      setlevels(res.data.result);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed");
      // window.location.href = `/levels?query=${searchTerm}`;
      // navigate(`/levels?query=${searchTerm}`)
      search = `?query=${searchTerm}`;
      getPaginatedlevels();
    }
  };

  return (
    <>
      <Breadcrum path="All levels" />
      <section className="levelInf">
        <div className="max-w-[986px] w-full mx-auto px-[4rem] textlevels_title__vCKfs">
          <div className="title-heading">
            <div className="flex justify-between">
              <div className="title-heading-name">All levels</div>
              <div className="col-lg-6">
                <div className="show-filter add-level-info">
                  <form action="#">
                    <div className="row gx-2 items-center">
                      <div className="col-md-6 col-item"></div>
                      <div className="col-md-6 col-lg-6 col-item">
                        <div className=" search-group">
                          <i
                            className={
                              "fa fa-search feather-search pl-[3px] " +
                              randomColor
                            }
                            aria-hidden="true"
                          ></i>
                          <input
                            type="text"
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            value={searchTerm}
                            className="form-control focus:outline-none focus:border-[#fdae40]"
                            placeholder="Search for levels"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="horizontal-info fos-animate-me fadeIn delay-0_1">
            <div className="flex items-center justify-start flex-wrap">
              <span>{total} levels are here</span>
            </div>
          </div>
          {loading ? (
            <div className="my-[250px] pt-[50px]">
              <LargeLoading />
            </div>
          ) : (
            <div className="tp-container min-h-[450px] mt-[30px]">
              <div className="card-body p-0">
                <ul className="flex flex-wrap">
                  {getUnique(levels, "id").map((level, index) => (
                    <div
                      className={
                        "w-full mb-[16px] pb-[16px] flex ch-list-item transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                        (index + 1)
                      }
                    >
                      <div className={"ch-index " + "!text-[#76e199]"}>
                        {index == 9
                          ? `${currentPage.current + "0"}`
                          : `${parseInt(currentPage.current) - 1}` +
                            `${index + 1}`}
                      </div>
                      <div className="ch-details">
                        <Link to={`/books/${level.sl_name}`}>
                          <h2 className="ch-name">{level.name}</h2>
                        </Link>
                        <div className="ch-meta justify-between">
                          <div className="ch-meta-item flex text-[#fdae40] pt-[10px]">
                            <span>
                              {level?.count == 1
                                ? "1 Book"
                                : level?.count + " Books"}
                            </span>
                          </div>
                          <div
                            className={
                              "ch-meta-item flex view-info items-center flex text-[14px] leading-[19px] " +
                              "!text-[#76e199]"
                            }
                          >
                            <Link to={`/level/${level.st_name}/${level.tid}`}>
                              <span>View books</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          onChange={handlePageClick}
          color="primary"
          className="justify-center flex mb-5 fos-animate-me fadeIn delay-0_10"
        />
      )}
    </>
  );
}

export default Levels;
