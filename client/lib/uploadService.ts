async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
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
          if (blob) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.onerror = () => reject(new Error("Failed to compress image"));
          } else {
            reject(new Error("Failed to compress image"));
          }
        }, "image/jpeg", 0.8);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}

function compressVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => reject(new Error("Failed to read video"));
  });
}

export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Compress image before upload
    const imageData = await compressImage(file);

    // Upload via backend API
    const response = await fetch("/api/upload/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const result = await response.json();
    return result.url;
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
    let mediaData: string;

    if (mediaType === "image" && file.type.startsWith("image/")) {
      mediaData = await compressImage(file);
    } else if (mediaType === "video") {
      mediaData = await compressVideo(file);
    } else {
      mediaData = await compressImage(file);
    }

    // Upload via backend API
    const response = await fetch("/api/upload/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData: mediaData,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const result = await response.json();

    return {
      type: mediaType,
      url: result.url,
      path: result.path,
    };
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
}

export async function deleteProductMedia(path: string): Promise<void> {
  try {
    const response = await fetch("/api/upload/image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
}

export async function deleteProductImage(path: string): Promise<void> {
  try {
    const response = await fetch("/api/upload/image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Delete failed");
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
