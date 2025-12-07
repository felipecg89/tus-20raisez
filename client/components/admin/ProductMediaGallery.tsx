import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";
import { uploadProductMedia, deleteProductMedia, MediaFile } from "@/lib/uploadService";

interface ProductMediaGalleryProps {
  productId?: string;
  mediaList: MediaFile[];
  onMediaAdded: (media: MediaFile) => void;
  onMediaRemoved: (path: string) => void;
}

export default function ProductMediaGallery({
  mediaList,
  onMediaAdded,
  onMediaRemoved,
}: ProductMediaGalleryProps) {
  const [uploading, setUploading] = useState(false);

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
          <div className="grid grid-cols-2 gap-2">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="flex items-center justify-center w-full h-12 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer transition-colors text-white font-medium">
                <ImageIcon className="h-4 w-4 mr-2" />
                {uploading ? "Subiendo..." : "Agregar Foto"}
              </div>
            </label>
            <label>
              <input
                type="file"
                accept="video/*"
                onChange={handleMediaUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="flex items-center justify-center w-full h-12 bg-purple-600 hover:bg-purple-700 rounded cursor-pointer transition-colors text-white font-medium">
                <Video className="h-4 w-4 mr-2" />
                {uploading ? "Subiendo..." : "Agregar Video"}
              </div>
            </label>
          </div>

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
