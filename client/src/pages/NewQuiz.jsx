import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import fixURL from "../utils/fixURL";
import fetchData from "../utils/fetchData";
import Spinner from "../components/Spinner";
import { MdCloudUpload } from "react-icons/md";
import { BsBookmarkXFill, BsPlus } from "react-icons/bs";
import EliminationImage from "../components/EliminationImage";
import Alert from "../components/Alert";
import { onFileChange } from "../utils/dragAndDrop";

const NewQuiz = ({ editPost }) => {
  const postContentLen = [16, 128],
    postURLLen = [8, 64],
    postTitleLen = [8, 196],
    imageNameLen = [1, 32];

  const preview = editPost?.preview;
  const owner = editPost?.owner;
  const postID = editPost?.postID;

  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("An error occured. Please try again. 😭");

  const [warningStatus, setWarningStatus] = useState(null);
  const [warningMessage, setWarningMessage] = useState("The number of photos you upload must be even. The maximum photo limit is 128, the minimum is 16.");

  const [thumbnailRef, thumbnailInputRef] = [useRef(), useRef()];

  const [postURL, setPostURL] = useState(editPost ? editPost?.postURL.split("/")[1] : "");
  const [postTitle, setPostTitle] = useState(editPost ? editPost?.postTitle : "");
  const [thumbnailImg, setThumbnailImg] = useState(editPost ? [editPost?.postThumbnail, editPost?.postThumbnail] : [null, null]);
  const [postContent, setPostContent] = useState(editPost ? editPost?.postContent : []);

  const navigate = useNavigate();
  const [{ user }, _] = useStateValue();

  const textAreaAdjust = ({ area, e }) => {
    if (area) {
      const element = document.querySelectorAll(area);
      if (!element) return null;
      for (const el of element) {
        el.style.height = "auto";
        el.style.height = (el.scrollHeight + 100 >= el.attributes.initialheight?.value ? el.scrollHeight : el.attributes.initialheight?.value) + "px";
      }
    } else if (e) {
      const element = e.target;
      element.style.height = "auto";
      element.style.height =
        (element.scrollHeight + 100 >= element.attributes.initialheight?.value ? element.scrollHeight : element.attributes.initialheight?.value) + "px";
    }
  };

  const onThumbnailChange = (e) => {
    e.preventDefault();

    // thumbnailRef.current.classList.remove("bg-violet-200");
    // thumbnailRef.current.classList.add("bg-violet-100");

    let newFile = e.target?.files ? e.target?.files[0] : e.nativeEvent.dataTransfer?.files[0];
    if (newFile) {
      setThumbnailImg([URL.createObjectURL(newFile), newFile]);
    }
  };

  const onThumbnailRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    thumbnailInputRef.current.value = null;
    setThumbnailImg([null, null]);
  };

  const submitPost = (e) => {
    e.preventDefault();
    setLoading(true);

    if (postContent?.length < 1) {
      setAlertStatus("fail");
      setAlertMessage("You have to put Content To your Post");
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }
    if (postContent?.length % 2 !== 0) {
      setAlertStatus("fail");
      setAlertMessage("The number of photos you upload must be even.");
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }
    if (postContent?.length > postContentLen[1] || postContent?.length < postContentLen[0]) {
      setAlertStatus("fail");
      setAlertMessage("The maximum photo limit is 128, the minimum is 16.");
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }
    if (postTitle?.length > postTitleLen[1] || postTitle?.length < postTitleLen[0]) {
      setAlertStatus("fail");
      setAlertMessage(`Either passed post title ${postTitleLen[1]} limit or entered less than ${postTitleLen[0]} character`);
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }
    if (postURL?.length > postURLLen[1] || postURL?.length < postURLLen[0]) {
      setAlertStatus("fail");
      setAlertMessage(`Either passed the url limit ${postURLLen[1]} or entered less than ${postURLLen[0]} character`);
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }
    if (!thumbnailImg[1]) {
      setAlertStatus("fail");
      setAlertMessage("Please include a thumbnail image");
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }

    const userName = (editPost && owner && fixURL(owner?.displayName)) || fixURL(user?.displayName);

    const successCb = (e) => {
      setAlertStatus("success");
      !editPost
        ? setAlertMessage("Succesfully created a quiz. Now Directing you to your quiz.")
        : setAlertMessage("Succesfully editted the quiz. Now Directing you to your quiz.");
      setLoading(false);

      setTimeout(() => {
        setAlertStatus(null);

        !editPost
          ? navigate(`/quizzes/preview/${userName}/${postURL}`, { replace: true })
          : preview
          ? navigate(`/quizzes/preview/${userName}/${postURL}`, { replace: true })
          : navigate(`/quizzes/${userName}/${postURL}`, { replace: true });
      }, 2000);
    };
    const failCb = (e) => {
      setAlertStatus("fail");
      setAlertMessage(e?.response?.data?.message || alertMessage);
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
    };

    const fd = new FormData();
    fd.append("postURL", postURL);
    fd.append("postTitle", postTitle);
    fd.append("postContent", JSON.stringify(postContent));
    fd.append("postThumbnail", thumbnailImg[1]);
    editPost && fd.append("postID", postID);
    editPost && fd.append("postType", editPost?.postType);
    try {
      postContent.forEach((el, i) => {
        if (el?.name?.length > imageNameLen[1] || el?.name?.length < imageNameLen[0]) {
          throw `Either passed the Image name limit ${imageNameLen[1]} or entered less than ${imageNameLen[0]} character`;
        }
        if (!el?.image || !el?.image[1]) throw `Please add Images for each Image Area`;
        fd.append("postImages-" + i, el?.image[1]);
      });
    } catch (err) {
      setAlertStatus("fail");
      setAlertMessage(err || alertMessage);
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }

    const fetchURL = !editPost ? "/api/createpost/quiz" : !preview ? `/api/editpost/quiz` : `/api/editpost/quiz/preview`;

    fetchData(fetchURL, {
      options: {
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "post",
      },
      successCallBack: successCb,
      failCallBack: failCb,
    });
  };

  useEffect(() => {
    const handleResize = () => {
      textAreaAdjust({ area: ".title__area" });
    };

    textAreaAdjust({ area: ".title__area" });

    window.addEventListener("DOMContentLoaded", textAreaAdjust({ area: ".title__area" }));
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("DOMContentLoaded", textAreaAdjust({ area: ".title__area" }));
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {loading && <div className="absolute block cursor-wait w-full h-full z-50 left-0 top-0"></div>}
      <div className={`w-full ${!editPost && "max-w-container default-padding"}`}>
        <form className={`create_quiz_area text-black dark:text-white container-bg rounded-lg ${!editPost && "default-padding"}`}>
          <div className="flex flex-col">
            {alertStatus && (
              <div className="mb-4">
                <Alert alertStatus={alertStatus} alertMessage={alertMessage} />
              </div>
            )}
            <div className="mb-8 button_area w-full flex justify-between">
              <Link
                to={"/createpost/preview"}
                className="dark:bg-customgray dark:hover:bg-gray-400/40 bg-white text-blue-600 dark:text-white border border-blue-600 dark:border-white sm:py-2 sm:px-5 py-2 px-3 rounded-md ">
                Preview
              </Link>
              <button
                disabled={loading}
                type="submit"
                onClick={(e) => {
                  submitPost(e);
                }}
                className="relative disabled:cursor-not-allowed dark:disabled:bg-white/80 dark:bg-white dark:hover:bg-white/80 bg-blue-600 hover:bg-blue-700 dark:text-black text-white sm:py-2 sm:px-5 py-2 px-3 rounded-md z-[20]">
                {!loading ? (
                  !editPost ? (
                    "Publish Now"
                  ) : (
                    "Save Changes"
                  )
                ) : (
                  <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
                  </span>
                )}
              </button>
            </div>
            <span className="mb-8 html_area relative w-full sm:flex">
              {`raducat.com/quizzes/${fixURL(user?.displayName)}/`}
              <input
                required
                onChange={(e) => {
                  setPostURL(fixURL(e.target?.value));
                }}
                placeholder="Post URL"
                name="url_area"
                maxLength="64"
                value={postURL}
                className="sm:flex-1 w-full mr-8 outline-none resize-none border-b border-dashed border-customgray dark:border-white overflow-hidden bg-transparent"
              />
              <div className="group z-20 absolute right-0 top-0 aspect-square w-6 bg-customgray rounded-full text-center cursor-help">
                <span className="font-bold text-white rounded-full">?</span>
                <span className="helper_url text-black text-sm absolute top-full left-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 w-40 dark:bg-customgray bg-white border border-customslate_light dark:border-white/30 p-2 rounded-lg -translate-x-full transition-all duration-500">
                  In this area you can put your own custom URL
                </span>
              </div>
            </span>
            <textarea
              required
              maxLength={196}
              type="text"
              placeholder="Post Title"
              initialheight={80}
              name="title-area"
              onFocus={(e) => {
                textAreaAdjust({ e });
              }}
              onChange={(e) => {
                setPostTitle(e.target.value);
                textAreaAdjust({ e });
              }}
              value={postTitle}
              className="title__area mb-8 p-2 rounded-md dark:bg-dark_input border dark:border-customgray border-customslate_light resize-none overflow-hidden font-medium"></textarea>
            <div className="thumbnail__area mb-8">
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onThumbnailChange}
                className="w-full rounded-md cursor-pointer z-10 overflow-hidden">
                <input
                  required
                  name="thumbnailFile"
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/png,image/gif,image/jpeg,image/jpg,image/webp"
                  className="hidden w-full cursor-pointer z-10"
                  onChange={onThumbnailChange}
                />
                {!thumbnailImg[0] ? (
                  <div
                    ref={thumbnailRef}
                    className="w-full border-2 bg-white dark:bg-dark_input dark:border-customgray border-customslate_light hover:bg-light_input dark:hover:bg-gray-600/30 border-dashed grid place-items-center">
                    <span className="w-full my-4 md:my-12 text-center grid place-items-center text-gray-500">
                      <MdCloudUpload className="w-24 h-24 text-gray-500" />
                      <span className="text-sm">
                        Thumbnail <br />
                        Click or Drop Image Here <br />
                        To Upload
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="relative rounded-md grid place-items-center">
                    <button className="z-20 opacity-30 hover:opacity-100 duration-300 transition-all ease-in-out" onClick={onThumbnailRemove}>
                      <BsBookmarkXFill className="absolute sm:text-6xl xxs:text-5xl text-3xl right-4 sm:-top-2 -top-1 z-10 text-logo hover:text-red-600" />
                      <span className="absolute xxs:w-6 xxs:h-6 xxs:right-8 xxs:top-2 w-4 h-3 right-5 top-1 bg-white"></span>
                    </button>
                    <img src={thumbnailImg[0]} alt="thumbnail_photo" className="max-w-full w-fit aspect-video object-contain rounded-md" />
                  </div>
                )}
              </div>
            </div>
            <Alert color="bg-orange-500" symbol="⚠" alertMessage={warningMessage} alertStatus={!warningStatus} alertTitle="ATTENTION" />
            <div className="elimination__image__area relative mb-8 border-2 rounded-md bg-white dark:bg-dark_input dark:border-customgray border-customslate_light border-dashed my-8">
              <span className="absolute left-0 top-0 w-fit px-4 text-lg font-medium z-20 rounded-br-lg bg-yellow-500">{postContent.length}</span>
              <div className="elimination__image__area__container w-full flex flex-wrap md:gap-4 gap-2 mt-4 md:mt-0 items-center justify-center default-padding">
                {postContent.map((value, index) => {
                  return <EliminationImage editPost={editPost} key={index} index={index} data={postContent} setData={setPostContent} />;
                })}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setPostContent([...postContent, { image: [null, null], name: null }]);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onFileChange(e, setPostContent, postContent.length)}
                  className="relative link mb-auto">
                  <div className="relative sm:w-48 sm:h-72 w-40 h-56 rounded-lg border dark:border-customgray border-slate-400 overflow-hidden bg-customslate_light dark:bg-customslate_dark dark:hover:bg-customslate_dark/50 hover:bg-customslate_light/20 transition-colors duration-500">
                    <div className="absolute w-full text-gray-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center p-8">
                      <BsPlus className="w-full h-full drop-shadow-md" />
                      <span className="text-center">
                        <strong>Click</strong> Or <strong>Drop</strong> Your Images <strong className="underline">Here</strong> to Add Content
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewQuiz;
