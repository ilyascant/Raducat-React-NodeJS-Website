import React from "react";
import { Link } from "react-router-dom";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-container default-padding-x dark:text-white">
        <section className="relative flex gap-2 h-[450px]">
          <span className="absolute bg-red-600 rounded-md -left-2 -bottom-2 w-16 h-16 -z-10"></span>
          <span className="absolute bg-yellow-400 rounded-md -right-2 -bottom-2 w-32 h-32 -z-10"></span>
          <div className="w-1/2 h-full rounded-md overflow-hidden">
            <div className="relative flex-1 h-full rounded-md overflow-hidden">
              <Link>
                <div className="absolute w-full px-2 left-1/2 bottom-2 -translate-x-1/2 z-20">
                  <p className="font-bold text-white text-center min-w-0 hypen-auto break-words">
                    Watch Mikasa of Attack On Titan (Anime) Chase After Eren For Absolute No Reason
                  </p>
                  <div className="flex w-full justify-center items-center gap-6 my-1">
                    <MdChevronLeft className="text-3xl text-white" />
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((e, index) =>
                      index === 8 ? (
                        <button className="bg-white aspect-square flex-1 rounded-full scale-[2.5]" />
                      ) : (
                        <button className="bg-white aspect-square flex-1 rounded-full" />
                      )
                    )}
                    <MdChevronRight className="text-3xl text-white" />
                  </div>
                </div>
                <img
                  className="object-cover h-full w-full"
                  src="https://i.pinimg.com/originals/65/d7/8b/65d78b2013ecb003c3ed21c21bbae9f2.jpg"
                  alt="trendy-post"
                />
              </Link>
              <div className="slider-gradient-b-t absolute bottom-0 left-0 h-full w-full pointer-events-none" />
            </div>
          </div>
          <div className="w-1/2 h-full flex flex-col gap-2">
            <div className="h-1/2 flex flex-col gap-2">
              <div className="relative w-full h-1/2 flex-1 rounded-md overflow-hidden">
                <Link className="">
                  <p className="absolute left-2 top-1/2 -translate-y-1/2 text-center z-20 font-bold text-white">
                    TRENDY
                    <br />
                    QUIZ
                  </p>
                  <img
                    className="object-cover h-full w-full"
                    src="https://i.pinimg.com/originals/74/cf/93/74cf9348c493672d88ece0cee090876b.jpg"
                    alt="trendy-quiz"
                  />
                </Link>
                <div className="gradient-l-r absolute top-0 left-0 h-full w-full pointer-events-none"></div>
              </div>
              <div className="relative w-full flex-1 rounded-md overflow-hidden">
                <Link className="overflow-hidden">
                  <p className="absolute left-2 top-1/2 -translate-y-1/2 text-center z-20 font-bold text-white">
                    TRENDY
                    <br />
                    VIDEO
                  </p>
                  <img className="object-cover h-full w-full" src="https://www.criticalmention.com/wp-content/uploads/tiktok_banner.png" alt="trendy-video" />
                </Link>
                <div className="gradient-l-r absolute top-0 left-0 h-full w-full pointer-events-none" />
              </div>
            </div>

            <div className="h-1/2 flex flex-row gap-2">
              <div className="relative flex-1 rounded-md overflow-hidden">
                <Link className="">
                  <p className="absolute w-full px-2 left-1/2 bottom-2 -translate-x-1/2 z-20 font-bold text-white text-center min-w-0 hypen-auto break-words">
                    Attack on Titan Season 5 Will Be Released On 2023 Summer
                  </p>
                  <img
                    className="object-cover h-full w-full"
                    src="https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2022/01/05/How-to-watch-Attack-on-Titan-Final-Season-Part-2.jpg"
                    alt="trendy-post"
                  />
                </Link>
                <div className="gradient-b-t absolute bottom-0 left-0 h-full w-full pointer-events-none" />
              </div>
              <div className="relative flex-1 rounded-md overflow-hidden">
                <Link className="">
                  <p className="absolute w-full px-2 left-1/2 bottom-2 -translate-x-1/2 z-20 font-bold text-white text-center min-w-0 hypen-auto break-words">
                    The Ring Of Power's IMDB Ratings Are Below 2 Stars out of 5
                  </p>
                  <img className="object-cover h-full w-full" src="https://m.media-amazon.com/images/I/91wKh-pDgWL._RI_.jpg" alt="trendy-post" />
                </Link>
                <div className="gradient-b-t absolute bottom-0 left-0 h-full w-full pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center container-bg my-6 rounded-md">
          <div className="my-8">ADVERTISEMENT</div>
        </div>
        <div className="flex">
          {/* <section className="lg:w-contentWidth"> */}
          <section className="overflow-hidden">
            <div className="mb-4">
              <h2 className="font-semibold text-3xl">Trending</h2>
              <div className="w-64 h-1 bg-red-600 mt-1"></div>
              <div className="w-48 h-1 bg-red-600 mt-1"></div>
              <div className="w-36 h-1 bg-red-600 mt-1"></div>
            </div>
            <div
              className="relative
                         after:absolute after:right-0 after:top-0 after:h-full after:w-8 after:bg-gradient-to-l after:from-black/70 after:via-transparent after:z-10 after:pointer-events-none after:rounded-r-md
                         before:absolute before:left-0 before:top-0 before:h-full before:w-8 before:bg-gradient-to-r before:from-black/70 before:via-transparent before:z-10 before:pointer-events-none before:rounded-l-md">
              <div className="flex flex-row flex-nowrap gap-4 overflow-x-scroll scroll-smooth no-scrollbar rounded-md">
                {[0, 1, 2, 3, 4, 5, 6].map((e, index) => (
                  <Link key={index} className="h-64 shrink-0 grow-0 aspect-[2/3] rounded-md border border-slate-400 dark:border-white overflow-hidden">
                    {index}
                  </Link>
                ))}
              </div>
            </div>
          </section>
          {/* <div className="flex-1 lg:grid hidden default-padding sticky top-2 ml-4 container-bg rounded-md h-96 place-items-center">
            <div className="grid place-items-center w-full h-full">
              <div className="w-fit">ADVERTISEMENT</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
