import React from "react";
import { Link } from "react-router-dom";

const CreatePost = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-container default-padding">
        <section className="post_type_selection flex justify-center  md:py-24 container-bg rounded-lg sm:py-12 py-8 px-5">
          <ul className="flex flex-wrap justify-center gap-12 font-medium text-base text-center">
            <li>
              <Link to={"/createpost/post"} className="flex flex-col gap-2 items-center">
                <div className="rounded-lg overflow-hidden drop-shadow-md border border-slate-400 dark:border-darkblue cursor-pointer hover:rotate-3 transition-all duration-500">
                  <img
                    className="object-cover w-52 md:w-60 aspect-square  hover:scale-125 transition-all duration-500"
                    src="https://img.freepik.com/free-vector/blogging-concept-with-man_23-2148653963.jpg?w=826&t=st=1681536403~exp=1681537003~hmac=df758a713764cb6c8821d9d82e7446553ce1076d650e4a1989d284ae6bb0fa5b"
                    alt="Post"
                  />
                </div>
                <span className="cursor-pointer link text-black dark:text-white dark-highlight-1-2">Post</span>
              </Link>
            </li>
            <li>
              <Link to={"/createpost/elimination"} className="flex flex-col gap-2 items-center">
                <div className="rounded-lg overflow-hidden drop-shadow-md border border-slate-400 dark:border-darkblue cursor-pointer hover:-rotate-3 transition-all duration-500">
                  <img
                    className="object-cover w-52 md:w-60 aspect-square hover:rotate-3 hover:scale-125 transition-all duration-500"
                    src="https://img.freepik.com/free-vector/choice-concept-illustration_114360-5842.jpg"
                    alt="Post"
                  />
                </div>
                <span className="cursor-pointer link text-black dark:text-white dark-highlight-1-2">Elimination</span>
              </Link>
            </li>
            <li>
              <Link to={"/createpost/personality"} className="flex flex-col gap-2 items-center">
                <div className="rounded-lg overflow-hidden drop-shadow-md border border-slate-400 dark:border-darkblue cursor-pointer hover:rotate-3 transition-all duration-500">
                  <img
                    className="object-cover w-52 md:w-60 aspect-square hover:rotate-3 hover:scale-125 transition-all duration-500"
                    src="https://static.vecteezy.com/system/resources/previews/003/145/566/non_2x/bipolar-disorder-hide-emotion-split-of-personality-vector.jpg"
                    alt="Post"
                  />
                </div>
                <span className="cursor-pointer link text-black dark:text-white dark-highlight-1-2">Personality Quiz</span>
              </Link>
            </li>
            <li>
              <Link to={"/createpost/test"} className="flex flex-col gap-2 items-center">
                <div className="rounded-lg overflow-hidden drop-shadow-md border border-slate-400 dark:border-darkblue cursor-pointer hover:-rotate-3 transition-all duration-500">
                  <img
                    className="object-cover w-52 md:w-60 aspect-square hover:rotate-3 hover:scale-125 transition-all duration-500"
                    src="https://static.vecteezy.com/system/resources/thumbnails/001/829/795/small/people-fly-flag-to-choose-yes-or-no-to-give-feedback-online-polling-mobile-apps-to-choose-to-agree-or-disagree-on-an-issue-or-problem-illustration-for-web-landing-page-banner-mobile-apps-free-vector.jpg"
                    alt="Post"
                  />
                </div>
                <span className="cursor-pointer link text-black dark:text-white dark-highlight-1-2">Test</span>
              </Link>
            </li>
            <li>
              <Link to={"/createpost/poll"} className="flex flex-col gap-2 items-center">
                <div className="rounded-lg overflow-hidden drop-shadow-md border border-slate-400 dark:border-darkblue cursor-pointer hover:rotate-3 transition-all duration-500">
                  <img
                    className="object-cover w-52 md:w-60 aspect-square hover:rotate-3 hover:scale-125 transition-all duration-500"
                    src="https://assets-us-01.kc-usercontent.com/469992e5-7cbd-0032-ead4-f2db9237053a/81077074-231d-4312-8e7a-43a8bd4e1ffc/2021-03-05_social_should-employers-use-personality-test.jpg"
                    alt="Post"
                  />
                </div>
                <span className="cursor-pointer link text-black dark:text-white dark-highlight-1-2">Poll</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CreatePost;
