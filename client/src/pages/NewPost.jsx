import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useStateValue } from "../context/StateProvider";
import { MdCloudUpload, MdImage, MdLink, MdNotes } from "react-icons/md";
import { BsBookmarkXFill } from "react-icons/bs";
import AddText from "../components/AddText";
import AddImage from "../components/AddImage";
import fetchData from "../utils/fetchData";
import fixURL from "../utils/fixURL";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const NewPost = ({ editPost }) => {
  const postURLLen = [8, 64],
    postTitleLen = [8, 196],
    postDescriptionLen = [8, 2048],
    textTitleLen = [0, 384],
    textDesLen = [8, 2048],
    imageTitleLen = [8, 384],
    imageDesLen = [0, 2048];

  const preview = editPost?.preview;
  const owner = editPost?.owner;
  const postID = editPost?.postID;

  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("An error occured. Please try again. 😭");

  const [thumbnailRef, thumbnailInputRef] = [useRef(), useRef()];

  const [postURL, setPostURL] = useState(editPost ? editPost?.postURL.split("/")[1] : "");
  const [postTitle, setPostTitle] = useState(editPost ? editPost?.postTitle : "");
  const [postDescription, setPostDescription] = useState(editPost ? editPost?.postDescription : "");
  const [thumbnailImg, setThumbnailImg] = useState(editPost ? [editPost?.postThumbnail, editPost?.postThumbnail] : [null, null]);
  const [newPostArea, setNewPostArea] = useState(editPost ? editPost?.postContent : []);

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
  const onFileChange = async (e) => {
    e.preventDefault();

    // thumbnailRef.current.classList.remove("bg-violet-200");
    // thumbnailRef.current.classList.add("bg-violet-100");

    let newFile = e.target?.files ? e.target?.files[0] : e.nativeEvent.dataTransfer?.files[0];
    if (newFile) {
      setThumbnailImg([URL.createObjectURL(newFile), newFile]);
    }
  };

  const onDragEnter = (e) => {
    // thumbnailRef.current.classList.remove("bg-violet-100");
    // thumbnailRef.current.classList.add("bg-violet-200");
  };
  const onDragLeave = (e) => {
    // thumbnailRef.current.classList.remove("bg-violet-200");
    // thumbnailRef.current.classList.add("bg-violet-100");
  };

  const addTextArea = () => {
    const newArea = { selection: "text", title: "", description: "" };
    setNewPostArea([...newPostArea, newArea]);
  };
  const addImageArea = () => {
    const newArea = { selection: "image", title: "", image: "", description: "" };
    setNewPostArea([...newPostArea, newArea]);
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

    if (newPostArea?.length < 1) {
      setAlertStatus("fail");
      setAlertMessage("You have to put Content To your Post");
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
    if (postDescription && postDescription?.length > postDescriptionLen[1]) {
      setAlertStatus("fail");
      setAlertMessage(`Either passed post description ${postDescriptionLen[1]} limit or entered less than ${postDescriptionLen[0]} character`);
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
      setAlertMessage(`Please include a thumbnail image`);
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
        ? setAlertMessage("Succesfully created a post. Now Directing you to your post.")
        : setAlertMessage("Succesfully editted the post. Now Directing you to your post.");
      setLoading(false);

      setTimeout(() => {
        setAlertStatus(null);

        !editPost
          ? navigate(`/posts/preview/${userName}/${postURL}`, { replace: true })
          : preview
          ? navigate(`/posts/preview/${userName}/${postURL}`, { replace: true })
          : navigate(`/posts/${userName}/${postURL}`, { replace: true });
      }, 2000);
    };
    const failCb = (e) => {
      console.log(e);
      setAlertStatus("fail");
      setAlertMessage(e.response.data?.message);
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
    };

    const fd = new FormData();
    fd.append("postURL", postURL);
    fd.append("postTitle", postTitle);
    fd.append("postDescription", postDescription);
    fd.append("postContent", JSON.stringify(newPostArea));
    fd.append("postThumbnail", thumbnailImg[1]);
    editPost && fd.append("postID", postID);
    editPost && fd.append("postType", editPost?.postType);

    try {
      newPostArea.forEach((el, i) => {
        switch (el?.selection) {
          case "text":
            el.title = el?.title?.trim();
            el.description = el?.description?.trim();
            if (el?.title.length > textTitleLen[1] || el?.title.length < textTitleLen[0]) {
              throw `Either passed the Text title limit ${textTitleLen[1]} or entered less than ${textTitleLen[0]} character`;
            } else if (el?.description.length > textDesLen[1] || el?.description.length < textDesLen[0]) {
              throw `Either passed the Text description limit ${textDesLen[1]} or entered less than ${textDesLen[0]} character`;
            }
            break;
          case "image":
            el.title = el?.title?.trim();
            el.description = el?.description?.trim();
            if (el?.title.length > imageTitleLen[1] || el?.title.length < imageTitleLen[0]) {
              throw `Either passed the Image title limit ${imageTitleLen[1]} or entered less than ${imageTitleLen[0]} character`;
            } else if (el?.description.length > imageDesLen[1] || el?.description.length < imageDesLen[0]) {
              throw `Either passed the Image description limit ${imageDesLen[1]} or entered less than ${imageDesLen[0]} character`;
            } else if (!el?.image) {
              throw `Please include a image for your image area`;
            }
            fd.append("postImages-" + i, el?.image);
            break;
          default:
            break;
        }
      });
    } catch (error) {
      setAlertStatus("fail");
      setAlertMessage(typeof error === "string" ? error : "An error occured. Please try again. 😭");
      setLoading(false);
      setTimeout(() => {
        setAlertStatus(null);
      }, 5000);
      return;
    }

    const fetchURL = !editPost ? "/api/createpost/post" : !preview ? `/api/editpost/post` : `/api/editpost/post/preview`;

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
      textAreaAdjust({ area: ".title__area, .description__area" });
    };

    textAreaAdjust({ area: ".title__area, .description__area" });

    window.addEventListener("DOMContentLoaded", textAreaAdjust({ area: ".title__area, .description__area" }));
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("DOMContentLoaded", textAreaAdjust({ area: ".title__area, .description__area" }));
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {loading && <div className="absolute block cursor-wait w-full h-full z-50 left-0 top-0"></div>}
      <div className={`w-full ${!editPost && "max-w-container default-padding"}`}>
        <form className={`create_post_area text-black dark:text-white container-bg rounded-lg ${!editPost && "default-padding"}`}>
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
              {`raducat.com/posts/${fixURL(editPost ? owner?.displayName : user?.displayName)}/`}
              <input
                required
                onChange={(e) => {
                  setPostURL(fixURL(e.target?.value));
                }}
                placeholder="Post URL"
                name="url_area"
                minLength={postURLLen[0]}
                maxLength={postURLLen[1]}
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
              minLength={postTitleLen[0]}
              maxLength={postTitleLen[1]}
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
            <textarea
              required
              initialheight={192}
              minLength={postDescriptionLen[0]}
              maxLength={postDescriptionLen[1]}
              type="text"
              name="text-area"
              placeholder="You can put description here [Can be Empty]"
              onFocus={(e) => {
                textAreaAdjust({ e });
              }}
              onChange={(e) => {
                textAreaAdjust({ e });
                // setCurrentPostArea(e, "description");
                setPostDescription(e.target.value);
              }}
              value={postDescription}
              className="description__area mb-8 min-h-[9rem] font-light resize-none outline-none overflow-hidden p-2 bg-light_overlay dark:bg-dark_input border rounded-md dark:border-customgray border-customslate_light"></textarea>

            <div className="thumbnail__area mb-8">
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onFileChange}
                className="w-full rounded-md cursor-pointer z-10 overflow-hidden">
                <input
                  required
                  name="thumbnailFile"
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/png,image/gif,image/jpeg,image/jpg,image/webp"
                  className="hidden w-full cursor-pointer z-10"
                  onChange={onFileChange}
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
            {newPostArea.length > 0 && (
              <div className="flex flex-col gap-4 items-center dark:bg-dark_input bg-light_overlay rounded-md mt-8 default-padding">
                {newPostArea.map((area, index) => {
                  if (area.selection === "text") {
                    return (
                      <AddText
                        key={index}
                        index={index}
                        postArea={newPostArea}
                        setPostArea={setNewPostArea}
                        textTitleLen={textTitleLen}
                        textDesLen={textDesLen}
                      />
                    );
                  } else if (area.selection === "image") {
                    return (
                      <AddImage
                        editImage={area.image}
                        key={index}
                        index={index}
                        postArea={newPostArea}
                        setPostArea={setNewPostArea}
                        imageTitleLen={imageTitleLen}
                        imageDesLen={imageDesLen}
                      />
                    );
                  } else if (area.section === "link") {
                  }
                })}
              </div>
            )}
            <div className="add_area w-full flex border dark:border-customgray border-customslate_light rounded-md overflow-hidden bg-white dark:bg-dark_input">
              <div onClick={addTextArea} className="relative flex flex-col py-1 box-content h-14 flex-1 items-center cursor-pointer hover:bg-light_input">
                <MdNotes className="flex-1 w-full text-blue-600 dark:text-white pointer-events-none" />
                <span className="left-0 top-1/2 -translate-y-1/2 absolute w-full h-3/4 border-r border-customslate_light"></span>
                <div className="text-blue-600 dark:text-white text-xs md:text-sm whitespace-nowrap">Add Text</div>
              </div>
              <div onClick={addImageArea} className="relative flex flex-col py-1 box-content h-14 flex-1 items-center cursor-pointer hover:bg-light_input">
                <MdImage className="w-full h-full text-blue-600 dark:text-white  pointer-events-none" />
                <span className="left-0 top-1/2 -translate-y-1/2 absolute w-full h-3/4 border-r border-customslate_light"></span>
                <div className="text-blue-600 dark:text-white text-xs md:text-sm whitespace-nowrap">Add Image</div>
              </div>
              <div
                //   onClick={addTextArea}
                className="relative flex flex-col py-1 box-content h-14 flex-1 items-center cursor-pointer hover:bg-light_input">
                <MdLink className="w-full h-full text-blue-600 dark:text-white pointer-events-none" />
                <div className="text-blue-600 dark:text-white text-xs md:text-sm whitespace-nowrap">Add Link</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
