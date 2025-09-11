const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage for images ONLY
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!file.mimetype.startsWith("image/")) {
      // Reject non-image files
    return null
    }

    return {
      folder: "task_images",
      resource_type: "image",
      public_id: Date.now() + "-" + file.originalname.replace(/\s/g, "_"),
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
