<<<<<<< HEAD
# 🔧 Troubleshooting Guide

Solutions for common issues when handling large volumes of data.

---

## 🚨 Common Issues & Solutions

### 1. API Responding Slowly

**Symptoms**:
- API requests taking > 1 second
- Pagination requests slow
- Filters not responding quickly

**Diagnosis**:
```bash
# Check Supabase slow query log
# Dashboard → Database → Performance → Slow Queries

# Check current query times
# Dashboard → Database → Performance → Query Performance
```

**Solutions**:

1. **Check if indexes exist**:
   ```sql
   SELECT * FROM pg_stat_user_indexes 
   WHERE schemaname = 'public' 
   AND tablename = 'products';
   ```
   
   If no indexes appear, create them:
   ```sql
   CREATE INDEX idx_products_type ON products(type);
   CREATE INDEX idx_products_city ON products(city);
   CREATE INDEX idx_products_price ON products(price);
   CREATE INDEX idx_products_created_at ON products(created_at DESC);
   ```

2. **Analyze slow queries**:
   ```sql
   EXPLAIN ANALYZE 
   SELECT * FROM products 
   WHERE city ILIKE '%Guanajuato%' 
   LIMIT 20;
   ```

3. **Add missing index** (if EXPLAIN shows sequential scan):
   ```sql
   CREATE INDEX idx_products_city_lower ON products(LOWER(city));
   ```

4. **Reduce page size** (in frontend code):
   ```typescript
   // Instead of
   const limit = 100;  // Too many
   
   // Use
   const limit = 20;   // Better performance
   ```

---

### 2. Image Upload Failures

**Symptoms**:
- "Upload failed" error
- Images not appearing after upload
- File size limit exceeded message

**Solutions**:

1. **RLS Policy Issue** (Row Level Security):
   ```sql
   -- Check current policies
   SELECT * FROM pg_policies 
   WHERE tablename = 'product_images';
   
   -- Create public upload policy
   CREATE POLICY "Enable public uploads" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'product-images');
   
   -- Create public read policy
   CREATE POLICY "Enable public read" ON storage.objects
     FOR SELECT USING (bucket_id = 'product-images');
   ```

2. **File Size Too Large**:
   - Images: Max 5 MB
   - Videos: Max 50 MB
   
   **Check file size**:
   ```javascript
   const fileSizeInMB = file.size / (1024 * 1024);
   console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);
   ```

3. **Storage Quota Exceeded**:
   - Go to Supabase Dashboard → Storage
   - Check "Usage" to see current storage
   - Delete old unused files or upgrade plan

4. **Browser Console Errors**:
   ```javascript
   // Open DevTools (F12)
   // Check Console tab for specific error messages
   // Common errors:
   // - CORS error → Check Supabase CORS settings
   // - 403 Forbidden → Check RLS policies
   // - 413 Payload Too Large → File too large
   ```

---

### 3. Slow Image Loading

**Symptoms**:
- Images take long to display
- Property pages slow to load
- Pagination slow with images

**Solutions**:

1. **Enable CDN Caching** (Supabase):
   - Dashboard → Storage → bucket settings
   - Enable "CDN Caching"
   - Set cache time to 86400 (24 hours)

2. **Verify Image Compression**:
   ```javascript
   // Check if images are being compressed
   // Look in uploadService.ts
   // Should see: canvas.toBlob(..., 'image/jpeg', 0.8)
   // 0.8 = 80% quality = good compression
   ```

3. **Lazy Load Images** (Frontend):
   ```jsx
   <img 
     src={imageUrl} 
     loading="lazy"  // Native lazy loading
     alt="Property"
   />
   ```

4. **Reduce Image Size**:
   - Current: Max width 1200px
   - For slower connections: Consider 800px or 600px
   
   **Adjust in uploadService.ts**:
   ```typescript
   if (width > 800) {  // Change from 1200
     height = (height * 800) / width;
     width = 800;
   }
   ```

---

### 4. Batch Upload Failing

**Symptoms**:
- Batch upload returns error
- Some files succeed, some fail
- Progress bar stuck at certain percentage

**Solutions**:

1. **File Count Exceeds Limit**:
   - Maximum 100 files per batch
   - If uploading more, split into multiple batches
   
   ```typescript
   // Correct way to upload 250 files
   const files = [...]; // 250 files
   const batchSize = 100;
   
   for (let i = 0; i < files.length; i += batchSize) {
     const batch = files.slice(i, i + batchSize);
     await batchUploadMedia(batch);
   }
   ```

