const multer = require("multer");
const { supabase } = require("../libs/supabase");

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage }); // for PDFs only

async function uploadPdfToSupabase(file, userId) {
  if (!file) throw new Error("No file provided");

  const fileName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
  const filePath = `task_pdfs/${fileName}`;

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype, // must be application/pdf
      upsert: false,
    });

  if (error) throw error;

  const { data: signed, error: signErr } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
  if (signErr) throw signErr;

  console.log("PDF buffer length:", file.buffer.length);
console.log("PDF file size:", file.size);

  return {
    filename: fileName,
    filePath: filePath,
    url: signed.signedUrl,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    uploadedBy: userId,
  };
}

module.exports = { uploadPdfToSupabase, upload };
