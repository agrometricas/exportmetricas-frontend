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

---

### Importación CSV

`ImportProducerDrawer` sube un CSV a `POST /merchant/business/import`: una fila
por finca, con los datos del productor repetidos. El backend responde cuántas
filas entraron y el detalle de las que fallaron.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Formularios | `components/producer/addProducerForm.tsx`, `AddBusinessForm.tsx`, `AddBankAccountForm.tsx` |
| Envío | `components/producer/hooks/{useSubmitProducer, useSubmitBusiness}.ts` |
| Esquemas | `components/producer/schemas/{producer, business}.schema.ts` |
| Tablas y detalle | `components/producer/table-producer/`, `components/business/table-business/` |
| Selectores | `components/producer/{SelectProducer, ProducerSelectBase, InputFieldProducerSelect}.tsx`, `components/business/{SelectBusiness, …}.tsx` |
| Importación | `components/producer/ImportProducerDrawer.tsx`, `hooks/merchants/uploadMerchants.ts` |
| Logo del productor | `components/producer/{UploadLogoForm, UploadLogoFile}.tsx`, `hooks/merchants/uploadMerchantLogo.ts` |
| Páginas | `app/dashboard/producer/{producers, add-producer, fincas, add-fincas, add-bank-account, upload-logo}/page.tsx` |
| Tipos | `types/merchant/`, `types/bankAccount*.ts` |
| Hooks | `hooks/merchants/`, `hooks/business/`, `hooks/bank-account/` |
| Ubicación | `components/location/`, `hooks/location/` |

- Crear un productor o una finca invalida `merchants`.
- Los selectores de país, provincia y ciudad son encadenados: cada uno pide su
  lista con el id del anterior (`hooks/location/`).

> No hay pantalla de edición de productor, finca ni cuenta: los hooks
> `update*` existen pero ninguna pantalla los usa.
