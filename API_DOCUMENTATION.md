# 📡 API Documentation - Scalable Architecture

Complete reference for all API endpoints with support for large-scale data handling.

## Base URL

```
/api
```

---

## 📦 Products API

### List Products (Paginated & Filterable)

**Endpoint**: `GET /api/products`

**Parameters** (all optional):
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | number | 1 | 999 | Page number for pagination |
| `limit` | number | 20 | 100 | Items per page |
| `type` | string | - | - | Filter by type: `casa` or `terreno` |
| `city` | string | - | - | Filter by city (partial match, case-insensitive) |
| `minPrice` | number | - | - | Minimum price filter |
| `maxPrice` | number | - | - | Maximum price filter |
| `search` | string | - | - | Search in name and description |

**Example Requests**:
```bash
# Basic pagination
GET /api/products?page=1&limit=20

# Filter by type and city
GET /api/products?page=1&limit=20&type=casa&city=Guanajuato

# Price range search
GET /api/products?page=1&limit=20&minPrice=100000&maxPrice=500000

# Full-text search
GET /api/products?page=1&limit=20&search=colonial

# Combined filters
GET /api/products?page=1&limit=20&type=casa&city=Guanajuato&minPrice=150000&maxPrice=300000&search=modern
```

**Success Response** (200 OK):
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Casa Colonial en Guanajuato",
      "description": "Hermosa casa colonial con patio interior...",
      "price": 180000,
      "city": "Guanajuato",
      "type": "casa",
      "image": "https://storage.url/image.jpg",
      "features": ["3 recámaras", "2 baños", "Patio"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Error al obtener productos"
}
```

---

### Get Single Product

**Endpoint**: `GET /api/products/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID (path parameter) |

**Example**:
```bash
GET /api/products/123e4567-e89b-12d3-a456-426614174000
```

**Success Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Casa Colonial en Guanajuato",
  "description": "Hermosa casa colonial con patio interior...",
  "price": 180000,
  "city": "Guanajuato",
  "type": "casa",
  "image": "https://storage.url/image.jpg",
  "features": ["3 recámaras", "2 baños", "Patio"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Producto no encontrado"
}
```

---

### Create Product

**Endpoint**: `POST /api/products`

**Request Body** (application/json):
```json
{
  "name": "Casa Moderna",
  "description": "Una casa moderna con todas las comodidades",
  "price": 250000,
  "city": "Monterrey",
  "type": "casa",
  "image": "https://storage.url/image.jpg",
  "features": ["3 recámaras", "2 baños", "Piscina"]
}
```

**Required Fields**:
- `name` (string)
- `description` (string)
- `price` (number)
- `city` (string)
- `type` (string): `casa` or `terreno`

**Optional Fields**:
- `image` (string): Image URL
- `features` (array): List of features

**Success Response** (201 Created):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Casa Moderna",
  "description": "Una casa moderna con todas las comodidades",
  "price": 250000,
  "city": "Monterrey",
  "type": "casa",
  "image": "https://storage.url/image.jpg",
  "features": ["3 recámaras", "2 baños", "Piscina"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Campos requeridos faltantes"
}
```

---

### Update Product

**Endpoint**: `PUT /api/products/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID (path parameter) |

**Request Body** (application/json):
```json
{
  "name": "Casa Moderna Actualizada",
  "description": "Descripción actualizada",
  "price": 260000,
  "city": "Monterrey",
  "type": "casa",
  "image": "https://storage.url/new-image.jpg",
  "features": ["3 recámaras", "2 baños", "Piscina", "Jacuzzi"]
}
```

**Success Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Casa Moderna Actualizada",
  "description": "Descripción actualizada",
  "price": 260000,
  "city": "Monterrey",
  "type": "casa",
  "image": "https://storage.url/new-image.jpg",
  "features": ["3 recámaras", "2 baños", "Piscina", "Jacuzzi"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

---

### Delete Product

**Endpoint**: `DELETE /api/products/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID (path parameter) |

