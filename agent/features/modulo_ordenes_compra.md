# Módulo Órdenes de Compra

> Reglas autoritativas del backend; aquí se anota cómo la web arma la orden,
> muestra el cupo y crea la exportación de cada línea.

### Propósito

La orden de compra es lo que la exportadora le pide a un productor para una
semana: por finca, qué alícuota y cuántas cajas, y si cada línea va contra el
cupo del contrato del productor o es *spot*. De cada línea nace una
exportación.

---

### Pantallas

| Ruta | Qué hace |
|------|----------|
| `export/purchase-orders` | Lista: semana, productor, cajas de contrato, spot y total, y cuántas líneas ya son exportación |
| `export/add-purchase-order` | Crea la orden. Al guardar abre su página |
| `export/purchase-orders/[id]` | Edita la orden; cada línea guardada tiene su botón **Crear exportación** o muestra la exportación que ya tiene |
| `export/purchase-orders/[id]/export/[lineId]` | Formulario de exportación prellenado con la línea |

En el menú están bajo *Exportaciones*.

---

### Formulario de la orden

| Campo | Notas |
|-------|-------|
| `merchantId` | Productor. Solo al crear: el backend no lo acepta al editar |
| `weekStart` | Cualquier día de la semana en `DD/MM/AAAA`; el backend lo lleva al lunes. Debajo se muestra `getWeekInfo(día).week` |
| `notes` | Opcional |
| `lines[]` | `businessId`, `boxBrandId`, `boxQuantity`, `type` (`CONTRACT` o `SPOT`); al editar, la línea guardada lleva su `id` |

- Al cambiar de productor, las fincas de las líneas se vacían.
- Una línea que ya es exportación no se puede quitar: el botón está apagado.
- **Eliminar** está apagado mientras alguna línea sea exportación.

### Cupo de la semana

El formulario no calcula el cupo: lo pide a `POST /purchase-orders/quote` con
el productor, el día y las líneas completas, 300 ms después de la última tecla
(`usePurchaseOrderQuote`). Muestra lo que vuelve: cajas de contrato, spot y
total, una fila por finca con su cupo semanal, lo que lleva de contrato, lo que
le queda y lo spot, y los avisos del backend. Los avisos no impiden guardar.

---

### Exportación de una línea

La página de la línea carga la orden y, de las mismas listas que usan los
selectores, el productor, la finca y la alícuota completos para mostrar sus
datos. El formulario de exportación arranca con esos tres y las cajas de la
línea, y manda `purchaseOrderLineId`. Al guardar vuelve a la orden.

- La finca y la alícuota tienen que ser las de la línea; las cajas se pueden
  ajustar.
- Editar o duplicar una exportación nunca manda `purchaseOrderLineId`. Al
  editar una que nació de una orden, un aviso enlaza a la orden.
- Cancelar la exportación suelta la línea: vuelve a aparecer **Crear
  exportación**.

---

### Precios

El precio de cada línea no se escribe en la orden: va en la **Hoja de
Precios** de Liquidación (ver [modulo_liquidacion](modulo_liquidacion.md)),
que reúne las líneas de todas las órdenes de la semana. El pago al productor
de la exportación de una línea propone ese precio.

---

### Claves de react-query

`purchaseOrders` (lista) y `purchaseOrder` (detalle). Las invalidan guardar o
eliminar la orden, crear o editar una exportación y cancelarla.
