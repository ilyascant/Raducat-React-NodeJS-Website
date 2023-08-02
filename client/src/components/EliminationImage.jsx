import React, { useRef } from "react";
import { ImFilePicture } from "react-icons/im";
import { MdClose } from "react-icons/md";
import { onFileChange } from "../utils/dragAndDrop";

const EliminationImage = ({ index, data, setData }) => {
  const [eliminationRef, eliminationInputRef] = [useRef(), useRef()];

  return (
    <div
      ref={eliminationRef}
      onClick={(e) => {
        eliminationInputRef?.current?.click();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onFileChange(e, setData, index)}
      className="relative link">
      <input
        required
        name="eliminationFile"
        ref={eliminationInputRef}
        type="file"
        multiple={true}
        accept="image/png,image/gif,image/jpeg,image/jpg,image/webp"
        className="absolute hidden w-full pointer-events-none outline-none outline-0"
        onChange={(e) => onFileChange(e, setData, index)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      {data && data[index] && data[index]?.image && data[index]?.image.length > 0 && data[index]?.image[0] ? (
        <>
          <div className="sm:w-48 sm:h-72 w-36 h-52 rounded-lg border dark:border-customgray border-slate-400 overflow-hidden">
            <img className="w-full h-full object-cover" src={typeof data[index]?.image === "string" ? data[index]?.image : data[index]?.image[0]} alt="" />
          </div>
        </>
      ) : (
        <div className="relative sm:w-48 sm:h-72 w-40 h-56 rounded-lg border dark:border-customgray border-slate-400 overflow-hidden bg-customslate_light dark:bg-customslate_dark dark:hover:bg-customslate_dark/50 hover:bg-customslate_light/20 transition-colors duration-500">
          <div className="absolute text-gray-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ImFilePicture className="w-full h-full drop-shadow-md" />
            <br />
            <span>Add Image</span>
          </div>
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setData((prev) => {
            let newData = [...prev];
            if (newData && newData[index]) newData.splice(index, 1);
            return newData;
          });
        }}
        className="absolute top-0 right-0 text-center bg-red-600 rounded-tr-lg rounded-bl-lg z-20">
        <MdClose className="box-content w-8 h-8 text-white" />
      </button>
      <div className="w-full text-center">
        <textarea
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) =>
            setData((prev) => {
              let newData = [...prev];
              if (newData && newData[index]) {
                newData[index].name = e.target.value;
              } else {
                newData.push({ image: newData[index]?.image !== undefined ? newData[index]?.image[0] : [null, null], name: newData[index]?.name });
              }

              console.log(e.target.value);
              return newData;
            })
          }
          value={data[index]?.name || ""}
          required
          maxLength={32}
          type="text"
          placeholder="Click and Type Title"
          className="participant__name text-white placeholder:text-white/60 sm:w-48 w-36 h-20 text-center min-w-0 break-words font-normal text-sm bg-transparent pt-2 resize-none outline-none overflow-y-auto mb-2 z-20"
          name={`participant__${index}__name`}
          id={`participant__${index}__name`}
          cols="30"
          rows="10"></textarea>
      </div>
    </div>
  );
};

export default EliminationImage;
