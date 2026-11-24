/**
 * Rutas privadas de gestión interna.
 * No se enlazan en ninguna parte pública del sitio ni en robots.txt.
 */
const ADMIN_BASE =
  (import.meta.env.VITE_PRIVATE_ADMIN_PATH as string | undefined)?.replace(/\/+$/, "") ||
  "/panel-interno-trmx";

const LOGIN_PATH =
  (import.meta.env.VITE_PRIVATE_LOGIN_PATH as string | undefined)?.replace(/\/+$/, "") ||
  "/acceso-interno-trmx";

export const PRIVATE_ROUTES = {
  login: LOGIN_PATH,
  admin: ADMIN_BASE,
  adminProductDetailPattern: `${ADMIN_BASE}/productos/:id`,
  adminProductDetail: (id: string) => `${ADMIN_BASE}/productos/${id}`,
  agentes: `${ADMIN_BASE}/agentes`,
} as const;
