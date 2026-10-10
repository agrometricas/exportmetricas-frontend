# Módulo Exportaciones y Envío de Insumos

> Reglas autoritativas del backend; aquí se anota cómo la web planifica un
> embarque y registra los materiales que se le envían a la finca.

### Propósito

Crear la **exportación** (el embarque planificado) y después su **envío de
insumos** (`exportSent`): los materiales que salen hacia la finca para armarlo.
El envío es lo que descuenta inventario y fija el costo de materiales.

---

### Modelo: exportación (campos que envía la web)

| Campo | Notas |
|-------|-------|
| `merchantId`, `businessId` | Productor y finca |
| `boxBrandId`, `boxQuantity` | Alícuota y número de cajas |
| `contractType` | `FOB`, `FAS` o `SPOT` |
| `clientId` | |
| `departureHarborId`, `destinationHarborId` | Puerto `Nacional` y puerto `Internacional` |
| `shippingCompanyId`, `depositId`, `transportId`, `verifierId` | Opcionales |
| `numberOfVerifiers`, `shipName`, `bookingNumber`, `estimatedTravelTime` | Opcionales |
| `cuttingDate`, `shippingDateTime` | |
| `weekDescription` | Texto de `getWeekInfo(cuttingDate).week` |
| `weekDaysOfWeek[]`, `weekBoxesOfDay[]` | Cajas por día de la semana de corte |
| `weekTotal` | Igual a `boxQuantity` |

`dataReviewed` es la casilla de confirmación del formulario; no se envía.

### Modelo: envío de insumos

`exportId`, una cantidad por cada material simple (`bottomTypeQuantity`,
`labelQuantity`, …) y cuatro listas: `pesticideSent[]`, `insecticideSent[]`,
`stickerSent[]`, `sheetSent[]`, cada elemento con el id del material y su
`quantity`.

---

### Workflow (que la web orquesta)

```
Agregar Exportaciones  →  POST /export
        ↓
Agregar Envíos de Insumos: lista GET /export/pending
        ↓ elegir una
/liquidation/add-supply-shipment/[id]  →  POST /export/export-sent
        ↓
la exportación sale de la lista de pendientes y el envío entra a
"Agregar Hojas de Corte" y "Agregar Costos Validados"
```

---

### Semana de corte

Al elegir `cuttingDate`, el formulario calcula la semana con `getWeekInfo()`
(semana ISO, lunes a domingo) y muestra la grilla de días
(`components/export/cutting-sheet/DateGrid.tsx`) donde se reparte cuántas cajas
se cortan cada día. En el formulario ese reparto vive en
`weekCutting.daysOfWeek` y `weekCutting.boxesOfDay`; `useSubmitExport` lo manda
como `weekDaysOfWeek` y `weekBoxesOfDay`, en el mismo orden.

---

### Cantidades que propone el envío

`SentMaterialsExportForm` precarga el formulario a partir de la exportación
elegida:

| Material | Valor inicial |
|----------|---------------|
| Fondo, tapa, cubierta, cartulina | `boxQuantity` de la exportación |
| El resto de materiales simples | La cantidad definida en la alícuota |
| Pesticidas, insecticidas, stickers, hojas | El cóctel de la alícuota, con sus cantidades |

El usuario puede cambiar cualquier valor antes de enviar. El esquema de
validación se arma según qué materiales tiene la alícuota.

---

### Reglas de negocio

- Una exportación admite un solo envío de insumos.
- **Cada material enviado debe tener stock asignado a la finca.** Si falta uno,
  el backend rechaza el envío completo con un mensaje que nombra el tipo de
  material; nada se guarda.
- El envío descuenta el stock de la finca al instante.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Formulario de exportación | `components/export/AddExportForm.tsx` |
| Envío y esquema | `components/export/hooks/useSubmitExport.ts`, `components/export/schemas/export.schema.ts` |
| Tabla y detalle | `components/export/table-export/` |
| Lista de pendientes de envío | `components/export/{ExportList, ExportCard}.tsx` |
| Formulario de envío de insumos | `components/export/SentMaterialsExportForm.tsx` |
| Campos de cantidad y cócteles | `components/export/ui/InputFieldSent*.tsx` |
| Envíos realizados | `components/liquidation/exports-sent/` |
| Grilla de días de corte | `components/export/cutting-sheet/DateGrid.tsx`, `utils/getWeekInfo.ts` |
| Páginas | `app/dashboard/export/{search, add-export}/page.tsx`, `app/dashboard/liquidation/{exports-sent, add-supply-shipment, add-supply-shipment/[id]}/page.tsx` |
| Lectura en servidor | `lib/export/export.ts` (`fetchExport`) |
| Tipos | `types/export*.ts`, `types/exportSent*.ts`, `types/export-sent/` |
| Hooks | `hooks/export/{createExport, getExport, getExports, getExportsPending}.ts`, `hooks/export/export-sent/` |

Invalidaciones:

- Crear una exportación: `exports`, `exportsPending`, `cuttingSheets`,
  `cuttingSheetsPending`.
- Crear un envío: `exports`, `exportsSent`, `exportsSentPending`,
  `exportsPending`, `clientPaymentsPending`, `cuttingSheets`,
  `cuttingSheetsPending`, `exportSentCostsPending`.

> Las pantallas de envío de insumos están bajo `/dashboard/liquidation/` aunque
> el menú las muestra en *Exportaciones*. No hay pantalla para editar ni anular
> una exportación o un envío.
