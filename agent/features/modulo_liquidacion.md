# Módulo Liquidación

> Reglas autoritativas del backend; aquí se anota cómo la web valida los costos
> de un embarque y registra el pago al productor y el cobro al cliente.

### Propósito

Cerrar económicamente cada envío de insumos en tres pasos: **validar el costo**
de los materiales enviados, **pagar al productor** descontando sus gastos y
**registrar el cobro al cliente**.

---

### Workflow (que la web orquesta)

```
Agregar Costos Validados: lista GET /export-sent/pending-costs
        ↓ revisar uno                              ↓ o elegir varios
/liquidation/add-export-cost/[id]              "Confirmar costos"
   GET   /export-sent-material/:exportSentId     POST /export-sent/confirm-producer-cost/batch
   PATCH /export-sent-material/:id               (una llamada por línea cambiada)
   PATCH /export-sent/:id/confirm-producer-cost  (confirma)
        ↓
el envío aparece en las dos listas de pago:

Agregar Pago Productores                 Agregar Cobro Clientes
GET  /export/export-sent/pending         GET  /client-payment/pending
POST /export/producer-payment            POST /client-payment
POST …/transfer  (comprobante)           POST …/transfer  (comprobante)
```

Los dos pagos son independientes: cualquiera puede registrarse primero.

Las dos listas de pendientes son tablas (`PendingTable`) con fecha de corte,
finca, productor, alícuota, cajas, cliente y ruta. *Realizar pago* y *Realizar
cobro* piden confirmación y abren el formulario de ese envío.

---

### Costos validados

`ExportSentCostForm` muestra cada material enviado con su cantidad y su costo
unitario editable. Al guardar:

1. Compara cada `unitCost` con el original y manda un `PATCH` **solo por las
   líneas que cambiaron**
2. Llama a la confirmación
3. Invalida `COST_CONFIRMATION_QUERIES` y va a *Costos Validados*

### Lista de pendientes y confirmación por lote

Los envíos con costos por validar se muestran en una tabla (`PendingTable`)
con los datos del embarque y el **costo de materiales** que da el backend
(`materialsCost`, con `materialLines` materiales), ordenada por fecha de
corte. *Revisar costos* pide confirmación y abre el formulario.

Cuando los costos no hay que corregirlos, se eligen varias filas y **Confirmar
costos (N)** (`BatchActionBar`) los confirma tal como están, con
`POST /export-sent/confirm-producer-cost/batch` y solo los ids.

- La respuesta es `{ confirmed, failed }`. El toast resume cuántos se
  confirmaron (`costBatchSummary`, `utils/costBatch.ts`); los que fallaron
  siguen elegidos, con un aviso que dice cuál y por qué
- Invalida las mismas claves que la confirmación una por una

---

### Pago a productor (campos que envía la web)

| Campo | Origen en el formulario |
|-------|-------------------------|
| `exportSentId`, `merchantId`, `departureHarborId`, `destinationHarborId`, `boxBrandId`, `boxQuantity` | Precargados del envío elegido |
| `price` | Propuesto por el backend (el precio fijado en la exportación o el mínimo), editable |
| `transport`, `materials`, `others` | Los escribe el usuario |
| `description` | Descripción de los gastos |
| `sourceBankAccountId`, `destinationBankAccountId` | Selectores de cuenta |

### Cobro a cliente (campos que envía la web)

`exportSentId`, `clientId`, `boxBrandId`, `boxQuantity`, `price`,
`description?`, `sourceBankAccountId`, `destinationBankAccountId`. El `price`
arranca con el que propone el backend y es editable.

---

### Dónde se calculan los montos

**En el backend.** El body solo lleva insumos. Mientras el usuario llena el
formulario, `usePaymentQuote` (`hooks/liquidation/`) pide los montos a la ruta
de cotización y el formulario los muestra en campos de solo lectura
(`ReadOnlyAmount`):

| Formulario | Ruta | Devuelve |
|------------|------|----------|
| Pago a productor | `GET /export/producer-payment/quote` | `price`, `priceProposal`, `transport`, `transportProposal`, `materials`, `materialsProposal`, `subtotal1`, `subtotal2`, `total`, `amount` |
| Cobro a cliente | `GET /client-payment/quote` | `price`, `total`, `priceProposal` |

- La cotización se pide 300 ms después de la última tecla
- Pedida sin `price`, devuelve el precio que el backend propone; ese valor
  llena el campo *Precio*, que el usuario puede cambiar. En el pago a
  productor, debajo se dice de dónde sale (`priceProposal.source`): el del
  contrato de la finca, fijado al planificar la exportación (`CONTRACT`); el
  de la hoja de precios si es *spot* (`PRICE_SHEET`); o el precio mínimo de la
  exportadora
- El cobro a cliente manda también el `exportSentId`: sin precio, el backend
  propone el de la orden de compra del cliente para esa alícuota y semana,
  primero el de su contrato y después el de su pedido *spot*, o el precio de
  venta por defecto. Debajo del campo se dice cuál es
- El pago a productor manda también el `exportSentId`. Pedida sin `transport`,
  la cotización propone el transporte con la tarifa del transportista para la
  provincia de la finca por contenedor, y trae el detalle en
  `transportProposal`; el formulario lo pone en el campo y lo explica debajo.
  Sin tarifa no propone nada y el campo queda vacío. El usuario puede cambiarlo
- Pedida sin `materials`, la cotización propone el gasto de materiales: el
  costo validado de los insumos del envío. El formulario lo pone en el campo y
  dice cuántos materiales suma (`materialsProposal`). El usuario puede
  cambiarlo
