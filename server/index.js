const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/indexRouter.js");
const authRouter = require("./routes/authRouter.js");
const createPostRouter = require("./routes/createPostRouter.js");
const adminRouter = require("./routes/adminRouter.js");

const getPostsRouter = require("./routes/getPostsRouter.js");
const editPostRouter = require("./routes/editPostRouter.js");

const getQuizzesRouter = require("./routes/getQuizzesRouter.js");

const app = express();
const PORT = 8800;

require("dotenv").config();

app.use(cookieParser());
app.use(cors());

app.use(express.json({ extended: false }));

app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/createpost", createPostRouter);
app.use("/api/editpost", editPostRouter);
app.use("/api/getadminpage", adminRouter);

// POSTS
app.use("/api/getposts", getPostsRouter);
// QUIZZES
app.use("/api/getquizzes", getQuizzesRouter);

app.get("/*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname + "/build/index.html"));
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMsg = err.message || "Something Went Wrong";
  return res.status(errorStatus).json({
    succes: false,
    status: errorStatus,
    message: errorMsg,
    stack: err.stack,
  });
});

// app.listen(PORT, () => console.log(`Server is Running On PORT: ${PORT}`));
module.exports = app;
