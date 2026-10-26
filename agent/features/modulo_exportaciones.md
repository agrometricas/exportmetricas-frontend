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

Con la finca, la fecha de corte y las cajas puestas, el formulario pregunta a
`GET /contract-usage/check` cómo queda la semana de la finca con esta
exportación (al editar manda su `exportId` para no contarla dos veces) y lo
dice debajo de la semana. Si pasa el cupo del contrato muestra el aviso del
backend, sin bloquear el envío (`ExportQuotaCheck`).

Al crear una exportación desde cero (no al editar, al duplicar ni desde una
orden de compra), con la finca elegida el formulario pregunta a
`GET /export/last?businessId=` cuál es la última exportación no cancelada de
esa finca y ofrece copiarla: el botón lleva a
`/dashboard/export/[id]/duplicate` (`LastFarmExportAlert`). La clave
`lastFarmExport` se invalida al crear, editar y cancelar.

Si el productor tiene una sola finca, o la exportadora una sola alícuota, el
selector la elige solo (`BusinessSelectBase`, `BoxBrandSelectBase`).

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
Agregar Envíos de Insumos: lista GET /export/pending (por fecha de corte)
        ↓ elegir una                         ↓ o elegir varias
/liquidation/add-supply-shipment/[id]    "Enviar lo propuesto"
  →  POST /export/export-sent              →  POST /export/export-sent/batch
        ↓
