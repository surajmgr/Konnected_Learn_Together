import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import logoCut from "../../static/logo-cut.png";

// React Notification
import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";

const onValidUsername = (val) => {
  const usernameRegex = /^[a-z0-9_.]+$/;
  return usernameRegex.test(val);
};

function Login() {
  const state = useLocation().state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    if (e.target.name == "username") {
      if (!onValidUsername(e.target.value) && e.target.value !== "") {
        Store.addNotification({
          title: "Invalid Character!",
          message: "",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      } else {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputs.name.length < 3 || inputs.name.length > 255) {
        Store.addNotification({
          title: "Length Error!",
          message: "Name must be between 3 and 255 characters.",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      } else if (inputs.username.length < 3 || inputs.username.length > 30) {
        Store.addNotification({
          title: "Length Error!",
          message: "Username must be between 3 and 30 characters.",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      } else if (inputs.email.length == 0) {
        Store.addNotification({
          title: "Length Error!",
          message: "Email shouldn't be empty",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      } else if (inputs.password.length < 8) {
        Store.addNotification({
          title: "Length Error!",
          message: "Password must be of 8 or more characters.",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });
      } else {
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, inputs, { withCredentials: true });
        setLoading(false);
        navigate("/login", { state });
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
      {currentUser ? (
        <>{(window.location.href = "/")}</>
      ) : (
        <>
          <section className="bg-gray-50 h-screen flex items-center justify-around">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
              <div className="bg-white rounded-lg shadow md:mt-0 w-[400px] xl:p-0 fos-animate-me bounceIn delay-0_3">
                <i
                  onClick={() => (state ? navigate(state.path) : navigate("/"))}
                  className="close fa fa-close float-right p-[10px] cursor-pointer"
                ></i>
                {loading ? (
                  <div className="large-loading my-[180px]">
                    <LargeLoading />
                  </div>
                ) : (
                  <div className="p-6 space-y-5 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                      Create an account
                    </h1>
                    <span className="pb-[15px]">
                      Join the community
                      <br />
                    </span>

                    <form className="space-y-4" action="#">
                      <div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none w-full focus:border-[#2663eb] block p-2.5"
                          placeholder="Full name"
                          required=""
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          onChange={handleChange}
                          value={inputs.username}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none w-full focus:border-[#2663eb] block p-2.5"
                          placeholder="username"
                          required=""
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none w-full focus:border-[#2663eb] block p-2.5"
                          placeholder="name@company.com"
                          required=""
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-[#2663eb] block w-full p-2.5"
                          required=""
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-light text-gray-500">
                          By clicking sign up, I will agree to all terms of kEd.
                        </p>
                      </div>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full text-white bg-[#2663eb] hover:bg-[#2663eb] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Sign up
                      </button>
                      <p className="text-sm font-light text-gray-500">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          state={state}
                          className="font-medium text-[#2663eb] hover:underline"
                        >
                          Sign in
                        </Link>
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Login;