- Con un insumo que el backend rechaza (un precio con tres decimales, por
  ejemplo) los montos quedan vacíos
- *Enviar* está deshabilitado mientras los montos en pantalla no correspondan
  a lo que está escrito (`isSettled`): lo que se guarda se calcula de los
  insumos, y el usuario tiene que haber visto esa cifra

El gasto `materials` lo escribe el usuario: no se trae de los costos validados
del mismo envío.

Todo esto es deuda frente a la regla de la casa (`agent/coding-standards.md` §
_The backend owns the math_). Un cambio en estas fórmulas o en el precio se hace
moviéndolos al backend, no editando el componente.

---

### Hoja de precios

Liquidación → **Hoja de Precios** (`/dashboard/liquidation/price-sheet`): las
exportaciones con corte en la semana, con su cliente y su precio por caja al
productor. Solo las *spot* se precian aquí; las de contrato muestran el precio
de su contrato sin campo.

- Se elige cualquier día de la semana (`DD/MM/AAAA`); arranca en la de hoy.
  La hoja sale de `GET /price-sheet?week=`.
- Cada exportación *spot* tiene su campo de precio. Vacío usa el mínimo del
  contrato de su productor, que se ve como ejemplo en el campo.
- Los totales por exportación y de la semana, y los avisos (precios de
  contrato bajo el mínimo, *spot* sin precio), los da el backend: mientras se escribe, la hoja se pide a
  `POST /price-sheet/quote` con los precios escritos, 300 ms después de la
  última tecla (`usePriceSheetQuote`). *Guardar Precios* está apagado hasta
  que lo que se ve responde a lo escrito.
- Guardar manda `PUT /price-sheet` con cada exportación *spot* y su precio
  (`null` si está vacía); nunca una de contrato. Un aviso no impide guardar.
- Cada fila enlaza a su exportación y, si ya se pagó, muestra el precio del
  pago.

### Precio mínimo

Configuraciones → **Precio Mínimo** (`/dashboard/settings/minimum-box-price`):
el FAS y el FOB por caja de la exportadora (`GET` y `PUT
/settings/minimum-box-price`). Mientras no se guarda rige el de 2026 y la
pantalla lo dice. Guardar invalida la hoja y las cotizaciones del pago.

---

### Reglas de negocio

- Un envío admite un pago a productor y un cobro a cliente; no se repiten.
- Un envío no aparece en ninguna de las dos listas de pago hasta tener los
  costos confirmados.
- El comprobante es una imagen y se sube **después** de crear el pago, con el
  id que devuelve la creación. Subir otro reemplaza el anterior.
- Las cuentas de origen y destino salen de *Cuentas Bancarias*.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Costos pendientes | `components/export-cost/ExportCostList.tsx`, `components/export/pendingColumns.tsx`, `components/ui/{PendingTable, OpenWithConfirmation}.tsx` |
| Confirmación por lote | `components/ui/BatchActionBar.tsx`, `hooks/export/export-sent/confirmExportSentCostReview.ts`, `utils/{costBatch, selection}.ts`, `types/costConfirmationBatch.ts` |
| Validación de costos | `components/export-cost/ExportSentCostForm.tsx` |
| Costos confirmados | `components/export-cost/{TableExportSentConfirmedCost, DetailExportSentConfirmedCost}.tsx` |
| Pago a productor: pendientes | `components/export/export-payments/PendingPaymentList.tsx` |
| Pago a productor: formulario | `components/export/export-payments/PendingPaymentForm.tsx` |
| Pagos a productor realizados | `components/liquidation/producer-payments/` |
| Cobro a cliente | `components/client-payment/` |
| Selector de cuenta | `components/export/export-payments/bank-account/` |
| Hoja de precios | `components/price-sheet/`, `hooks/price-sheet/priceSheet.ts`, `types/priceSheet.ts` |
| Precio mínimo | `components/settings/minimum-box-price/`, `hooks/settings/minimumBoxPrice.ts` |
| Montos cotizados | `hooks/liquidation/usePaymentQuote.ts`, `hooks/export/producerPayment/useProducerPaymentQuote.ts`, `hooks/client-payment/useClientPaymentQuote.ts`, `components/ui/form/ReadOnlyAmount.tsx` |
| Páginas | `app/dashboard/liquidation/{export-costs, add-export-cost, add-export-cost/[id], producer-payments, producer-pending-payments, producer-pending-payments/[id], client-payments, client-pending-payments, client-pending-payments/[id]}/page.tsx` |
| Tipos | `types/producerPayment.ts`, `types/client-payment/`, `types/export-sent/` |
| Hooks | `hooks/export/export-sent/`, `hooks/export/producerPayment/`, `hooks/liquidation/`, `hooks/client-payment/` |

Invalidaciones:

- Confirmar costos, uno o por lote: `COST_CONFIRMATION_QUERIES`
  (`exportSentCostsPending`, `confirmedExportSents`, `exportsSentPending`,
  `clientPaymentsPending` y las del avance de la exportación).
- Pago a productor: `producerPayments`, `exportsSentPending`.
- Cobro a cliente: `clientPayments`, `exportsSentPending`,
  `clientPaymentsPending`.

- `POST /export/producer-payment` responde un arreglo; `createProducerPayment`
  toma el `id` del primer elemento para subir el comprobante.

> El formulario de pago a productor vive en `components/export/export-payments/`,
> no en `components/liquidation/`.
