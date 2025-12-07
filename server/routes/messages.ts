import { RequestHandler } from "express";
import { Message } from "@shared/api";

// In-memory storage (in production, use a database)
let messages: Message[] = [
  {
    id: "1",
    name: "Juan García",
    whatsapp: "+1 (555) 123-4567",
    email: "juan@example.com",
    city: "Los Angeles",
    message: "Interesado en las casas de Monterrey",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "2",
    name: "María López",
    whatsapp: "+1 (555) 234-5678",
    email: "maria@example.com",
    city: "Chicago",
    message: "Necesito información sobre IMSS",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const getMessages: RequestHandler = (_req, res) => {
  res.json(messages);
};

export const getMessage: RequestHandler = (req, res) => {
  const message = messages.find((m) => m.id === req.params.id);
  if (!message) {
    res.status(404).json({ error: "Mensaje no encontrado" });
    return;
  }
  res.json(message);
};

export const createMessage: RequestHandler = (req, res) => {
  const { name, whatsapp, email, city, message } = req.body;

  if (!name || !whatsapp || !email || !city) {
    res.status(400).json({ error: "Campos requeridos faltantes" });
    return;
  }

  const newMessage: Message = {
    id: Date.now().toString(),
    name,
    whatsapp,
    email,
    city,
    message: message || "",
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
};

export const markMessageAsRead: RequestHandler = (req, res) => {
  const messageIndex = messages.findIndex((m) => m.id === req.params.id);
  if (messageIndex === -1) {
    res.status(404).json({ error: "Mensaje no encontrado" });
    return;
  }

  messages[messageIndex].read = true;
  res.json(messages[messageIndex]);
};

export const deleteMessage: RequestHandler = (req, res) => {
  const messageIndex = messages.findIndex((m) => m.id === req.params.id);
  if (messageIndex === -1) {
    res.status(404).json({ error: "Mensaje no encontrado" });
    return;
  }

  const deletedMessage = messages[messageIndex];
  messages.splice(messageIndex, 1);
  res.json(deletedMessage);
};

export const getStats: RequestHandler = (_req, res) => {
  const unreadCount = messages.filter((m) => !m.read).length;
  res.json({
    totalMessages: messages.length,
    unreadMessages: unreadCount,
  });
};