2. **Mixed File Types Causing Issues**:
   ```javascript
   // Filter to valid types only
   const validFiles = files.filter(f => {
     return f.type.startsWith('image/') || 
            f.type.startsWith('video/');
   });
   ```

3. **Network Timeout**:
   - Reduce batch size from 100 to 50 or 25
   - Check network connection
   - Try uploading smaller batch first

4. **Check Error Details**:
   ```javascript
   // In browser console, run:
   const result = await batchUploadMedia(files);
   console.log('Successful:', result.successful.length);
   console.log('Failed:', result.failed);
   // See which files failed and why
   ```

---

### 5. Database Connection Errors

**Symptoms**:
- "Connection timeout" error
- API requests hang
- Database operations very slow

**Solutions**:

1. **Check Connection Pool**:
   - Supabase Dashboard → Database → Connection
   - Verify you're within connection limits
   - Default: 5 concurrent connections

2. **Too Many Concurrent Requests**:
   ```javascript
   // Bad: 100 concurrent requests
   Promise.all(products.map(p => fetchProductDetails(p.id)));
   
   // Good: Batch with concurrency limit
   async function* batchRequests(items, batchSize) {
     for (let i = 0; i < items.length; i += batchSize) {
       yield items.slice(i, i + batchSize);
     }
   }
   ```

3. **Check Supabase Project Status**:
   - Go to https://status.supabase.com
   - Look for any service outages
   - Check Dashboard → Support → Status

4. **Restart Connection**:
   - For development: Refresh browser page
   - For production: May need to contact Supabase

---

### 6. Pagination Not Working

**Symptoms**:
- Pagination controls not appearing
- Page doesn't change when clicking next
- Total pages showing as 0

**Solutions**:

1. **API Response Format Changed**:
   ```javascript
   // Check if response has pagination object
   const response = await fetch('/api/products');
   const result = await response.json();
   console.log(result.pagination);  // Should exist
   
   // If undefined, API might not be updated
   // Verify server has latest code
   ```

2. **Frontend Component Not Updated**:
   ```jsx
   // Check AdminProducts.tsx
   // Should have pagination state:
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   
   // And pagination controls in JSX
   ```

3. **Total Count Returning 0**:
   ```javascript
   // Check API response
   // pagination.total should be > 0
   
   // If 0, means:
   // - No products in database
   // - Query filter is too restrictive
   // - Database count is broken
   ```

4. **Query Parameters Not Passed**:
   ```javascript
   // In API call, verify params are sent
   const params = new URLSearchParams();
   params.append('page', page.toString());
   params.append('limit', '20');
   console.log(params.toString());  // Verify
   ```

---

### 7. Memory Issues (Out of Memory)

**Symptoms**:
- "JavaScript heap out of memory" error
- App becomes very slow
- Browser crashes

**Solutions**:

1. **Reduce Data Load**:
   ```javascript
   // Bad: Load all products at once
   const allProducts = await fetchAllProducts();
   
   // Good: Use pagination
   const page1Products = await fetch('/api/products?page=1&limit=20');
   ```

2. **Lazy Load Images**:
   ```jsx
   <img src={url} loading="lazy" />
   // Only loads image when visible on screen
   ```

3. **Clean Up Unused Data**:
   ```javascript
   // After fetching, clear unused references
   const products = [...data];
   // Don't keep multiple copies of same data
   ```

4. **Monitor Memory Usage** (Chrome DevTools):
   - F12 → Memory tab
   - Take heap snapshots
   - Look for growing memory usage
   - Identify what's taking memory

---

### 8. Search Not Working

**Symptoms**:
- Search returns no results
- Search very slow
- Search only matches beginning of text

**Solutions**:

1. **Index Missing**:
   ```sql
   -- Check if full-text search index exists
   SELECT * FROM pg_indexes 
   WHERE tablename = 'products' 
   AND indexname LIKE '%search%';
   
   -- Create if missing
   CREATE INDEX idx_products_search ON products 
   USING gin(to_tsvector('spanish', name || ' ' || description));
   ```

2. **Search Parameter Not Sent**:
   ```javascript
   // Check API call includes search parameter
   fetch(`/api/products?search=colonial`);
   
   // If URL doesn't have ?search=..., search won't work
   ```

3. **Case Sensitivity Issue**:
   ```sql
   -- Database search should be case-insensitive
   -- Check API code uses ILIKE (not LIKE)
   query = query.ilike("city", `%${city}%`);  // ✓ Case-insensitive
   // NOT: query = query.like("city", `%${city}%`);  // Case-sensitive
   ```

