import React, { useEffect, useRef, useState } from "react";
import { BsBookmarkXFill } from "react-icons/bs";
import { MdCloudUpload } from "react-icons/md";

const AddImage = ({ index, editImage, postArea, setPostArea, imageTitleLen, imageDesLen }) => {
  const [image, setImage] = useState([editImage ? editImage : null, editImage ? editImage : null]);
  const [imageRef, imageInputRef] = [useRef(), useRef()];

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

  const onDragEnter = (e) => {
    // thumbnailRef.current.classList.remove("bg-violet-100");
    // thumbnailRef.current.classList.add("bg-violet-200");
  };
  const onDragLeave = (e) => {
    // thumbnailRef.current.classList.remove("bg-violet-200");
    // thumbnailRef.current.classList.add("bg-violet-100");
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
  const removeImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    imageInputRef.current.value = null;
    setImage([null, null]);
    setCurrentPostArea(null, image);
  };

  const onFileChange = async (e) => {
    e.preventDefault();

    let newFile = e.target?.files ? e.target?.files[0] : e.nativeEvent.dataTransfer?.files[0];
    if (newFile) {
      const imageURL = URL.createObjectURL(newFile);
      setImage([imageURL, newFile]);
      setCurrentPostArea("_", "image");
    }
  };

  useEffect(() => {
    if (image[1] !== null) {
      setPostArea((prev) => {
        const newArea = [...prev];
        newArea[index].image = image[1];
        return newArea;
      });
    }
  }, [image]);

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
        required
        initialheight={48}
        minLength={imageTitleLen[0]}
        maxLength={imageTitleLen[1]}
        type="text"
        name="title-area"
        placeholder="Title [Can NOT be Empty] - Click to Edit"
        onFocus={(e) => {
          textAreaAdjust({ e });
        }}
        onChange={(e) => {
          textAreaAdjust({ e });
          setCurrentPostArea(e, "title");
        }}
        value={postArea[index].title}
        className="title__area w-full min-h-[2.5rem] font-bold bg-transparent pt-2 resize-none outline-none overflow-hidden mb-2"></textarea>

      <div className="thumbnail_area mt-2 mb-6">
        <div
          onClick={() => imageInputRef.current?.click()}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onFileChange}
          className="w-full rounded-md cursor-pointer overflow-hidden">
          <input
            required
            name={"image" + index}
            ref={imageInputRef}
            type="file"
            accept="image/png,image/gif,image/jpeg,image/jpg,image/webp"
            className="hidden w-full cursor-pointer z-10"
            onChange={onFileChange}
          />

          {!image[0] ? (
            <div
              ref={imageRef}
              className="w-full border-2 dark:border-customgray border-light_input hover:bg-light_input dark:hover:bg-gray-600/30 border-dashed grid place-items-center">
              <span className="w-full my-4 md:my-12 text-center grid place-items-center dark:text-light_input text-gray-500">
                <MdCloudUpload className="w-24 h-24" />
                <span className="text-sm">
                  Post Image <br />
                  Click or Drop Image Here <br />
                  To Upload
                </span>
              </span>
            </div>
          ) : (
            <div className="relative w-full rounded-md grid place-items-center">
              <button className="z-20 opacity-30 hover:opacity-100 duration-300 transition-all ease-in-out" onClick={removeImage}>
                <BsBookmarkXFill className="absolute sm:text-6xl xxs:text-5xl text-3xl right-4 sm:-top-2 -top-1 z-10 text-logo hover:text-red-600" />
                <span className="absolute xxs:w-6 xxs:h-6 xxs:right-8 xxs:top-2 w-4 h-3 right-5 top-1 bg-white"></span>
              </button>
              <img src={image[0]} alt="thumbnail_photo" className="max-w-full w-full aspect-video object-top object-contain rounded-md" />
            </div>
          )}
        </div>
      </div>
      <textarea
        required
        initialheight={192}
        minLength={imageDesLen[0]}
        maxLength={imageDesLen[1]}
        type="text"
        name="description-area"
        placeholder="Some text [Can be Empty] - Click to Edit"
        onFocus={(e) => {
          textAreaAdjust({ e });
        }}
        onChange={(e) => {
          textAreaAdjust({ e });
          setCurrentPostArea(e, "description");
        }}
        value={postArea[index].description}
        className="description__area w-full min-h-[9rem] font-light bg-transparent pt-2 resize-none outline-none overflow-hidden"></textarea>
    </div>
  );
};

export default AddImage;
