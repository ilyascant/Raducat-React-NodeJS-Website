import axios from "axios";

const fetchData = (URL, { successCallBack, failCallBack, options }) => {
  try {
    axios({
      url: URL,
      ...options,
      headers: options?.headers || {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((e) => successCallBack(e))
      .catch((e) => failCallBack(e));
  } catch (error) {
    return failCallBack(error);
  }
};

export default fetchData;