4. **Special Characters Breaking Search**:
   ```javascript
   // Escape special characters
   const searchTerm = 'Casa "Colonial"';  // Quotes might break search
   const escaped = searchTerm.replace(/['"]/g, '');  // Remove quotes
   ```

---

### 9. Filters Not Working Together

**Symptoms**:
- Works with type filter alone
- Works with city filter alone
- Doesn't work when combining filters
- Some combinations return no results

**Solutions**:

1. **OR vs AND Logic**:
   ```sql
   -- Current (AND logic - should work)
   WHERE type = 'casa' AND city ILIKE '%Guanajuato%'
   
   -- If not working, might be OR logic problem
   -- Check server/routes/products.ts for filter logic
   ```

2. **Filter Values Not Matching**:
   ```javascript
   // Check exact values in database
   SELECT DISTINCT type FROM products;
   SELECT DISTINCT city FROM products;
   
   // Ensure filter values match exactly
   // 'Casa' vs 'casa' (case sensitivity)
   // 'Guanajuato, GTO' vs 'Guanajuato' (extra info)
   ```

3. **Filter Parameters Not Passed**:
   ```javascript
   // Verify all filters included in API call
   const params = new URLSearchParams();
   params.append('page', page.toString());
   params.append('type', type);  // ✓ Include
   params.append('city', city);  // ✓ Include
   params.append('minPrice', minPrice);  // ✓ Include
   console.log(params.toString());  // Verify all present
   ```

---

### 10. Dashboard Admin Panel Issues

**Symptoms**:
- Products list not loading
- Forms not submitting
- Pagination not working in admin
- Media gallery not appearing

**Solutions**:

1. **Clear Browser Cache**:
   - F12 → Application → Clear Storage
   - Refresh page
   - Try again

2. **Check Admin Component**:
   - Verify AdminProducts.tsx has latest code
   - Check if pagination state is updated
   - Verify API response handling

3. **Verify API Response**:
   ```javascript
   // Check browser Network tab
   // F12 → Network → Filter "products"
   // Click on request → Response tab
   // Should see { data: [], pagination: {...} }
   ```

4. **Check User Permissions**:
   - Verify you're logged in as admin (if authentication enabled)
   - Check RLS policies allow admin access

---

## 🧪 Testing Commands

### Test API Endpoints

```bash
# List products
curl "http://localhost:3000/api/products?page=1&limit=20"

# Search
curl "http://localhost:3000/api/products?search=colonial"

# Filter by type
curl "http://localhost:3000/api/products?type=casa"

# Price range
curl "http://localhost:3000/api/products?minPrice=100000&maxPrice=300000"

# All combined
curl "http://localhost:3000/api/products?page=1&limit=20&type=casa&city=Guanajuato&minPrice=100000&maxPrice=300000"
```

### Test Upload

```javascript
// In browser console
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const url = await uploadProductImage(file);
console.log('Uploaded:', url);
```

---

## 📊 Performance Baseline

Expected response times (with proper indexes):

| Operation | Expected Time | Problem If > |
|-----------|---|---|
| List products (page 1) | 50-100ms | 500ms |
| Search products | 100-200ms | 1000ms |
| Filter by type | 50-100ms | 500ms |
| List media (50 files) | 100-150ms | 1000ms |
| Upload image | 1-3 seconds | 10 seconds |
| Batch upload (10 files) | 10-20 seconds | 60 seconds |

---

## 📞 Getting Help

### Before Contacting Support

1. Check this guide for your issue
2. Look at browser console (F12) for errors
3. Check network tab to see API responses
4. Try clearing cache and refreshing
5. Verify database indexes are created
6. Check Supabase status page

### How to Report Issues

Include:
- [ ] Description of problem
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Screenshots/videos if applicable
- [ ] Browser/device information
- [ ] Error messages from console
- [ ] Recent code changes (if applicable)

### Useful Debugging Info

```javascript
// Run in browser console to gather info
console.log('User Agent:', navigator.userAgent);
console.log('Window size:', window.innerWidth, window.innerHeight);
console.log('Connection type:', navigator.connection?.effectiveType);
console.log('Memory limit:', performance.memory);

// Check API response
fetch('/api/products?page=1&limit=5')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)));
```

---

**Last Updated**: January 2025  
**Document Version**: 1.0
=======
# 🔧 Troubleshooting Guide

