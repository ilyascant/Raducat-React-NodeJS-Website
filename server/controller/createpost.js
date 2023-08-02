const { addDoc, collection } = require("firebase/firestore");
const createError = require("../utils/createError.js");
const imageUploader = require("../utils/imageUploader");
const { db } = require("../firebase");
const fixURL = require("../utils/fixURL.js");

module.exports.post = async (req, res, next) => {
  let { postURL, postTitle, postDescription, postContent, postThumbnail = { file: null } } = req?.body;
  postTitle = postTitle?.trim();
  postDescription = postDescription?.trim();
  postURL = fixURL(req.body?.postURL?.trim());
  postContent = JSON.parse(postContent);

  const [postThumbnailFile, files] = [[], []];
  req?.files &&
    req.files?.forEach((e) => {
      if (e?.fieldname === "postThumbnail") postThumbnailFile.push(e);
      else if (e?.fieldname.split("-")[0] === "postImages") files.push(e);
    });

  const postURLLen = [8, 64],
    postTitleLen = [8, 196],
    postDescriptionLen = [8, 2048],
    textTitleLen = [0, 384],
    textDesLen = [8, 2048],
    imageTitleLen = [8, 384],
    imageDesLen = [0, 2048];

  const promises = [];

  if (postURL && postTitle && postContent) {
    try {
      if (postContent?.length < 1) {
        console.log(`You have to put Content To your Post`);
        throw createError(404, "You have to put Content To your Post");
      }
      if (postTitle?.length > postTitleLen[1] || postTitle?.length < postTitleLen[0]) {
        console.log(`Either passed post title ${postTitleLen[1]} limit or entered less than ${postTitleLen[0]} character`);
        throw createError(404, `Either passed post title ${postTitleLen[1]} limit or entered less than ${postTitleLen[0]} character`);
      }
      if (postDescription && postDescription?.length > postDescriptionLen[1]) {
        console.log(`Either passed post description ${postDescriptionLen[1]} limit or entered less than ${postDescriptionLen[0]} character`);
        throw createError(404, `Either passed post description ${postDescriptionLen[1]} limit or entered less than ${postDescriptionLen[0]} character`);
      }
      if (postURL?.length > postURLLen[1] || postURL?.length < postURLLen[0]) {
        console.log(`Either passed the url limit ${postURLLen[1]} or entered less than ${postURLLen[0]} character`);
        throw createError(404, `Either passed the url limit ${postURLLen[1]} or entered less than ${postURLLen[0]} character`);
      }
      if (postThumbnailFile && postThumbnailFile?.length < 1) {
        console.log(`Please include a thumbnail image`);
        throw createError(404, `Please include a thumbnail image`);
      } else {
        promises.push(imageUploader(postThumbnailFile[0], postThumbnail));
      }

      let fileIndex = 0;

      postContent.map(async (e, index) => {
        switch (e?.selection) {
          case "text":
            await new Promise((resolve, reject) => {
              e.title = e?.title?.trim();
              e.description = e?.description?.trim();
              if (e?.title?.length > textTitleLen[1] || e?.title?.length < textTitleLen[0]) {
                console.log(`Either passed the Text title limit ${textTitleLen[1]} or entered less than ${textTitleLen[0]} character`);
                throw createError(404, `Either passed the Text title limit ${textTitleLen[1]} or entered less than ${textTitleLen[0]} character`);
              } else if (e?.description?.length > textDesLen[1] || e?.description?.length < textDesLen[0]) {
                console.log(`Either passed the Text description limit ${textDesLen[1]} or entered less than ${textDesLen[0]} character`);
                throw createError(404, `Either passed the Text description limit ${textDesLen[1]} or entered less than ${textDesLen[0]} character`);
              }
            });
            break;
          case "image":
            e.title = e?.title?.trim();
            e.description = e?.description?.trim();
            if (e?.title?.length > imageTitleLen[1] || e?.title?.length < imageTitleLen[0]) {
              console.log(`Either passed the Image title limit ${imageTitleLen[1]} or entered less than ${imageTitleLen[0]} character`);
              throw createError(404, `Either passed the Image title limit ${imageTitleLen[1]} or entered less than ${imageTitleLen[0]} character`);
            } else if (e?.description?.length > imageDesLen[1] || e?.description?.length < imageDesLen[0]) {
              console.log(`Either passed the Image description limit ${imageDesLen[1]} or entered less than ${imageDesLen[0]} character`);
              throw createError(404, `Either passed the Image description limit ${imageDesLen[1]} or entered less than ${imageDesLen[0]} character`);
            }
            if (files[fileIndex]) {
              return promises.push(imageUploader(files[fileIndex++], postContent[index]));
            } else {
              console.log(`Please include a image for your image area`);
              throw createError(404, `Please include a image for your image area`);
            }
            break;
          default:
            break;
        }
      });

      await Promise.all(promises);

      postURL = fixURL(req.user?.displayName) + "/" + fixURL(req.body?.postURL.trim());
      const docRef = await addDoc(collection(db, "unapproved_posts"), {
        postURL,
        postTitle,
        postDescription,
        postThumbnail: postThumbnail?.image,
        postContent,
        owner: req.user?.uid,
        postedAt: new Date().getTime(),
        postType: "posts",
      });
      return res.status(200).json();
    } catch (err) {
      return next(createError(err?.status || 404, err?.message));
    }
  } else {
    console.log("Post URL, Post Thumbnail or Post Title can't be left Empty!");
    return next(createError(404, "Post URL, Post Thumbnail or Post Title can't be left Empty!"));
  }
};

