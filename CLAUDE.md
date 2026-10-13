# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repo.

## Qué es esto

**App web de Exportmétricas** (Next.js 14, App Router). La usa el personal de
una exportadora de banano para gestionar el ciclo completo de un embarque:
productores y fincas, clientes y logística, alícuotas y materiales, bodega,
exportaciones, envíos de insumos, hojas de corte y liquidación.

Incluye además un formulario público —sin sesión— con el que el productor
reporta cada semana el stock real de materiales de su finca.

No hay app móvil: esta web es el único cliente del backend
(`exportmetricas-backend`, NestJS).

## La lógica de negocio vive en el backend

**Esta app captura y muestra; el backend calcula y valida.** Es la regla de la
casa. La liquidación es el modelo: el formulario manda los insumos, pide los
montos a una ruta de cotización y los muestra sin recalcularlos.

- **No agregar un cálculo nuevo del lado del cliente.** Si una pantalla necesita
  un número que el backend no da, se pide al backend.
- Lo único que se deriva acá es presentación: formatear, y sumar valores que ya
  son finales (el pie de una tabla, el total de una selección).
- Las reglas que deciden si algo se puede guardar las hace cumplir el backend.
  La web puede chequear lo mismo para dar feedback inmediato, pero no es la que
  manda.
- Un formulario que necesita ver un monto antes de guardar lo pide al backend
  (como `usePaymentQuote`), no lo calcula.

## Archivos de contexto

- @agent/project-overview.md — dominio, vocabulario, mapa de módulos y arquitectura técnica
- @agent/coding-standards.md — convenciones de código

El detalle de cada módulo está en `agent/features/`, enlazado desde el mapa de
módulos del overview.

## Comandos

```bash
npm run dev            # servidor de desarrollo (:3000)
npm run build          # build de producción
npm run start          # sirve el build
npm run lint           # ESLint (next lint)
npm run format         # Prettier, solo verifica
npm run format:fix     # Prettier, corrige
```

No hay tests: ni unitarios ni E2E.

## Verificación

```bash
npx tsc --noEmit       # tipos
npm run lint
npm run build
```

Sin tests, la verificación real es abrir la pantalla y ejercitar el flujo contra
un backend.

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | Base del backend. Obligatoria |
| `NEXTAUTH_SECRET` | Firma de la sesión de next-auth. Solo servidor |
| `NEXTAUTH_URL` | URL pública de esta app. Solo servidor |
| `NEXT_PORTAL_URL` | Opcional |

Se leen a través de `src/lib/env.ts`, que falla en el servidor si falta una
obligatoria.

## Deploy

Vercel, desde la rama por defecto **`main-2`** (no existe `main`). Las ramas
nuevas salen de `origin/main-2`.

## Orden de deploy

El backend usa `ValidationPipe` con `forbidNonWhitelisted`: **un campo nuevo en
un body se rechaza con 400 hasta que el DTO del backend esté desplegado**.
Siempre backend primero, después la web.
