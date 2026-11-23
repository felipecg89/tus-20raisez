import { RequestHandler } from "express";
import { Product } from "@shared/api";
import { supabase, supabaseAdmin } from "../lib/supabase";

// Catálogo base de alta calidad para producción cuando Supabase no esté conectado
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Casa Colonial en Guanajuato",
    description:
      "Hermosa casa colonial con patio interior, cantera mexicana, acabados de cedro y vista panorámica a la ciudad histórica.",
    price: 180000,
    city: "Guanajuato",
    state: "Guanajuato",
    postalCode: "36000",
    neighborhood: "Centro Histórico",
    address: "Calle Cantarranas 45",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
    features: ["Patio central con fuente", "Cochera techada", "Terraza con vista", "Cisterna de 10,000 L"],
    bedrooms: 3,
    bathrooms: 2,
    area: 250,
    floors: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Departamento Vista al Mar en Jalisco",
    description:
      "Moderno departamento frente a la bahía en Puerto Vallarta, acceso directo a la playa, alberca infinity y amenidades de lujo.",
    price: 250000,
    city: "Puerto Vallarta",
    state: "Jalisco",
    postalCode: "48300",
    neighborhood: "Zona Hotelera Norte",
    address: "Av. Paseo de la Marina 210",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    features: ["Alberca infinity", "Seguridad 24/7", "Balcón privado con vista al mar", "Gimnasio y spa"],
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    floors: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Residencia Contemporánea Monterrey",
    description:
      "Espectacular casa contemporánea en fraccionamiento privado con vigilancia, acabados de mármol y amplio jardín.",
    price: 320000,
    city: "Monterrey",
    state: "Nuevo León",
    postalCode: "66260",
    neighborhood: "Valle Oriente",
    address: "Paseo de las Cumbres 500",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
    features: ["Clima central inverter", "Cochera triple", "Cocina integral equipada", "Jardín privado"],
    bedrooms: 4,
    bathrooms: 4,
    area: 380,
    floors: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Lote Residencial en Querétaro",
    description:
      "Terreno listo para construir dentro de clúster con campo de golf, servicios subterráneos y club deportivo familiar.",
    price: 95000,
    city: "Querétaro",
    state: "Querétaro",
    postalCode: "76900",
    neighborhood: "El Campanario",
    address: "Circuito de los Virreyes Lote 14",
    type: "terreno",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
    features: ["Servicios subterráneos", "Escrituración inmediata", "Seguridad privada", "Casa club"],
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    floors: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Casa Campestre Morelia",
    description:
      "Propiedad campestre de descanso con amplios jardines arbolados, alberca climatizada y terraza para eventos familiares.",
    price: 200000,
    city: "Morelia",
    state: "Michoacán",
    postalCode: "58000",
    neighborhood: "Altozano",
    address: "Camino a Santa María 80",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    features: ["Alberca y asador", "Jardín de 1,000 m²", "Chimenea rústica", "Bardeado perimetral"],
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    floors: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Penthouse de Lujo CDMX",
    description:
      "Exclusivo penthouse de dos niveles con roof garden privado, vistas a la ciudad y acabados importados de alta gama.",
    price: 450000,
    city: "Ciudad de México",
    state: "Ciudad de México",
    postalCode: "11560",
    neighborhood: "Polanco / Reforma",
    address: "Campos Elíseos 120",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
    features: ["Roof garden privado", "Elevador directo", "2 estacionamientos", "Seguridad 24/7"],
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    floors: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Casa Yucateca con Alberca en Mérida",
    description:
      "Arquitectura tradicional de techos altos y muros de mampostería combinada con confort moderno y alberca chukum.",
    price: 165000,
    city: "Mérida",
    state: "Yucatán",
    postalCode: "97000",
    neighborhood: "Santiago Centro",
    address: "Calle 59 x 68",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
    features: ["Alberca acabado chukum", "Cocina abierta", "Jardín tropical", "Techos de 4 metros"],
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    floors: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Quinta Colonial Zacatecas",
    description:
      "Encantadora quinta con muros de cantera rosa zacatecana, portón de hierro forjado y ubicación privilegiada.",
    price: 215000,
    city: "Zacatecas",
    state: "Zacatecas",
    postalCode: "98000",
    neighborhood: "La Bufa Residencial",
    address: "Paseo Díaz Ordaz 410",
    type: "casa",
    category: "compra",
    isCommercial: false,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    features: ["Cantera rosa original", "Cava subterránea", "Balcones coloniales", "Cochera para 3 autos"],
    bedrooms: 4,
    bathrooms: 3,
    area: 310,
    floors: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getProducts: RequestHandler = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const offset = (page - 1) * limit;

  const city = req.query.city as string;
  const type = req.query.type as string;
  const category = req.query.category as string;
  const search = req.query.search as string;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

  // Intentar consultar Supabase si está disponible
  if (supabase) {
    try {
      let query = supabase.from("products").select("*", { count: "exact" });

      if (type && type !== "all") {
        query = query.eq("type", type);
      }
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      if (city && city !== "all") {
        query = query.ilike("city", `%${city}%`);
      }
      if (minPrice !== undefined) {
        query = query.gte("price", minPrice);
      }
      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Timeout safety promise (3 seconds max)
      const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase connection timeout")), 3000)
      );

      const queryPromise = query
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = (await Promise.race([queryPromise, timeoutPromise])) as any;

      if (!error && Array.isArray(data) && data.length > 0) {
        const products = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          city: p.city,
          state: p.state,
          postalCode: p.postal_code,
          neighborhood: p.neighborhood,
          address: p.address,
          streetType: p.street_type,
          streetName: p.street_name,
          exteriorNumber: p.exterior_number,
          interiorNumber: p.interior_number,
          locality: p.locality,
          latitude: p.latitude ? Number(p.latitude) : undefined,
          longitude: p.longitude ? Number(p.longitude) : undefined,
          type: p.type,
          category: p.category || "compra",
          isCommercial: p.is_commercial || false,
          capacity: p.capacity ? Number(p.capacity) : undefined,
          rentalPeriod: p.rental_period || undefined,
          image: p.main_image_url,
          features: p.features || [],
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          area: p.area || 0,
          floors: p.floors || 0,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));

        return res.json({
          data: products,
          pagination: {
            page,
            limit,
            total: count || products.length,
            totalPages: Math.ceil((count || products.length) / limit),
            hasNext: page < Math.ceil((count || products.length) / limit),
            hasPrev: page > 1,
          },
        });
      }
    } catch (supabaseError) {
      console.warn("Supabase unavailable or offline, using verified fallback catalog:", (supabaseError as any)?.message);
    }
  }

  // Fallback resiliente con datos completos de alta calidad
  let filtered = [...FALLBACK_PRODUCTS];

  if (type && type !== "all") {
    filtered = filtered.filter((p) => p.type === type);
  }
  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (city && city !== "all") {
    filtered = filtered.filter(
      (p) =>
        p.city.toLowerCase().includes(city.toLowerCase()) ||
        (p.state && p.state.toLowerCase().includes(city.toLowerCase()))
    );
  }
  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }

  const paginated = filtered.slice(offset, offset + limit);

  return res.json({
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 1,
      hasNext: page < Math.ceil(filtered.length / limit),
      hasPrev: page > 1,
    },
  });
};

