const multer = require("multer");
const path = require("path");
const fs = require("fs");

// CREATE UPLOADS FOLDER IF NOT EXISTS
const uploadPath = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// STORAGE
const storage = multer.diskStorage({

  destination: function (
    req,
    file,
    cb
  ) {

    cb(
      null,
      uploadPath
    );

  },

  filename: function (
    req,
    file,
    cb
  ) {

    const cleanName =
      file.originalname.replace(
        /\s+/g,
        "-"
      );

    cb(
      null,
      Date.now() +
      "-" +
      cleanName
    );

  },

});

const upload = multer({
  storage,
});

module.exports = upload;