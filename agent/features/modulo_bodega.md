# Módulo Bodega (`winery`)

> Reglas autoritativas del backend; aquí se anota cómo la web carga el
> inventario de materiales, lo reparte a las fincas y lo ajusta.

### Propósito

Llevar el inventario en dos niveles: la **bodega** de la exportadora y el
**stock de cada finca**. Un envío de insumos solo puede despachar materiales que
la finca tenga asignados, así que este módulo es requisito de Exportaciones.

Incluye el formulario público con el que el productor reporta cada semana su
stock real.

---

### Modelos (campos que envía/lee la web)

**Stock de bodega:** `materialType`, `materialId`, `materialName`,
`currentStock`, `assignedStock`, `currentCost`, `assignedCost`,
`materialDetail`, y al pedir uno solo: `stockMovements[]` y
`businessMaterialStocks[]` (las fincas que lo tienen).

**Stock de finca:** `businessId`, `exporterMaterialStockId`, `currentStock`,
`assignedStock`, `currentCost`, `materialDetail`, `stockMovementsFromExporter[]`
y `stockMovementsConsumption[]`.

**Movimiento:** `type` (`TRANSFER`, `CONSUMPTION`, `ADJUSTMENT`, `RETURN`),
`quantity`, `unitCost`, `createdAt`. `RETURN` es lo que vuelve a la finca al
cancelar una exportación con envío de insumos: llega en
`stockMovementsFromExporter[]` y se muestra como *Devolución*, con el número de
envío. Las etiquetas están en `utils/stockMovementLabels.ts`.

Lectura de las cifras:

- Bodega `currentStock` — lo que queda físicamente en bodega.
- Bodega `assignedStock` — bodega más lo repartido a fincas y aún no consumido.
- Finca `currentStock` — lo que la finca tiene.

---

### Pantallas y qué hace cada una

| Menú | Ruta | Qué hace | Endpoint |
|------|------|----------|----------|
| Stock | `winery/stock` | Bodega completa, con el detalle de cada material | `GET /exporter-material-stock/exporter/:exporterId`, con la exportadora de la sesión |
| Agregar Stock | `winery/add-material` | Lista de materiales para elegir uno, e importación CSV | `GET /exporter-materials/:exporterId` |
| — | `winery/add-material/[slug]` | Un material: stock inicial, ingreso a bodega y asignación a fincas | `GET …/by-exporter-and-material`, `POST /exporter-material-stock`, `PATCH …/update/:id`, `POST …/assign` |
| Trazabilidad de Stock | `winery/stock-movements` | Movimientos de una finca, material por material | `GET /exporter-material-stock/business/:businessId` |
| Ajuste Semanal | `winery/adjust-weekly` | Ajuste del stock de una finca contra el conteo real | `POST /exporter-material-stock/adjust-business/:businessId` |

El `slug` de `add-material/[slug]` es `<materialType>-<materialId>`. Si el
material todavía no tiene stock en bodega se muestra `CreateInitialStockForm`;
si ya lo tiene, `AddMaterialForm`, que abre `UpdateStockModal` (ingreso) y
`AssignStockToBusinessModal` (asignación a una finca). Aumentar lo ya asignado
a una finca va por `PATCH …/business/:id/increase`.

---

### Reglas de negocio

- El stock de bodega y el de finca **solo suben** desde estas pantallas. Bajan
  con un envío de insumos o con un ajuste.
- No se puede asignar a una finca más de lo que hay en bodega.
- Un ingreso a bodega reemplaza el costo unitario por el nuevo.
- El ajuste desde la web acepta diferencias en ambos sentidos; el del productor
  solo a la baja.

---

### Importación CSV

`ImportExporterStockDrawer` ofrece dos cargas:

| Carga | Endpoint | Columnas |
|-------|----------|----------|
| Solo bodega | `POST /exporter-material-stock/import/exporter-only` | `materialType, materialId, assignedStock, assignedCost` |
| Bodega + asignación a finca | `POST /exporter-material-stock/import` | `businessId, materialType, materialId, assignedStock, assignedCost` |

`materialType` va con el nombre del enum (`BOTTOM`, `LABEL`, …), al revés que en
la importación de materiales de Alícuotas.

---

### Ajuste semanal del productor (página pública)

```
correo del backend (viernes)  →  /ajuste-materiales/[token]
        ↓ GET  /public/weekly-adjustment?token=
formulario: nombre del responsable + cantidad real por material
        ↓ POST /public/weekly-adjustment?token=
/ajuste-materiales/success
```

- No usa sesión ni `lib/axios.ts`: llama al backend con `fetch`.
- El formulario lista los materiales asignados a la finca **sin mostrar la
  cantidad teórica**: el productor escribe lo que contó.
- El enlace vence a los tres días y sirve una sola vez. Un valor mayor al
  esperado lo rechaza el backend.
- La página queda fuera de `/dashboard`, así que no pasa por `IsOnboarding` ni
  muestra el menú.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Tabla de bodega y detalle | `components/winery/{TableExporterMaterialStock, DetailExporterMaterialStock}.tsx` |
| Alta e ingreso | `components/winery/{MaterialList, CreateInitialStockForm, AddMaterialForm, UpdateStockModal}.tsx` |
| Asignación a finca | `components/winery/{AssignStockToBusinessModal, AssignStockToBusinessForm, CreateBusinessStockAssignmentForm}.tsx` |
| Movimientos | `components/winery/{StockMovementsSelector, MaterialStockMovementCard}.tsx` |
| Ajuste semanal | `components/winery/{AdjustWeeklySelector, AdjustWeeklyForm}.tsx` |
| Importación | `components/winery/ImportExporterStockDrawer.tsx` |
| Página pública | `app/ajuste-materiales/{[token], success}/page.tsx`, `components/public-adjustment/PublicAdjustmentPage.tsx` |
| Páginas | `app/dashboard/winery/{stock, add-material, add-material/[slug], stock-movements, adjust-weekly}/page.tsx` |
| Tipos | `types/winery/` |
| Hooks | `hooks/winery/` |
| Nombres y orden de materiales | `utils/materialTypeLabels.ts` |

- Las mutaciones de bodega invalidan `exporterMaterialStock`; el ajuste invalida
  `['businessStock', businessId]` y `stockMovements`.
- Los selectores de finca de *Trazabilidad* y *Ajuste Semanal* usan
  `hooks/business/getAllBusinessesByExporter.ts`.
- `hooks/utils/useDownloadMaterialsSummaryReport.ts` descarga el Excel semanal
  de materiales enviados (`GET /reports/materials-summary?date=`); el botón está
  en el dashboard.

> `winery` es el nombre de este módulo en el código; en pantalla es *Bodega*.