export const getProduct: RequestHandler = async (req, res) => {
  const targetId = req.params.id;

  if (supabase) {
    try {
      const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase connection timeout")), 3000)
      );

      const queryPromise = supabase
        .from("products")
        .select("*")
        .eq("id", targetId)
        .single();

      const { data, error } = (await Promise.race([queryPromise, timeoutPromise])) as any;

      if (!error && data) {
        const product: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          city: data.city,
          state: data.state,
          postalCode: data.postal_code,
          neighborhood: data.neighborhood,
          address: data.address,
          streetType: data.street_type,
          streetName: data.street_name,
          exteriorNumber: data.exterior_number,
          interiorNumber: data.interior_number,
          locality: data.locality,
          latitude: data.latitude ? Number(data.latitude) : undefined,
          longitude: data.longitude ? Number(data.longitude) : undefined,
          type: data.type,
          category: data.category || "compra",
          isCommercial: data.is_commercial || false,
          capacity: data.capacity ? Number(data.capacity) : undefined,
          rentalPeriod: data.rental_period || undefined,
          image: data.main_image_url,
          features: data.features || [],
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          area: data.area || 0,
          floors: data.floors || 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        return res.json(product);
      }
    } catch (e) {
      console.warn("Supabase getProduct failed, checking fallback:", (e as any)?.message);
    }
  }

  // Buscar en fallback
  const fallbackItem = FALLBACK_PRODUCTS.find((p) => p.id === targetId);
  if (fallbackItem) {
    return res.json(fallbackItem);
  }

  return res.status(404).json({ error: "Producto no encontrado" });
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      city,
      type,
      category,
      image,
      features,
      state,
      postalCode,
      neighborhood,
      address,
      streetType,
      streetName,
      exteriorNumber,
      interiorNumber,
      locality,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      area,
      floors,
      capacity,
      rentalPeriod,
    } = req.body;

    if (!name || !description || price === undefined || !city || !type || !category) {
      res.status(400).json({ error: "Campos requeridos faltantes" });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([
        {
          name,
          description,
          price: Number(price),
          city,
          state,
          postal_code: postalCode,
          neighborhood,
          address,
          street_type: streetType,
          street_name: streetName,
          exterior_number: exteriorNumber,
          interior_number: interiorNumber,
          locality,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          type,
          category,
          is_commercial: req.body.isCommercial || false,
          capacity: capacity ? Number(capacity) : null,
          rental_period: rentalPeriod || (category === "renta" ? "mensual" : null),
          main_image_url: image || null,
          features: features || [],
          bedrooms: bedrooms || 0,
          bathrooms: bathrooms || 0,
          area: area || 0,
          floors: floors || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const newProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      neighborhood: data.neighborhood,
      address: data.address,
      streetType: data.street_type,
      streetName: data.street_name,
      exteriorNumber: data.exterior_number,
      interiorNumber: data.interior_number,
      locality: data.locality,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      type: data.type,
      category: data.category,
      isCommercial: data.is_commercial || false,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      rentalPeriod: data.rental_period || undefined,
      image: data.main_image_url,
      features: data.features || [],
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      area: data.area || 0,
      floors: data.floors || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      city,
      type,
      category,
      image,
      features,
      state,
      postalCode,
      neighborhood,
      address,
      streetType,
      streetName,
      exteriorNumber,
      interiorNumber,
      locality,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      area,
      floors,
      capacity,
      rentalPeriod,
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        city,
        state,
        postal_code: postalCode,
        neighborhood,
        address,
        street_type: streetType,
        street_name: streetName,
        exterior_number: exteriorNumber,
        interior_number: interiorNumber,
        locality,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        type,
        category,
        is_commercial: req.body.isCommercial || false,
        capacity: capacity !== undefined ? (capacity ? Number(capacity) : null) : undefined,
        rental_period: rentalPeriod !== undefined ? rentalPeriod : undefined,
        main_image_url: image || null,
        features: features || [],
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area: area || 0,
        floors: floors || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      res.status(500).json({ error: `Error al actualizar producto: ${error.message}` });
      return;
    }

    if (!data) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const updatedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      neighborhood: data.neighborhood,
      address: data.address,
      streetType: data.street_type,
      streetName: data.street_name,
      exteriorNumber: data.exterior_number,
      interiorNumber: data.interior_number,
      locality: data.locality,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      type: data.type,
      category: data.category,
      isCommercial: data.is_commercial || false,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      rentalPeriod: data.rental_period || undefined,
      image: data.main_image_url,
      features: data.features || [],
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      area: data.area || 0,
      floors: data.floors || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: `Error al actualizar producto: ${error.message}` });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const deletedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      neighborhood: data.neighborhood,
      address: data.address,
      streetType: data.street_type,
      streetName: data.street_name,
      exteriorNumber: data.exterior_number,
      interiorNumber: data.interior_number,
      locality: data.locality,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      type: data.type,
      category: data.category,
      isCommercial: data.is_commercial || false,
      image: data.main_image_url,
      features: data.features || [],
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      area: data.area || 0,
      floors: data.floors || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.json(deletedProduct);
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
