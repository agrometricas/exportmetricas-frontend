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
        ↓ elegir un envío
/liquidation/add-export-cost/[id]
   GET   /export-sent-material/:exportSentId        materiales y costo unitario
   PATCH /export-sent-material/:id                  una llamada por línea cambiada
   PATCH /export-sent/:id/confirm-producer-cost     confirma
        ↓
el envío aparece en las dos listas de pago:

Agregar Pago Productores                 Agregar Cobro Clientes
GET  /export/export-sent/pending         GET  /client-payment/pending
POST /export/producer-payment            POST /client-payment
POST …/transfer  (comprobante)           POST …/transfer  (comprobante)
```

Los dos pagos son independientes: cualquiera puede registrarse primero.

---

### Costos validados

`ExportSentCostForm` muestra cada material enviado con su cantidad y su costo
unitario editable. Al guardar:

1. Compara cada `unitCost` con el original y manda un `PATCH` **solo por las
   líneas que cambiaron**
2. Llama a la confirmación
3. Invalida `exportSentCostsPending` y va a *Costos Validados*

---

### Pago a productor (campos que envía la web)

| Campo | Origen en el formulario |
|-------|-------------------------|
| `exportSentId`, `merchantId`, `departureHarborId`, `destinationHarborId`, `boxBrandId`, `boxQuantity` | Precargados del envío elegido |
| `price` | Propuesto por el backend (hoja de precios de la semana o precio mínimo), editable |
| `transport`, `materials`, `others` | Los escribe el usuario |
| `description` | Descripción de los gastos |
| `sourceBankAccountId`, `destinationBankAccountId` | Selectores de cuenta |

### Cobro a cliente (campos que envía la web)

`exportSentId`, `clientId`, `boxBrandId`, `boxQuantity`, `price`,
`description?`, `sourceBankAccountId`, `destinationBankAccountId`.

---

### Dónde se calculan los montos

**En el backend.** El body solo lleva insumos. Mientras el usuario llena el
formulario, `usePaymentQuote` (`hooks/liquidation/`) pide los montos a la ruta
de cotización y el formulario los muestra en campos de solo lectura
(`ReadOnlyAmount`):

| Formulario | Ruta | Devuelve |
|------------|------|----------|
| Pago a productor | `GET /export/producer-payment/quote` | `price`, `priceProposal`, `transport`, `transportProposal`, `materials`, `materialsProposal`, `subtotal1`, `subtotal2`, `total`, `amount` |
| Cobro a cliente | `GET /client-payment/quote` | `price`, `total` |

- La cotización se pide 300 ms después de la última tecla
- Pedida sin `price`, devuelve el precio que el backend propone; ese valor
  llena el campo *Precio*, que el usuario puede cambiar. En el pago a
  productor, debajo se dice de dónde sale (`priceProposal.source`): de la
  hoja de precios de la semana, si la exportación nació de una línea con
  precio, o el precio mínimo de la exportadora
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
líneas de las órdenes de compra de la semana con su precio por caja.

- Se elige cualquier día de la semana (`DD/MM/AAAA`); arranca en la de hoy.
  La hoja sale de `GET /price-sheet?week=`.
- Cada línea tiene su campo de precio. Vacío usa el mínimo del contrato de su
  productor, que se ve como ejemplo en el campo.
- Los totales por línea y de la semana, y los avisos de líneas de contrato
  bajo el mínimo, los da el backend: mientras se escribe, la hoja se pide a
  `POST /price-sheet/quote` con los precios escritos, 300 ms después de la
  última tecla (`usePriceSheetQuote`). *Guardar Precios* está apagado hasta
  que lo que se ve responde a lo escrito.
- Guardar manda `PUT /price-sheet` con cada línea y su precio (`null` si está
  vacía). Un aviso de bajo mínimo no impide guardar.
- La línea muestra su exportación y, si ya se pagó, el precio del pago.

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
| Costos pendientes | `components/export-cost/{ExportCostList, ExportCostCard}.tsx` |
| Validación de costos | `components/export-cost/ExportSentCostForm.tsx` |
| Costos confirmados | `components/export-cost/{TableExportSentConfirmedCost, DetailExportSentConfirmedCost}.tsx` |
| Pago a productor: pendientes | `components/export/export-payments/{PendingPaymentList, PendingPaymentCard}.tsx` |
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

- Confirmar costos: `exportSentCostsPending`.
- Pago a productor: `producerPayments`, `exportsSentPending`.
- Cobro a cliente: `clientPayments`, `exportsSentPending`,
  `clientPaymentsPending`.

- `POST /export/producer-payment` responde un arreglo; `createProducerPayment`
  toma el `id` del primer elemento para subir el comprobante.
- Confirmar costos **no** invalida `exportsSentPending` ni
  `clientPaymentsPending`: con `staleTime: Infinity`, el envío recién confirmado
  no aparece en las listas de pago ni en sus contadores hasta recargar la
  página.

> El formulario de pago a productor vive en `components/export/export-payments/`,
> no en `components/liquidation/`.
