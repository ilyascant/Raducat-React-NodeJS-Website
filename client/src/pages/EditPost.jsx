import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import fetchData from "../utils/fetchData";
import timeSince from "../utils/timeSince";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { useStateValue } from "../context/StateProvider";
import fixURL from "../utils/fixURL";
import NewPost from "./NewPost";
import NewQuiz from "./NewQuiz";

const EditPost = ({ type }) => {
  const [{ user }, dispatch] = useStateValue();

  const { preview, postURL, userName, quizURL } = useParams();
  const [{ postID, post, owner }, setPost] = useState({});
  const [timePassed, setTimePassed] = useState("unknown");

  const [loading, setLoading] = useState(false);

  const [alertStatus, setAlertStatus] = useState(true);
  const [alertMessage, setAlertMessage] = useState(<h1>You are in edit mode. After apply your changes there is no way to recover old data.</h1>);

  const navigate = useNavigate();

  useMemo(async () => {
    setLoading(true);
    let fetchURL;

    if (postURL) {
      fetchURL = !preview ? `/api/getposts/approved/${userName + "/" + postURL}` : `/api/getposts/unapproved/preview/${userName + "/" + postURL}`;
    } else if (quizURL) {
      fetchURL = !preview ? `/api/getquizzes/approved/${userName + "/" + quizURL}` : `/api/getquizzes/unapproved/preview/${userName + "/" + quizURL}`;
    } else {
      return setLoading(false);
    }
    await fetchData(fetchURL, {
      options: {
        method: "get",
        withCredentials: true,
      },
      successCallBack: (e) => {
        setPost({ post: e?.data?.postData, owner: e?.data?.owner, postID: e?.data?.postData?.postID });
        setTimePassed(timeSince(e?.data?.postData.postedAt));
      },
      failCallBack: () => setLoading(false),
    });

    setLoading(false);
  }, []);

  return post === undefined || loading ? (
    <div className="w-full h-[50%] flex justify-center items-center">
      <Spinner darkColor={"blue-600"} darkFillColor={"#88abf7"} w={200} h={200} />
    </div>
  ) : (
    <div className="flex flex-col items-center w-full dark:text-white">
      {owner?.uid === user?.uid || user?.role.toLowerCase() === "admin" || user?.role.toLowerCase() === "mod" ? (
        <div className="break-words hyphens-auto max-w-container w-full flex md:justify-start justify-center default-padding-x">
          <article className="w-full relative lg:w-8/12 flex flex-col default-padding container-bg rounded-md">
            {alertStatus && (
              <div className="mb-24">
                <Alert color="bg-orange-500" symbol="⚠" alertMessage={alertMessage} alertStatus={alertStatus} alertTitle="ATTENTION" />
              </div>
            )}
            {postURL && <NewPost editPost={{ ...post, owner, preview }} />}
            {quizURL && <NewQuiz editPost={{ ...post, owner, preview }} />}
          </article>
        </div>
      ) : (
        navigate(-1)
      )}
    </div>
  );
};

export default EditPost;
