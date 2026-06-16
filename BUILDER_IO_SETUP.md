<<<<<<< HEAD
# Guía de Integración de Builder.io

Esta guía te ayudará a integrar Builder.io con tu aplicación Next.js para crear páginas editables con roles de usuario.

## 1. Prerrequisitos

- Cuenta de Builder.io (crea una en https://builder.io si no tienes)
- API Key de Builder.io
- Space ID de Builder.io

## 2. Obtener tus Credenciales de Builder.io

### Paso 1: Obtén tu API Key
1. Inicia sesión en https://builder.io
2. Ve a **Account Settings** (Configuración de Cuenta)
3. En la sección **API Keys**, copia tu clave API pública
4. Guárdala en un lugar seguro

### Paso 2: Obtén tu Space ID
1. Ve a tu Dashboard de Builder.io
2. Tu Space ID está visible en la URL: `https://builder.io/app/<SPACE_ID>/content`
3. Guarda este ID

## 3. Instalar la Dependencia de Builder.io

```bash
pnpm add @builder.io/react
```

## 4. Configurar Variables de Entorno

En tu archivo `.env.local` o en DevServerControl, agrega:

```env
VITE_BUILDER_API_KEY=tu_api_key_aqui
VITE_BUILDER_SPACE_ID=tu_space_id_aqui
```

## 5. Crear Modelos en Builder.io

Accede a https://builder.io y crea los siguientes modelos para tu aplicación:

### Modelo 1: Navbar (`navbar`)
**Ubicación:** Create → New Model → Custom
**Propiedades Personalizadas:**
- `userRole` (select: "cliente", "agente", "admin")
- `isAuthenticated` (boolean)

**Contenido a Diseñar:**
- Logo de la aplicación
- Enlaces de navegación
- Botón de login/logout
- Avatar del usuario (condicional)

### Modelo 2: Login Page (`login-page`)
**Ubicación:** Create → New Page → `/login`

**Contenido a Diseñar:**
- Formulario de login (en el código, no en Builder)
- Formulario de registro (en el código, no en Builder)
- Diseño y branding

### Modelo 3: Agents Dashboard (`agents-dashboard`)
**Ubicación:** Create → New Page → `/agentes`
**Propiedades Personalizadas:**
- `userRole` (select: "cliente", "agente", "admin")
- `showPropertyManagement` (boolean)
- `showGlobalControls` (boolean)
- `showWebDesignEditor` (boolean)

**Contenido a Diseñar:**
- Panel de gestión de propiedades
- Panel de control global (solo admin)
- Botón para editar diseño web (solo admin)
- Información de usuario

### Modelo 4: Footer (`footer`)
**Ubicación:** Create → New Model → Custom

**Contenido a Diseñar:**
- Enlaces de footer
- Información de contacto
- Enlaces sociales

## 6. Implementar Lógica Condicional

En Builder.io, usa Custom Properties para controlar la visibilidad:

### Para mostrar/ocultar basado en roles:

1. Selecciona un componente
2. En el panel derecho, ve a **Bindings**
3. Usa expresiones como:

```javascript
// Mostrar solo para agentes y admins
state.userRole === "agente" || state.userRole === "admin"

// Mostrar solo para admins
state.userRole === "admin"

// Mostrar para clientes o deslogueados
!state.userRole || state.userRole === "cliente"
```

## 7. Actualizar el Componente BuilderContent

Una vez instalado @builder.io/react, actualiza `client/components/BuilderContent.tsx`:

```typescript
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BUILDER_CONFIG, BUILDER_MODELS } from "@/lib/builder-config";
import { useAuth } from "@/contexts/AuthContext";

// Configure Builder
builder.init(BUILDER_CONFIG.apiKey);

export const BuilderContent: React.FC<BuilderContentProps> = ({
  model,
  content,
  className,
}) => {
  const { user } = useAuth();
  const isPreviewing = useIsPreviewing();

  return (
    <BuilderComponent
      model={model}
      content={content}
      customizations={{
        properties: {
          userRole: user?.role,
          isAuthenticated: !!user,
        },
      }}
      className={className}
    />
  );
};
```

## 8. Usar BuilderContent en las Páginas

### En Navbar:
```typescript
import { BuilderContent } from "@/components/BuilderContent";
import { BUILDER_MODELS } from "@/lib/builder-config";

export const AuthAwareNavbar = () => {
  return <BuilderContent model={BUILDER_MODELS.navbar} />;
};
```

### En Login Page:
```typescript
export default function Login() {
  return (
    <BuilderContent model={BUILDER_MODELS.loginPage}>
      {/* Aquí va el formulario nativo de login */}
      <form onSubmit={handleSubmit}>
        {/* Form content */}
      </form>
    </BuilderContent>
  );
}
```

### En Agentes Page:
```typescript
export default function Agentes() {
  return (
    <BuilderContent model={BUILDER_MODELS.agentsDashboard} />
  );
}
```

## 9. Flujo de Roles y Permisos

El sistema está configurado con tres roles principales:

### Cliente (cliente)
- Visible: Formulario de Solicitud de Préstamo
- Visible: Información de propiedades públicas
- Visible: Contacto

### Agente (agente)
- Visible: Gestión de Propiedades (enlace a Supabase)
- Visible: Dashboard personal
- Acceso: `/agentes`

### Admin (admin)
- Visible: Panel de Control Global
- Visible: Editar Diseño de Web (enlace a Builder.io)
- Visible: Gestión de usuarios
- Visible: Todas las propiedades
- Acceso: `/admin` y `/agentes`

## 10. Crear Usuarios de Prueba

1. Accede a `/login`
2. Crea cuentas con diferentes roles en Supabase:
   - admin@test.com (rol: admin)
   - agent@test.com (rol: agente)
   - client@test.com (rol: cliente)

## 11. Testear la Integración

### Prueba del Navbar:
- Deslogueado: Debe mostrar "Iniciar Sesión" y "Registrarse"
- Logueado: Debe mostrar Dashboard y Cerrar Sesión

### Prueba del Dashboard de Agentes:
- Agente: Acceso a `/agentes` y botón "Gestionar Propiedades"
- Admin: Acceso a `/agentes` con todos los paneles
- Cliente: No accede a `/agentes` (redirect a login)

### Prueba de Roles:
- Verifica que los componentes condicionales se muestren correctamente
- Prueba con diferentes roles en Builder.io preview

## Recursos Útiles

- [Documentación de Builder.io](https://builder.io/docs)
- [Builder React SDK](https://github.com/BuilderIO/builder/tree/main/packages/react)
- [Custom Properties Guide](https://builder.io/docs/custom-properties)
- [Bindings Guide](https://builder.io/docs/guides/dynamic-data)

## Solución de Problemas

### "Invalid API Key"
- Verifica que VITE_BUILDER_API_KEY sea correcta
- Asegúrate de que sea la clave pública, no la privada

### "Model not found"
- Crea el modelo en Builder.io
- Verifica que el nombre coincida exactamente (case-sensitive)

### Componentes no se muestran
- Revisa la consola del navegador para errores
- Verifica que el @builder.io/react esté instalado
- Asegúrate de que BuilderContent esté importado correctamente

## Siguiente Paso

Una vez que hayas seguido esta guía y creado tus modelos en Builder.io:

1. Instala `@builder.io/react`
2. Actualiza las variables de entorno
3. Actualiza el componente BuilderContent
4. Reemplaza los placeholders con tus modelos reales

¡Listo! Tu aplicación ahora utilizará contenido editable de Builder.io.
=======
# Guía de Integración de Builder.io

Esta guía te ayudará a integrar Builder.io con tu aplicación Next.js para crear páginas editables con roles de usuario.

## 1. Prerrequisitos

- Cuenta de Builder.io (crea una en https://builder.io si no tienes)
- API Key de Builder.io
- Space ID de Builder.io

## 2. Obtener tus Credenciales de Builder.io

### Paso 1: Obtén tu API Key
1. Inicia sesión en https://builder.io
2. Ve a **Account Settings** (Configuración de Cuenta)
3. En la sección **API Keys**, copia tu clave API pública
4. Guárdala en un lugar seguro

### Paso 2: Obtén tu Space ID
1. Ve a tu Dashboard de Builder.io
2. Tu Space ID está visible en la URL: `https://builder.io/app/<SPACE_ID>/content`
3. Guarda este ID

## 3. Instalar la Dependencia de Builder.io

```bash
pnpm add @builder.io/react
```

## 4. Configurar Variables de Entorno

En tu archivo `.env.local` o en DevServerControl, agrega:

```env
VITE_BUILDER_API_KEY=tu_api_key_aqui
VITE_BUILDER_SPACE_ID=tu_space_id_aqui
```

## 5. Crear Modelos en Builder.io

Accede a https://builder.io y crea los siguientes modelos para tu aplicación:

### Modelo 1: Navbar (`navbar`)
**Ubicación:** Create → New Model → Custom
**Propiedades Personalizadas:**
- `userRole` (select: "cliente", "agente", "admin")
- `isAuthenticated` (boolean)

**Contenido a Diseñar:**
- Logo de la aplicación
- Enlaces de navegación
- Botón de login/logout
- Avatar del usuario (condicional)

### Modelo 2: Login Page (`login-page`)
**Ubicación:** Create → New Page → `/login`

**Contenido a Diseñar:**
- Formulario de login (en el código, no en Builder)
- Formulario de registro (en el código, no en Builder)
- Diseño y branding

### Modelo 3: Agents Dashboard (`agents-dashboard`)
**Ubicación:** Create → New Page → `/agentes`
**Propiedades Personalizadas:**
- `userRole` (select: "cliente", "agente", "admin")
- `showPropertyManagement` (boolean)
- `showGlobalControls` (boolean)
- `showWebDesignEditor` (boolean)

**Contenido a Diseñar:**
- Panel de gestión de propiedades
- Panel de control global (solo admin)
- Botón para editar diseño web (solo admin)
- Información de usuario

### Modelo 4: Footer (`footer`)
**Ubicación:** Create → New Model → Custom

**Contenido a Diseñar:**
- Enlaces de footer
- Información de contacto
- Enlaces sociales

## 6. Implementar Lógica Condicional

En Builder.io, usa Custom Properties para controlar la visibilidad:

### Para mostrar/ocultar basado en roles:

1. Selecciona un componente
2. En el panel derecho, ve a **Bindings**
3. Usa expresiones como:

```javascript
// Mostrar solo para agentes y admins
state.userRole === "agente" || state.userRole === "admin"

// Mostrar solo para admins
state.userRole === "admin"

// Mostrar para clientes o deslogueados
!state.userRole || state.userRole === "cliente"
```

## 7. Actualizar el Componente BuilderContent

Una vez instalado @builder.io/react, actualiza `client/components/BuilderContent.tsx`:

```typescript
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BUILDER_CONFIG, BUILDER_MODELS } from "@/lib/builder-config";
import { useAuth } from "@/contexts/AuthContext";

// Configure Builder
builder.init(BUILDER_CONFIG.apiKey);

export const BuilderContent: React.FC<BuilderContentProps> = ({
  model,
  content,
  className,
}) => {
  const { user } = useAuth();
  const isPreviewing = useIsPreviewing();

  return (
    <BuilderComponent
      model={model}
      content={content}
      customizations={{
        properties: {
          userRole: user?.role,
          isAuthenticated: !!user,
        },
      }}
      className={className}
    />
  );
};
```

## 8. Usar BuilderContent en las Páginas

### En Navbar:
```typescript
import { BuilderContent } from "@/components/BuilderContent";
import { BUILDER_MODELS } from "@/lib/builder-config";

export const AuthAwareNavbar = () => {
  return <BuilderContent model={BUILDER_MODELS.navbar} />;
};
```

### En Login Page:
```typescript
export default function Login() {
  return (
    <BuilderContent model={BUILDER_MODELS.loginPage}>
      {/* Aquí va el formulario nativo de login */}
      <form onSubmit={handleSubmit}>
        {/* Form content */}
      </form>
    </BuilderContent>
  );
}
```

### En Agentes Page:
```typescript
export default function Agentes() {
  return (
    <BuilderContent model={BUILDER_MODELS.agentsDashboard} />
  );
}
```

## 9. Flujo de Roles y Permisos

El sistema está configurado con tres roles principales:

### Cliente (cliente)
- Visible: Formulario de Solicitud de Préstamo
- Visible: Información de propiedades públicas
- Visible: Contacto

### Agente (agente)
- Visible: Gestión de Propiedades (enlace a Supabase)
- Visible: Dashboard personal
- Acceso: `/agentes`

### Admin (admin)
- Visible: Panel de Control Global
- Visible: Editar Diseño de Web (enlace a Builder.io)
- Visible: Gestión de usuarios
- Visible: Todas las propiedades
- Acceso: `/admin` y `/agentes`

## 10. Crear Usuarios de Prueba

1. Accede a `/login`
2. Crea cuentas con diferentes roles en Supabase:
   - admin@test.com (rol: admin)
   - agent@test.com (rol: agente)
   - client@test.com (rol: cliente)

## 11. Testear la Integración

### Prueba del Navbar:
- Deslogueado: Debe mostrar "Iniciar Sesión" y "Registrarse"
- Logueado: Debe mostrar Dashboard y Cerrar Sesión

### Prueba del Dashboard de Agentes:
- Agente: Acceso a `/agentes` y botón "Gestionar Propiedades"
- Admin: Acceso a `/agentes` con todos los paneles
- Cliente: No accede a `/agentes` (redirect a login)

### Prueba de Roles:
- Verifica que los componentes condicionales se muestren correctamente
- Prueba con diferentes roles en Builder.io preview

## Recursos Útiles

- [Documentación de Builder.io](https://builder.io/docs)
- [Builder React SDK](https://github.com/BuilderIO/builder/tree/main/packages/react)
- [Custom Properties Guide](https://builder.io/docs/custom-properties)
- [Bindings Guide](https://builder.io/docs/guides/dynamic-data)

## Solución de Problemas

### "Invalid API Key"
- Verifica que VITE_BUILDER_API_KEY sea correcta
- Asegúrate de que sea la clave pública, no la privada

### "Model not found"
- Crea el modelo en Builder.io
- Verifica que el nombre coincida exactamente (case-sensitive)

### Componentes no se muestran
- Revisa la consola del navegador para errores
- Verifica que el @builder.io/react esté instalado
- Asegúrate de que BuilderContent esté importado correctamente

## Siguiente Paso

Una vez que hayas seguido esta guía y creado tus modelos en Builder.io:

1. Instala `@builder.io/react`
2. Actualiza las variables de entorno
3. Actualiza el componente BuilderContent
4. Reemplaza los placeholders con tus modelos reales

¡Listo! Tu aplicación ahora utilizará contenido editable de Builder.io.
>>>>>>> 5d4ecee69de27c68db3eabc663ba48a32a5c7829
