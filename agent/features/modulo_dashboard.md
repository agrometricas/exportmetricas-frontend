# Módulo Inicio (`/dashboard`)

> Pantalla de entrada después del login. No tiene endpoint propio: todo lo que
> muestra se arma en el navegador a partir de listas que ya existen.

### Propósito

Dar al usuario `MASTER` una vista semanal de la operación: qué se corta cada
día, cuántas cajas y contenedores van, qué se le ha pagado a cada productor y
cómo se compara con el precio spot.

---

### Qué ve cada rol

| Rol | Contenido |
|-----|-----------|
| `MASTER` | Alertas de cupo de la semana (`ContractUsageAlerts`), calendario y resumen semanal (`CalendarSummaryContainer`) |
| `LOGISTICS`, `EXPORT` | Alertas de cupo de la semana y una tarjeta con texto de relleno |
| `QUALITY`, `ADMINISTRATIVE` | El mensaje "No tienes acceso a contenido del dashboard" |

Todos ven el saludo con su nombre y el menú lateral de su rol.

---

### De dónde salen los datos

| Dato | Hook | Endpoint |
|------|------|----------|
| Exportaciones | `useExports` | `GET /export` |
| Envíos de insumos con sus pagos | `useExportsSent` | `GET /export-sent` |
| Precios spot | `useSpotPrices` | `GET /spot-prices` (últimos 10) |
| Excel de materiales | `useDownloadMaterialsSummaryReport` | `GET /reports/materials-summary?date=` |
| Fincas que pasaron su cupo esta semana | `useContractUsage` | `GET /contract-usage?week=` |

`CalendarSummaryContainer` mantiene la semana seleccionada y filtra las listas
completas en memoria.

---

### Componentes

| Componente | Qué muestra |
|------------|-------------|
| `WeeklyExportsCalendar` | Grilla de lunes a domingo con las cajas de cada exportación por día (de `weekDaysOfWeek` / `weekBoxesOfDay`) |
| `ExportCardWithPopover` | Cada exportación dentro del calendario, con su detalle |
| `WeeklyExportsSummary` | Totales de la semana: cajas y contenedores |
| `WeeklyFarmSummaryCard` | Resumen por finca y descarga del Excel de materiales |
| `ExportSentChart` | Barras con el total del cliente frente al del productor (recharts) |
| `SpotPriceComparison` | Últimos precios spot y lo pagado a productores con contrato `SPOT` |

---

### Cálculos que hace el cliente

Este módulo es donde más aritmética hay en el navegador:

- Cajas por día y por semana, sumando `weekBoxesOfDay`.
- Total de contenedores de la semana: por cada exportación, sus cajas divididas
  para las cajas por contenedor de la alícuota (`boxBrand.boxQuantity`),
  redondeando hacia arriba.
- Total cobrado al cliente y total pagado al productor por envío.
- Monto por productor en contratos `SPOT`: `price × boxQuantity` del pago.

Son agregados de presentación sobre valores que el backend ya guardó, pero están
escritos dentro de los componentes, cada uno en su `useMemo`. Antes de reusar
uno, extraerlo a `utils/`; si una cifra debe coincidir con un reporte o con un
pago, pedirla al backend.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Página | `app/dashboard/page.tsx` |
| Contenedor por rol | `components/dashboard/Dashboard.tsx` |
| Vista semanal | `components/dashboard/CalendarSummaryContainer.tsx` |
| Piezas | `components/dashboard/{WeeklyExportsCalendar, ExportCardWithPopover, WeeklyExportsSummary, WeeklyFarmSummaryCard, ExportSentChart, SpotPriceComparison}.tsx` |
| Hooks | `hooks/export/getExports.ts`, `hooks/export/getExportSents.ts`, `hooks/utils/getSpotPrices.ts`, `hooks/utils/useDownloadMaterialsSummaryReport.ts` |

- La vista carga **todas** las exportaciones y todos los envíos de la
  exportadora y filtra por semana en el navegador; no hay consulta por rango.
- El Excel se pide con la fecha de la semana visible y falla con 404 si esa
  semana no tiene exportaciones.
- No hay pantalla para cargar precios spot: se registran directamente contra el
  backend.
