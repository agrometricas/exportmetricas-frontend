# Módulo Comercialización (Clientes y Logística)

> Reglas autoritativas del backend; aquí se anota cómo la web mantiene las
> contrapartes de un embarque.

### Propósito

Dar de alta todo lo que una exportación necesita fuera de la finca: clientes,
puertos, navieras, depósitos y transportes. Son los catálogos de los que el
formulario de exportación elige.

---

### Modelos (campos que envía/lee la web)

**Cliente:** `businessName`, `businessId` (13 caracteres), `address`, `type`
(`Supermercado`, `Intermediario`), `commercialType`, `shippingMethod`, `phone`,
`email?`, `website?`, `postalCode?`, `annualPurchaseVolume?`,
`paymentConditions?`, ubicación, `harbors[]` (ids de puertos de destino),
`incoterms[]`, `certificates[]`, `contacts[]`.

**Puerto:** `type` (`Nacional`, `Internacional`), `name`, `code`, `address`,
`openTime`, `closeTime` (`HH:mm`), `daysOfOperation[]`, ubicación,
`contacts[]`.

**Naviera:** `name`, `code`, `countryId`, `frequencies`, `cargoType`,
`trackingPlatform?`, `contacts[]`, `harbors[]` — cada elemento es una ruta
`{ harborDepartureId, harborDestinationId, estDuration }`. El formulario ya no
pide costo: el precio de una ruta está en el contrato naviero.

**Contrato naviero:** `shippingCompanyId` (solo al crear), `reference?`,
`startDate`, `endDate` y `routes[]`, cada una
`{ harborDepartureId, harborDestinationId, costPerContainer, transitDays }`. La
respuesta trae `costPerContainer` como texto decimal y `active` (vigente hoy).

**Depósito:** `name`, `code`, `cityId`, `address`, `openTime`, `closeTime`,
`contacts[]`.

**Transporte:** `name`, `ruc`, `address`, `satelliteTracking`,
`certifications[]`, `contacts[]`.

---

### Reglas de negocio

- El puerto de salida de una exportación se elige entre los `Nacional` y el de
  destino entre los `Internacional`: los selectores piden cada lista con
  `GET /harbor/type/:type`.
- Al elegir el puerto de destino, el selector de cliente se limita a los
  clientes que reciben en ese puerto (`GET /client/harbor/:id`).
- Incoterms, certificaciones de transporte y ubicaciones son catálogos fijos del
  backend; la web solo los lista.

### Tarifas de transporte

*Comercialización → Tarifas de Transporte*
(`components/transport-rate/TransportRatesManager.tsx`, una sola pantalla con
el formulario arriba y la tabla debajo). Cada tarifa es el costo por
contenedor de un transportista para una provincia de Ecuador: el servicio
depósito o puerto → finca → puerto.

- Un transportista tiene una tarifa por provincia; repetirla responde 409.
- Editar solo cambia el costo; para cambiar transportista o provincia se
  elimina y se crea otra.
- La usa el pago a productor para proponer el gasto de transporte (ver
  [modulo_liquidacion](modulo_liquidacion.md)).

### Contratos navieros

*Comercialización → Contratos Navieros*. Cada contrato es de una naviera, con
vigencia (inicio y fin, `DD/MM/AAAA`) y una o más rutas con su costo por
contenedor en USD y, si se conoce, los días de tránsito.

- El costo acepta coma o punto decimal y hasta dos decimales;
  `shippingContractBody()` lo manda como número.
- Una ruta no puede tener dos precios el mismo día en la misma naviera: si se
  cruza con otro contrato, el backend responde 409 con la ruta y las fechas del
  otro, y la web muestra ese mensaje.
- Editar manda todas las rutas: las que se quitan del formulario se borran.
- Para dar por terminado un contrato sin perder el historial de precios se
  cambia la fecha de fin; eliminarlo borra también sus rutas. Un contrato con
  bookings no se puede eliminar (409).
- Los campos de texto del formulario usan `InputFieldPlain`: `InputFieldNumber`
  pierde el valor de una fila cuando se quita otra de la lista, y
  `InputFieldQuantity` no deja escribir el punto decimal.

---

### Totales por contraparte

Comercialización → **Totales por Contraparte**
(`/dashboard/client/counterpart-totals`): las exportaciones no canceladas con
fecha de corte en un período (por defecto, del primero del mes a hoy), sumadas
por cliente, productor, puerto de salida y de destino, naviera, depósito y
verificadora, una pestaña por cada una. Sale de `GET
/reports/counterparts?from=&to=`; la web no suma nada.

- Cliente: exportaciones, cajas, contenedores, lo cobrado (y cuántas ya se
  cobraron), lo pagado a los productores y el flete.
- Naviera: el flete es el de los contenedores tomados de un booking, y dice
  cuántas exportaciones lo tienen.
- El reporte espera las dos fechas completas y en orden.

---

### Importación CSV

`ImportClientDrawer` sube un CSV con encabezados a `POST /client/upload`. La
respuesta trae una entrada por fila con `status: 'success' | 'error'`.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Cliente | `components/settings/{AddClientForm, ImportClientDrawer}.tsx`, `components/settings/hooks/useSubmitClient.ts`, `components/settings/schemas/client.schema.ts` |
| Puerto | `components/settings/AddHarborForm.tsx`, `components/settings/hooks/useSubmitHarbor.ts`, `components/settings/schemas/harbor.schema.ts`, `components/harbor/` |
| Naviera | `components/shipping-company/` |
| Contrato naviero | `components/shipping-contract/`, `hooks/shipping-contract/`, `types/shippingContract.ts` |
| Depósito | `components/deposit/` |
| Transporte | `components/transport/` |
| Tablas y detalle | `components/client/table-client/`, `components/harbor/table-harbor/`, `components/<dominio>/table-<dominio>/` |
| Selectores | `Select<X>.tsx` + `<X>SelectBase.tsx` + `InputField<X>Select.tsx` en cada dominio |
| Cuentas bancarias | `components/client/table-bank-accounts/`, `components/producer/AddBankAccountForm.tsx` |
| Páginas | `app/dashboard/client/{clients, add-client, harbors, add-harbor, shipping-companies, add-shipping-company, shipping-contracts, shipping-contracts/[id], add-shipping-contract, deposits, add-deposit, transports, add-transport, bank-accounts, add-bank-account}/page.tsx` |
| Tipos | `types/client*.ts`, `types/harbor*.ts`, `types/shippingCompany*.ts`, `types/deposit/`, `types/transport/` |
| Hooks | `hooks/export/client/`, `hooks/export/harbor/`, `hooks/export/shippingCompany/`, `hooks/deposit/`, `hooks/transport/` |
| Totales por contraparte | `components/counterpart-totals/`, `hooks/reports/counterpartTotals.ts`, `types/counterpartTotals.ts`, `app/dashboard/client/counterpart-totals/page.tsx` |

- Los formularios de **cliente** y de **puerto** viven en `components/settings/`,
  no en `components/client/` ni `components/harbor/`.
- Los hooks de cliente, puerto y naviera cuelgan de `hooks/export/`.
- `AddHarborModal` y `AddShippingCompanyModal` permiten crear un puerto o una
  naviera sin salir del formulario que los necesita.

> Las cuentas bancarias se dan de alta desde *Productor* y desde
> *Comercialización*, pero se listan en el menú *Liquidación*.