Solutions for common issues when handling large volumes of data.

---

## 🚨 Common Issues & Solutions

### 1. API Responding Slowly

**Symptoms**:
- API requests taking > 1 second
- Pagination requests slow
- Filters not responding quickly

**Diagnosis**:
```bash
# Check Supabase slow query log
# Dashboard → Database → Performance → Slow Queries

# Check current query times
# Dashboard → Database → Performance → Query Performance
```

**Solutions**:

1. **Check if indexes exist**:
   ```sql
   SELECT * FROM pg_stat_user_indexes 
   WHERE schemaname = 'public' 
   AND tablename = 'products';
   ```
   
   If no indexes appear, create them:
   ```sql
   CREATE INDEX idx_products_type ON products(type);
   CREATE INDEX idx_products_city ON products(city);
   CREATE INDEX idx_products_price ON products(price);
   CREATE INDEX idx_products_created_at ON products(created_at DESC);
   ```

2. **Analyze slow queries**:
   ```sql
   EXPLAIN ANALYZE 
   SELECT * FROM products 
   WHERE city ILIKE '%Guanajuato%' 
   LIMIT 20;
   ```

3. **Add missing index** (if EXPLAIN shows sequential scan):
   ```sql
   CREATE INDEX idx_products_city_lower ON products(LOWER(city));
   ```

4. **Reduce page size** (in frontend code):
   ```typescript
   // Instead of
   const limit = 100;  // Too many
   
   // Use
   const limit = 20;   // Better performance
   ```

---

### 2. Image Upload Failures

**Symptoms**:
- "Upload failed" error
- Images not appearing after upload
- File size limit exceeded message

**Solutions**:

1. **RLS Policy Issue** (Row Level Security):
   ```sql
   -- Check current policies
   SELECT * FROM pg_policies 
   WHERE tablename = 'product_images';
   
   -- Create public upload policy
   CREATE POLICY "Enable public uploads" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'product-images');
   
   -- Create public read policy
   CREATE POLICY "Enable public read" ON storage.objects
     FOR SELECT USING (bucket_id = 'product-images');
   ```

2. **File Size Too Large**:
   - Images: Max 5 MB
   - Videos: Max 50 MB
   
   **Check file size**:
   ```javascript
   const fileSizeInMB = file.size / (1024 * 1024);
   console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);
   ```

3. **Storage Quota Exceeded**:
   - Go to Supabase Dashboard → Storage
   - Check "Usage" to see current storage
   - Delete old unused files or upgrade plan

4. **Browser Console Errors**:
   ```javascript
   // Open DevTools (F12)
   // Check Console tab for specific error messages
   // Common errors:
   // - CORS error → Check Supabase CORS settings
   // - 403 Forbidden → Check RLS policies
   // - 413 Payload Too Large → File too large
   ```

---

### 3. Slow Image Loading

**Symptoms**:
- Images take long to display
- Property pages slow to load
- Pagination slow with images

**Solutions**:

1. **Enable CDN Caching** (Supabase):
   - Dashboard → Storage → bucket settings
   - Enable "CDN Caching"
   - Set cache time to 86400 (24 hours)

2. **Verify Image Compression**:
   ```javascript
   // Check if images are being compressed
   // Look in uploadService.ts
   // Should see: canvas.toBlob(..., 'image/jpeg', 0.8)
   // 0.8 = 80% quality = good compression
   ```

3. **Lazy Load Images** (Frontend):
   ```jsx
   <img 
     src={imageUrl} 
     loading="lazy"  // Native lazy loading
     alt="Property"
   />
   ```

4. **Reduce Image Size**:
   - Current: Max width 1200px
   - For slower connections: Consider 800px or 600px
   
   **Adjust in uploadService.ts**:
   ```typescript
   if (width > 800) {  // Change from 1200
     height = (height * 800) / width;
     width = 800;
   }
   ```

---

### 4. Batch Upload Failing

**Symptoms**:
- Batch upload returns error
- Some files succeed, some fail
- Progress bar stuck at certain percentage

**Solutions**:

1. **File Count Exceeds Limit**:
   - Maximum 100 files per batch
   - If uploading more, split into multiple batches
   
   ```typescript
   // Correct way to upload 250 files
   const files = [...]; // 250 files
   const batchSize = 100;
   
   for (let i = 0; i < files.length; i += batchSize) {
     const batch = files.slice(i, i + batchSize);
     await batchUploadMedia(batch);
   }
   ```

