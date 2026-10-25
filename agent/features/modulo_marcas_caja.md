# Módulo Alícuotas y Materiales (`box-brands`)

> Reglas autoritativas del backend; aquí se anota cómo la web arma una alícuota
> y mantiene los catálogos de materiales.

### Propósito

Definir cada tipo de caja que la exportadora despacha —la **alícuota**
(`boxBrand`)— eligiendo un material de cada tipo y su cantidad. De la alícuota
salen las cantidades que propone el envío de insumos y buena parte de lo que
imprime la hoja de corte.

---

### Modelo (campos que envía/lee la web)

**Alícuota:** `name`, `brandId`, `brandCode` (único), `boxQuantity`,
`netWeightBox`, `grossWeightBox`, `requiredCertificates[]`, y por cada tipo de
material un par `<material>Id` + `<material>Quantity`.

Pesticidas, insecticidas, stickers y hojas no van como un id sino como lista
(*cóctel*): `pesticides[]`, `insecticides[]`, `stickers[]`, `sheets[]`, cada
elemento con el id del material y su `quantity`.

La cantidad de cada pesticida es la fumigación de las cajas de la alícuota
(cajas × dosis). La calcula el backend: `SelectPesticide` la pide a
`GET /box-brand/fumigation-proposal?boxQuantity=` (`useFumigationProposal`,
con las cajas escritas tras una pausa) y la precarga; se puede cambiar.
Insecticidas, stickers y hojas se escriben a mano.

En el formulario `name` se rotula *Nickname* —el nombre con que la exportadora
identifica la caja—, `boxQuantity` es *Número de Cajas/Contenedor* y los dos
pesos se escriben en libras. La lista de alícuotas muestra cada peso en libras y
en kilos (`formatBoxWeight`, `utils/boxWeight.ts`), con los kilos que trae la
respuesta (`netWeightKg`, `grossWeightKg`).

**Marca (`brand`):** `name`. **Certificado requerido:** `name`.

---

### Grupos de materiales

La carpeta de componentes y la de hooks siguen la misma división:

| Carpeta | Tipos |
|---------|-------|
| `specifications/` | `brand`, `requiredCertificate` |
| `materials/` | `bottom`, `lid`, `cover`, `cardboard`, `paraseal`, `pad`, `sponge`, `label`, `band`, `sachet`, `rubber`, `protector`, `cluster-bag`, `pallet`, `minipallets`, `corner`, `reinforcement`, `packingtape` |
| `post-harvest/` | `pesticide` |
| `container/` | `staple`, `stripping`, `thermograph`, `seal`, `metto-label` |
| `additions/` | `latex-remover`, `insecticide`, `blocking-sheet`, `sticker`, `sheet`, `container-seal-plastic`, `security-kit`, `boarding-card` |

Cada tipo repite las mismas piezas:

```
Add<X>Form.tsx · Add<X>Modal.tsx · <X>SelectBase.tsx · InputField<X>Select.tsx
<X>SelectBanContainer.tsx
hooks/box-brand/<grupo>/<tipo>/{create<X>, get<X>s, get<X>?, update<X>?}.ts
```

Los tipos que van en cóctel suman un selector múltiple
(`InputField<X>MultiSelect`, `<X>MultiSelectBase`).

El modal permite crear un material nuevo **sin salir del formulario de la
alícuota**: se abre desde el selector, crea, invalida la lista y el material
queda disponible para elegir.

---

### Reglas de negocio

- Fondo, tapa, cubierta y cartulina son obligatorios; el resto es opcional.
- El `brandCode` no se repite.
- El nombre de un material no se repite.
- Etiqueta, bolsa de clúster y etiqueta metto llevan una imagen de arte.

### Unidades de los materiales

Configuraciones > **Unidades de Materiales** (`/dashboard/settings/material-units`)
elige en qué unidad se mide cada tipo de material. La lista de unidades, la
unidad de cada tipo y si es la de por defecto vienen del backend
(`GET /settings/material-units`); guardar manda los 32 tipos (`PUT`).

- El formulario de alícuota rotula cada cantidad con esa unidad, abreviada y
  contra lo que se cuenta: `u/caja`, `ml/caja`, `rollo/cont.`. Qué tipo y qué
  base (caja o contenedor) tiene cada campo `…Quantity` está en
  `QUANTITY_FIELDS` (`utils/materialUnits.ts`).
- El detalle de la alícuota muestra el tipo y la unidad de cada material.
- La unidad es un rótulo: no cambia ningún número ni convierte cantidades.
- Las filas de materiales del formulario van en una columna hasta pantallas
  `xl`; en dos columnas el selector y la cantidad no entran lado a lado.

---

### Importación CSV

`ImportBoxBrandDrawer.tsx` ofrece las dos cargas:

| Qué | Hook | Endpoint |
|-----|------|----------|
| Alícuotas | `hooks/box-brand/uploadBoxBrands.ts` | `POST /box-brand/upload-csv` |
| Materiales | `hooks/box-brand/materials/uploadBoxBrandMaterials.ts` | `POST /box-brand/materials/import` |

En el CSV de materiales la columna `material_type` va **en español** (`fondo`,
`tapa`, `etiqueta`, …), no con el nombre del enum.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Formulario de alícuota | `components/box-brands/AddBoxBrandsForm.tsx` |
| Tabla y detalle | `components/box-brands/table-box-brand/` |
| Selector de alícuota | `components/box-brands/{SelectBoxBrand, BoxBrandSelectBase, InputFieldBoxBrandSelect}.tsx` |
| Logo de la alícuota | `components/box-brands/UploadLogoForm.tsx`, `hooks/box-brand/uploadBoxBrandLogo.ts` |
| Materiales | `components/box-brands/{specifications, materials, post-harvest, container, additions}/` |
| Páginas | `app/dashboard/box-brands/{search, add-box-brand, add-brand, upload-logo}/page.tsx` |
| Tipos | `types/box-brand/` |
| Hooks | `hooks/box-brand/` |
| Etiquetas y orden de tipos | `utils/materialTypeLabels.ts` |
| Unidades | `components/settings/material-units/`, `hooks/settings/materialUnits.ts`, `utils/materialUnits.ts` |

- `utils/materialTypeLabels.ts` traduce cada `MaterialType` a su nombre en
  pantalla (`MATERIAL_TYPE_LABELS`) y fija el orden en que se listan
  (`MATERIAL_TYPE_ORDER`); lo usan las pantallas de Bodega.
- `SelectBoxBrand` elige la alícuota y, si recibe `name2`, pide el número de
  cajas. Los formularios de liquidación le pasan como `children` el precio y el
  monto, para que queden en la misma grilla.

> No hay pantalla para editar una alícuota. En el menú este módulo se llama
> *Materiales* y sus ítems *Alícuotas*.
