import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useStateValue } from "../context/StateProvider";

import { BiMenu } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { BsPerson, BsHeart, BsSearch, BsPersonCircle } from "react-icons/bs";
import { userActionType } from "../context/reducer";
import Spinner from "./Spinner";

const Header = () => {
  const [{ user }, dispatch] = useStateValue();
  const [screenWidth, setScreenWidth] = useState(1920);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const setProfileTab = (e, option = undefined) => {
    e.preventDefault();
    setIsProfileOpen(option || !isProfileOpen);
  };

  const handleLogout = () => {
    setLoading(true);
    axios({
      url: "/api/auth/signout",
      method: "post",
    }).then(() => {
      dispatch({
        type: userActionType.SET_USER,
        user: null,
      });
      setLoading(false);
      setIsProfileOpen(false);
    });
  };

  useEffect(() => {
    const getWindowSize = () => {
      setScreenWidth(window.innerWidth);
    };
    getWindowSize();

    const handleMouseClick = (e) => {
      const clickedElement = e?.target;
      const parentElement = document.querySelector(".profile_tab");
      const profileButton = document.querySelector(".profile_button");

      if (isProfileOpen && clickedElement) {
        if (profileButton && profileButton.contains(clickedElement)) return;
        if (parentElement && !parentElement.contains(clickedElement)) setProfileTab(e, false);
      }
    };

    window.addEventListener("resize", getWindowSize);
    document.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("resize", getWindowSize);
      document.removeEventListener("click", handleMouseClick);
    };
  }, [isProfileOpen]);

  return screenWidth > 800 ? (
    <>
      {/* {isProfileOpen && (
        <div id="pageOverlay" className="fixed top-0 left-0 bg-black/30 w-full h-full z-30"></div>
      )} */}
      <header className="header-container dark:mb-0 mb-8 relative z-40 flex h-16 w-full items-center justify-center bg-white drop-shadow-md dark:bg-dark dark:drop-shadow-none">
        <div className="wrapper max-w-container flex h-full w-full justify-between default-padding-x">
          {/* LEFT SIDE */}
          <div className="flex h-full items-center gap-2">
            <button className="dark-highlight-1 inline-block">
              <BiMenu className="text-2xl text-black dark:text-white" />
            </button>
            <Link to={"/"}>
              <p className="select-none text-3xl font-extrabold text-logo">Raducat</p>
            </Link>
          </div>
          {/* MIDDLE SIDE */}
          <nav>
            <ul className="header-list flex h-full items-center gap-4 text-base font-medium text-black dark:text-white lg:gap-6">
              <li className="link dark-highlight-1-2 inline-block">
                <Link to={"/quizzes"}>Quizzes</Link>
              </li>
              <li className="link dark-highlight-1-2 inline-block">
                <Link to={"/posts"}>Posts</Link>
              </li>
              <li className="link dark-highlight-1-2 inline-block">
                <Link to={"/tvandmovies"}>TV & Movies</Link>
              </li>
              <li className="link dark-highlight-1-2 inline-block">
                <Link to={"/shopping"}>Shopping</Link>
              </li>
              <li className="link dark-highlight-1-2 inline-block">
                <Link to={"/videos"}>Videos</Link>
              </li>
              <li className="link dark-highlight-1-2 inline-block">
                <Link to={"/news"}>News</Link>
              </li>
            </ul>
          </nav>
          {/* RIGHT SIDE */}

          <div className="relative flex h-full items-center justify-center gap-4">
            <Link to={"/favorites"} className="dark-highlight-2">
              <BsHeart className="text-xl text-black dark:text-white" />
            </Link>
            {!loading ? (
              user ? (
                user?.photoURL ? (
                  <button onClick={setProfileTab} className="profile_button dark-highlight-2">
                    <img className="profile_photo h-[1.25rem] w-[1.25rem] cursor-pointer rounded-full" src={user?.photoURL} alt="userPhoto" />
                  </button>
                ) : (
                  <button onClick={setProfileTab} className="profile_button dark-highlight-2">
                    <BsPersonCircle className="text-2xl text-black dark:text-white" />
                  </button>
                )
              ) : (
                <Link to={"/auth/signin"} className="dark-highlight-1-2 text-black dark:text-white">
                  Sign in
                </Link>
              )
            ) : (
              <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
            )}
            {
              //
              //
              // THIS IS CLICK-OPEN PROFILE TAB
              //
              //
            }
            {isProfileOpen && (
              <div className="profile_tab absolute left-1/4 top-full flex w-[20rem] -translate-x-[97%] -translate-y-4 cursor-default flex-col gap-6 border border-dark bg-white text-base font-medium drop-shadow-md dark:border-white dark:bg-darkblue">
                <div className="flex items-center gap-4 px-4 pt-4">
                  {user?.photoURL ? (
                    <button onClick={setProfileTab} className="dark-highlight-2">
                      <img className="profile_photo h-[1.25rem] w-[1.25rem] cursor-pointer rounded-full" src={user?.photoURL} alt="userPhoto" />
                    </button>
                  ) : (
                    <button onClick={setProfileTab} className="dark-highlight-1">
                      <BsPersonCircle className="text-2xl text-black dark:text-white" />
                    </button>
                  )}
                  <p className="dark-highlight-1-2 cursor-pointer font-semibold text-blue-700 dark:text-white">
                    <span>{user?.displayName}</span>
                  </p>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="dark-highlight-2 ml-auto text-black hover:text-logo dark:text-white dark:hover:text-white">
                    <MdClose className="text-xl" />
                  </button>
                </div>
                <div className="px-4">
                  <ul className="flex flex-col gap-2 text-black dark:text-white">
                    {user?.role === "admin" && (
                      <li className="link dark-highlight-1-2 text-yellow-400 dark:hover:text-yellow-500 font-bold">
                        <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/adminpanel"}>
                          Admin Panel
                        </Link>
                      </li>
                    )}
                    <li className="link dark-highlight-1-2">
                      <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/createpost"}>
                        New Post
                      </Link>
                    </li>
                    <li className="link dark-highlight-1-2">
                      <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/mydrafts"}>
                        My Drafts
                      </Link>
                    </li>
                    <li className="link dark-highlight-1-2">
                      <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/settings"}>
                        Account Settings
                      </Link>
                    </li>
                    <li className="link dark-highlight-1-2">
                      <button className="inline-block w-full text-left" onClick={handleLogout} type="button">
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-4 border-t border-gray-300 bg-gray-300/25 px-4 py-6 text-black dark:border-white/50 dark:bg-white/30 dark:text-white">
                  <h3>Notifications</h3>
                  <h4 className="text-sm font-light">Unread</h4>
                  <div className="ml-auto mr-auto text-sm font-extralight">No unread notifications.</div>
                </div>
              </div>
            )}
            <button className="dark-highlight-2">
              <BsSearch className="text-xl text-black dark:text-white" />
            </button>
          </div>
        </div>
      </header>
      <div className="hidden w-full dark:flex justify-center dark:pb-8">
        <div className="w-[95%] h-1 border-b border-b-darkblue"></div>
      </div>
    </>
  ) : (
    //
    //
    //
    // MOBILE
    //
    //
    //
    <>
      {/* {isProfileOpen && (
        <div id="pageOverlay" className="fixed top-0 left-0 bg-black/30 w-full h-full z-30"></div>
      )} */}
      <header className="header-container dark:mb-0 mb-8 relative z-40 flex w-full justify-center bg-white drop-shadow-md dark:bg-dark">
        <div className="wrapper flex w-full flex-col gap-2 default-padding-x py-1 pt-3 ">
          {/* LEFT SIDE */}
          <div className="flex overflow-hidden xxxs:overflow-visible">
            <div className="mr-auto flex items-center gap-2">
              <button className="dark-highlight-1 -translate-x-1">
                <BiMenu className="text-2xl text-black dark:text-white" />
              </button>
              <Link to={"/"}>
                <p className="select-none text-3xl font-bold text-logo">Raducat</p>
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="ml-auto flex h-full items-center justify-center gap-2 xs:gap-4">
              <Link to={"/favorites"} className="dark-highlight-2 text-black dark:text-white">
                <BsHeart className="text-xl" />
              </Link>

              {!loading ? (
                user ? (
                  <>
                    {user?.photoURL ? (
                      <button onClick={setProfileTab} className="profile_button dark-highlight-2">
                        <img className="profile_photo h-[1.25rem] w-[1.25rem] cursor-pointer rounded-full" src={user?.photoURL} alt="userPhoto" />
                      </button>
                    ) : (
                      <button onClick={setProfileTab} className="profile_button dark-highlight-2">
                        <BsPersonCircle className="text-2xl text-black dark:text-white" />
                      </button>
                    )}
                  </>
                ) : (
                  <Link to={"/auth/signin"} className="dark-highlight-1-2 text-black dark:text-white">
                    Sign in
                  </Link>
                )
              ) : (
                <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
              )}
              {
                //
                //
                // THIS IS CLICK-OPEN PROFILE TAB
                //
                //
              }
              {isProfileOpen && (
                <div className="profile_tab absolute left-0 top-full flex w-full translate-y-2 cursor-default flex-col gap-6 border border-dark bg-white text-base font-medium drop-shadow-md dark:bg-dark ">
                  <div className="flex items-center gap-4 px-4 pt-4">
                    {user?.photoURL ? (
                      <button onClick={setProfileTab} className="dark-highlight-2">
                        <img className="profile_photo h-[1.25rem] w-[1.25rem] cursor-pointer rounded-full" src={user?.photoURL} alt="userPhoto" />
                      </button>
                    ) : (
                      <button onClick={setProfileTab} className="dark-highlight-1">
                        <BsPersonCircle className="text-2xl text-black dark:text-white" />
                      </button>
                    )}
                    <p className="dark-highlight-1-2 cursor-pointer font-semibold text-blue-700 dark:text-white">
                      <span>{user?.displayName}</span>
                    </p>
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="dark-highlight-2 ml-auto text-black hover:text-logo dark:text-white dark:hover:text-white">
                      <MdClose className="text-xl" />
                    </button>
                  </div>
                  <div className="px-4">
                    <ul className="flex flex-col gap-2">
                      {user?.role === "admin" && (
                        <li className="link dark-highlight-1-2 text-yellow-400 dark:hover:text-yellow-500 font-bold">
                          <Link className="w-full" onClick={() => setIsProfileOpen(false)} to={"/adminpanel"}>
                            Admin Panel
                          </Link>
                        </li>
                      )}
                      <li className="link dark-highlight-1-2 text-black dark:text-white">
                        <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/createpost"}>
                          New Post
                        </Link>
                      </li>
                      <li className="link dark-highlight-1-2 text-black dark:text-white">
                        <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/mydrafts"}>
                          My Drafts
                        </Link>
                      </li>
                      <li className="link dark-highlight-1-2 text-black dark:text-white">
                        <Link className="inline-block w-full" onClick={() => setIsProfileOpen(false)} to={"/settings"}>
                          Account Settings
                        </Link>
                      </li>
                      <li className="link dark-highlight-1-2 text-black dark:text-white">
                        <button className="inline-block w-full text-left" onClick={handleLogout} type="button">
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4 border-t border-gray-300 bg-gray-300/25 px-4 py-6 text-black dark:border-white/50 dark:bg-white/30 dark:text-white">
                    <h3>Notifications</h3>
                    <h4 className="text-sm font-light">Unread</h4>
                    <div className="ml-auto mr-auto text-sm font-extralight">No unread notifications.</div>
                  </div>
                </div>
              )}
              <button className="dark-highlight-2">
                <BsSearch className="text-xl text-black dark:text-white" />
              </button>
            </div>
          </div>
          <div>
            {/* BOTTOM SIDE */}
            <nav className="mb-1">
              <ul className="header-list flex items-center gap-6 overflow-x-scroll whitespace-nowrap py-1 text-base font-medium text-black dark:text-white">
                <li className="link dark-highlight-1-2 inline-block">
                  <Link to={"/quizzes"}>Quizzes</Link>
                </li>
                <li className="link dark-highlight-1-2 inline-block">
                  <Link to={"/posts"}>Posts</Link>
                </li>
                <li className="link dark-highlight-1-2 inline-block">
                  <Link to={"/tvandmovies"}>TV & Movies</Link>
                </li>
                <li className="link dark-highlight-1-2 inline-block">
                  <Link to={"/shopping"}>Shopping</Link>
                </li>
                <li className="link dark-highlight-1-2 inline-block">
                  <Link to={"/videos"}>Videos</Link>
                </li>
                <li className="link dark-highlight-1-2 inline-block">
                  <Link to={"/news"}>News</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div className="hidden w-full dark:flex justify-center dark:pb-8">
        <div className="w-[95%] h-1 border-b border-b-darkblue"></div>
      </div>
    </>
  );
};

export default Header;
