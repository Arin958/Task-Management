const { supabase } = require("../libs/supabase");

exports.download = async (req, res) => {
  try {
    // Get file path from query or params
    const filePath = decodeURIComponent(req.query.path || req.params.filePath || "");
    if (!filePath) return res.status(400).json({ success: false, error: "File path is required" });

    console.log("Requested file:", filePath);

    // Download file from Supabase storage
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .download(filePath);

    if (error) return res.status(500).json({ success: false, error: error.message });

    // Set proper headers for download
    const fileName = filePath.split("/").pop();
    res.setHeader("Content-Type", "application/pdf"); // adjust if needed
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Send file buffer to client
    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
