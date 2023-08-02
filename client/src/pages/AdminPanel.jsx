import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fetchData from "../utils/fetchData";
import timeSince from "../utils/timeSince";
import fixURL from "../utils/fixURL";
import Spinner from "../components/Spinner";

const AdminPanel = () => {
  const [posts, setPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState({});

  const [lastPostID, setLastPostID] = useState(null);

  const [loading, setLoading] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("An error occured. Please try again. 😭");

  const navigate = useNavigate();

  useMemo(async () => {
    setLoading(true);

    await fetchData(`api/getadminpage/${lastPostID ? `?lastPostID=${lastPostID}` : ""}`, {
      options: {
        method: "get",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setPosts([...e?.data]);
        setLoading(false);
      },
      failCallBack: () => setLoading(false),
    });
  }, [lastPostID]);

  return loading ? (
    <div className="w-full h-[50%] flex justify-center items-center">
      <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w={200} h={200} />
    </div>
  ) : (
    <div className="w-full flex justify-center">
      {posts && posts.length > 0 && (
        <div className="w-full max-w-container default-padding">
          <ul className="w-full lg:w-9/12 container-bg flex flex-col items-center sm:default-padding p-2 rounded-lg">
            <>
              {posts.map((e, index) => {
                let displayName = e.owner?.displayName;
                let postData = e?.postData;
                let postTitle = postData?.postTitle;
                let postURL = postData?.postURL;
                let postImg = postData?.postThumbnail;
                let postID = postData?.postID;
                let postType = postData?.postType;
                let postedAt = timeSince(postData?.postedAt);
                const approvePost = async () => {
                  const fetchURL = `api/get${postType}/approve`;
                  await fetchData(fetchURL, {
                    options: {
                      data: { postID },
                      method: "post",
                      withCredentials: true,
                    },
                    successCallBack: (e) => {
                      let strIndex = String(index);

                      setApprovedPosts((prevState) => {
                        return {
                          ...prevState,

                          // const strIndex = "example";
                          // const index = 42;
                          // const obj = {[strIndex]: index};
                          // console.log(obj); // Output: { "example": 42 }

                          [strIndex]: index,
                        };
                      });
                      return null;
                    },
                    failCallBack: (e) => console.log(e),
                  });
                };

                return (
                  <li key={index} className="post_container w-full flex gap-4 relative dark:text-white text-black box-content mb-8 last:mb-0">
                    <div className="absolute -top-3 -left-3 bg-yellow-400 z-20 rounded-full w-14 h-14 grid content-center justify-center -rotate-[30deg] text-black font-semibold">
                      <span>{postType === "quizzes" ? "Quiz" : postType === "posts" ? "Post" : null}</span>
                    </div>
                    {approvedPosts[index] === index && (
                      <div className="absolute z-10 w-full h-full top-0 left-0 pattern-diagonal-lines pattern-green-600 pattern-bg-transparent pattern-size-8 pattern-opacity-20"></div>
                    )}
                    <div className={`flex-1 shrink grow ${index % 2 === 1 ? "hover:rotate-2" : "hover:-rotate-2"}`}>
                      <Link
                        to={`/${postType}/preview/${postURL}`}
                        className="flex items-center aspect-[3/2] border dark:border-customgray border-light drop-shadow-lg rounded-lg overflow-hidden">
                        <img
                          className="h-full w-full object-cover hover:scale-125 duration-150 transition-transform ease-in-out"
                          src={postImg}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="relative flex-1 shrink grow sm:grow-[2] min-w-0 flex flex-col gap-2 font-medium hypen-auto break-words">
                      <div className="xs:text-xs text-[.6rem] leading-3 font-medium">
                        <span>
                          <span>TV & Movies</span>
                          <span> • </span>
                          <span>{postedAt} ago</span>
                        </span>
                      </div>
                      <div className="md:text-lg sm:text-base text-sm font-medium text-ellipsis">
                        <Link to={`/${postType}/preview/${postURL}`} className="link">
                          <h2 className="">{postTitle}</h2>
                        </Link>
                      </div>
                      <div className="xs:text-xs text-[.5rem] break-all">
                        <span className="font-light">by</span>
                        <Link className="link" to={`user/${fixURL(displayName)}`}>
                          <span className="font-medium"> {displayName}</span>
                        </Link>
                      </div>
                      <div className="relative self-end mt-auto xs:text-xs text-[.5rem] text-yellow-500 font-semibold">
                        <button onClick={approvePost}>
                          {approvedPosts[index] === index ? "Approved" : "Waiting for Approval (Click to Approve)"}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
