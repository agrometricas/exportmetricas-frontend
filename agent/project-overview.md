# Exportmétricas — App Web (Next.js)

> Contexto de dominio para la app web. Las reglas de negocio son
> **autoritativas del backend** (`exportmetricas-backend`, NestJS) — esta app es
> la capa de **captura y visualización**. Para la arquitectura técnica de
> Next.js (axios, TanStack Query, next-auth), ver la sección "Arquitectura técnica"
> al final y los docs de `agent/features/`.

---

## Qué es esta app

App **Next.js 15 (App Router)** para el personal de una **exportadora de
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
| `purchaseOrder` | Orden de compra |
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
Orden de compra (opcional)     → cada línea da una exportación
  ↓
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
| Órdenes de compra | `export/purchase-orders`, `export/add-purchase-order` | Exportaciones | [modulo_ordenes_compra](features/modulo_ordenes_compra.md) |
| Exportaciones y envíos | `export/`, `liquidation/add-supply-shipment`, `liquidation/exports-sent` | Exportaciones | [modulo_exportaciones](features/modulo_exportaciones.md) |
| Hojas de corte | `export/add-cutting-sheet`, `export/cutting-sheets`, `box-brands/cutting-types`, `box-brands/verifiers` | Calidad | [modulo_hoja_corte](features/modulo_hoja_corte.md) |
| Bodega | `winery/`, `/ajuste-materiales/*` | Bodega | [modulo_bodega](features/modulo_bodega.md) |
| Liquidación | `liquidation/` | Liquidación | [modulo_liquidacion](features/modulo_liquidacion.md) |
| Inicio | `/dashboard` (raíz) | — | [modulo_dashboard](features/modulo_dashboard.md) |
| Errores del navegador | `api/client-errors`, `error.tsx`, `global-error.tsx` | — | [observabilidad_logs](features/observabilidad_logs.md) |

**La ruta no siempre coincide con el menú.** Envíos de insumos vive bajo
`liquidation/` pero se muestra en *Exportaciones*; verificadoras y tipos de
corte viven bajo `box-brands/` pero se muestran en *Calidad*; cuentas bancarias
viven bajo `client/` y `producer/` pero se muestran en *Liquidación*. El menú
manda: está en `components/ui/sidenav/navMenus.ts`.

Los catálogos que se cargan una vez comparten una entrada del menú, con
pestañas arriba de cada lista: *Comercialización › Logística* (puertos,
navieras, contratos navieros, depósitos, transportes y tarifas de transporte) y
*Calidad › Verificadoras y Tipos de Corte*. Cada pestaña es la página de
siempre, con su ruta. La entrada queda marcada en todas ellas y en sus altas
(`match` de la entrada, `SectionTabs`).

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

### 5. Una lista vacía es `[]`

Los listados del backend responden 200 con `[]` cuando no hay registros. Un
404 en un listado significa que el recurso padre de la URL no existe (un
productor, un puerto) y se trata como error.

### 6. Fecha de corte y semana

La semana del embarque sale de `getWeekInfo()` (semana ISO, lunes a domingo) y
viaja como texto en `weekDescription`. Las fechas se envían como medianoche
local en ISO.

---

## Arquitectura técnica (resumen)

### Stack

Next.js 15 App Router · TypeScript. El App Router corre con la copia de React 19
que trae Next; el paquete `react` instalado sigue en 18. UI con **Chakra UI v3**, con el tema de la marca en
`theme/system.ts` y modo claro y oscuro con **next-themes**; tablas con
**Material React Table** (que trae MUI como motor); gráficos con **recharts**;
formularios con **Formik + Yup**; fechas con **date-fns**.

Los colores, la tipografía y los radios salen de `design-system.md`, en la
raíz del repo.

### Datos: TanStack Query (v5)

- Un hook por endpoint en `hooks/<dominio>/`.
- El `QueryClient` activo se crea en `components/Providers.tsx` con
  `staleTime: Infinity`, `gcTime: Infinity` y sin refetch automático: **un
  dato solo se vuelve a pedir si una mutación invalida su clave**. Con
  `refetchOnMount: true`, una clave invalidada mientras su pantalla no estaba
  abierta se vuelve a pedir al abrirla.
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
- El interceptor de respuesta solo reporta el error (ver
  [observabilidad_logs](features/observabilidad_logs.md)) y lo deja pasar: cada
  hook o formulario sigue manejando el suyo. Ante un 401 el patrón es redirigir
  a `/api/auth/signout`.
- Las páginas públicas y algunas de servidor usan `fetch` directo
  (el login de next-auth, recuperación de contraseña, ajuste de materiales).

### Auth: next-auth (`app/api/auth/[...nextauth]/`)

- `CredentialsProvider` → `POST /auth/exporter/login` (espera **201**).
- `session.user` lleva `{ id, name, email, role, exporterId, onboardingStatus }`,
  más `accessToken` y `refreshToken`. Tipos en `types/next-auth.d.ts`.
