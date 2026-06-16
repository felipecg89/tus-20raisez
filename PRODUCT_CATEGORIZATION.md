# 📂 Product Categorization Implementation Guide

Complete guide to implement and use the product categorization system.

---

## 🎯 Overview

Products can now be categorized into 4 types:

1. **Venta de Casa** - House for sale
2. **Venta de Terreno** - Land for sale
3. **Renta de Casa** - House for rent
4. **Renta de Terreno** - Land for rent

---

## 🔧 Database Setup

### Step 1: Add Category Column to Database

**Go to Supabase → SQL Editor** and run:

```sql
-- Add category column to products table
ALTER TABLE products ADD COLUMN category VARCHAR(50) DEFAULT 'venta_casa';

-- Create index for faster filtering
CREATE INDEX idx_products_category ON products(category);

-- Update existing products (choose one)
-- Option 1: Mark all as "venta_casa" (if all current are sales)
UPDATE products SET category = 'venta_casa' WHERE category IS NULL;

-- Option 2: Mix based on type
UPDATE products SET category = 'venta_casa' WHERE type = 'casa' AND category IS NULL;
UPDATE products SET category = 'venta_terreno' WHERE type = 'terreno' AND category IS NULL;
```

### Step 2: Verify Column Created

Run this query to confirm:

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name='products' AND column_name='category';
```

You should see:
```
column_name | data_type
------------|----------
category    | character varying
```

---

## 💻 Frontend Implementation

### What Changed

**Files Modified**:
- `shared/api.ts` - Added ProductCategory type and PRODUCT_CATEGORIES list
- `server/routes/products.ts` - Updated all endpoints to handle category
- `client/components/admin/AdminProducts.tsx` - Added category UI

### Features Added

✅ **Category Dropdown in Form**
- Select category when creating/editing products
- Defaults to "Venta de Casa"
- Shows Spanish labels

✅ **Category Filter in Admin**
- Filter products by category
- Dropdown in product list header
- Works with search and pagination

✅ **Category Display on Cards**
- Shows category badge (blue) next to type badge
- Shows category name in Spanish

---

## 👨‍💼 Admin Panel Usage

### Creating a Product with Category

1. Go to **Admin Panel** → **Productos** tab
2. Click **"Nuevo Producto"** button
3. Fill in:
   - **Nombre**: Product name
   - **Descripción**: Description
   - **Precio**: Price in USD
   - **Ciudad**: City name
   - **Tipo**: Casa or Terreno (unchanged)
   - **Categoría**: New dropdown ⭐
     - Venta de Casa
     - Venta de Terreno
     - Renta de Casa
     - Renta de Terreno
   - **Imagen**: Upload image
   - **Características**: Features separated by commas
4. Click **"Crear Producto"**

### Filtering Products by Category

1. Go to **Admin Panel** → **Productos** tab
2. Use the **"Filtrar por categoría"** dropdown
3. Select category to filter:
   - Todas las categorías (show all)
   - Venta de Casa
   - Venta de Terreno
   - Renta de Casa
   - Renta de Terreno
4. Results update automatically

### Editing a Product

1. Click the **Edit (✏️)** button on any product card
2. Change the **Categoría** field if needed
3. Click **"Guardar Cambios"**

---

## 🔌 API Integration

### Create Product with Category

**Request**:
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Casa Moderna",
  "description": "Modern house with pool",
  "price": 250000,
  "city": "Monterrey",
  "type": "casa",
  "category": "venta_casa",
  "image": "https://...",
  "features": ["3 bedrooms", "2 bathrooms", "Pool"]
}
```

**Required Fields** (IMPORTANT - category is now required):
- ✅ name
- ✅ description
- ✅ price
- ✅ city
- ✅ type
- ✅ **category** (NEW!)
- image (optional)
- features (optional)

### Filter Products by Category

**Request**:
```bash
# Get all products with category filter
GET /api/products?page=1&limit=20&category=venta_casa

# Combine with other filters
GET /api/products?page=1&limit=20&category=renta_casa&city=Monterrey&minPrice=800&maxPrice=2000
```

