import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import fetchData from "../utils/fetchData";
import timeSince from "../utils/timeSince";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import fixURL from "../utils/fixURL";
import { useStateValue } from "../context/StateProvider";
import Confetti from "../components/Confetti";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const QuizBoilerPlate = () => {
  const [{ user, windowWidth }, dispatch] = useStateValue();

  const [leftHalfRef, rightHalfRef, leftHalfRefText, rightHalfRefText, theWinnerRef, resultRef] = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const { preview, quizURL, userName } = useParams();
  const [{ postID, post, owner }, setQuiz] = useState({});
  const [postContent, setPostContent] = useState([]);
  const [initialPostContent, setInitialPostContent] = useState([]);
  const [versusArr, setVersusArr] = useState([]);
  const [winners, setWinners] = useState([]);
  const [theWinner, setTheWinner] = useState({});
  const [round, setRound] = useState([]);
  const [timesPlayed, setTimesPlayed] = useState(null);
  const [timePassed, setTimePassed] = useState("unknown");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [alertStatus, setAlertStatus] = useState(preview);
  const [alertMessage, setAlertMessage] = useState(
    <h1>
      This is a preview of a Post. Meaning this post hasn't approved by Mods/Admins and may contain potentially <strong>HARMFUL/INAPPROPRIATE</strong> content.
      Post will be published after Mods/Admins approval.
    </h1>
  );
  const [approveStatus, setApproveStatus] = useState("unapproved");

  const [deleteWarn, setDeleteWarn] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [screenWidth, setScreenWidth] = useState(1920);

  const navigate = useNavigate();

  function winnerHandler(winnerIndex, loserIndex) {
    if (disabled) return;
    let content = [];

    if (postContent?.length + winners?.length === 2) {
      setDisabled(true);
      setTheWinner(postContent[winnerIndex]);
    } else if (parseInt(postContent?.length / 2) === 1) {
      const newArr = [...postContent];
      newArr.splice(loserIndex, 1);
      setWinners([]);
      content = shuffleArray([...winners, ...newArr]);
      setPostContent(content);
      setRound([0, parseInt(content?.length / 2)]);
      clickHandler(winnerIndex, content);
    } else if (parseInt(postContent?.length / 2) > 0) {
      setWinners([...winners, postContent[winnerIndex]]);
      setPostContent((prev) => {
        content.push(...prev);
        content.splice(0, 1);
        content.splice(0, 1);
        return content;
      });
      setRound([round[0] + 1, round[1]]);
      clickHandler(winnerIndex, content);
    }
  }

  function clickHandler(winnerIndex, content) {
    setDisabled(true);
    if (leftHalfRef.current) {
      leftHalfRef.current.style.transform = "translate(50%, 0)";
      leftHalfRef.current.style.zIndex = winnerIndex === 0 ? "30" : "25";
      rightHalfRefText.current.style.display = winnerIndex === 0 ? "none" : "block";
    }
    if (rightHalfRef.current) {
      rightHalfRef.current.style.transform = "translate(-50%, 0)";
      rightHalfRef.current.style.zIndex = winnerIndex === 1 ? "30" : "25";
      leftHalfRefText.current.style.display = winnerIndex === 1 ? "none" : "block";
    }
    const timer = 1 || 500;
    const delay = 1 || 300;

    setTimeout(() => {
      if (leftHalfRef.current) {
        leftHalfRef.current.style.transform = "translate(0, 0)";
      }
      if (rightHalfRef.current) {
        rightHalfRef.current.style.transform = "translate(0, 0)";
      }
    }, timer);
    setTimeout(() => {
      if (leftHalfRef.current) {
        leftHalfRef.current.style.zIndex = leftHalfRef.current && "0";
        leftHalfRefText.current.style.display = "block";
      }
      if (rightHalfRef.current) {
        rightHalfRef.current.style.transform = "translate(0, 0)";
        rightHalfRef.current.style.zIndex = rightHalfRef.current && "0";
        rightHalfRefText.current.style.display = "block";
      }
      setDisabled(false);
      setVersusArr(content.slice(0, 2));
    }, timer + delay);
  }

  const approveQuiz = async () => {
    setApproveStatus("fetched");

    await fetchData("/api/getquizzes/approve", {
      options: {
        data: { postID: postID },
        method: "post",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setApproveStatus("approved");
        setAlertStatus(null);
        navigate(`/quizzes/${fixURL(owner?.displayName)}/${quizURL}`, { replace: true });
      },
      failCallBack: (e) => {
        setApproveStatus("unapproved");
        setAlertStatus("fail");
        setAlertMessage(e?.response?.data?.message || alertMessage);
        setLoading(false);
        setTimeout(() => {
          setAlertMessage(
            <h1>
              This is a preview of a Post. Meaning this post hasn't approved by Mods/Admins and may contain potentially <strong>HARMFUL/INAPPROPRIATE</strong>{" "}
              content. Post will be published after Mods/Admins approval.
            </h1>
          );
        }, 2000);
      },
    });
  };

  const deleteQuiz = async () => {
    const fetchURL = !preview ? `/api/getquizzes/delete` : `/api/getquizzes/delete/preview`;
    await fetchData(fetchURL, {
      options: {
        data: { postID: postID, postType: post?.postType },
        method: "post",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setDeleteStatus("success");
        setDeleteMsg("Successfully deleted the Quiz. Now directing to Quiz page.");
        setTimeout(() => {
          setDeleteStatus(null);
          setDeleteMsg(null);
          navigate("/quizzes", { replace: true });
        }, 2000);
      },
      failCallBack: (e) => {
        setDeleteStatus("fail");
        setDeleteMsg(e.response.data?.message || "An error accured while deleting quiz. Please try again after.");
        setTimeout(() => {
          setDeleteStatus(null);
          setDeleteMsg(null);
        }, 5000);
      },
    });
  };

  useEffect(() => {
    const getWindowSize = () => {
      setScreenWidth(window.innerWidth);
    };
    getWindowSize();

    window.addEventListener("resize", getWindowSize);
    return () => {
      window.removeEventListener("resize", getWindowSize);
    };
  }, []);

  useMemo(async () => {
    if (Object.keys(theWinner).length > 0) {
      if (post)
        fetchData("/api/getquizzes/givepoint", {
          options: {
            data: { postID: post.postID, theWinner },
            method: "post",
            withCredentials: true,
          },
          successCallBack: async (e) => {
            const fetchURL = !preview
              ? `/api/getquizzes/approved/${userName + "/" + quizURL}`
              : `/api/getquizzes/unapproved/preview/${userName + "/" + quizURL}`;
            await fetchData(fetchURL, {
              options: {
                method: "get",
                withCredentials: true,
              },
              successCallBack: (e) => {
                setTimesPlayed(e?.data?.postData?.timesPlayed);
                const shuffledContent = shuffleArray(e?.data?.postData.postContent);
                setInitialPostContent(shuffledContent);
                if (resultRef)
                  setTimeout(() => {
                    resultRef?.current.scrollIntoView({ behavior: "smooth" });
                  }, 1000);
              },
              failCallBack: () => {
                setTimesPlayed(post?.timesPlayed + 1);
                setInitialPostContent((prev) => {
                  const newArr = [...prev];
                  const foundWinnerData = newArr.find((el) => el?.name === theWinner?.name);
                  foundWinnerData.winCount++;
                  return newArr;
                });
                if (resultRef)
                  setTimeout(() => {
                    resultRef?.current.scrollIntoView({ behavior: "smooth" });
                  }, 1000);
              },
            });
          },
          failCallBack: (e) => {
            setAlertStatus("fail");
            setAlertMessage(e?.response?.data?.message || alertMessage);
            setLoading(false);
            setTimeout(() => {
              setAlertMessage(
                <h1>
                  This is a preview of a Post. Meaning this post hasn't approved by Mods/Admins and may contain potentially{" "}
                  <strong>HARMFUL/INAPPROPRIATE</strong> content. Post will be published after Mods/Admins approval.
                </h1>
              );
            }, 2000);
          },
        });
    }
    return;
  }, [theWinner]);

  useMemo(async () => {
    setLoading(true);
    setDisabled(true);
    const fetchURL = !preview ? `/api/getquizzes/approved/${userName + "/" + quizURL}` : `/api/getquizzes/unapproved/preview/${userName + "/" + quizURL}`;
    await fetchData(fetchURL, {
      options: {
        method: "get",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setQuiz({ post: e?.data?.postData, owner: e?.data?.owner, postID: e?.data?.postData?.postID });
        setTimePassed(timeSince(e?.data?.postData?.postedAt));
        setTimesPlayed(e?.data?.postData?.timesPlayed);

        const shuffledContent = shuffleArray(e?.data?.postData.postContent);
        setPostContent(shuffledContent);
        setInitialPostContent(shuffledContent);
        setVersusArr(shuffledContent.slice(0, 2));
        setTimePassed(timeSince(e?.data?.postData.postedAt));
        setRound([0, parseInt(shuffledContent?.length / 2)]);
      },
      failCallBack: () => setLoading(false),
    });

    setLoading(false);
    setDisabled(false);
  }, []);

  return post === undefined || loading ? (
    <div className="w-full h-[50%] flex justify-center items-center">
      <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="200" h="200" />
    </div>
  ) : (
    <div className="relative w-full dark:text-white text-black flex justify-center">
      <div className="w-full max-w-container default-padding">
        <div className="w-full h-full container-bg rounded-lg lg:w-contentWidth">
          <article className="relative default-padding">
            {alertStatus && (
              <div className="mb-12">
                <Alert color="bg-orange-500" symbol="⚠" alertMessage={alertMessage} alertStatus={alertStatus} alertTitle="ATTENTION" />
              </div>
            )}
            {/* top bar */}
            <div className="flex flex-col w-full mb-4 justify-between">
              <div className="top_info_bar">
                <div className="w-full flex flex-wrap justify-between">
                  <div className="shrink-0 mr-4">
                    <span className="italic font-light">
                      Posted
                      <span> {timePassed} </span>
                      ago
                    </span>
                  </div>
                  {(user?.role === "admin" || user?.uid === owner.uid) && (
                    <div className="flex gap-4 md:gap-8 font-medium">
                      {preview && owner?.role === "admin" && approveStatus === "unapproved" ? (
                        <button onClick={approveQuiz} className="dark-highlight-1-2 dark:!text-orange-400 text-orange-500 hover:text-orange-700 ">
                          Approve
                        </button>
                      ) : approveStatus === "fetched" ? (
                        <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
                      ) : null}

                      <button
                        onClick={() => navigate(`/quizzes/edit${preview ? "/preview" : ""}/${fixURL(owner?.displayName)}/${quizURL}`, { replace: true })}
                        className="dark-highlight-1-2 dark:!text-emerald-500 text-emerald-500 hover:text-emerald-700 ">
                        Edit
                      </button>
                      {!deleteStatus ? (
                        <button
                          onClick={() => setDeleteWarn(true)}
                          className="dark-highlight-1-2 dark:!text-red-400 text-red-500 dark:hover:text-red-400 hover:text-red-700 ">
                          Delete
                        </button>
                      ) : (
                        <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 my-4">
                  <div>
                    <img className="w-12 h-12 rounded-full" src="https://pbs.twimg.com/media/D3EaGhQWwAA6gjI.png" alt="" />
                  </div>
                  <div className="flex flex-col text-sm justify-center">
                    <div>
                      <span className="font-light text-sm">by </span>
                      <span className="underline-offset-2 underline cursor-pointer">{owner?.displayName || "unknown"}</span>
                    </div>
                    <span className="italic text-xs leading-5">{owner?.role || "user"}</span>
                  </div>
                </div>

                {deleteWarn && <div className="fixed z-[45] left-0 top-0 w-full h-full dark:bg-black/50 bg-black/70"></div>}
                {deleteWarn && (
                  <div className="z-50 absolute w-3/4 left-1/2 top-24 -translate-x-1/2 dark:bg-dark_input bg-customslate_light border-2 border-red-600 rounded-md drop-shadow-md">
                    <div className="text-center mx-12 md:pt-8">
                      {deleteStatus && (
                        <div className="my-4">
                          <Alert
                            color={deleteStatus === "success" ? "bg-emerald-500" : "bg-red-600"}
                            symbol="⚠"
                            alertMessage={deleteMsg}
                            alertStatus={deleteStatus}
                            alertTitle="ATTENTION"
                          />
                        </div>
                      )}
                      <div className="mt-5 md:mb-24 mb-12">
                        <span>
                          Do you really want to <strong>DELETE</strong> this post?
                        </span>
                      </div>
                      <div className="mb-6 w-full flex justify-between font-medium">
                        {!deleteStatus ? (
                          <button onClick={deleteQuiz} className="dark:!text-red-400 text-red-500 hover:text-red-700 font-bold link dark-highlight-1-2">
                            DELETE
                          </button>
                        ) : (
                          <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
                        )}
                        <button onClick={() => setDeleteWarn(false)} className="dark:!text-white link dark-highlight-1-2">
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="top_title_bar text-2xl font-semibold md:text-4xl sm:text-3xl">{post?.postTitle}</div>
            </div>

            {/* content */}
            {Object.keys(theWinner).length > 0 && <Confetti />}
            <fieldset className="relative">
              {
                <div className="flex flex-row justify-center md:gap-4 gap-2">
                  {Object.keys(theWinner).length <= 0 ? (
                    <>
                      {/* First Half */}
                      <motion.figure
                        key={versusArr[0]?.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "linear", duration: 0.5 }}
                        ref={leftHalfRef}
                        className="flex-col max-w-[50%] flex-1 items-center md:gap-4 gap-2 overflow-hidden duration-200 transition-transform">
                        <div
                          onClick={() => winnerHandler(0, 1)}
                          className="relative overflow-hidden flex justify-center items-center rounded-lg aspect-[2/3] drop-shadow-lg gradient-border-effect">
                          <div className="overflow-hidden w-[calc(100%-.5rem)] h-[calc(100%-.5rem)] rounded-lg">
                            <img
                              className="w-full h-full object-cover object-top link hover:scale-125 duration-150 transition-transform ease-in-out"
                              src={versusArr[0]?.image}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="w-full md:font-bold font-medium md:text-lg text-base min-w-0 break-words text-center md:my-4 my-2">
                          <span ref={leftHalfRefText}>{versusArr[0]?.name}</span>
                        </div>
                      </motion.figure>
                      {/* Gap */}
                      <div className="self-center flex flex-col items-center gap-4 absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
                        <div className="!text-yellow-500  bg-darkblue sm:p-4 p-2 rounded-md border">
                          <div className="text-center font-medium sm:text-base text-xs">
                            Round <br />
                            <span>{round[0] + 1}</span>/<span>{round[1]}</span>
                          </div>
                        </div>
                        {postContent?.length + winners?.length === 3 && (
                          <div className="!text-yellow-500 bg-white w-12 h-12 z-[5555555] scale_animation drop-shadow-md rounded-full grid content-center justify-center">
                            <span className="w-full h-full text-xl font-medium">+1</span>
                          </div>
                        )}
                      </div>
                      {/* Second Half */}
                      <motion.figure
                        key={versusArr[1]?.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "linear", duration: 0.5 }}
                        ref={rightHalfRef}
                        className="flex-col max-w-[50%] flex-1 items-center md:gap-4 gap-2 overflow-hidden duration-500 transition-transform">
                        <div
                          onClick={() => winnerHandler(1, 0)}
                          className="overflow-hidden flex justify-center items-center rounded-lg aspect-[2/3] drop-shadow-lg gradient-border-effect-reverse">
                          <div className="overflow-hidden w-[calc(100%-.5rem)] h-[calc(100%-.5rem)] rounded-lg">
                            <img
                              className="w-full h-full object-cover object-top link hover:scale-125 duration-150 transition-transform ease-in-out"
                              src={versusArr[1]?.image}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="w-full md:font-bold font-medium md:text-lg text-base min-w-0 break-words text-center md:my-4 my-2">
                          <span ref={rightHalfRefText}>{versusArr[1]?.name}</span>
                        </div>
                      </motion.figure>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-32">
                      <figure
                        ref={theWinnerRef}
                        className="flex-col max-w-[50%] flex-1 items-center md:gap-4 gap-2 overflow-hidden duration-200 transition-transform">
                        <div
                          onClick={() => winnerHandler(0, 1)}
                          className="relative overflow-hidden flex justify-center items-center rounded-lg aspect-[2/3] drop-shadow-lg gradient-border-effect">
                          <div className="overflow-hidden w-[calc(100%-.5rem)] h-[calc(100%-.5rem)] rounded-lg">
                            <img
                              className="w-full h-full object-cover object-top link hover:scale-125 duration-150 transition-transform ease-in-out"
                              src={theWinner?.image}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="w-full md:font-bold font-medium md:text-lg text-base min-w-0 break-words text-center md:my-4 my-2">
                          <span ref={leftHalfRefText}>{theWinner?.name}</span>
                        </div>
                      </figure>
                      <div ref={resultRef} className="result__section">
                        <ul className="flex flex-col gap-8 mt-8">
                          {initialPostContent
                            .sort((a, b) => b?.winCount - a?.winCount)
                            .map((el, index) => (
                              <li key={index} className="flex flex-row gap-4">
                                <div className="overflow-hidden flex-1 grow rounded-lg aspect-square border border-slate-400 dark:border-white">
                                  <img
                                    className="w-full h-full object-cover object-top link hover:scale-125 duration-150 transition-transform ease-in-out"
                                    src={el?.image}
                                    alt=""
                                  />
                                </div>
                                <div className="flex flex-col flex-1 sm:grow-[4] grow-[2] items-start justify-start">
                                  <div className="md:font-bold font-medium md:text-lg text-base min-w-0 break-words">
                                    <span ref={leftHalfRefText}>{el?.name}</span>
                                  </div>
                                  <div className="w-full mt-3">
                                    <span className="mt-auto text-xs italic">Win Rate</span>
                                    <div className="relative mt-1 w-11/12 h-6 my-auto rounded-md overflow-hidden dark:bg-customslate_dark bg-customslate_light">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${((el?.winCount / timesPlayed) * 100).toFixed(2)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-red-600 rounded-r-md"></motion.div>
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold">
                                        {((el?.winCount / timesPlayed) * 100).toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              }
            </fieldset>
          </article>
        </div>
      </div>
    </div>
  );
};

export default QuizBoilerPlate;
