import { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

export const uploadImage: RequestHandler = async (req, res) => {
  try {
    const { imageData, fileName } = req.body;

    if (!imageData) {
      return res.status(400).json({
        error: "Image data is required",
      });
    }

    // Convert base64 to buffer
    let fileBuffer: Buffer;
    if (typeof imageData === "string") {
      // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      fileBuffer = Buffer.from(base64Data, "base64");
    } else {
      fileBuffer = Buffer.from(imageData);
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${Date.now().toString(36)}.jpg`;
    const path = `products/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, fileBuffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return res.status(400).json({
        error: `Upload failed: ${error.message}`,
      });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);

    res.json({
      url: publicUrl,
      path: path,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteImage: RequestHandler = async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({
        error: "Path is required",
      });
    }

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([path]);

    if (error) {
      return res.status(400).json({
        error: `Delete failed: ${error.message}`,
      });
    }

    res.json({
      success: true,
      message: "Image deleted",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Delete failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