**Available Categories**:
- `venta_casa` - House for sale
- `venta_terreno` - Land for sale
- `renta_casa` - House for rent
- `renta_terreno` - Land for rent

### Update Product with Category

**Request**:
```bash
PUT /api/products/{id}
Content-Type: application/json

{
  "name": "Casa Moderna",
  "description": "...",
  "price": 250000,
  "city": "Monterrey",
  "type": "casa",
  "category": "venta_casa",
  "image": "...",
  "features": [...]
}
```

---

## 🎨 Product Category Colors & Styling

### Category Badge Colors

In the Admin Panel, categories are shown with different colors:

| Category | Color | Hex |
|----------|-------|-----|
| Venta de Casa | Blue | #1e40af |
| Venta de Terreno | Blue | #1e40af |
| Renta de Casa | Blue | #1e40af |
| Renta de Terreno | Blue | #1e40af |

All use the same blue (`bg-blue-600`) as shown in product cards.

---

## 📊 Database Schema

### products table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  city VARCHAR(100),
  type VARCHAR(50),
  category VARCHAR(50) DEFAULT 'venta_casa',  -- NEW COLUMN
  main_image_url VARCHAR(500),
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
```

---

## 🔄 Migration Path for Existing Data

### If All Current Products Are Sales (Venta)

```sql
-- Mark all as house sales by default
UPDATE products SET category = 'venta_casa' WHERE category IS NULL;
```

### If You Have Both Houses and Land

```sql
-- Mark houses as sale
UPDATE products SET category = 'venta_casa' WHERE type = 'casa' AND category IS NULL;

-- Mark land as sale
UPDATE products SET category = 'venta_terreno' WHERE type = 'terreno' AND category IS NULL;
```

### If You Need Custom Logic

```sql
-- Mark specific products manually
UPDATE products SET category = 'renta_casa' WHERE id = 'product-id-here';
UPDATE products SET category = 'venta_terreno' WHERE id = 'another-product-id';
```

---

## ✅ Verification Checklist

- [ ] Database column `category` added to `products` table
- [ ] Index `idx_products_category` created
- [ ] Existing products updated with category values
- [ ] Code deployed to production
- [ ] Admin can create products with category
- [ ] Category dropdown appears in form
- [ ] Category filter works in product list
- [ ] Category badge displays on product cards
- [ ] API accepts category in POST/PUT requests

---

## 🚀 Public Site Integration (Future)

Once categorization is working in admin, you can:

1. **Update Casas page** to show category badges
2. **Add category filter** to public product listings
3. **Separate views** for sales vs rentals
4. **Category-specific pages** (e.g., `/rentals` already exists)

---

## 🆘 Troubleshooting

### Category dropdown not appearing in form?

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Refresh page
- [ ] Verify code was deployed
- [ ] Check browser console (F12) for errors

### Getting "Campos requeridos faltantes" error?

- [ ] Make sure **Categoría** field is selected
- [ ] Category is now a required field
- [ ] Cannot save product without selecting category

### Filter not working?

- [ ] Check database has `category` column
- [ ] Run: `ALTER TABLE products ADD COLUMN category VARCHAR(50) DEFAULT 'venta_casa';`
- [ ] Verify index was created
- [ ] Refresh admin page

### New products showing wrong category?

- [ ] Check the form field is correctly selected
- [ ] Verify API response includes category
- [ ] Check browser console for validation errors

---

## 📚 Related Documentation

- **Scalability Guide**: `SCALABILITY_GUIDE.md`
- **API Documentation**: `API_DOCUMENTATION.md`
- **Admin Panel Guide**: `CPANEL_GUIDE.md`

---

## 🎯 Future Enhancements

1. **Multi-level Categories**
   - Example: Sales → House → Luxury
   - Example: Rentals → Land → Agricultural

2. **Category Statistics**
   - Show count of products per category
   - Category-specific growth charts

3. **Public Site Integration**
   - Separate browsing by category
   - Category-specific landing pages
   - Category filters on search

4. **Advanced Filtering**
   - Category + price range + location
   - Save favorite category filters

---

**Document Status**: ✅ Complete  
**Date**: January 2025  
**Version**: 1.0
