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
| `cuttingDate` | Día de corte en `DD/MM/AAAA`, a medianoche local |
| `shippingDateTime` | Fecha Máxima de Ingreso: `DD/MM/AAAA` y `HH:mm`, el momento real en ISO. Las exportaciones guardadas antes de este campo quedaron 5 horas adelantadas y se muestran así |
| `weekDescription` | Texto de `getWeekInfo(cuttingDate).week` |
| `weekDaysOfWeek[]`, `weekBoxesOfDay[]` | Cajas por día de la semana de corte |
| `weekTotal` | Igual a `boxQuantity` |
| `bookingId`, `bookingContainerIds` | Booking opcional y los contenedores de él que carga la exportación; sin booking va `null` y `[]` |
| `purchaseOrderLineId` | Solo cuando la exportación nace de una línea de orden de compra, y solo al crear. Ver [modulo_ordenes_compra](modulo_ordenes_compra.md) |

`dataReviewed` es la casilla de confirmación del formulario; no se envía.
`exportBody()` arma el body a partir de los valores del formulario; crear y
editar mandan el mismo.

La respuesta trae además `cancelledAt` y `cancellationReason`: una exportación
con `cancelledAt` está cancelada.

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

### Bookings

*Exportaciones → Bookings*. Un booking es la reserva con la naviera: número,
naviera, nave, día y hora de zarpe (ETD), ruta y contenedores reservados, con
sus números si ya se conocen.

- La ruta se elige entre las del **contrato naviero vigente el día del
  zarpe** (`GET /shipping-contracts/routes?shippingCompanyId=&date=`). Al
  elegirla la web muestra el costo por contenedor, los días de tránsito y el
  contrato; si la naviera no tiene contrato vigente ese día, avisa y enlaza a
  *Contratos Navieros*.
- El día de zarpe se escribe en `DD/MM/AAAA` y la hora en `HH:mm` (24 horas);
  `bookingBody()` los une en un momento de hora local con `atHourMinute()`.
- El backend congela el costo al reservar y responde el flete estimado
  (`estimatedFreight`) y la llegada (`eta`); la web los muestra tal cual.
- Los números de contenedor (`MSKU1234567`) se pueden cargar después; no
  pueden ser más que los reservados. Se mandan sin espacios ni guiones y en
  mayúsculas.
- En la tabla de bookings, cada contenedor asignado muestra su exportación.

### Booking en la exportación

En la sección *Naviera* del formulario de exportación hay un selector
**Booking (opcional)** (`components/export/ExportBookingSelect.tsx`):

- Al elegir uno, la naviera, los puertos, la nave, el número de booking y el
  tiempo de viaje se llenan con los del booking y los campos manuales se
  esconden; se muestra un resumen con zarpe, llegada y tránsito. El backend
  los copia del booking de todas formas.
- Debajo se marcan los contenedores del booking que carga esta exportación.
  Los que ya están en otra exportación aparecen deshabilitados con su número
  de exportación.
- Sin booking se llenan a mano como antes. Con booking, el tiempo de viaje
  puede quedar vacío si el contrato no tiene días de tránsito.
- Editar conserva los contenedores de la exportación; duplicar conserva el
  booking pero no los contenedores (`exportFormValues(source, { withContainers })`).
- El detalle de la exportación lista sus contenedores. Guardar o cancelar una
  exportación invalida también `bookings`.

| Pieza | Archivo |
|-------|---------|
| Formulario y ruta vigente | `components/booking/{BookingForm, RouteInForceSelect}.tsx` |
| Esquema, body y envío | `components/booking/schemas/booking.schema.ts`, `components/booking/bookingBody.ts`, `components/booking/hooks/useSubmitBooking.ts` |
| Tabla | `components/booking/TableBookings.tsx` |
| Páginas | `app/dashboard/export/{bookings, add-booking, bookings/[id]}/page.tsx` |
| Hooks y tipos | `hooks/booking/`, `hooks/shipping-contract/getRoutesInForce.ts`, `types/booking.ts` |

