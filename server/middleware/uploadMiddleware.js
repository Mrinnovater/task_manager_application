const multer = require("multer");
const path = require("path");

// STORAGE
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },

});

// FILE FILTER
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;