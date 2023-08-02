import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import timeSince from "../utils/timeSince";
import fixURL from "../utils/fixURL";
import Spinner from "../components/Spinner";
import fetchData from "../utils/fetchData";

const Quizzes = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [quizzes, setQuizzes] = useState([]);

  const [lastQuizID, setLastQuizID] = useState(null);

  const navigate = useNavigate();

  useMemo(async () => {
    setLoading(true);
    await fetchData(`api/getquizzes/approved${lastQuizID ? `?lastQuizID=${lastQuizID}` : ""}`, {
      options: {
        method: "get",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setQuizzes(e.data?.quizzes);
        setLoading(false);
      },
      failCallBack: (e) => {
        setLoading(false);
        console.log(e);
      },
    });
  }, []);

  return loading !== false ? (
    <div className="w-full h-[50%] flex justify-center items-center">
      <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w={200} h={200} />
    </div>
  ) : (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-container default-padding">
        <ul className="w-full lg:w-9/12 container-bg flex flex-col items-center sm:default-padding p-2 rounded-lg">
          <>
            {quizzes.map((e, index) => {
              console.log(e);
              let displayName = e.owner?.displayName;
              let quizData = e?.postData;
              let quizTitle = quizData?.postTitle;
              let quizURL = quizData?.postURL;
              let quizImg = quizData?.postThumbnail;
              let quizID = quizData?.postID;
              let postedAt = timeSince(quizData?.postedAt);
              return (
                <li key={index} className="post_container w-full flex gap-4 relative dark:text-white text-black box-content mb-8 last:mb-0">
                  <div className={`flex-1 shrink grow ${index % 2 === 1 ? "hover:rotate-2" : "hover:-rotate-2"}`}>
                    <Link
                      to={`/quizzes/${quizURL}`}
                      className="flex items-center aspect-[3/2] border dark:border-customgray border-light drop-shadow-lg rounded-lg overflow-hidden">
                      <img
                        className="h-full w-full object-cover hover:scale-125 duration-150 transition-transform ease-in-out"
                        src={quizImg}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="elative flex-1 shrink grow sm:grow-[2] min-w-0 flex flex-col gap-2 font-medium hypen-auto break-words">
                    <div className="xs:text-xs text-[.6rem] leading-3 font-medium">
                      <span>
                        <span>TV & Movies</span>
                        <span> • </span>
                        <span>{postedAt} ago</span>
                      </span>
                    </div>
                    <div className="md:text-lg sm:text-base text-sm font-medium text-ellipsis">
                      <Link to={`/quizzes/${quizURL}`} className="link">
                        <h2 className="">{quizTitle}</h2>
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

export default Quizzes;