2. **Mixed File Types Causing Issues**:
   ```javascript
   // Filter to valid types only
   const validFiles = files.filter(f => {
     return f.type.startsWith('image/') || 
            f.type.startsWith('video/');
   });
   ```

3. **Network Timeout**:
   - Reduce batch size from 100 to 50 or 25
   - Check network connection
   - Try uploading smaller batch first

4. **Check Error Details**:
   ```javascript
   // In browser console, run:
   const result = await batchUploadMedia(files);
   console.log('Successful:', result.successful.length);
   console.log('Failed:', result.failed);
   // See which files failed and why
   ```

---

### 5. Database Connection Errors

**Symptoms**:
- "Connection timeout" error
- API requests hang
- Database operations very slow

**Solutions**:

1. **Check Connection Pool**:
   - Supabase Dashboard → Database → Connection
   - Verify you're within connection limits
   - Default: 5 concurrent connections

2. **Too Many Concurrent Requests**:
   ```javascript
   // Bad: 100 concurrent requests
   Promise.all(products.map(p => fetchProductDetails(p.id)));
   
   // Good: Batch with concurrency limit
   async function* batchRequests(items, batchSize) {
     for (let i = 0; i < items.length; i += batchSize) {
       yield items.slice(i, i + batchSize);
     }
   }
   ```

3. **Check Supabase Project Status**:
   - Go to https://status.supabase.com
   - Look for any service outages
   - Check Dashboard → Support → Status

4. **Restart Connection**:
   - For development: Refresh browser page
   - For production: May need to contact Supabase

---

### 6. Pagination Not Working

**Symptoms**:
- Pagination controls not appearing
- Page doesn't change when clicking next
- Total pages showing as 0

**Solutions**:

1. **API Response Format Changed**:
   ```javascript
   // Check if response has pagination object
   const response = await fetch('/api/products');
   const result = await response.json();
   console.log(result.pagination);  // Should exist
   
   // If undefined, API might not be updated
   // Verify server has latest code
   ```

2. **Frontend Component Not Updated**:
   ```jsx
   // Check AdminProducts.tsx
   // Should have pagination state:
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   
   // And pagination controls in JSX
   ```

3. **Total Count Returning 0**:
   ```javascript
   // Check API response
   // pagination.total should be > 0
   
   // If 0, means:
   // - No products in database
   // - Query filter is too restrictive
   // - Database count is broken
   ```

4. **Query Parameters Not Passed**:
   ```javascript
   // In API call, verify params are sent
   const params = new URLSearchParams();
   params.append('page', page.toString());
   params.append('limit', '20');
   console.log(params.toString());  // Verify
   ```

---

### 7. Memory Issues (Out of Memory)

**Symptoms**:
- "JavaScript heap out of memory" error
- App becomes very slow
- Browser crashes

**Solutions**:

1. **Reduce Data Load**:
   ```javascript
   // Bad: Load all products at once
   const allProducts = await fetchAllProducts();
   
   // Good: Use pagination
   const page1Products = await fetch('/api/products?page=1&limit=20');
   ```

2. **Lazy Load Images**:
   ```jsx
   <img src={url} loading="lazy" />
   // Only loads image when visible on screen
   ```

3. **Clean Up Unused Data**:
   ```javascript
   // After fetching, clear unused references
   const products = [...data];
   // Don't keep multiple copies of same data
   ```

4. **Monitor Memory Usage** (Chrome DevTools):
   - F12 → Memory tab
   - Take heap snapshots
   - Look for growing memory usage
   - Identify what's taking memory

---

### 8. Search Not Working

**Symptoms**:
- Search returns no results
- Search very slow
- Search only matches beginning of text

**Solutions**:

1. **Index Missing**:
   ```sql
   -- Check if full-text search index exists
   SELECT * FROM pg_indexes 
   WHERE tablename = 'products' 
   AND indexname LIKE '%search%';
   
   -- Create if missing
   CREATE INDEX idx_products_search ON products 
   USING gin(to_tsvector('spanish', name || ' ' || description));
   ```

2. **Search Parameter Not Sent**:
   ```javascript
   // Check API call includes search parameter
   fetch(`/api/products?search=colonial`);
   
   // If URL doesn't have ?search=..., search won't work
   ```

3. **Case Sensitivity Issue**:
   ```sql
   -- Database search should be case-insensitive
   -- Check API code uses ILIKE (not LIKE)
   query = query.ilike("city", `%${city}%`);  // ✓ Case-insensitive
   // NOT: query = query.like("city", `%${city}%`);  // Case-sensitive
   ```

