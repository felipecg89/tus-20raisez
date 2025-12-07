import { RequestHandler } from "express";
import { ContentBlock } from "@shared/api";

// In-memory storage for content (in production, use a database)
let contentBlocks: ContentBlock[] = [
  {
    id: "hero-title",
    section: "hero",
    key: "title",
    value: "Conecta tus sueños de Estados Unidos con tu hogar en México",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hero-subtitle",
    section: "hero",
    key: "subtitle",
    value: "Casas, trámites y asesoría legal para paisanos",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hero-cta",
    section: "hero",
    key: "ctaText",
    value: "Quiero empezar",
    updatedAt: new Date().toISOString(),
  },
];

export const getContent: RequestHandler = (req, res) => {
  const { section } = req.query;
  const filtered = section
    ? contentBlocks.filter((c) => c.section === section)
    : contentBlocks;
  res.json(filtered);
};

export const getContentBlock: RequestHandler = (req, res) => {
  const block = contentBlocks.find((c) => c.id === req.params.id);
  if (!block) {
    res.status(404).json({ error: "Bloque de contenido no encontrado" });
    return;
  }
  res.json(block);
};

export const updateContent: RequestHandler = (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    res.status(400).json({ error: "El valor es requerido" });
    return;
  }

  const blockIndex = contentBlocks.findIndex((c) => c.id === req.params.id);
  if (blockIndex === -1) {
    res.status(404).json({ error: "Bloque de contenido no encontrado" });
    return;
  }

  contentBlocks[blockIndex] = {
    ...contentBlocks[blockIndex],
    value,
    updatedAt: new Date().toISOString(),
  };

  res.json(contentBlocks[blockIndex]);
};

export const createContent: RequestHandler = (req, res) => {
  const { section, key, value } = req.body;

  if (!section || !key || value === undefined) {
    res.status(400).json({ error: "Campos requeridos faltantes" });
    return;
  }

  const newBlock: ContentBlock = {
    id: `${section}-${key}-${Date.now()}`,
    section,
    key,
    value,
    updatedAt: new Date().toISOString(),
  };

  contentBlocks.push(newBlock);
  res.status(201).json(newBlock);
};

export const deleteContent: RequestHandler = (req, res) => {
  const blockIndex = contentBlocks.findIndex((c) => c.id === req.params.id);
  if (blockIndex === -1) {
    res.status(404).json({ error: "Bloque de contenido no encontrado" });
    return;
  }

  const deletedBlock = contentBlocks[blockIndex];
  contentBlocks.splice(blockIndex, 1);
  res.json(deletedBlock);
};
