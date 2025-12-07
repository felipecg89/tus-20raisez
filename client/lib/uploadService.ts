import { supabase } from "./supabase";

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if larger than 1200px width
        if (width > 1200) {
          height = (height * 1200) / width;
          width = 1200;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob || file);
        }, "image/jpeg", 0.8);
      };
    };
  });
}

function compressVideo(file: File): Promise<Blob> {
  return Promise.resolve(file);
}

export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Compress image before upload
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, {
      type: "image/jpeg",
    });

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${Date.now().toString(36)}.jpg`;
    const path = `products/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(path, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL with transformation parameters for optimization
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export interface MediaFile {
  type: "image" | "video";
  url: string;
  path: string;
}

export async function uploadProductMedia(
  file: File,
  mediaType: "image" | "video"
): Promise<MediaFile> {
  try {
    let uploadedFile = file;

    // Compress if it's an image
    if (mediaType === "image" && file.type.startsWith("image/")) {
      const compressedBlob = await compressImage(file);
      uploadedFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
      });
    }

    // Create unique filename
    const timestamp = Date.now();
    const extension = mediaType === "video" ? "mp4" : "jpg";
    const filename = `${timestamp}-${Date.now().toString(36)}.${extension}`;
    const path = `product-media/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(path, uploadedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    return {
      type: mediaType,
      url: publicUrl,
      path: path,
    };
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
}

export async function deleteProductMedia(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
}

export async function deleteProductImage(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export interface BatchUploadOptions {
  onProgress?: (progress: number) => void;
  batchSize?: number;
}

export interface BatchUploadResult {
  successful: MediaFile[];
  failed: Array<{ file: File; error: string }>;
}

export async function batchUploadMedia(
  files: File[],
  options: BatchUploadOptions = {}
): Promise<BatchUploadResult> {
  const { onProgress, batchSize = 10 } = options;
  const successful: MediaFile[] = [];
  const failed: Array<{ file: File; error: string }> = [];

  // Validate files before upload
  const validFiles = files.filter((file) => {
    // Check file size
    if (file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        failed.push({
          file,
          error: `Image too large: ${file.name} (max 5MB)`,
        });
        return false;
      }
    } else if (file.type.startsWith("video/")) {
      if (file.size > 50 * 1024 * 1024) {
        failed.push({
          file,
          error: `Video too large: ${file.name} (max 50MB)`,
        });
        return false;
      }
    } else {
      failed.push({
        file,
        error: `Invalid file type: ${file.name}`,
      });
      return false;
    }
    return true;
  });

  // Upload in batches
  for (let i = 0; i < validFiles.length; i += batchSize) {
    const batch = validFiles.slice(i, i + batchSize);

    try {
      const batchResults = await Promise.allSettled(
        batch.map((file) => {
          const mediaType = file.type.startsWith("video/") ? "video" : "image";
          return uploadProductMedia(file, mediaType);
        })
      );

      batchResults.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          successful.push(result.value);
        } else {
          failed.push({
            file: batch[idx],
            error: result.reason?.message || "Unknown error",
          });
        }
      });
    } catch (error) {
      batch.forEach((file) => {
        failed.push({
          file,
          error: "Batch upload failed",
        });
      });
    }

    // Report progress
    const totalProcessed = successful.length + failed.length;
    const progress = (totalProcessed / files.length) * 100;
    if (onProgress) {
      onProgress(Math.min(progress, 99));
    }
  }

  if (onProgress) {
    onProgress(100);
  }

  return {
    successful,
    failed,
  };
}

export async function bulkAddProductMediaToAPI(
  productId: string,
  mediaItems: MediaFile[]
): Promise<any> {
  try {
    const response = await fetch("/api/products/media/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        mediaItems: mediaItems.map((media) => ({
          mediaType: media.type,
          mediaUrl: media.url,
          storagePath: media.path,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add media to database");
    }

    return await response.json();
  } catch (error) {
    console.error("Error bulk adding media to API:", error);
    throw error;
  }
}
