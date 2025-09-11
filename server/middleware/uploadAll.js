const multer = require("multer");
const { uploader } = require("../config/cloudinary"); // Cloudinary SDK
const { uploadPdfToSupabase } = require("./pdfFile");

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage }).fields([
  { name: "images", maxCount: 5 },
  { name: "documents", maxCount: 5 },
]);

const uploadAll = (req, res, next) => {
  upload(req, res, async err => {
    if (err) return next(err);

    req.files = req.files || {};

    // 🔹 Handle images upload to Cloudinary
    if (req.files.images?.length) {
      const imageAttachments = [];
      for (const file of req.files.images) {
        try {
          // Upload image buffer to Cloudinary
          const uploaded = await new Promise((resolve, reject) => {
            const stream = uploader.upload_stream(
              { folder: "task_images" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(file.buffer);
          });

          imageAttachments.push({
            filename: uploaded.public_id,
            url: uploaded.secure_url,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: req.user._id,
          });
        } catch (error) {
          return next(error);
        }
      }
      req.files.images = imageAttachments;
    }

    // 🔹 Handle PDFs upload to Supabase
    if (req.files.documents?.length) {
      const pdfAttachments = [];
      for (const file of req.files.documents) {
        try {
          const pdfAttachment = await uploadPdfToSupabase(file, req.user._id);
          pdfAttachments.push(pdfAttachment);
        } catch (error) {
          return next(error);
        }
      }
      req.files.documents = pdfAttachments;
    }

    next();
  });
};

module.exports = uploadAll;
