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
      const res = await axios.get(`/auth/activate-account${token}`);
      setSuc(res.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <>
      {token ? (
        <div>
          {err && <p className="text-xl text-center text-red-700">{err}</p>}
          {suc ? (
            <>
              <p class="text-xl text-center text-blue-700">{suc}</p>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
