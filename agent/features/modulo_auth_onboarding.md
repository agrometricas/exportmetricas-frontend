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

El rol solo decide qué grupos del menú se muestran (`SideNavItems.ts`). No hay
pantalla para crear usuarios ni cambiar roles: el único usuario que la web sabe
crear es el `MASTER` del registro.

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
| Logo de la exportadora | `app/dashboard/settings/upload-logo/page.tsx`, `components/settings/upload-logo/` |

- El `callbackUrl` del login es `${NEXT_PORTAL_URL}/dashboard`.
- `forgot-password` y `reset-password` usan `fetch` directo: se ejecutan sin
  sesión.

> `IsOnboarding` devuelve `null` mientras no hay sesión cargada: una página
> envuelta se ve en blanco durante ese instante, no con un spinner.
