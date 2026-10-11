# Exportmétricas — App Web (Next.js)

> Contexto de dominio para la app web. Las reglas de negocio son
> **autoritativas del backend** (`exportmetricas-backend`, NestJS) — esta app es
> la capa de **captura y visualización**. Para la arquitectura técnica de
> Next.js (axios, react-query, next-auth), ver la sección "Arquitectura técnica"
> al final y los docs de `agent/features/`.

---

## Qué es esta app

App **Next.js 14 (App Router)** para el personal de una **exportadora de
banano**. Gestiona el ciclo de un embarque de punta a punta: a quién se le
compra la fruta, a quién se le vende, con qué caja y qué materiales se despacha,
cuánto material hay en bodega y en cada finca, y cómo se liquida con el
productor y con el cliente.

Tiene dos públicos:

- **Usuarios de la exportadora**, con sesión y un rol (`MASTER`, `LOGISTICS`,
  `EXPORT`, `QUALITY`, `ADMINISTRATIVE`), bajo `/dashboard`.
- **Productores**, sin sesión, que entran por un enlace con token a
  `/ajuste-materiales/[token]` para reportar el stock real de su finca.

---

## El sistema más amplio

- **Backend (NestJS)** — reglas, inventario, PDF, Excel y correos. Autoritativo.
- **App web (este repo)** — único cliente. No hay app móvil.

Cada exportadora es un tenant: todo lo que la web muestra viene filtrado por la
exportadora de la sesión.

---

## Vocabulario

Los nombres del código (heredados del backend) no coinciden con los de la
pantalla:

| En el código | En la pantalla |
|---|---|
| `exporter` | Exportadora |
| `merchant` / `producer` | Productor |
| `business` | Finca |
| `client` | Cliente |
| `harbor` | Puerto (`Nacional` de salida, `Internacional` de destino) |
| `shippingCompany` | Naviera |
| `deposit` | Depósito |
| `verifier` | Verificadora |
| `boxBrand` | Alícuota |
| `brand` | Marca |
| `cuttingType` | Tipo de corte |
| `export` | Exportación |
| `exportSent` / `supply-shipment` | Envío de insumos |
| `cuttingSheet` | Hoja de corte |
| `export-cost` | Costos validados |
| `producerPayment` / `liquidation` | Pago a productor |
| `clientPayment` | Cobro a cliente |
| `winery` | Bodega |

---

## El embarque, paso a paso

```
Exportación                    → aparece en "Agregar Envíos de Insumos"
  ↓
Envío de insumos               → aparece en "Agregar Hojas de Corte"
  ↓                              y en "Agregar Costos Validados"
Hoja de corte      Costos validados
                     ↓
        Pago a productor      Cobro a cliente
```

Cada paso pendiente es una lista que el backend filtra por banderas; la web las
consulta para pintar los contadores del menú lateral.

---

## Mapa de módulos (carpeta `app/dashboard/`)

| Dominio | Ruta `app/dashboard/` | Menú | Doc |
|---|---|---|---|
| Sesión y onboarding | `/auth/*`, `onboarding/`, `user/` | — | [modulo_auth_onboarding](features/modulo_auth_onboarding.md) |
| Productores y fincas | `producer/` | Productor | [modulo_productores](features/modulo_productores.md) |
| Clientes y logística | `client/` | Comercialización | [modulo_comercializacion](features/modulo_comercializacion.md) |
| Alícuotas y materiales | `box-brands/` | Materiales | [modulo_marcas_caja](features/modulo_marcas_caja.md) |
| Exportaciones y envíos | `export/`, `liquidation/add-supply-shipment`, `liquidation/exports-sent` | Exportaciones | [modulo_exportaciones](features/modulo_exportaciones.md) |
| Hojas de corte | `export/add-cutting-sheet`, `export/cutting-sheets`, `box-brands/cutting-types`, `box-brands/verifiers` | Calidad | [modulo_hoja_corte](features/modulo_hoja_corte.md) |
| Bodega | `winery/`, `/ajuste-materiales/*` | Bodega | [modulo_bodega](features/modulo_bodega.md) |
| Liquidación | `liquidation/` | Liquidación | [modulo_liquidacion](features/modulo_liquidacion.md) |
| Inicio | `/dashboard` (raíz) | — | [modulo_dashboard](features/modulo_dashboard.md) |

**La ruta no siempre coincide con el menú.** Envíos de insumos vive bajo
`liquidation/` pero se muestra en *Exportaciones*; verificadoras y tipos de
corte viven bajo `box-brands/` pero se muestran en *Calidad*; cuentas bancarias
viven bajo `client/` y `producer/` pero se muestran en *Liquidación*. El menú
manda: está en `components/ui/sidenav/navMenus.ts`.

Cada dominio repite el mismo patrón de carpetas:
`hooks/<dominio>/` · `types/<dominio>` · `components/<dominio>/` ·
`app/dashboard/<dominio>/{add-…, lista}/page.tsx`.

---

## Reglas que la web debe respetar

### 1. El orden de los pasos lo marca el backend

Una exportación no puede tener dos envíos de insumos, ni un envío dos hojas de
corte o dos pagos. La web lista solo lo pendiente; un intento duplicado lo
rechaza el backend.

### 2. Sin stock asignado no hay envío de insumos

El envío descuenta del stock de la finca. Si un material de la alícuota no está
asignado a esa finca, el backend rechaza el envío completo y la web muestra el
mensaje. El camino es Bodega → asignar a la finca → reintentar.

