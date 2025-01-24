import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./tick.css";

function BookVerified() {
  const navigate = useNavigate();
  const token = useLocation().search;
  const [suc, setSuc] = useState(null);

  useEffect(async () => {
    try {
      const res = await axios.post(`books/server-verify-book/1${token}`,token,{
        withCredentials: true,
      });
      setSuc(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="h-[100vh]">
      {suc ?
      <div className="success-tick-container">
        <div id="card" className="animated fadeIn shadow">
          <div id="upper-side">
            <svg
              className="checkmark"
              id="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            <h3 id="status">Success</h3>
          </div>
          <div id="lower-side">
            <p id="message">
              Congratulations, the book with book id: <b>0x00kEd-43</b> has been
              verified and will be live in the site from now on.
            </p>
            <a href="/books" id="contBtn">
              Return Home
            </a>
          </div>
        </div>
      </div>
      :
      <div className="flex justify-between items-center">
        <span>Loading...</span>
      </div>
    }
    </div>
  );
}

export default BookVerified;
