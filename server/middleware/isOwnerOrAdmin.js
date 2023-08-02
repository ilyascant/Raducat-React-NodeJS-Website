const createError = require("../utils/createError");

module.exports = isOwnerOrAdmin = async (req, res, next) => {
  let postData = req?.postData;
  if (typeof postData === "string") {
    try {
      postData = JSON.parse(postData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  if ((req?.user && req?.user?.role === "admin") || (postData && postData.owner?.uid === req.user?.uid)) return next();
  else {
    console.log("You Are not the OWNER or ADMIN.");
    return next(createError(404, "You Are not the OWNER or ADMIN."));
  }
};
