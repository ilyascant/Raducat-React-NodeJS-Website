const path = require("path");
const stream = require("stream");
const { admin } = require("../firebase");
const fixURL = require("./fixURL");

const imageUploader = (image, area = null, name = null) => {
  return new Promise((resolve, reject) => {
    const bucket = admin.storage().bucket();
    const imageName = name || "IMAGE-" + Date.now() + `-${fixURL(String(Math.floor(Math.random() * 10000000000000) + 1))}` + path.extname(image?.originalname);
    const file = bucket.file(imageName);
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(image.buffer);
    passthroughStream.end();
    passthroughStream.pipe(file.createWriteStream()).on("finish", () => {
      resolve((area.image = area ? `https://storage.googleapis.com/${bucket.name}/${imageName}` : null));
    });
  });
};

module.exports = imageUploader;
