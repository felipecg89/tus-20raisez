# Panel Administrativo - Guía de Uso

¡Tu panel administrativo está listo! Aquí te mostramos cómo usar cada sección.

## 📍 Acceso al Panel

El panel administrativo está disponible en: `/admin`

También puedes acceder desde el header haciendo clic en el ícono de configuración (⚙️) en la barra de navegación superior.

---

## 📊 Dashboard Principal

Al entrar al panel, verás:

- **Estadísticas en tiempo real**: Productos activos, mensajes recibidos, mensajes sin leer
- **Gráficos de actividad**: Análisis mensual y tendencias de crecimiento
- **Acceso rápido**: Tabs para gestionar Productos, Mensajes y Contenido

---

## 🏠 Sección 1: Gestión de Productos

### ¿Qué es?
Administra las propiedades (casas y terrenos) que ofreces en tu sitio.

### Funcionalidades:

#### Crear Nuevo Producto
1. Haz clic en "➕ Nuevo Producto"
2. Completa los campos:
   - **Nombre**: Ej. "Casa moderna en Monterrey"
   - **Ciudad**: Ej. "Monterrey"
   - **Descripción**: Detalles de la propiedad
   - **Precio**: Precio en USD
   - **Tipo**: Selecciona "Casa" o "Terreno"
   - **URL de imagen**: Link a una imagen de la propiedad
   - **Características**: Lista separada por comas (Ej: "3 recamaras, piscina, jardín")
3. Haz clic en "Crear Producto"

#### Editar Producto
1. Haz clic en el botón "Editar" (✏️) en la tarjeta del producto
2. Modifica los campos que necesites
3. Haz clic en "Guardar Cambios"

#### Eliminar Producto
1. Haz clic en el botón "Eliminar" (🗑️) en la tarjeta del producto
2. Confirma la eliminación

---

## 💬 Sección 2: Gestión de Mensajes

### ¿Qué es?
Administra los mensajes que envían los clientes a través de tu sitio.

### Funcionalidades:

#### Ver Mensajes
1. Los mensajes se muestran en una lista a la izquierda
2. Haz clic en un mensaje para ver los detalles completos
3. Los mensajes nuevos están marcados con una etiqueta "Nuevo"

#### Filtros
- **Todos**: Muestra todos los mensajes
- **Sin leer**: Muestra solo los mensajes que no has leído

#### Marcar como Leído
1. Selecciona un mensaje sin leer
2. Haz clic en "👁️ Marcar como leído"
3. El mensaje aparecerá marcado como leído

#### Eliminar Mensaje
1. Selecciona el mensaje
2. Haz clic en "🗑️ Eliminar"
3. Confirma la eliminación

---

## 📝 Sección 3: Gestión de Contenido

### ¿Qué es?
Edita el contenido de las diferentes secciones de tu sitio (hero, servicios, beneficios, etc.).

### Funcionalidades:

#### Crear Nuevo Bloque
1. Haz clic en "➕ Nuevo Bloque"
2. Selecciona la sección:
   - **Sección Hero**: Encabezado principal
   - **Servicios**: Tarjetas de servicios
   - **Beneficios**: Lista de ventajas
   - **Footer**: Pie de página
   - **Otro**: Contenido adicional
3. Ingresa:
   - **Clave**: Identificador único (Ej: "hero-title")
   - **Valor**: El contenido actual
4. Haz clic en "Crear Bloque"

#### Editar Contenido
1. Localiza el bloque en su sección
2. Haz clic en "Editar"
3. Modifica el valor del contenido
4. Haz clic en "💾 Guardar"

#### Eliminar Bloque
1. Haz clic en el botón "❌" en la esquina superior derecha
2. Confirma la eliminación

---

## 📊 API Endpoints

El panel usa los siguientes endpoints (útil si quieres integrar con otras herramientas):

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto específico
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Mensajes
- `GET /api/messages` - Obtener todos los mensajes
- `GET /api/messages/:id` - Obtener un mensaje específico
- `POST /api/messages` - Crear nuevo mensaje
- `PUT /api/messages/:id/read` - Marcar como leído
- `DELETE /api/messages/:id` - Eliminar mensaje
- `GET /api/stats` - Obtener estadísticas

### Contenido
- `GET /api/content` - Obtener todos los bloques de contenido
- `GET /api/content?section=hero` - Obtener bloques por sección
- `GET /api/content/:id` - Obtener bloque específico
- `POST /api/content` - Crear nuevo bloque
- `PUT /api/content/:id` - Actualizar bloque
- `DELETE /api/content/:id` - Eliminar bloque

---

## 💡 Tips y Mejores Prácticas

### Para Productos
- Usa URLs de imagen de alta calidad
- Incluye todas las características importantes
- Actualiza los precios regularmente
- Mantén las descripciones claras y concisas

### Para Mensajes
- Revisa los mensajes sin leer regularmente
- Responde rápidamente a los clientes
- Guarda información importante antes de eliminar
- Usa los filtros para organizar tu bandeja

### Para Contenido
- Usa claves descriptivas para identificar bloques fácilmente
- No elimines bloques críticos del sitio
- Prueba cambios en una sección antes de actualizar
- Documenta qué bloques son importantes

---

## 🚀 Próximos Pasos

### Mejoras Futuras (En Desarrollo)
- [ ] Integración con base de datos persistente (Supabase/Neon)
- [ ] Autenticación y control de acceso
- [ ] Búsqueda avanzada de mensajes
- [ ] Exportar datos a CSV/Excel
- [ ] Historial de cambios
- [ ] Notificaciones en tiempo real

---

## ❓ Preguntas Frecuentes

**¿Dónde se guardan los datos?**
Actualmente en la memoria del servidor. Se recomienda conectar una base de datos como Supabase o Neon para persistencia.

**¿Puedo acceder al panel desde cualquier dispositivo?**
Sí, el panel es completamente responsivo. Funciona en móvil, tablet y desktop.

**¿Se pierden los datos si reinicio el servidor?**
Sí, con el sistema actual. Para mantener los datos persistentes, necesitas conectar una base de datos.

**¿Cómo agrego nuevas secciones?**
En la sección de Contenido, selecciona "Otro" en el selector de secciones para crear bloques personalizados.

---

¡Tu panel está listo para usar! Si tienes preguntas, revisa los endpoints de API o contacta al equipo de soporte.