la exportación sale de la lista de pendientes y el envío entra a
"Agregar Hojas de Corte" y "Agregar Costos Validados"
```

---

### Bookings

*Exportaciones → Bookings*. Un booking es la reserva con la naviera: número,
naviera, nave, día y hora de zarpe (ETD), ruta y contenedores reservados, con
sus números si ya se conocen.

- La nave se escribe libre, pero el campo sugiere las naves ya registradas en
  bookings y exportaciones de esa naviera (`GET
  /harbor/shipping-company/:id/vessels`, `InputFieldShipName`). Lo mismo en la
  exportación sin booking y en el plan semanal. Guardar un booking, una
  exportación o un plan invalida `vessels`

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

### Ficha de la exportación (`/dashboard/export/[id]`)

Junta la exportación en una sola pantalla: finca, cliente, cajas y corte, sus
pasos (`ExportSteps`, de `GET /export/:id/progress`) y debajo el detalle de
siempre (`DetailExport`). Cada paso muestra su estado tal como lo da el backend
y, si se puede hacer, su botón (`stepAction`, `utils/exportSteps.ts`): el envío
y la hoja de corte van con el id de la exportación; costos, pago y cobro con el
del envío; la aduana abre su ventana ahí mismo. El paso que sigue va resaltado.
El botón de un paso solo aparece para el rol de su área (`seesQueue`,
`utils/workQueueAccess.ts`, el mismo reparto de *Lo que falta*); los demás ven
el estado sin la acción.

Los enlaces llevan `?volver=` con la ficha, y los cinco formularios de paso
vuelven ahí al guardar (`returnTo`, que solo acepta páginas de `/dashboard/`);
sin `volver`, van a su lista de siempre. Se llega desde *Ver pasos y detalle*
en el menú de cada fila de *Exportaciones*, desde Inicio y desde la búsqueda
rápida.

### Documentos del embarque

En la edición del booking, *Documentos del embarque* (`BookingDocuments`) lista
y sube el BL, el fitosanitario, el certificado de origen, la inspección de cada
contenedor, la DAE, el seguro y el sanitario. Valen para todas las
exportaciones del booking.

- Arriba va lo que el booking necesita (`BookingDocumentChecklist`,
  `GET /bookings/:id/document-status`): el semáforo con su rótulo, el avance y
  cada ítem con *Listo*, *Falta* o *Rechazado* y el motivo que da el backend.
  La web no decide nada: el semáforo, el porcentaje y los motivos vienen
  hechos.
- Cada documento muestra quién lo subió, cuándo y el comienzo de su huella
  SHA-256 (`documentTrace`, `utils/documentStatus.ts`); la huella completa va
  en el `title`.

- Los tipos, su nombre y si piden vencimiento o contenedor salen de
  `GET /bookings/document-types` (`useDocumentTypes`); la lista, de
  `GET /bookings/:id/documents` (`useBookingDocuments`).
- El alta es un formulario multipart (`bookingDocumentBody`,
  `utils/bookingDocumentBody.ts`): tipo, número, contenedor, emisión,
  vencimiento (`InputFieldDayDate`) y el archivo. Lo vacío no se manda. La web
  revisa tipo y tamaño del archivo (PDF, JPG o PNG, 10 MB) para avisar antes;
  manda el backend.
- El estado y los días que faltan los calcula el backend; la web solo los
  rotula (`documentStatusText` y `DOCUMENT_STATUS_COLOR`,
  `utils/documentStatus.ts`).
- Eliminar pide confirmación.
- El detalle de cada exportación muestra los documentos de su booking con su
  estado (`booking.documents`).

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
| AUCP y DAE | modal → `PUT /export/:id/customs` | Mientras no esté cancelada |
| Factura comercial / Packing list (PDF) | `GET /export/:id/invoice` · `GET /export/:id/packing-list` → descarga | Mientras no esté cancelada |

- Editar y duplicar usan el mismo `AddExportForm` prellenado con
  `exportFormValues()`
- Cambiar algo de una exportación que ya tiene envío de insumos es cancelarla y
  duplicarla. La pantalla de edición lo dice y ofrece el botón de duplicar
- El modal de cancelar avisa si el material del envío vuelve a la finca. El
  backend rechaza la cancelación si ya hay pago al productor o cobro al
  cliente, y la web muestra su mensaje
- Una cancelada queda en la tabla con la etiqueta *Cancelada* y el motivo en
  el detalle; las listas de pendientes ya no la traen
- La naviera y los puertos se muestran a partir del valor del formulario: los
  puertos se eligen entre las rutas de la naviera seleccionada
- AUCP y DAE: el modal manda el registro completo —número y fecha de la AUCP;
  número, fecha, canal de aforo y valor en USD de la DAE—, con lo vacío como
  `null`, así se
  corrige o se borra. Las reglas (qué va junto, no hay DAE sin AUCP ni de fecha
  anterior) las hace cumplir el backend; el formulario avisa lo que falta. La
  columna *Aduana* muestra el `customsStep` que manda el backend y el detalle,
  los números con sus fechas
- La factura y el packing list los dibuja el backend; la web solo descarga el
  PDF. La factura sale del cobro al cliente: sin cobro el backend responde 409 y
  la web muestra su mensaje. Como la descarga pide un `Blob`, el cuerpo del
  error llega como archivo y `withJsonErrorBody` (`utils/blobError.ts`) lo
  vuelve JSON antes de `serverErrorMessage`

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

Las cantidades las calcula el backend: `SentMaterialsExportForm` las pide a
`GET /export/:id/supplies-proposal` (`useSuppliesProposal`) y precarga el
formulario con `supplies`. Muestra también los contenedores de la exportación
(`containers`).

| Material | Lo que propone el backend |
|----------|---------------------------|
| Por caja (fondo, tapa, funda, cartulina, paraseal, pad, esponja, etiqueta, banda, sachet, liga, protector, cluster bag) | Cantidad de la alícuota × cajas |
| Por contenedor (pallets … tarjeta de embarque) e insecticidas, stickers y hojas | Cantidad de la alícuota × contenedores |
| Pesticidas (fumigación) | En proporción a las cajas: cajas × dosis |

Las filas de los cócteles siguen el orden del cóctel de la alícuota; cada una
toma su cantidad de la propuesta por el id del material (`proposedQuantity`,
`utils/suppliesProposal.ts`). El usuario puede cambiar cualquier valor antes de
enviar. El esquema de validación se arma según qué materiales tiene la
alícuota.

### Lista de pendientes y envío por lote

Las exportaciones pendientes se muestran en una tabla (`PendingTable`) con
fecha de corte, finca, productor, alícuota, cajas, cliente y ruta, ordenable y
con búsqueda. *Realizar envío* abre el formulario de esa exportación.

Cada fila trae su casilla, y arriba de la tabla está el botón **Enviar lo
propuesto (N)** (`BatchActionBar`). Después de confirmar en un modal que lista
finca, alícuota, cajas y fecha de corte de cada una, la web manda solo los ids
a `POST /export/export-sent/batch`; las cantidades son las que propone el
backend, sin cambios. Para cambiar una cantidad se usa *Realizar envío*.

- La respuesta es `{ created, failed }`. El toast resume cuántos se
  registraron (`shipmentBatchSummary`, `utils/shipmentBatch.ts`), y las que
  quedaron sin enviar siguen elegidas en la tabla, con un aviso que dice cuál
  y por qué (el mensaje del backend, p. ej. la finca sin stock de un material)
- La petición lleva su propio timeout de dos minutos: el backend registra un
  envío detrás de otro
- Invalida las mismas claves que el envío una por una más las del stock

---

### Reglas de negocio

- Una exportación admite un solo envío de insumos.
- **Cada material enviado debe tener stock asignado a la finca.** Si falta uno,
  el backend rechaza el envío completo (409) con un mensaje que nombra el
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
| AUCP y DAE | `components/export/ExportCustomsModal.tsx`, `utils/customs.ts`, `hooks/export/updateExportCustoms.ts` |
| Factura y packing list | `components/export/ExportDocumentsMenuItems.tsx`, `hooks/export/downloadShippingDocument.ts` |
| Tabla y detalle | `components/export/table-export/` |
| Ficha | `app/dashboard/export/[id]/page.tsx`, `components/export/progress/ExportSteps.tsx`, `hooks/export/exportProgress.ts`, `utils/exportSteps.ts` |
| Documentos del embarque | `components/booking/{BookingDocuments, BookingDocumentChecklist}.tsx`, `hooks/booking/{bookingDocuments, documentStatus}.ts`, `types/{bookingDocument, shipmentStatus}.ts` |
| Tablero de documentos | `app/dashboard/export/documents/page.tsx`, `components/booking/TableDocumentBoard.tsx`, `utils/shipmentStatus.ts` (`GET /bookings/document-board`): cada booking desde una semana antes de hoy con su semáforo, su avance y lo que le falta, y un enlace a sus documentos |
| Búsqueda rápida | `components/ui/header/QuickSearch.tsx`, `hooks/export/searchExports.ts`, `utils/exportSearch.ts`, `types/exportSearch.ts` |
| Lista de pendientes de envío | `components/export/{ExportList, pendingColumns}.tsx`, `components/ui/PendingTable.tsx` |
| Envío por lote | `components/ui/BatchActionBar.tsx`, `hooks/export/export-sent/createExportSentBatch.ts`, `utils/{shipmentBatch, selection}.ts`, `types/exportSentBatch.ts` |
| Formulario de envío de insumos | `components/export/SentMaterialsExportForm.tsx` |
| Campos de cantidad y cócteles | `components/export/ui/InputFieldSent*.tsx` |
| Envíos realizados | `components/liquidation/exports-sent/` |
| Grilla de días de corte | `components/export/cutting-sheet/DateGrid.tsx`, `utils/getWeekInfo.ts` |
| Páginas | `app/dashboard/export/{search, add-export, [id]/edit, [id]/duplicate}/page.tsx`, `app/dashboard/liquidation/{exports-sent, add-supply-shipment, add-supply-shipment/[id]}/page.tsx` |
| Lectura en servidor | `lib/export/export.ts` (`fetchExport`) |
| Tipos | `types/export*.ts`, `types/exportSent*.ts`, `types/export-sent/` |
| Hooks | `hooks/export/{createExport, updateExport, cancelExport, getExport, getExports, getExportsPending}.ts`, `hooks/export/export-sent/` |

Invalidaciones:

- Cada paso de la exportación, la aduana, los documentos, cancelar y editar:
  también `exportProgress` y `workQueue` (`PROGRESS_QUERIES`), para que la
  ficha e Inicio se pongan al día.
- Crear o editar una exportación: `exports`, `exportsPending`, `cuttingSheets`,
  `cuttingSheetsPending`; al editar, también `['export', id]`.
- Cancelar: las listas de exportaciones y de pendientes, `export`, y las de
  stock (`exporterMaterialStock`, `businessStock`, `stockMovements`).
- AUCP y DAE: `exports`, `export`, `bookingDocumentStatus` y `documentBoard`.
- Subir o eliminar un documento del embarque: `bookingDocuments`,
  `bookingDocumentStatus`, `documentBoard`, `exports` y `export`.
- Crear un envío: `exports`, `exportsSent`, `exportsSentPending`,
  `exportsPending`, `clientPaymentsPending`, `cuttingSheets`,
  `cuttingSheetsPending`, `exportSentCostsPending`.

> Las pantallas de envío de insumos están bajo `/dashboard/liquidation/` aunque
> el menú las muestra en *Exportaciones*. Un envío de insumos no se edita.
