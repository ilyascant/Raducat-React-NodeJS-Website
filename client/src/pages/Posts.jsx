import React, { useEffect, useMemo, useRef, useState } from "react";
import fetchData from "../utils/fetchData";
import fixURL from "../utils/fixURL";
import timeSince from "../utils/timeSince";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Posts = () => {
  const [loading, setLoading] = useState(true);

  const [lastPostID, setLastPostID] = useState(null);
  const [posts, setPosts] = useState([]);

  useMemo(async () => {
    setLoading(true);
    await fetchData(`api/getposts/approved${lastPostID ? `?lastPostID=${lastPostID}` : ""}`, {
      options: {
        method: "get",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setPosts(e.data?.posts);
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
              let postedAt = timeSince(postData?.postedAt);

              return (
                <li key={index} className="post_container w-full flex gap-4 relative dark:text-white text-black box-content mb-8 last:mb-0">
                  <div className={`flex-1 shrink grow ${index % 2 === 1 ? "hover:rotate-2" : "hover:-rotate-2"}`}>
                    <Link
                      to={`/posts/${postURL}`}
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
                      <Link to={`/posts/${postURL}`} className="link">
                        <h2 className="">{postTitle}</h2>
                      </Link>
                    </div>
                    <div className="xs:text-xs text-[.5rem] break-all">
                      <span className="font-light">by</span>
                      <Link className="link" to={`user/${fixURL(displayName)}`}>
                        <span className="font-medium"> {displayName}</span>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </>
        </ul>
      </div>
    </div>
  );
};

export default Posts;