4. **Special Characters Breaking Search**:
   ```javascript
   // Escape special characters
   const searchTerm = 'Casa "Colonial"';  // Quotes might break search
   const escaped = searchTerm.replace(/['"]/g, '');  // Remove quotes
   ```

---

### 9. Filters Not Working Together

**Symptoms**:
- Works with type filter alone
- Works with city filter alone
- Doesn't work when combining filters
- Some combinations return no results

**Solutions**:

1. **OR vs AND Logic**:
   ```sql
   -- Current (AND logic - should work)
   WHERE type = 'casa' AND city ILIKE '%Guanajuato%'
   
   -- If not working, might be OR logic problem
   -- Check server/routes/products.ts for filter logic
   ```

2. **Filter Values Not Matching**:
   ```javascript
   // Check exact values in database
   SELECT DISTINCT type FROM products;
   SELECT DISTINCT city FROM products;
   
   // Ensure filter values match exactly
   // 'Casa' vs 'casa' (case sensitivity)
   // 'Guanajuato, GTO' vs 'Guanajuato' (extra info)
   ```

3. **Filter Parameters Not Passed**:
   ```javascript
   // Verify all filters included in API call
   const params = new URLSearchParams();
   params.append('page', page.toString());
   params.append('type', type);  // ✓ Include
   params.append('city', city);  // ✓ Include
   params.append('minPrice', minPrice);  // ✓ Include
   console.log(params.toString());  // Verify all present
   ```

---

### 10. Dashboard Admin Panel Issues

**Symptoms**:
- Products list not loading
- Forms not submitting
- Pagination not working in admin
- Media gallery not appearing

**Solutions**:

1. **Clear Browser Cache**:
   - F12 → Application → Clear Storage
   - Refresh page
   - Try again

2. **Check Admin Component**:
   - Verify AdminProducts.tsx has latest code
   - Check if pagination state is updated
   - Verify API response handling

3. **Verify API Response**:
   ```javascript
   // Check browser Network tab
   // F12 → Network → Filter "products"
   // Click on request → Response tab
   // Should see { data: [], pagination: {...} }
   ```

4. **Check User Permissions**:
   - Verify you're logged in as admin (if authentication enabled)
   - Check RLS policies allow admin access

---

## 🧪 Testing Commands

### Test API Endpoints

```bash
# List products
curl "http://localhost:3000/api/products?page=1&limit=20"

# Search
curl "http://localhost:3000/api/products?search=colonial"

# Filter by type
curl "http://localhost:3000/api/products?type=casa"

# Price range
curl "http://localhost:3000/api/products?minPrice=100000&maxPrice=300000"

# All combined
curl "http://localhost:3000/api/products?page=1&limit=20&type=casa&city=Guanajuato&minPrice=100000&maxPrice=300000"
```

### Test Upload

```javascript
// In browser console
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const url = await uploadProductImage(file);
console.log('Uploaded:', url);
```

---

## 📊 Performance Baseline

Expected response times (with proper indexes):

| Operation | Expected Time | Problem If > |
|-----------|---|---|
| List products (page 1) | 50-100ms | 500ms |
| Search products | 100-200ms | 1000ms |
| Filter by type | 50-100ms | 500ms |
| List media (50 files) | 100-150ms | 1000ms |
| Upload image | 1-3 seconds | 10 seconds |
| Batch upload (10 files) | 10-20 seconds | 60 seconds |

---

## 📞 Getting Help

### Before Contacting Support

1. Check this guide for your issue
2. Look at browser console (F12) for errors
3. Check network tab to see API responses
4. Try clearing cache and refreshing
5. Verify database indexes are created
6. Check Supabase status page

### How to Report Issues

Include:
- [ ] Description of problem
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Screenshots/videos if applicable
- [ ] Browser/device information
- [ ] Error messages from console
- [ ] Recent code changes (if applicable)

### Useful Debugging Info

```javascript
// Run in browser console to gather info
console.log('User Agent:', navigator.userAgent);
console.log('Window size:', window.innerWidth, window.innerHeight);
console.log('Connection type:', navigator.connection?.effectiveType);
console.log('Memory limit:', performance.memory);

// Check API response
fetch('/api/products?page=1&limit=5')
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)));
```

---

**Last Updated**: January 2025  
**Document Version**: 1.0
>>>>>>> 5d4ecee69de27c68db3eabc663ba48a32a5c7829
