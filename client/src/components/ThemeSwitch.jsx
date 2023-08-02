import React, { useEffect, useRef, useState } from "react";

const ThemeSwitch = () => {
  const toggleRef = useRef(null);
  const [themeName, setThemeName] = useState("Dark");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark" || (!currentTheme && !window.matchMedia("(prefers-color-scheme: light)").matches)) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setThemeName("Dark");
      toggleRef.current.checked = true;
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setThemeName("Light");

      toggleRef.current.checked = false;
    }
  }, []);

  const switchTheme = (e) => {
    if (e.target.checked) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setThemeName("Dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setThemeName("Light");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-container w-full relative default-padding">
        <label className="mr-5 inline-flex cursor-pointer items-center">
          <input ref={toggleRef} onClick={switchTheme} type="checkbox" value="" className="peer sr-only" />
          <div
            className="relative h-6 w-12 rounded-full
                  bg-gray-300 peer-checked:bg-logo
                    after:absolute after:bg-white after:w-5 after:h-5 after:inset-0 after:rounded-full after:top-1/2 after:-translate-y-1/2 after:left-0.5
                    peer-checked:after:-translate-x-full peer-checked:after:left-[calc(100%-0.125rem)] after:transition-all after:duration-500
                    "></div>
          <span className="ml-3 text-sm font-medium text-dark dark:text-white">{`${themeName !== "Dark" ? "Dark" : "Light"}`} Theme</span>
        </label>
      </div>
    </div>
  );
};

export default ThemeSwitch;
