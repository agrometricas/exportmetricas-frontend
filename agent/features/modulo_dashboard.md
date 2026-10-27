# Módulo Inicio (`/dashboard`)

> Pantalla de entrada después del login. *Lo que falta* sale de
> `GET /export/work-queue` y la vista semanal, de `GET /reports/week`.

### Propósito

Dar al usuario `MASTER` una vista semanal de la operación: qué se corta cada
día, cuántas cajas y contenedores van, qué se le ha pagado a cada productor y
cómo se compara con el precio spot.

---

### Qué ve cada rol

| Rol | Contenido |
|-----|-----------|
| `MASTER` | *Lo que falta* completo, alertas de cupo de la semana (`ContractUsageAlerts`), calendario y resumen semanal (`CalendarSummaryContainer`) |
| `EXPORT` | *Lo que falta* de su área (envío de insumos, aduana, documentos) y las alertas de cupo |
| `QUALITY` | *Lo que falta* de su área (hojas de corte) |
| `ADMINISTRATIVE` | *Lo que falta* de su área (costos, pagos y cobros) |
| `LOGISTICS` | Las alertas de cupo; *Lo que falta* dice que no hay nada para su área |

*Lo que falta* (`WorkQueuePanel`) muestra una tarjeta por paso con algo
pendiente, con las primeras cuatro exportaciones. Cada fila es un enlace que
abre el paso, con regreso a Inicio; si el paso se hace desde la ficha (la
aduana), abre la ficha. La acción va en el título del enlace. Qué paso ve cada rol está en
`utils/workQueueAccess.ts`, con las mismas áreas que el menú.

Todos ven el saludo con su nombre y el menú lateral de su rol.

---

### De dónde salen los datos

| Dato | Hook | Endpoint |
|------|------|----------|
| Resumen de la semana | `useWeekSummary` | `GET /reports/week?week=&merchantId=&boxBrandId=&clientId=` |
| Precios spot | `useSpotPrices` | `GET /spot-prices` (últimos 10) |
| Excel de materiales | `useDownloadMaterialsSummaryReport` | `GET /reports/materials-summary?date=` |
| Fincas que pasaron su cupo esta semana | `useContractUsage` | `GET /contract-usage?week=` |

`CalendarSummaryContainer` mantiene la semana seleccionada y los filtros
(productor, marca y cliente, por id) y pide el resumen de esa semana. El
backend devuelve todo armado: las cajas de cada día, las exportaciones, los
totales, las fincas, las cajas cobradas y pagadas, y el precio spot por
productor. Los filtros se aplican a todo el resumen; sus opciones son las de
la semana, y una opción elegida en otra semana sigue en la lista para poder
quitarla.

Arma dos columnas: a la izquierda el calendario, las fincas y el gráfico; a la
derecha el egreso y el ingreso de la semana, el resumen y los precios spot.

La consulta se repite cada vez que se abre Inicio (`staleTime: 0`): casi
cualquier escritura cambia alguna cifra de la semana. Al cambiar de semana o de
filtro, la vista anterior queda atenuada hasta que llega la nueva.

---

### Componentes

| Componente | Qué muestra |
|------------|-------------|
| `WeeklyExportsCalendar` | Grilla de lunes a domingo con las cajas de cada exportación por día (`days` del resumen) y los filtros |
| `ExportCardWithPopover` | Cada exportación dentro del calendario, con su detalle |
| `WeeklyExportsSummary` | Cada exportación con su destino y sus contenedores, y los totales de cajas y contenedores |
| `WeeklyFarmSummaryCard` | Resumen por finca y descarga del Excel de materiales |
| `ExportSentChart` | Barras con las cajas cobradas al cliente frente a las pagadas al productor, por marca, productor y cliente (recharts, colores de `CHART_SERIES`). Si a cada grupo le tocan menos de 160 px de ancho, las columnas pasan a una fila por grupo, con su nombre arriba de las barras. Un nombre que no cabe se corta con «…»; el tooltip lo muestra completo |
| `SpotPriceComparison` | Últimos precios spot y el promedio pagado a productores con contrato `SPOT`, con la tendencia frente al precio de referencia de la semana |

---

### Cálculos

Los hace el backend (`GET /reports/week`). La web solo da formato y asigna un
color a cada exportación (`getExportColor`), que se mantiene al cambiar de
semana.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Página | `app/dashboard/page.tsx` |
| Contenedor por rol | `components/dashboard/Dashboard.tsx` |
| Vista semanal | `components/dashboard/CalendarSummaryContainer.tsx` |
| Piezas | `components/dashboard/{WeeklyExportsCalendar, ExportCardWithPopover, WeeklyExportsSummary, WeeklyFarmSummaryCard, ExportSentChart, SpotPriceComparison}.tsx` |
| Hooks | `hooks/reports/weekSummary.ts`, `hooks/utils/getSpotPrices.ts`, `hooks/utils/useDownloadMaterialsSummaryReport.ts` |
| Tipos | `types/weekSummary.ts` |

- El Excel se pide con la fecha de la semana visible y falla con 404 si esa
  semana no tiene exportaciones.
- No hay pantalla para cargar precios spot: se registran directamente contra el
  backend.
