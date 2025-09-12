const express = require("express");
const { supabase } = require("../libs/supabase"); // adjust path if needed

const testRoutes = express.Router();

/**
 * ✅ Test Supabase DB connection
 */
testRoutes.get("/test-supabase", async (req, res) => {
  try {
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("Bucket:", process.env.SUPABASE_BUCKET);

    // Try a simple DB query (replace "users" with any table you have)
    const { data, error } = await supabase.from("users").select("*").limit(1);

    if (error) {
      console.error("Supabase DB error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ Test Supabase Storage upload
 */
testRoutes.get("/test-storage", async (req, res) => {
  try {
    const filePath = `test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, Buffer.from("hello from Render!"), {
        contentType: "text/plain",
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = testRoutes;
