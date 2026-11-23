import { RequestHandler } from "express";
import { Message } from "@shared/api";
import { supabase, supabaseAdmin } from "../lib/supabase";

let inMemoryMessages: Message[] = [
  {
    id: "1",
    name: "Juan García",
    whatsapp: "+1 (555) 123-4567",
    email: "juan@example.com",
    city: "Los Angeles",
    message: "Interesado en opciones de casas en Guanajuato y asesoría legal",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "2",
    name: "María López",
    whatsapp: "+1 (555) 234-5678",
    email: "maria@example.com",
    city: "Chicago",
    message: "Necesito información sobre pensión IMSS Modalidad 40 desde EE. UU.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const getMessages: RequestHandler = async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        whatsapp: m.whatsapp,
        email: m.email,
        city: m.city || "",
        message: m.message || "",
        createdAt: m.created_at,
        read: !!m.read,
      }));
      return res.json(mapped);
    }
  } catch (e) {
    console.warn("Supabase contact_messages fallback:", e);
  }

  return res.json(inMemoryMessages);
};

export const getMessage: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return res.json({
        id: data.id,
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email,
        city: data.city || "",
        message: data.message || "",
        createdAt: data.created_at,
        read: !!data.read,
      });
    }
  } catch (e) {}

  const message = inMemoryMessages.find((m) => m.id === id);
  if (!message) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }
  return res.json(message);
};

export const createMessage: RequestHandler = async (req, res) => {
  const { name, whatsapp, email, city, message } = req.body;

  if (!name || !whatsapp || !email || !city) {
    return res.status(400).json({ error: "Campos requeridos faltantes" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .insert([
        {
          name,
          whatsapp,
          email,
          city,
          message: message || "",
          read: false,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return res.status(201).json({
        id: data.id,
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email,
        city: data.city,
        message: data.message,
        createdAt: data.created_at,
        read: data.read,
      });
    }
  } catch (e) {
    console.warn("Error inserting message into Supabase:", e);
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

  inMemoryMessages.unshift(newMessage);
  return res.status(201).json(newMessage);
};

export const markMessageAsRead: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return res.json({
        id: data.id,
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email,
        city: data.city,
        message: data.message,
        createdAt: data.created_at,
        read: data.read,
      });
    }
  } catch (e) {}

  const messageIndex = inMemoryMessages.findIndex((m) => m.id === id);
  if (messageIndex === -1) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }

  inMemoryMessages[messageIndex].read = true;
  return res.json(inMemoryMessages[messageIndex]);
};

export const deleteMessage: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", id);
    if (!error) {
      return res.json({ success: true, id });
    }
  } catch (e) {}

  const messageIndex = inMemoryMessages.findIndex((m) => m.id === id);
  if (messageIndex === -1) {
    return res.status(404).json({ error: "Mensaje no encontrado" });
  }

  const deletedMessage = inMemoryMessages[messageIndex];
  inMemoryMessages.splice(messageIndex, 1);
  return res.json(deletedMessage);
};

export const getStats: RequestHandler = async (_req, res) => {
  try {
    const { data: messagesData, error } = await supabase
      .from("contact_messages")
      .select("read");

    if (!error && Array.isArray(messagesData)) {
      const unreadCount = messagesData.filter((m: any) => !m.read).length;
      return res.json({
        totalMessages: messagesData.length,
        unreadMessages: unreadCount,
      });
    }
  } catch (e) {}

  const unreadCount = inMemoryMessages.filter((m) => !m.read).length;
  return res.json({
    totalMessages: inMemoryMessages.length,
    unreadMessages: unreadCount,
  });
};
