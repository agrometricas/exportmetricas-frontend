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
`{ harborDepartureId, harborDestinationId, estDuration, cost }`.

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
| Depósito | `components/deposit/` |
| Transporte | `components/transport/` |
| Tablas y detalle | `components/client/table-client/`, `components/harbor/table-harbor/`, `components/<dominio>/table-<dominio>/` |
| Selectores | `Select<X>.tsx` + `<X>SelectBase.tsx` + `InputField<X>Select.tsx` en cada dominio |
| Cuentas bancarias | `components/client/table-bank-accounts/`, `components/producer/AddBankAccountForm.tsx` |
| Páginas | `app/dashboard/client/{clients, add-client, harbors, add-harbor, shipping-companies, add-shipping-company, deposits, add-deposit, transports, add-transport, bank-accounts, add-bank-account}/page.tsx` |
| Tipos | `types/client*.ts`, `types/harbor*.ts`, `types/shippingCompany*.ts`, `types/deposit/`, `types/transport/` |
| Hooks | `hooks/export/client/`, `hooks/export/harbor/`, `hooks/export/shippingCompany/`, `hooks/deposit/`, `hooks/transport/` |

- Los formularios de **cliente** y de **puerto** viven en `components/settings/`,
  no en `components/client/` ni `components/harbor/`.
- Los hooks de cliente, puerto y naviera cuelgan de `hooks/export/`.
- `AddHarborModal` y `AddShippingCompanyModal` permiten crear un puerto o una
  naviera sin salir del formulario que los necesita.

> Las cuentas bancarias se dan de alta desde *Productor* y desde
> *Comercialización*, pero se listan en el menú *Liquidación*.
