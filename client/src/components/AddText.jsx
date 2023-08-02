import React, { useEffect } from "react";
import { BsBookmarkXFill } from "react-icons/bs";

const AddText = ({ index, postArea, setPostArea, textTitleLen, textDesLen }) => {
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
        (element.scrollHeight + 100 >= element.attributes.initialheight?.value ? element.scrollHeight : element.attributes.initialheight?.value) +
        "px";
    }
  };

  const setCurrentPostArea = (e, area) => {
    setPostArea((prev) => {
      const newArea = [...prev];
      switch (area) {
        case "title":
          newArea[index].title = e.target.value;
          break;
        case "description":
          newArea[index].description = e.target.value;
          break;
        default:
          break;
      }
      return newArea;
    });
  };

  const removeCurrentPostArea = () => {
    setPostArea((prev) => {
      const newArea = [...prev];
      newArea.splice(index, 1);
      return newArea;
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
    <div className="relative w-full dark:bg-customslate_dark bg-white rounded-md px-3 py-2 flex flex-col">
      <button
        className="z-20 opacity-30 hover:opacity-100 duration-300 transition-all ease-in-out"
        onClick={(e) => {
          e.stopPropagation();
          removeCurrentPostArea();
        }}>
        <BsBookmarkXFill className="absolute sm:text-6xl xxs:text-5xl text-3xl right-4 sm:-top-2 -top-1 z-10 text-logo hover:text-red-600" />
        <span className="absolute xxs:w-6 xxs:h-6 xxs:right-8 xxs:top-2 w-4 h-3 right-5 top-1 bg-white"></span>
      </button>
      <textarea
        initialheight={48}
        minLength={textTitleLen[0]}
        maxLength={textTitleLen[1]}
        type="text"
        name="title-area"
        placeholder="Title [Can be Empty] - Click to Edit"
        onFocus={(e) => {
          textAreaAdjust(e);
        }}
        onChange={(e) => {
          textAreaAdjust(e);
          setCurrentPostArea(e, "title");
        }}
        value={postArea[index].title}
        className="title__area w-full min-h-[2.5rem] font-bold bg-transparent pt-2 resize-none outline-none overflow-hidden mb-2"></textarea>
      <div className="w-10/12 border-t mb-4 dark:border-customgray border-light_input mr-auto ml-auto"></div>
      <textarea
        required
        initialheight={192}
        minLength={textDesLen[0]}
        maxLength={textDesLen[1]}
        type="text"
        name="text-area"
        placeholder="Some text [Can NOT be Empty] - Click to Edit"
        onFocus={(e) => {
          textAreaAdjust(e);
        }}
        onChange={(e) => {
          textAreaAdjust(e);
          setCurrentPostArea(e, "description");
        }}
        value={postArea[index].description}
        className="description__area w-full min-h-[9rem] font-light bg-transparent pt-2 resize-none outline-none overflow-hidden"></textarea>
    </div>
  );
};

export default AddText;