- El callback `jwt` de `authOptions.ts` **renueva los tokens del backend**
  (`POST /auth/exporter/refresh`) cuando al refresh token se le pasó la mitad
  de su vida (`needsRenewal`, `utils/sessionRenewal.ts`). Como el interceptor
  pide la sesión en cada petición, un usuario activo no llega a ver el token
  vencido. La renovación también trae el nombre y el rol guardados hoy. Si el
  usuario estuvo inactivo más que la vida del token, o la renovación falla, la
  siguiente petición da 401 y vuelve al login.
- El `onboardingStatus` se actualiza en la sesión con `update()` al terminar el
  onboarding.

### Protección de rutas

- `components/ui/IsOnboarding.tsx` es un HOC que envuelve casi todas las páginas
  de `/dashboard`: no renderiza nada sin sesión y redirige a
  `/dashboard/onboarding` mientras el estado sea `pending`.
- `middleware.ts` (en la raíz del repo) solo registra la ruta; no valida sesión.
- La raíz (`/`) lee la sesión en el servidor: con sesión va a `/dashboard`, sin
  ella a `/auth/signin`.
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

Dentro de Configuraciones, *Usuarios* (invitar, cambiar el rol, eliminar) se
muestra solo al `MASTER`, que es el único al que el backend se lo permite.

El backend usa el mismo reparto para guardar: una ruta que crea, cambia o borra
responde 403 a un rol fuera de su área, con el área a la que le corresponde en
el mensaje. Las consultas son de todos. La web no bloquea pantallas por rol:
esconde el menú y, en la ficha y en *Lo que falta*, las acciones de otras áreas
(`utils/workQueueAccess.ts`). Los contadores rojos salen de
`hooks/useMenuCounts.tsx`, que consulta las cinco listas de pendientes.

### Layout

`app/dashboard/layout.tsx` → `components/ui/ClientLayoutWrapper.tsx`: barra
lateral colapsable, `AppBar` y el contenido con scroll propio. En pantallas
angostas la barra es un cajón que se cierra solo al cambiar de página
(`SidenavBar`).

Cada página arma su marco con `components/ui/page/PageLayout.tsx`: arriba el
encabezado (ícono, título, descripción, botón y, si hay, las pestañas de la
sección) y debajo el contenido. Las listas usan `PageLayout` con la tabla
directo en su tarjeta; los formularios y las fichas usan `CardPage`, que pone el contenido en
una sola tarjeta. Los formularios van a 1024 px de ancho y lo que lleva una
tabla, a 1440 px. Dentro del formulario, cada sección abre con
`FormSectionTitle` y el botón de guardar va en `FormActions`, que queda fijo
abajo mientras el formulario no termina (`components/ui/form/FormSection.tsx`).

En el menú lateral, cada lista va en una fila junto con su alta: el `+` a la
derecha abre el formulario (`menuRows`, `components/ui/sidenav/`). Con la
barra colapsada, pasar el mouse por un ícono muestra las entradas del grupo.

El modo oscuro se elige en el menú del usuario (arriba a la derecha) y queda
guardado en el navegador. La app abre en claro. Las tablas lo siguen: el tema
de MUI se arma con el modo activo (`brandMuiTheme`, `theme/muiTheme/`).

Los formularios largos (exportación, alícuota, hoja de corte) avisan antes de
perder lo llenado (`UnsavedChangesGuard`, `components/ui/form/`): con un
diálogo si se sale por un enlace de la app, y con el aviso del navegador si se
recarga o se cierra la pestaña. Solo pregunta después de que el usuario cambió
algo; el botón *Atrás* del navegador no lo cubre.

La `AppBar` trae la búsqueda rápida (`components/ui/header/QuickSearch.tsx`):
un botón, o `Ctrl K` y `/` desde cualquier pantalla, abre un buscador que pide
`GET /export/search?q=` a partir de dos letras o de un número. Muestra cada
exportación con su finca, cliente, corte, booking y contenedores
(`searchHitSummary`, `utils/exportSearch.ts`); con las flechas y Enter, o con
un clic, abre su ficha.

---

## Tests

Vitest sobre utilidades puras (`src/**/*.spec.ts`) y una prueba de humo con
Playwright (`smoke/`, `npm run smoke`) que abre cada pantalla contra una web y
un backend locales. No hay pruebas de componentes. Ver
[`coding-standards.md`](coding-standards.md) § _Testing_.

---

## Errores comunes a evitar (lado web)

- Agregar un cálculo de dinero en un formulario en vez de pedirlo al backend.
- Olvidar invalidar una clave después de una mutación: con `staleTime: Infinity`
  la pantalla se queda con el dato viejo hasta recargar.
- Olvidar invalidar las listas `…Pending`: el contador del menú no baja.
- Atrapar el 404 de un listado para devolver `[]`: tapa una ruta mal escrita.
- Leer el detalle de un 400 en `message`: está en `errors`.
- Usar el access token como Bearer.
- Mandar un campo en el body que el DTO del backend aún no acepta.
- Buscar una pantalla por el nombre del menú en vez de por `navMenus.ts`.
- Ramificar de `main`: la rama por defecto es `main-2`.
