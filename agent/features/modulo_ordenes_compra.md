# Módulo Órdenes de Compra

> Reglas autoritativas del backend; aquí se anota cómo la web arma la orden
> del cliente, muestra lo pedido contra lo asignado y asigna fincas.

### Propósito

La orden de compra es lo que **el cliente** pide: qué alícuotas y cuántas
cajas de cada una por semana. Es de contrato, una porción fija que se repite
cada semana mientras está vigente, o *spot*, lo que pide de más para una
sola semana. La exportadora la cumple asignando fincas: cada finca asignada es
una exportación de ese cliente, y el contrato de la finca decide si se le
compra de contrato o *spot*.

---

### Pantallas

| Ruta | Qué hace |
|------|----------|
| `export/purchase-orders` | Lista: cliente, tipo, semanas, cajas por semana, alícuotas, si está vigente esta semana y notas |
| `export/add-purchase-order` | Crea la orden. Al guardar abre su página |
| `export/purchase-orders/[id]` | Edita la orden o la elimina |
| `export/weekly-plan` | **Pedidos de la semana**: lo pedido contra lo asignado, por cliente y alícuota |
| `export/weekly-plan/assign` | **Asignar fincas**: crea de una vez las exportaciones de varias fincas para un cliente |

En el menú están bajo *Exportaciones*.

---

### Formulario de la orden

| Campo | Notas |
|-------|-------|
| `type` | `CONTRACT` o `SPOT`. Solo al crear |
| `clientId` | Solo al crear: el backend no acepta el cliente ni el tipo al editar |
| `startWeek` | Cualquier día de la semana en `DD/MM/AAAA`; el backend lo lleva al lunes. Debajo se muestra `getWeekInfo(día).week` |
| `endWeek` | Solo en un contrato, opcional: sin él queda abierto. Un *spot* manda `null` |
| `notes` | Opcional |
| `lines[]` | `boxBrandId`, `boxQuantity` (cajas por semana) y `price` (precio de venta por caja, opcional: `null` vacío); al editar, la línea guardada lleva su `id` |

- Una alícuota va una sola vez por orden; el esquema lo avisa antes de que lo
  rechace el backend.
- Una línea guardada dice cuántos contenedores por semana son, con el dato que
  devuelve el backend (`containers`).
- Eliminar la orden no toca las exportaciones ya asignadas.
- El cuerpo lo arma `purchaseOrderBody` (`components/purchase-order/`).

---

### Pedidos de la semana

Se elige cualquier día de la semana (arranca en la de hoy, o en la del
parámetro `week`). La tabla sale de `GET /purchase-orders/week?week=` sin
calcular nada en el navegador:

- Por cliente y alícuota: lo pedido, con cuánto es de contrato y cuánto
  *spot*; lo asignado, con cada exportación (finca, cajas, corte y si es de
  contrato o *spot*); y lo que falta, o *Completo*, o cuánto se asignó de más.
- El pie y los avisos (asignado de más, asignado sin pedido) son los del
  backend.
- Cada fila lleva **Asignar fincas**, un enlace a `export/weekly-plan/assign`
  con el cliente, la alícuota, la semana y lo que falta en la URL.

---

### Asignar fincas

`ExportPlanForm` (`components/purchase-order/`). Arranca con el cliente, una
finca por llenar con la alícuota de la fila y las cajas que faltan.

- Por finca: la finca (de todas las de la exportadora), la alícuota, el día de
  corte, las cajas y, si hay booking, sus contenedores; un contenedor elegido
  en una finca queda deshabilitado en las otras. **Agregar finca** suma otra
  con la misma alícuota.
- Debajo de cada finca se ve su contrato de esa semana, de
  `GET /contract-usage?week=`: el precio y los contenedores que le quedan, o
  *Sin contrato esa semana: va spot*. Es lo ya guardado: las fincas de este
  mismo formulario las cuenta el backend al crear, en el orden de la lista.
- Los datos comunes —booking o naviera y puertos, nave, fecha máxima de
  ingreso, depósito, transporte y verificadora— se llenan una sola vez.
- Manda `POST /export/plan` con el body de `exportPlanBody`
  (`components/purchase-order/exportPlan.ts`): cada finca con su alícuota, su
  día y sus cajas, y los contenedores solo con booking. No manda el tipo de
  contrato ni el precio: los decide el backend.
- El backend crea todas o ninguna; el mensaje de error dice qué falló. Al
  terminar vuelve a *Pedidos de la semana*, y el aviso junta las notas del
  backend de las que fueron *spot*.

---

### Precios

El precio de venta va en la orden y el cobro al cliente lo propone (ver
[modulo_liquidacion](modulo_liquidacion.md)). El precio al productor no se
escribe aquí: una exportación de contrato lleva el de su contrato y una *spot*
se precia en la **Hoja de Precios** de Liquidación.

---

### Claves de consulta

`purchaseOrders` (lista), `purchaseOrder` (detalle) y `purchaseOrderWeek` (lo
pedido contra lo asignado). Guardar o eliminar la orden invalida las tres;
crear, editar o cancelar una exportación y asignar fincas invalidan
`purchaseOrderWeek`, la hoja de precios y el uso de los contratos.
