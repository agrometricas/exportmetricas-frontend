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
| `price` | Propuesto por el backend según el contrato del productor, editable |
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
| Pago a productor | `GET /export/producer-payment/quote` | `price`, `subtotal1`, `subtotal2`, `total`, `amount` |
| Cobro a cliente | `GET /client-payment/quote` | `price`, `total` |

- La cotización se pide 300 ms después de la última tecla
- Pedida sin `price`, devuelve el precio que el backend propone; ese valor
  llena el campo *Precio*, que el usuario puede cambiar
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
