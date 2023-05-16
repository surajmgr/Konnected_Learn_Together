import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ActivateAccount() {
  const navigate = useNavigate();
  const token = useLocation().search;

  const [err, setError] = useState(null);

  const [suc, setSuc] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/activate-account${token}`);
      setSuc(res.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <>
      {token ? (
        <div className="h-[100vh] w-full flex items-center justify-around">
          {err && <p className="text-xl text-center text-red-700">{err}</p>}
          {suc ? (
            <>
              <div className="success-tick-container -mt-[200px]">
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
                      Congratulations. Your account has been activated and from now on you can access to all the benefits of KonnectEd.
                    </p>
                    <a href="/login" id="contBtn">
                Login
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Activate Account
            </button>
          )}
        </div>
      ) : (
        <div>Access Denied!</div>
      )}
    </>
  );
}

export default ActivateAccount;
