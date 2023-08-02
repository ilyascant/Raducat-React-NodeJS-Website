import axios from "axios";

const fetchUser = async (URL) => {
  let user;
  try {
    user = await new Promise(async (resolve, reject) => {
      await axios({
        url: URL,
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        .then((e) => {
          if (e.data?.email) {
            resolve(e.data);
          } else reject(null);
        })
        .catch((e) => {
          reject(null);
        });
    });
  } catch (error) {
    return null;
  }
  return user;
};

export default fetchUser;
