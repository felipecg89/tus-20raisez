import { useState, useEffect } from "react";
import { Message } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface AdminMessagesProps {
  onUpdate: () => void;
}

export default function AdminMessages({ onUpdate }: AdminMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data.sort((a: Message, b: Message) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error al cargar mensajes");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Error marking message as read");

      toast.success("Mensaje marcado como leído");
      fetchMessages();
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el mensaje");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este mensaje?"))
      return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error deleting message");

      toast.success("Mensaje eliminado");
      fetchMessages();
      onUpdate();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el mensaje");
    }
  };

  const filteredMessages = messages.filter((msg) =>
    filter === "unread" ? !msg.read : true
  );

  if (loading) {
    return <div className="text-slate-400">Cargando mensajes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Mensajes ({filteredMessages.length})
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-blue-600" : ""}
          >
            Todos
          </Button>
          <Button
            onClick={() => setFilter("unread")}
            variant={filter === "unread" ? "default" : "outline"}
            className={filter === "unread" ? "bg-orange-600" : ""}
          >
            Sin leer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`bg-slate-700 border-slate-600 cursor-pointer transition-all ${
                selectedMessage?.id === message.id
                  ? "ring-2 ring-blue-500"
                  : "hover:bg-slate-600"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{message.name}</p>
                    <p className="text-xs text-slate-400">{message.city}</p>
                  </div>
                  {!message.read && (
                    <Badge className="bg-orange-600 text-white">Nuevo</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{selectedMessage.name}</CardTitle>
                    <p className="text-sm text-slate-400 mt-2">
                      📍 {selectedMessage.city}
                    </p>
                    <p className="text-sm text-slate-400">
                      📧 {selectedMessage.email}
                    </p>
                    <p className="text-sm text-slate-400">
                      📱 {selectedMessage.whatsapp}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {new Date(selectedMessage.createdAt).toLocaleString("es-MX")}
                    </p>
                    {!selectedMessage.read && (
                      <Badge className="bg-orange-600 text-white mt-2">Sin leer</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMessage.message && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">
                      Mensaje
                    </h4>
                    <p className="text-slate-300 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-600 pt-4 flex gap-2">
                  {!selectedMessage.read && (
                    <Button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Marcar como leído
                    </Button>
                  )}
                  {selectedMessage.read && (
                    <Button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      variant="outline"
                      className="border-slate-500 text-slate-300"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Leído
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="bg-red-600 hover:bg-red-700 ml-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="pt-6">
                <p className="text-center text-slate-400">
                  Selecciona un mensaje para verlo en detalle
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {filteredMessages.length === 0 && (
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="pt-6">
            <p className="text-center text-slate-400">
              {filter === "unread"
                ? "¡No hay mensajes sin leer!"
                : "No hay mensajes"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
