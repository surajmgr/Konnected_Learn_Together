import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";

import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";

function Login() {
  const navigate = useNavigate();
  const state = useLocation().state;
  const [loading, setLoading] = useState(false);
  const { currentUser, login } = useContext(AuthContext);

  console.log("State!");
  console.log(state);

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [err, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputs.username.length == 0 || inputs.password.length == 0) {
        Store.addNotification({
          title: "Length Error!",
          message: "Username or Password is empty.",
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
        await login(inputs);
        setLoading(false);
        if(state){
          navigate(state.path);
        } else {
        navigate("/");
      }
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

  return (
    <>
      {currentUser ? (
        <>{(window.location.href = "/")}</>
      ) : (
        <>
          <section className="bg-gray-50 h-screen flex items-center justify-around">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
              <div className="bg-white rounded-lg shadow md:mt-0 w-[400px] xl:p-0 fos-animate-me bounceIn delay-0_3">
                <i onClick={() => (state) ? navigate(state.path) : navigate("/")} className="close fa fa-close float-right p-[10px] cursor-pointer"></i>
                {loading ? 
                <div className="large-loading my-[180px]">
                <LargeLoading />
                </div>
                :
                <div className="p-6 space-y-5 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Sign in to your account
                  </h1>

                  <form className="space-y-4" action="#">
                    <div>
                      <label
                        for="username"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Username
                      </label>
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
                      <label
                        for="password"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Password
                      </label>
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
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                            required=""
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label for="remember" className="text-gray-500">
                            Remember me
                          </label>
                        </div>
                      </div>
                      <Link
                        to="/auth/reset-password"
                        className="text-sm font-medium text-[#2663eb] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="w-full text-white bg-[#2663eb] hover:bg-[#2663eb] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Sign in
                    </button>
                    <p className="text-sm font-light text-gray-500">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        state={state}
                        className="font-medium text-[#2663eb] hover:underline"
                      >
                        Sign up
                      </Link>
                    </p>
                  </form>
                </div>}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Login;