**Success Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Casa Moderna",
  "description": "Una casa moderna con todas las comodidades",
  "price": 250000,
  "city": "Monterrey",
  "type": "casa",
  "image": "https://storage.url/image.jpg",
  "features": ["3 recámaras", "2 baños", "Piscina"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Producto no encontrado"
}
```

---

## 🎬 Product Media API

### List Product Media (Paginated)

**Endpoint**: `GET /api/products/:productId/media`

**Parameters**:
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `productId` | string | - | - | Product ID (path parameter) |
| `page` | number | 1 | 999 | Page number |
| `limit` | number | 50 | 100 | Items per page |

**Example**:
```bash
GET /api/products/123e4567-e89b-12d3-a456-426614174000/media?page=1&limit=50
```

**Success Response** (200 OK):
```json
{
  "data": [
    {
      "id": "media-123",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "media_type": "image",
      "media_url": "https://storage.url/image1.jpg",
      "storage_path": "products/image1.jpg",
      "display_order": 0,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "media-124",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "media_type": "video",
      "media_url": "https://storage.url/video1.mp4",
      "storage_path": "products/video1.mp4",
      "display_order": 1,
      "created_at": "2024-01-15T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### Add Single Media

**Endpoint**: `POST /api/products/media`

**Request Body** (application/json):
```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "mediaType": "image",
  "mediaUrl": "https://storage.url/image.jpg",
  "storagePath": "products/image.jpg"
}
```

**Required Fields**:
- `productId` (string)
- `mediaType` (string): `image` or `video`
- `mediaUrl` (string)
- `storagePath` (string)

**Success Response** (201 Created):
```json
{
  "id": "media-123",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "media_type": "image",
  "media_url": "https://storage.url/image.jpg",
  "storage_path": "products/image.jpg",
  "display_order": 0,
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Batch Add Media ⭐ (For Handling Large Uploads)

**Endpoint**: `POST /api/products/media/bulk`

**Request Body** (application/json):
```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "mediaItems": [
    {
      "mediaType": "image",
      "mediaUrl": "https://storage.url/image1.jpg",
      "storagePath": "products/image1.jpg"
    },
    {
      "mediaType": "image",
      "mediaUrl": "https://storage.url/image2.jpg",
      "storagePath": "products/image2.jpg"
    },
    {
      "mediaType": "video",
      "mediaUrl": "https://storage.url/video1.mp4",
      "storagePath": "products/video1.mp4"
    }
  ]
}
```

**Constraints**:
- Maximum 100 items per request
- Will reject if more than 100 items provided

**Success Response** (201 Created):
```json
{
  "message": "3 archivos agregados correctamente",
  "data": [
    {
      "id": "media-123",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "media_type": "image",
      "media_url": "https://storage.url/image1.jpg",
      "storage_path": "products/image1.jpg",
      "display_order": 0,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "media-124",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "media_type": "image",
      "media_url": "https://storage.url/image2.jpg",
      "storage_path": "products/image2.jpg",
      "display_order": 1,
      "created_at": "2024-01-15T10:01:00Z"
    },
    {
      "id": "media-125",
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "media_type": "video",
      "media_url": "https://storage.url/video1.mp4",
      "storage_path": "products/video1.mp4",
      "display_order": 2,
      "created_at": "2024-01-15T10:02:00Z"
    }
  ]
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "No se pueden agregar más de 100 archivos a la vez"
}
```

---

### Delete Media

**Endpoint**: `DELETE /api/products/media/:mediaId`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `mediaId` | string | Media ID (path parameter) |

**Success Response** (200 OK):
```json
{
  "id": "media-123",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "media_type": "image",
  "media_url": "https://storage.url/image.jpg",
  "storage_path": "products/image.jpg",
  "display_order": 0,
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Reorder Media

**Endpoint**: `PUT /api/products/media/reorder`

**Request Body** (application/json):
```json
{
  "mediaId": "media-123",
  "newOrder": 2
}
```

**Success Response** (200 OK):
```json
{
  "id": "media-123",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "media_type": "image",
  "media_url": "https://storage.url/image.jpg",
  "storage_path": "products/image.jpg",
  "display_order": 2,
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

## 📨 Messages API

### List Messages

**Endpoint**: `GET /api/messages`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Success Response** (200 OK):
```json
{
  "data": [
    {
      "id": "msg-123",
      "name": "Juan Pérez",
      "whatsapp": "+1234567890",
      "email": "juan@example.com",
      "city": "Guanajuato",
      "message": "Estoy interesado en la propiedad...",
      "read": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Create Message

**Endpoint**: `POST /api/messages`

**Request Body**:
```json
{
  "name": "Juan Pérez",
  "whatsapp": "+1234567890",
  "email": "juan@example.com",
  "city": "Guanajuato",
  "message": "Estoy interesado en la propiedad..."
}
```

---

### Mark as Read

**Endpoint**: `PUT /api/messages/:id/read`

---

### Delete Message

**Endpoint**: `DELETE /api/messages/:id`

---

## 📝 Content API

### List Content Blocks

**Endpoint**: `GET /api/content`

**Query Parameters**:
- `section` (optional): Filter by section (hero, services, benefits, footer, etc.)

---

### Create Content Block

**Endpoint**: `POST /api/content`

**Request Body**:
```json
{
  "section": "hero",
  "key": "main-title",
  "value": "Conecta tus sueños con tu hogar"
}
```

---

### Update Content Block

**Endpoint**: `PUT /api/content/:id`

---

### Delete Content Block

**Endpoint**: `DELETE /api/content/:id`

---

## 🔍 Rate Limiting & Best Practices

### Recommended Limits

- **Pagination**: Use `limit=20` or `limit=50` for best performance
- **Batch Operations**: Maximum 100 items per request
- **Request Timeout**: 60 seconds (increase for batch operations)
- **Concurrent Requests**: Maximum 10 parallel API calls recommended

### Performance Tips

1. **Use pagination** - Never fetch all products at once
2. **Filter early** - Use query parameters to filter on the server
3. **Batch uploads** - Use `/media/bulk` for multiple files
4. **Cache responses** - Implement client-side caching for product lists
5. **Monitor performance** - Track slow queries and optimize

---

## 🚨 Error Handling

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Product updated |
| 201 | Created | New product added |
| 400 | Bad Request | Missing required field |
| 404 | Not Found | Product ID doesn't exist |
| 500 | Server Error | Database connection error |

### Error Response Format

```json
{
  "error": "Descripción del error en español"
}
```

---

## 📊 Pagination Response Format

All paginated endpoints return:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**How to use**:
- `hasNext=true` → Show "Next" button
- `hasPrev=true` → Show "Previous" button
- `totalPages=13` → Can show "Page 1 of 13"

---

**Last Updated**: January 2025  
**Version**: 2.0  
**Status**: Production Ready