module.exports.quiz = async (req, res, next) => {
  let { postURL, postTitle, postContent, postThumbnail = { file: null } } = req?.body;
  postTitle = postTitle?.trim();
  postURL = fixURL(req.body?.postURL?.trim());
  postContent = JSON.parse(postContent);

  const [postThumbnailFile, files] = [[], []];
  req?.files &&
    req.files?.forEach((e) => {
      if (e?.fieldname === "postThumbnail") postThumbnailFile.push(e);
      else if (e?.fieldname.split("-")[0] === "postImages") files.push(e);
    });

  const postContentLen = [16, 128],
    postURLLen = [8, 64],
    postTitleLen = [8, 196],
    imageNameLen = [1, 32];

  const promises = [];

  if (postURL && postTitle && postContent) {
    try {
      if (postContent?.length < 1) {
        console.log(`You have to put Content To your Post`);
        throw createError(404, "You have to put Content To your Post");
      }
      if (postContent?.length > postContentLen[1] || postContent?.length < postContentLen[0]) {
        console.log(`The maximum photo limit is 128, the minimum is 16.`);
        throw createError(404, "The maximum photo limit is 128, the minimum is 16.");
      }
      if (postContent?.length % 2 !== 0) {
        console.log(`The number of photos you upload must be even.`);
        throw createError(404, "The number of photos you upload must be even.");
      }
      if (postTitle?.length > postTitleLen[1] || postTitle?.length < postTitleLen[0]) {
        console.log(`Either passed post title ${postTitleLen[1]} limit or entered less than ${postTitleLen[0]} character`);
        throw createError(404, `Either passed post title ${postTitleLen[1]} limit or entered less than ${postTitleLen[0]} character`);
      }
      if (postURL?.length > postURLLen[1] || postURL?.length < postURLLen[0]) {
        console.log(`Either passed the url limit ${postURLLen[1]} or entered less than ${postURLLen[0]} character`);
        throw createError(404, `Either passed the url limit ${postURLLen[1]} or entered less than ${postURLLen[0]} character`);
      }

      if (postThumbnailFile && postThumbnailFile?.length < 1) {
        console.log(`Please include a thumbnail image`);
        throw createError(404, `Please include a thumbnail image`);
      } else {
        promises.push(imageUploader(postThumbnailFile[0], postThumbnail));
      }

      let fileIndex = 0;

      postContent.map((e, index) => {
        e.name = e?.name?.trim();
        e.winCount = 0;
        if (e?.name?.length > imageNameLen[1] || e?.name?.length < imageNameLen[0]) {
          console.log(`Either passed the Image name limit ${imageNameLen[1]} or entered less than ${imageNameLen[0]} character`);
          throw createError(404, `Either passed the Image name limit ${imageNameLen[1]} or entered less than ${imageNameLen[0]} character`);
        }
        if (files[fileIndex]) {
          return promises.push(imageUploader(files[fileIndex++], postContent[index]));
        } else {
          console.log(`Please include a image for your image area`);
          throw createError(404, `Please include a image for your image area`);
        }
      });

      await Promise.all(promises);

      postURL = fixURL(req.user?.displayName) + "/" + fixURL(req.body?.postURL?.trim());
      const docRef = await addDoc(collection(db, "unapproved_quizzes"), {
        postURL,
        postTitle,
        postThumbnail: postThumbnail?.image,
        postContent,
        owner: req.user?.uid,
        postedAt: new Date().getTime(),
        timesPlayed: 0,
        postType: "quizzes",
      });
      return res.status(200).json();
    } catch (err) {
      return next(createError(err?.status || 404, err?.message));
    }
  } else {
    console.log("Post URL, Post Thumbnail or Post Title can't be left Empty!");
    return next(createError(404, "Post URL, Post Thumbnail or Post Title can't be left Empty!"));
  }
};
