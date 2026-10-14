# Observabilidad y Logs (web → Vercel)

> Cómo se detecta un error de la web antes de que lo reporte un usuario. Un
> `console.error` del navegador nunca llega a los logs de Vercel, que solo
> guardan lo que corre en el servidor: por eso los errores se envían a una ruta
> propia que los escribe del lado del servidor.

---

## Dónde mirar

Vercel → proyecto → **Logs** → buscar **`[client-error]`**. Cada línea es un
JSON con `source`, `message`, `path` (la pantalla), `digest`, `context`,
`timestamp`, `userAgent` y `stack`.

Los errores del backend están en Railway, con sus propios tags.

---

## Piezas

| Pieza | Archivo | Qué hace |
|-------|---------|----------|
| Reportero | `src/lib/error-reporter.ts` | `reportClientError(source, error, context?)` manda el error a la ruta. Nunca lanza |
| Ruta | `src/app/api/client-errors/route.ts` | Recibe el `POST` y escribe la línea `[client-error]`. Responde siempre 200 |
| Captura global | `src/components/GlobalErrorReporter.tsx`, montado en `src/app/layout.tsx` | Errores fuera de React y promesas rechazadas sin `catch` |
| Pantallas de error | `src/app/error.tsx`, `src/app/global-error.tsx` | Evitan la página en blanco cuando falla un render, y lo reportan |
| Errores de la API | `src/lib/api-error-report.ts`, usado por el interceptor de `src/lib/axios.ts` | Decide qué peticiones fallidas se reportan |

---

## `source`

| `source` | Qué significa |
|----------|---------------|
| `api-5xx` | El backend respondió 5xx. Lleva método, ruta, código y el mensaje del backend |
| `api-network` | La petición no tuvo respuesta: sin red, o pasaron los 10 s de espera |
| `api-contract-mismatch` | Un 400 con `should not exist`: esta web mandó un campo que el backend desplegado todavía no conoce. Es un **desfase de deploy** |
| `render-boundary` | Falló el render de una página; lo atrapó `error.tsx` |
| `root-boundary` | Falló el layout raíz; lo atrapó `global-error.tsx` |
| `window-error` | Un error sin capturar fuera de React |
| `unhandled-rejection` | Una promesa rechazada que nadie esperaba |

---

## Qué no se reporta

- Un 4xx normal: sesión vencida, registro inexistente, validación. La única
  excepción es el `should not exist`
- Una petición cancelada al cambiar de pantalla
- Bodies de peticiones, tokens o la sesión. La ruta de una petición se reporta
  sin su query

---

## Límites

- El mismo error (`source` + mensaje) se reporta una vez por minuto
- Como máximo salen diez reportes por minuto por pestaña
- El mensaje se corta a 500 caracteres, el stack a 4000 y el body que acepta
  la ruta a 10 000

Los dos primeros evitan que un error en bucle inunde los logs.

---

## Al reportar algo nuevo

`reportClientError('<source-en-kebab>', error, { …ids })`, y el `source` nuevo
se agrega a la tabla de arriba. No se reportan condiciones esperadas del
negocio, ni nada desde la propia ruta de reportes.
