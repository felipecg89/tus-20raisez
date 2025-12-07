import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Image as ImageIcon, Video, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadProductMedia, deleteProductMedia, MediaFile, batchUploadMedia, bulkAddProductMediaToAPI } from "@/lib/uploadService";

interface ProductMediaGalleryProps {
  productId?: string;
  mediaList: MediaFile[];
  onMediaAdded: (media: MediaFile) => void;
  onMediaRemoved: (path: string) => void;
}

export default function ProductMediaGallery({
  productId,
  mediaList,
  onMediaAdded,
  onMediaRemoved,
}: ProductMediaGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [batchUploadActive, setBatchUploadActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<Array<{ file: string; error: string }>>([]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Determine media type
    let mediaType: "image" | "video" = "image";
    if (file.type.startsWith("video/")) {
      mediaType = "video";
    } else if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen o video válido");
      return;
    }

    // Validate file size (50MB max for videos, 5MB for images)
    const maxSize = mediaType === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `El archivo debe ser menor a ${mediaType === "video" ? "50MB" : "5MB"}`
      );
      return;
    }

    try {
      setUploading(true);
      const media = await uploadProductMedia(file, mediaType);
      onMediaAdded(media);
      toast.success(
        `${mediaType === "image" ? "Imagen" : "Video"} subido correctamente`
      );
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setBatchUploadActive(true);
      setUploadErrors([]);
      setUploadProgress(0);

      const result = await batchUploadMedia(files, {
        onProgress: setUploadProgress,
        batchSize: 10,
      });

      // Add successful uploads to media list
      result.successful.forEach((media) => {
        onMediaAdded(media);
      });

      // Record failed uploads
      if (result.failed.length > 0) {
        const errors = result.failed.map((f) => ({
          file: f.file.name,
          error: f.error,
        }));
        setUploadErrors(errors);

        toast.warning(
          `${result.successful.length} archivo(s) subido(s), ${result.failed.length} error(es)`
        );
      } else {
        toast.success(`${result.successful.length} archivo(s) subido(s) correctamente`);
      }

      // If product exists and uploads were successful, add to database
      if (productId && result.successful.length > 0) {
        try {
          await bulkAddProductMediaToAPI(productId, result.successful);
        } catch (error) {
          console.error("Error adding to database:", error);
          toast.error("Los archivos se subieron pero no se guardaron en la base de datos");
        }
      }
    } catch (error) {
      console.error("Error in batch upload:", error);
      toast.error("Error durante la carga por lotes");
    } finally {
      setBatchUploadActive(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteMedia = async (path: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este archivo?"))
      return;

    try {
      await deleteProductMedia(path);
      onMediaRemoved(path);
      toast.success("Archivo eliminado");
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Error al eliminar el archivo");
    }
  };

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white">Galería de Medios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaUpload}
                disabled={uploading || batchUploadActive}
                className="hidden"
              />
              <div className="flex items-center justify-center w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded cursor-pointer transition-colors text-white font-medium">
                <ImageIcon className="h-4 w-4 mr-2" />
                {uploading ? "Subiendo..." : "Foto"}
              </div>
            </label>
            <label>
              <input
                type="file"
                accept="video/*"
                onChange={handleMediaUpload}
                disabled={uploading || batchUploadActive}
                className="hidden"
              />
              <div className="flex items-center justify-center w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded cursor-pointer transition-colors text-white font-medium">
                <Video className="h-4 w-4 mr-2" />
                {uploading ? "Subiendo..." : "Video"}
              </div>
            </label>
            <label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleBatchUpload}
                disabled={uploading || batchUploadActive}
                className="hidden"
              />
              <div className="flex items-center justify-center w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded cursor-pointer transition-colors text-white font-medium text-sm">
                <Upload className="h-4 w-4 mr-1" />
                {batchUploadActive ? "Cargando..." : "Lote"}
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {batchUploadActive && (
            <div className="space-y-2">
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-300">{Math.round(uploadProgress)}% completado</p>
            </div>
          )}

          {/* Upload Errors */}
          {uploadErrors.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-1">
                    {uploadErrors.length} error(es) durante la carga
                  </p>
                  <ul className="text-xs text-red-200 space-y-1">
                    {uploadErrors.slice(0, 3).map((err, idx) => (
                      <li key={idx}>• {err.file}: {err.error}</li>
                    ))}
                    {uploadErrors.length > 3 && (
                      <li>• ... y {uploadErrors.length - 3} más</li>
                    )}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setUploadErrors([])}
                className="text-xs text-red-300 hover:text-red-200 underline"
              >
                Descartar
              </button>
            </div>
          )}

          {/* Media Grid */}
          {mediaList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mediaList.map((media, idx) => (
                <div key={idx} className="relative group">
                  <div className="relative w-full aspect-square bg-slate-600 rounded overflow-hidden">
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        onClick={() => handleDeleteMedia(media.path)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-1 right-1 px-2 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300">
                      {media.type === "image" ? "📸" : "🎥"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">No hay medios añadidos aún</p>
              <p className="text-xs mt-1">Agrega fotos o videos</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