Invalidaciones: guardar o eliminar un booking invalida `bookings` y `booking`.

---

### Editar, duplicar y cancelar

Desde el menú de acciones de cada fila en *Exportaciones*:

| Acción | Ruta / endpoint | Cuándo |
|--------|-----------------|--------|
| Editar | `/dashboard/export/[id]/edit` → `PUT /export/:id` | Mientras no tenga envío de insumos ni esté cancelada |
| Duplicar | `/dashboard/export/[id]/duplicate` → `POST /export` | Siempre: crea una exportación nueva |
| Cancelar | modal → `POST /export/:id/cancel` con `{ reason? }` | Mientras no esté cancelada |

- Editar y duplicar usan el mismo `AddExportForm` prellenado con
  `exportFormValues()`. La casilla de "He revisado los datos" vuelve a
  desmarcarse
- Cambiar algo de una exportación que ya tiene envío de insumos es cancelarla y
  duplicarla. La pantalla de edición lo dice y ofrece el botón de duplicar
- El modal de cancelar avisa si el material del envío vuelve a la finca. El
  backend rechaza la cancelación si ya hay pago al productor o cobro al
  cliente, y la web muestra su mensaje
- Una cancelada queda en la tabla con la etiqueta *Cancelada* y el motivo en
  el detalle; las listas de pendientes ya no la traen
- La naviera y los puertos se muestran a partir del valor del formulario: los
  puertos se eligen entre las rutas de la naviera seleccionada

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
- Una exportación con envío de insumos ya no se edita; cancelarla devuelve a
  la finca lo enviado (movimiento `RETURN`, *Devolución* en Trazabilidad).

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Formulario de exportación | `components/export/AddExportForm.tsx` |
| Envío y esquema | `components/export/hooks/useSubmitExport.ts`, `components/export/schemas/export.schema.ts`, `components/export/exportBody.ts` |
| Editar y duplicar | `components/export/ExportFormPage.tsx`, `components/export/exportFormValues.ts` |
| Cancelar | `components/export/CancelExportModal.tsx` |
| Tabla y detalle | `components/export/table-export/` |
| Lista de pendientes de envío | `components/export/{ExportList, ExportCard}.tsx` |
| Formulario de envío de insumos | `components/export/SentMaterialsExportForm.tsx` |
| Campos de cantidad y cócteles | `components/export/ui/InputFieldSent*.tsx` |
| Envíos realizados | `components/liquidation/exports-sent/` |
| Grilla de días de corte | `components/export/cutting-sheet/DateGrid.tsx`, `utils/getWeekInfo.ts` |
| Páginas | `app/dashboard/export/{search, add-export, [id]/edit, [id]/duplicate}/page.tsx`, `app/dashboard/liquidation/{exports-sent, add-supply-shipment, add-supply-shipment/[id]}/page.tsx` |
| Lectura en servidor | `lib/export/export.ts` (`fetchExport`) |
| Tipos | `types/export*.ts`, `types/exportSent*.ts`, `types/export-sent/` |
| Hooks | `hooks/export/{createExport, updateExport, cancelExport, getExport, getExports, getExportsPending}.ts`, `hooks/export/export-sent/` |

Invalidaciones:

- Crear o editar una exportación: `exports`, `exportsPending`, `cuttingSheets`,
  `cuttingSheetsPending`; al editar, también `['export', id]`.
- Cancelar: las listas de exportaciones y de pendientes, `export`, y las de
  stock (`exporterMaterialStock`, `businessStock`, `stockMovements`).
- Crear un envío: `exports`, `exportsSent`, `exportsSentPending`,
  `exportsPending`, `clientPaymentsPending`, `cuttingSheets`,
  `cuttingSheetsPending`, `exportSentCostsPending`.

> Las pantallas de envío de insumos están bajo `/dashboard/liquidation/` aunque
> el menú las muestra en *Exportaciones*. Un envío de insumos no se edita.