### 3. Los costos se validan antes de pagar

Un envío no aparece como pendiente de pago a productor ni de cobro a cliente
hasta que sus costos de materiales están confirmados en *Costos Validados*.

### 4. El Bearer es el refresh token

`lib/axios.ts` manda `session.refreshToken`, no el access token. Es lo que el
backend valida.

### 5. Lista vacía = 404

Muchas listas del backend responden 404 cuando no hay registros. Los hooks lo
convierten en `[]`.

### 6. Fecha de corte y semana

La semana del embarque sale de `getWeekInfo()` (semana ISO, lunes a domingo) y
viaja como texto en `weekDescription`. Las fechas se envían como medianoche
local en ISO.

---

## Arquitectura técnica (resumen)

### Stack

Next.js 14 App Router · React 18 · TypeScript. UI con **Chakra UI**; tablas con
**Material React Table** (que trae MUI como motor); gráficos con **recharts**;
formularios con **Formik + Yup**; fechas con **date-fns**.

### Datos: react-query (v3)

- Un hook por endpoint en `hooks/<dominio>/`.
- El `QueryClient` activo se crea en `components/Providers.tsx` con
  `staleTime: Infinity`, `cacheTime: Infinity` y sin refetch automático: **un
  dato solo se vuelve a pedir si una mutación invalida su clave**.
- Helpers de tipos en `lib/react-query.ts`: `QueryConfig<fn>`,
  `MutationConfig<fn>`, `ExtractFnReturnType<fn>`. El `queryClient` que exporta
  ese archivo no está montado.
- Las claves de lista más usadas: `exports`, `exportsPending`, `exportsSent`,
  `exportsSentPending`, `cuttingSheets`, `cuttingSheetsPending`,
  `exportSentCostsPending`, `clientPaymentsPending`, `merchants`, `clients`,
  `boxBrands`, `exporterMaterialStock`.

### HTTP: `lib/axios.ts`

- Instancia única, `baseURL = env.NEXT_PUBLIC_API_URL`, timeout de 10 s.
- El interceptor llama a `getSession()` en **cada** petición y pone el refresh
  token como Bearer.
- No hay interceptor de respuesta: cada hook o formulario maneja su error. Ante
  un 401 el patrón es redirigir a `/api/auth/signout`.
- Las páginas públicas y algunas de servidor usan `fetch` directo
  (`lib/export/export.ts`, recuperación de contraseña, ajuste de materiales).

### Auth: next-auth (`app/api/auth/[...nextauth]/`)

- `CredentialsProvider` → `POST /auth/exporter/login` (espera **201**).
- `session.user` lleva `{ id, name, email, role, exporterId, onboardingStatus }`,
  más `accessToken` y `refreshToken`. Tipos en `types/next-auth.d.ts`.
- La sesión de next-auth dura una hora y se extiende de a cinco minutos al
  vencer; **no llama al endpoint de refresh**. Cuando el token del backend
  expira, la siguiente petición da 401 y el usuario vuelve al login.
- El `onboardingStatus` se actualiza en la sesión con `update()` al terminar el
  onboarding.

### Protección de rutas

- `components/ui/IsOnboarding.tsx` es un HOC que envuelve casi todas las páginas
  de `/dashboard`: no renderiza nada sin sesión y redirige a
  `/dashboard/onboarding` mientras el estado sea `pending`.
- `middleware.ts` (en la raíz del repo) solo registra la ruta; no valida sesión.
- La sesión la valida el backend en cada petición.

### Navegación y permisos (sidenav)

`components/ui/sidenav/SideNavItems.ts` → `getNavItems(counts, session)` filtra
cada grupo por `allowedRoles`. `MASTER` ve todo.

| Grupo | Roles |
|---|---|
| Productor, Comercialización, Materiales | `LOGISTICS`, `EXPORT` |
| Exportaciones | `EXPORT` |
| Calidad | `QUALITY` |
| Liquidación, Bodega, Configuraciones | `ADMINISTRATIVE` |

Es el reparto de menús por área que definió la operación al pedir el sistema,
más Bodega, que se agregó después.

El filtro es del menú, no de las rutas. Los contadores rojos
salen de `hooks/useMenuCounts.tsx`, que consulta las cinco listas de pendientes.

### Layout

`app/dashboard/layout.tsx` → `components/ui/ClientLayoutWrapper.tsx`: barra
lateral colapsable, `AppBar` y el contenido con scroll propio. Soporta modo
claro y oscuro con `useColorModeValue`.

---

## Tests

No hay. Ver [`coding-standards.md`](coding-standards.md) § _Testing_.

---

## Errores comunes a evitar (lado web)

- Agregar un cálculo de dinero en un formulario en vez de pedirlo al backend.
- Olvidar invalidar una clave después de una mutación: con `staleTime: Infinity`
  la pantalla se queda con el dato viejo hasta recargar.
- Olvidar invalidar las listas `…Pending`: el contador del menú no baja.
- Tratar un 404 de una lista como error en vez de lista vacía.
- Leer el detalle de un 400 en `message`: está en `errors`.
- Usar el access token como Bearer.
- Mandar un campo en el body que el DTO del backend aún no acepta.
- Buscar una pantalla por el nombre del menú en vez de por `navMenus.ts`.
- Ramificar de `main`: la rama por defecto es `main-2`.
