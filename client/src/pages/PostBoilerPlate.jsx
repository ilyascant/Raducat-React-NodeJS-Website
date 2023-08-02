import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import fetchData from "../utils/fetchData";
import timeSince from "../utils/timeSince";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import fixURL from "../utils/fixURL";
import { useStateValue } from "../context/StateProvider";

const PostBoilerPlate = () => {
  const [{ user }, dispatch] = useStateValue();

  const { preview, postURL, userName } = useParams();
  const [{ postID, post, owner }, setPost] = useState({});
  const [timePassed, setTimePassed] = useState("unknown");
  const [loading, setLoading] = useState(false);

  const [alertStatus, setAlertStatus] = useState(preview);
  const [alertMessage, setAlertMessage] = useState(
    <h1>
      This is a preview of a Post. Meaning this post hasn't approved by Mods/Admins and may contain potentially <strong>HARMFUL/INAPPROPRIATE</strong>{" "}
      content. Post will be published after Mods/Admins approval.
    </h1>
  );
  const [approveStatus, setApproveStatus] = useState("unapproved");

  const [deleteWarn, setDeleteWarn] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState(null);

  const navigate = useNavigate();

  const approvePost = async () => {
    setApproveStatus("fetched");

    await fetchData("/api/getposts/approve", {
      options: {
        data: { postID },
        method: "post",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setApproveStatus("approved");
        setAlertStatus(null);
        navigate(`/posts/${fixURL(owner?.displayName)}/${postURL}`, { replace: true });
      },
      failCallBack: (e) => setApproveStatus("unapproved"),
    });
  };

  const deletePost = async () => {
    const fetchURL = !preview ? `/api/getposts/delete` : `/api/getposts/delete/preview/`;
    await fetchData(fetchURL, {
      options: {
        data: { postID, postType: post?.postType },
        method: "post",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setDeleteStatus("success");
        setDeleteMsg("Successfully deleted the Post. Now directing to Post page.");
        setTimeout(() => {
          setDeleteStatus(null);
          setDeleteMsg(null);
          navigate("/posts?page=1&batchsize=5", { replace: true });
        }, 2000);
      },
      failCallBack: (e) => {
        console.log(e);
        setDeleteStatus("fail");
        setDeleteMsg(e.response.data?.message || "An error accured while deleting post. Please try again after.");
        setTimeout(() => {
          setDeleteStatus(null);
          setDeleteMsg(null);
        }, 5000);
      },
    });
  };

  useMemo(async () => {
    setLoading(true);
    const fetchURL = !preview ? `/api/getposts/approved/${userName + "/" + postURL}` : `/api/getposts/unapproved/preview/${userName + "/" + postURL}`;
    await fetchData(fetchURL, {
      options: {
        method: "get",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setPost({ post: e?.data?.postData, owner: e?.data?.owner, postID: e?.data?.postData?.postID });
        setTimePassed(timeSince(e?.data?.postData.postedAt));
      },
      failCallBack: (e) => setLoading(false),
    });

    setLoading(false);
  }, []);
  return post === undefined || loading ? (
    <div className="w-full h-[50%] flex justify-center items-center">
      <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="200" h="200" />
    </div>
  ) : (
    <>
      <div className="flex flex-col items-center w-full dark:text-white">
        <div className="break-words hyphens-auto max-w-container w-full flex md:justify-start justify-center default-padding-x">
          <article className="w-full relative lg:w-contentWidth flex flex-col default-padding md:px-8 px-4 container-bg rounded-md">
            {alertStatus && (
              <div className="mb-12">
                <Alert color="bg-orange-500" symbol="⚠" alertMessage={alertMessage} alertStatus={alertStatus} alertTitle="ATTENTION" />
              </div>
            )}
            <div className="flex w-full mb-6 justify-between">
              <div className="w-full flex flex-wrap justify-between z-10">
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
                      <button onClick={approvePost} className="dark-highlight-1-2 dark:!text-orange-400 text-orange-500 hover:text-orange-700 ">
                        Approve
                      </button>
                    ) : approveStatus === "fetched" ? (
                      <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w="24" h="24" />
                    ) : null}

                    <button
                      onClick={() => navigate(`/posts/edit${preview ? "/preview" : ""}/${fixURL(owner?.displayName)}/${postURL}`, { replace: true })}
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
                        <button onClick={deletePost} className="dark:!text-red-400 text-red-500 hover:text-red-700 font-bold link dark-highlight-1-2">
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
            <div className="min-w-0 w-full flex flex-col gap-4 mb-20 overflow-hidden">
              <div className="w-full">
                <h1 className="text-2xl font-semibold md:text-4xl sm:text-3xl">{post?.postTitle}</h1>
              </div>
              {post?.postDescription && post.postDescription.length > 0 && (
                <div className="w-full">
                  <p className="text-lg font-light">{post?.postDescription}</p>
                </div>
              )}
              <div className="flex gap-2">
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
            </div>
            <div className="flex flex-col gap-20 mb-24 overflow-hidden">
              {post &&
                post?.postContent.map((item, index) => {
                  if (item.selection === "text") {
                    return (
                      <div key={index} className="flex flex-col gap-8">
                        {item.title && (
                          <div className="w-full">
                            <h2 className="text-xl font-semibold md:text-2xl">{item?.title}</h2>
                          </div>
                        )}
                        <div className="w-full">
                          <p className="text-lg font-light">{item?.description}</p>
                        </div>
                      </div>
                    );
                  } else if (item.selection === "image") {
                    return (
                      <div key={index} className="flex flex-col gap-8">
                        <div className="w-full">
                          <h2 className="text-xl font-semibold md:text-2xl">{item?.title}</h2>
                        </div>
                        <div className="w-full">
                          <img src={item?.image} alt={item?.title} className="w-full aspect-video object-top rounded-lg object-cover" />
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </article>
          <div className="flex-1 lg:grid hidden default-padding sticky top-2 ml-4 container-bg rounded-md h-96 place-items-center">
            <div className="grid place-items-center w-full h-full">
              <div className="w-fit">ADVERTISEMENT</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostBoilerPlate;
