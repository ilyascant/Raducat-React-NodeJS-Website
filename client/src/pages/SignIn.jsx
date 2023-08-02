import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userActionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { useGoogleLogin } from "@react-oauth/google";

import { AiOutlineGoogle } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { BsFacebook } from "react-icons/bs";

import Spinner from "../components/Spinner";
import fetchData from "../utils/fetchData";
import Alert from "../components/Alert";

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [{ user, returnURL }, dispatch] = useStateValue();

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetchData("/api/auth/signinwithgoogle", {
        options: {
          data: JSON.stringify({ token: tokenResponse.access_token }),
          method: "post",
          withCredentials: true,
        },
        successCallBack: successLoginCb,
        failCallBack: failLoginCb,
      });
    },
    onError: () => {
      setErrorMsg("An error occurred while logging in with Google. Please try again. 😭");
      setAlertStatus("error");
      setTimeout(() => {
        setLoading(false);
        setAlertStatus(null);
      }, 5000);
    },
  });

  const handleSignIn = (e) => {
    e.preventDefault();
    fetchSignIn(email, password);

    function fetchSignIn(email, password) {
      setLoading(true);
      fetchData("/api/auth/signin", {
        options: {
          data: { email, password },
          method: "post",
          withCredentials: true,
        },
        successCallBack: successLoginCb,
        failCallBack: failLoginCb,
      });
    }
  };

  const successLoginCb = (e) => {
    dispatch({
      type: userActionType.SET_USER,
      user: e.data,
    });
    setAlertStatus("success");
    setTimeout(() => {
      setLoading(false);
      setAlertStatus(null);
      navigate(-1, { replace: true });
    }, 2000);
  };
  const failLoginCb = (e) => {
    setErrorMsg(e.response.data?.message);
    setAlertStatus("error");
    setTimeout(() => {
      setLoading(false);
      setAlertStatus(null);
    }, 5000);
  };

  return (
    <section className="w-full flex justify-center items-center mt-10 overflow-hidden">
      <div className="lg:w-[33.33%] md:w-[50%] w-full flex flex-col items-center mx-2 md:mx-0 p-5 rounded-lg text-black dark:text-white border-gray-300 bg-gray-50/25 dark:border-darkblue dark:bg-dark border">
        <div className="w-full text-center flex flex-col items-center">
          <h1 className="font-bold text-lg my-2">Sign In</h1>
          <p className="mb-6">
            {"or "}{" "}
            <Link to="/auth/signup" className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 font-medium">
              sign up
            </Link>{" "}
            to make your own posts and quizzes
          </p>
          <div className="flex sm:flex-col flex-row w-full justify-center sm:items-center gap-[10%]">
            <button
              onClick={handleGoogleSignIn}
              className="sm:w-[90%] sm:py-2 sm:px-12 p-4 flex items-center justify-center gap-2 bg-red-500 text-white mb-2 rounded-md hover:bg-red-700">
              <AiOutlineGoogle className="sm:text-xl text-2xl" />
              <p className="sm:inline-block hidden">Sign in with Google</p>
            </button>
            <button
              disabled
              className="relative sm:w-[90%] sm:py-2 sm:px-12 p-4 flex items-center justify-center gap-2 bg-blue-500 text-white mb-2 rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-white/30">
              <FaLock className="absolute sm:text-xl text-base sm:top-[70%] top-[80%] sm:-left-2 -left-1.5 text-slate-500 dark:text-white" />
              <BsFacebook className="sm:text-lg text-2xl" />
              <p className="sm:inline-block hidden">Sign in with Facebook</p>
            </button>
          </div>
        </div>
        {/* 
        //
         */}
        <div className="w-full md:my-8 my-4 text-center">
          <div className="border-b inline-block w-[25%] mb-1 border-gray-300 dark:border-white"></div>
          <span className="text-base p-5">or</span>
          <div className="border-b inline-block w-[25%] mb-1 border-gray-300 dark:border-white"></div>
        </div>
        {/* 
        //
         */}
        <form onSubmit={handleSignIn} className="w-full">
          {alertStatus && (
            <div className="mb-4">
              <Alert alertStatus={alertStatus} alertMessage={errorMsg} />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium w-fit pr-2">
              Email
            </label>
            <input
              disabled={loading}
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm container-bg border border-gray-300 dark:text-white text-gray-900 text-sm rounded-md focus:border-blue-500 block w-full p-2.5"
              placeholder="name@raducat.com"
              required
            />
          </div>
          <div className="sm:mb-8 mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium w-fit pr-2">
              Password
            </label>
            <input
              disabled={loading}
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="shadow-sm container-bg border border-gray-300 dark:text-white text-gray-900 text-sm rounded-md focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="w-full">
            <button
              type="submit"
              className="mb-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-base px-5 py-2.5 text-center">
              {loading && <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />}
              {loading ? <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" /> && "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
