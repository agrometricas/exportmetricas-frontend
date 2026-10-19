# Módulo Productores y Fincas

> Reglas autoritativas del backend; aquí se anota cómo la web da de alta
> productores, fincas y sus cuentas bancarias.

### Propósito

Mantener a quién le compra la fruta la exportadora. El **productor**
(`merchant`) es la persona o empresa; la **finca** (`business`) es el predio. Un
productor tiene una o más fincas.

---

### Modelos (campos que envía/lee la web)

**Productor (`merchant`):** `businessName`, `businessId` (RUC de 13 dígitos),
`email?`, `address?`, `countryId?`, `provinceId?`, `cityId?`, `contractType`
(`FOB`, `FAS`, `SPOT`), `businesses[]`.

**Finca (`business`):** `name`, `fruitType` (`Orgánica`, `Convencional`),
`area`, `codeMAGAP`, `codeAGROCALIDAD`, ubicación, `latitude?`, `longitude?`,
`certificates[]` (ids), `businessCodes[]`, `contacts[]`.

**Cuenta bancaria:** `bank`, `owner`, `ownerID`, `accountNumber` (10 dígitos),
`type`, `email?`, y **exactamente uno** de `merchantId` o `clientId`.

---

### Reglas de negocio

- RUC y correo del productor no se repiten; `codeMAGAP` y `codeAGROCALIDAD`
  tampoco. El backend responde un conflicto con `model` y `prop`, y el
  formulario marca el campo.
- El correo del productor es opcional, pero es a donde llegan la hoja de corte y
  el enlace semanal de ajuste de materiales.
- El `contractType` del productor decide el precio por caja que el formulario de
  pago propone.
- Una cuenta bancaria es de un productor o de un cliente, nunca de ambos.

### Contratos de productor

El cupo que el MAGAP aprueba para una finca: hectáreas aprobadas y cajas
aprobadas por hectárea a la semana, con fecha de inicio y una de fin opcional
(sin fin, el contrato queda abierto). El tipo FAS o FOB es opcional.

- El formulario elige productor y finca; el cuerpo lleva solo `businessId` (el
  backend saca el productor de la finca). Al editar, la finca no cambia y no se
  manda.
- Las **cajas por semana** las calcula el backend y la web solo las muestra en
  la lista. El cuerpo nunca las lleva.
- Las reglas las hace cumplir el backend: fin antes del inicio (400) y contratos
  de la misma finca que se cruzan (409, con las fechas del que ya existe). El
  esquema chequea la primera para avisar antes.
- La lista muestra `Vigente` o `No vigente` según el `active` que devuelve el
  backend.
- Eliminar un contrato lo borra; para terminarlo sin perder el historial se le
  pone fecha de fin.

---

### Cupos de la semana

Productor → **Cupos de la Semana** (`/dashboard/producer/contract-usage`):
cada finca con contrato vigente o con exportaciones en la semana elegida, con
su cupo semanal, lo exportado y lo que queda. Sale de `GET
/contract-usage?week=` y no se calcula nada en el navegador.

- Cuentan todas las cajas exportadas de la finca: de contrato, spot o sin orden
  de compra; debajo del total se ve esa división.
- Las fincas que pasaron su cupo van primero, con la alerta del backend. Una
  finca sin contrato vigente dice *Sin contrato* y no alerta.
- La misma alerta, de la semana en curso, sale en Inicio para `MASTER`,
  `LOGISTICS` y `EXPORT` (`ContractUsageAlerts`), y al crear o editar una
  exportación (ver [modulo_exportaciones](modulo_exportaciones.md)).
- Crear, editar o cancelar una exportación invalida `contractUsage` y
  `contractUsageCheck`.

---

### Editar una finca

Productor → Fincas → **Editar** (`/dashboard/producer/fincas/[id]`) abre la
finca con lo guardado: datos, ubicación, certificados, códigos y contactos. El
productor se muestra pero no cambia.

- Guardar manda `PATCH /merchant/business/:id` con todo. Los códigos y
  contactos guardados viajan con su `id` (se actualizan), los nuevos sin `id`
  (se crean) y los que se quitaron no van (el backend los quita). Una lista
  vacía no se manda: una finca guardada sin códigos o sin contactos sigue así.
- Un lugar o una coordenada vacíos van como `null` y se borran.
- No se puede quitar el último código o contacto guardado.
- Las reglas del formulario son las del backend, no las del alta: aceptan
  tildes y lo que trajo una importación. Un código MAGAP o AGROCALIDAD de otra
  finca vuelve como error del campo.
- Al guardar invalida `businesses` y `business`, y vuelve a la lista.

---

### Importación CSV

`ImportProducerDrawer` sube un CSV a `POST /merchant/business/import`: una fila
por finca, con los datos del productor repetidos. El backend responde cuántas
filas entraron y el detalle de las que fallaron.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Formularios | `components/producer/addProducerForm.tsx`, `AddBusinessForm.tsx`, `AddBankAccountForm.tsx`; edición de finca en `components/business/edit/` (`EditBusinessForm.tsx`, `editBusiness.ts`) |
| Envío | `components/producer/hooks/{useSubmitProducer, useSubmitBusiness}.ts` |
| Esquemas | `components/producer/schemas/{producer, business}.schema.ts` |
| Tablas y detalle | `components/producer/table-producer/`, `components/business/table-business/` |
| Selectores | `components/producer/{SelectProducer, ProducerSelectBase, InputFieldProducerSelect}.tsx`, `components/business/{SelectBusiness, …}.tsx` |
| Importación | `components/producer/ImportProducerDrawer.tsx`, `hooks/merchants/uploadMerchants.ts` |
| Logo del productor | `components/producer/{UploadLogoForm, UploadLogoFile}.tsx`, `hooks/merchants/uploadMerchantLogo.ts` |
| Páginas | `app/dashboard/producer/{producers, add-producer, fincas, fincas/[id], add-fincas, contracts, contracts/[id], add-contract, add-bank-account, upload-logo}/page.tsx` |
| Contratos | `components/producer-contract/` (formulario de alta y edición, tabla, `producerContractBody.ts`), `hooks/producer-contract/`, `types/producerContract.ts` |
| Cupos de la semana | `components/contract-usage/`, `hooks/contract-usage/contractUsage.ts`, `types/contractUsage.ts`, `app/dashboard/producer/contract-usage/page.tsx` |
| Tipos | `types/merchant/`, `types/bankAccount*.ts` |
| Hooks | `hooks/merchants/`, `hooks/business/`, `hooks/bank-account/` |
| Ubicación | `components/location/`, `hooks/location/` |

- Crear un productor o una finca invalida `merchants`. Guardar o eliminar un
  contrato invalida `producerContracts` y `producerContract`.
- Los selectores de país, provincia y ciudad son encadenados: cada uno pide su
  lista con el id del anterior (`hooks/location/`).

> No hay pantalla de edición de productor ni de cuenta: sus hooks `update*`
> existen pero ninguna pantalla los usa.
