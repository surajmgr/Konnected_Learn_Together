import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";

function ResetPassword() {
  const navigate = useNavigate();
  const token = useLocation().search;
  const { currentUser } = useContext(AuthContext);

  const [err, setError] = useState(null);

  const [suc, setSuc] = useState(null);

  const [state, setState] = useState(null);

  const [inputs, setInputRS] = useState({
    email: "",
    code: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputRS((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(inputs);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (inputs.email !== "") {
      try {
        const res = await axios.post("/auth/reset-password", inputs, {
          withCredentials: true,
        });
        setState(res.data);
        Store.addNotification({
          title: "Check your mail for reset code.",
          message: "",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
        setError("");
      } catch (error) {
        Store.addNotification({
          title: "Warning!",
          message: error.response.data,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      }
    } else {
      Store.addNotification({
        title: "Warning!",
        message: "Please enter the email!",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (inputs.email !== "") {
      if (inputs.code.length === 4) {
        if (inputs.password.length >= 8) {
          try {
            const res = await axios.post(`/auth/reset-password`, inputs, {
              withCredentials: true,
            });
            setSuc(res.data);
            Store.addNotification({
              title: "Password Changed",
              message: "",
              type: "success",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 3000,
                showIcon: true,
              },
            });
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
                showIcon: true,
              },
            });
          }
        } else {
          Store.addNotification({
            title: "Warning!",
            message: "Password should be of 8 or more characters!",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 3000,
              showIcon: true,
            },
          });
        }
      } else {
        Store.addNotification({
          title: "Warning!",
          message: "Please enter the four digit reset code!",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      }
    } else {
      Store.addNotification({
        title: "Warning!",
        message: "Please enter the email!",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          showIcon: true,
        },
      });
    }
  };

  return (
    <>
      <>
        <section class="bg-gray-50 h-screen flex items-center justify-around">
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
            <div class="w-full bg-white rounded-lg shadow md:mt-0 w-[400px] xl:p-0 fos-animate-me bounceIn delay-0_3">
              <i
                onClick={() => navigate("/")}
                className="close fa fa-close float-right p-[10px] cursor-pointer"
              ></i>
              <div class="p-6 space-y-5 sm:p-8">
                {suc ? (
                  <>
                    <p class="text-sm font-light text-gray-500">
                      Password has been changed.{" "}
                      <Link
                        to="/login"
                        state={state}
                        class="font-medium text-[#2663eb] hover:underline"
                      >
                        Redirect to Sign in
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                      Account Recovery
                    </h1>
                    <span className="pb-[15px]">
                      {state ? (
                        <span className="text-green-700">
                          Reset Code has been Sent.
                        </span>
                      ) : (
                        "Change your password"
                      )}
                      <br />
                    </span>

                    <form class="space-y-4" action="#">
                      <div>
                        <label
                          for="email"
                          class="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Your email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                          onChange={handleChange}
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none w-full focus:border-[#2663eb] block p-2.5"
                          placeholder="name@company.com"
                          required=""
                        />
                      </div>
                      {state && (
                        <>
                          <div>
                            <label
                              for="code"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Reset code
                            </label>
                            <input
                              type="password"
                              name="code"
                              id="code"
                              onChange={handleChange}
                              placeholder="••••••••"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#2663eb] block w-full p-2.5"
                              required=""
                            />
                          </div>
                          <div>
                            <label
                              for="password"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              New Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              onChange={handleChange}
                              placeholder="••••••••"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#2663eb] block w-full p-2.5"
                              required=""
                            />
                          </div>
                        </>
                      )}
                      <button
                        type="submit"
                        onClick={state ? handleResetSubmit : handleUserSubmit}
                        class="w-full text-white bg-[#2663eb] hover:bg-[#2663eb] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        {state ? "Reset Password" : "Forgot Password"}
                      </button>
                      <p class="text-sm font-light text-gray-500">
                        Remembered your password?{" "}
                        <Link
                          to="/login"
                          state={state}
                          class="font-medium text-[#2663eb] hover:underline"
                        >
                          Sign in
                        </Link>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default ResetPassword;
