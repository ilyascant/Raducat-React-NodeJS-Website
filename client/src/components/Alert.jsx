import React from "react";

const Alert = ({ color, alertStatus, alertMessage, alertTitle, symbol }) => {
  return (
    <>
      {alertStatus !== null && (
        <div
          id="alert"
          className={`p-4 text-white rounded-lg dark:border dark:border-white ${
            color ? color : alertStatus === "success" ? "bg-emerald-400" : "bg-red-500"
          } `}
          role="alert">
          <div className="flex items-center">
            {symbol ? (
              <p className="mr-2 text-2xl">{symbol}</p>
            ) : (
              <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"></path>
              </svg>
            )}
            <span className="sr-only">Info</span>
            <h3 className="text-base font-medium">{alertTitle ? alertTitle : alertStatus === "success" ? "Success" : "Error Occurred"}</h3>
          </div>
          <div className="mt-1 text-sm">{alertMessage}</div>
        </div>
      )}
    </>
  );
};

export default Alert;
