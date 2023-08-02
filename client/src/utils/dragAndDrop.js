const allowedExtensions = ["png", "gif", "jpeg", "jpg", "webp"];

export const onFileChange = (e, setData, index = 0) => {
  e.preventDefault();
  if (e.target?.files || e.nativeEvent.dataTransfer?.files) {
    // if uploaded multiple imag
    if (e.target.files?.length > 1 || e.nativeEvent.dataTransfer?.files?.length > 1) {
      let newFiles = e.target?.files ? e.target?.files : e.nativeEvent.dataTransfer?.files;
      if (newFiles) {
        setData((prev) => {
          let newData = [...prev];
          newData.pop();
          for (const file of newFiles) {
            if (newData) {
              let extension = file.name.split(".")[1];
              let name = file.name.split(".")[0];
              if (!allowedExtensions.includes(extension)) continue;
              newData.push({ image: [URL.createObjectURL(file), file], name });
            }
          }
          return newData;
        });
      }
    } else {
      let newFile = e.target?.files ? e.target?.files[0] : e.nativeEvent.dataTransfer?.files[0];
      let extension = newFile.name.split(".")[1];
      let name = newFile.name.split(".")[0];
      if (!allowedExtensions.includes(extension)) return;

      if (newFile) {
        setData((prev) => {
          let newData = [...prev];
          if (newData) {
            if (newData[index]) {
              newData[index] = { image: [URL.createObjectURL(newFile), newFile], name };
            } else {
              newData.push({ image: [URL.createObjectURL(newFile), newFile], name });
            }
            return newData;
          }
        });
      }
    }
  }
};
