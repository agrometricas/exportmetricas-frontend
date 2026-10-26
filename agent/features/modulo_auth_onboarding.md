# Módulo Sesión, Registro y Onboarding

> Reglas autoritativas del backend; aquí se anota cómo la web registra una
> exportadora, mantiene la sesión y obliga al onboarding inicial.

### Propósito

Dar de alta una exportadora, iniciar sesión, recuperar la contraseña y llevar al
primer usuario por el onboarding antes de dejarlo entrar al resto de la app.

---

### Flujo

```
/auth/signup            POST /auth/exporter/register      → /auth/signin
/auth/signin            next-auth signIn('credentials')    → /dashboard
/dashboard/*            IsOnboarding: onboardingStatus === 'pending'
                                                           → /dashboard/onboarding
/dashboard/onboarding   POST /auth/exporter/onboarding
                        update({ onboardingStatus: 'done' })
                                                           → /dashboard/producer/producers
```

Recuperación de contraseña:

```
/auth/forgot-password            POST /auth/exporter/forgot-password
/auth/reset-password/[token]     POST /auth/exporter/reset-password
/auth/reset-password/success
```

---

### Sesión (lo que guarda next-auth)

| Campo | Origen |
|-------|--------|
| `session.user.id`, `name`, `email` | Respuesta del login |
| `session.user.role` | `MASTER`, `LOGISTICS`, `EXPORT`, `QUALITY`, `ADMINISTRATIVE` |
| `session.user.exporterId` | Exportadora del usuario; llega como string |
| `session.user.onboardingStatus` | `pending` o `done` |
| `session.accessToken`, `session.refreshToken` | Tokens del backend |

- El login espera un **201**; cualquier otro estado es credencial inválida.
- `lib/axios.ts` usa el `refreshToken` como Bearer.
- La sesión dura una hora y se extiende de a cinco minutos; la web no renueva
  los tokens del backend. Un 401 lleva a `/api/auth/signout`.

---

### Onboarding

El formulario crea, en una sola petición, el **primer productor con sus
fincas**.

- Mientras `onboardingStatus` sea `pending`, `IsOnboarding` redirige cualquier
  página del dashboard a `/dashboard/onboarding`.
- Al terminar, la web llama a `update({ onboardingStatus: 'done' })` de
  next-auth para corregir la sesión sin volver a iniciar sesión: el callback
  `jwt` de `authOptions.ts` acepta ese `trigger === 'update'`.
- Un error con `model` y `prop` en el cuerpo se pinta sobre el campo: `model ===
  'Merchant'` apunta al campo del productor, cualquier otro a
  `businesses[0].<prop>`.

---

### Roles

El rol decide qué grupos del menú se muestran (`SideNavItems.ts`), y el backend
usa el mismo reparto para decidir quién guarda en cada área (ver
[project-overview](../project-overview.md)).

### Usuarios (`/dashboard/settings/users`)

*Configuraciones › Usuarios*, que el menú muestra solo al `MASTER`
(`getSettingsMenu`). Lista los usuarios de la exportadora (`GET
/exporters/:exporterId/users`) con su rol y las áreas en que trabaja, que salen
del mismo menú (`getNavItems`).

- **Invitar**: nombre, correo y rol, sin contraseña. Al usuario le llega un
  correo con un enlace a `/auth/reset-password/<token>`, que sirve 7 días, para
  crear la suya. Si el correo no salió (`invitationSent: false`), el usuario
  queda creado y un aviso pide reenviar la invitación
- **Cambiar el rol** desde la fila, **reenviar la invitación** y **eliminar**
  (con confirmación). Nadie cambia su propio rol ni se elimina a sí mismo: la
  fila del usuario de la sesión no tiene acciones
- Un usuario que no es `MASTER` que entra por la URL ve la lista sin acciones
- Un correo que ya tiene cuenta, en cualquier exportadora, o un nombre repetido
  en la exportadora los rechaza el backend (409) con su motivo

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Opciones de next-auth | `app/api/auth/[...nextauth]/authOptions.ts` |
| Tipos de sesión | `types/next-auth.d.ts` |
| Login / registro | `components/signin/SignInForm.tsx`, `components/signup/SignUpForm.tsx` |
| Páginas de sesión | `app/auth/{signin, signup, signout, forgot-password, reset-password}/` |
| Layout de sesión | `app/auth/layout.tsx` |
| Guard de onboarding | `components/ui/IsOnboarding.tsx` |
| Onboarding | `components/onboarding/OnboardingForm.tsx`, `components/onboarding/hooks/useSubmitOnboarding.ts`, `components/onboarding/schema/`, `hooks/merchants/createOnboarding.ts` |
| Perfil | `app/dashboard/user/[id]/page.tsx`, `hooks/useUserProfile.tsx` |
| Datos de la exportadora | `app/dashboard/user/update-user/[idUser]/page.tsx`, `components/settings/UpdateExporterForm.tsx`, `hooks/settings/` |
| Usuarios | `app/dashboard/settings/users/page.tsx`, `components/exporter-user/UsersManager.tsx`, `hooks/exporter-user/`, `types/exporterUser.ts`, `utils/roles.ts` |
| Logos | `app/dashboard/logos/page.tsx`: una sola pantalla con una pestaña por dueño (exportadora, productores, alícuotas) que usa el formulario de cada uno (`components/settings/upload-logo/`, `components/producer/UploadLogoForm.tsx`, `components/box-brands/UploadLogoForm.tsx`). `?tab=` elige la pestaña (`utils/logoTabs.ts`); las direcciones viejas (`…/upload-logo`) redirigen a la suya. El menú la muestra en Materiales y en Configuraciones |

- El `callbackUrl` del login es `${NEXT_PORTAL_URL}/dashboard`.
- `forgot-password` y `reset-password` usan `fetch` directo: se ejecutan sin
  sesión.

> `IsOnboarding` devuelve `null` mientras no hay sesión cargada: una página
> envuelta se ve en blanco durante ese instante, no con un spinner.
