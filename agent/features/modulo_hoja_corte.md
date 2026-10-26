# Módulo Hojas de Corte (Calidad)

> Reglas autoritativas del backend; aquí se anota cómo la web pide la hoja de
> corte de un embarque y mantiene los catálogos de calidad.

### Propósito

Generar la **hoja de corte**: el PDF con las instrucciones de corte, empaque y
paletizado que recibe el productor. El PDF lo arma el backend; la web elige el
tipo de corte, completa tres datos y dispara la generación.

---

### Modelos (campos que envía/lee la web)

**Tipo de corte (`cuttingType`):** `boxBrandId`, `quality`, `shipmentType`,
`leavesAtHarvest`, `maxAgeAtCut`, `minCaliber`, `maxCaliber`, `fingerLength`,
`saneos`, `cunas`, `clusterDetail`, `labelDetail`, `firstLine` … `fourthLine`,
`packagingPattern`, `palletDetail`, `cornerProtectorsDetail`,
`reinforcementsDetail`, `plasticStrapsDetail`, `staplesDetail`,
`blockingSheetsDetail`, `transportDetail`, `generalObservations?`. Casi todo es
texto libre que se imprime tal cual.

La calidad y los saneos salen de `GET /cutting-type/options`
(`useCuttingTypeOptions`): la calidad se elige de la lista (Primera o Segunda)
y los saneos se eligen de sus sugerencias (1, 2, N/A) o se escribe otro valor,
de hasta 30 caracteres.

Un tipo de corte se edita desde *Editar* en su fila
(`/dashboard/box-brands/cutting-types/[id]`): el mismo formulario del alta,
cargado con `GET /cutting-type/:id`, guarda con `PUT /cutting-type/:id`. Los
valores del formulario y el body salen de `utils/cuttingTypeForm.ts`; un valor
guardado que no está en las listas de líneas o de patrón de empaque se sigue
ofreciendo (`optionsWithSaved`). Guardar invalida `cuttingTypes` y
`cuttingType`. Las hojas ya generadas no cambian.

Dos campos del tipo de corte se rotulan distinto de lo que su nombre sugiere:
`shipmentType` es *Nombre del Tipo de Corte* y `transportDetail` es *Detalle del
Termógrafo*.

Valores habituales, útiles para revisar lo que se escribe: calibre de 39 a 46
grados, largo de dedo de 9 pulgadas, de 2 a 4 cuñas por caja y de 3 a 6 dedos
por clúster.

**Hoja de corte:** `exportSentId`, `cuttingTypeId`, `palletsHeight`,
`containerPositioning`, `belowDeck`. El listado trae además `version` (1 al
crearla) y `correctionReason`, el motivo de la última corrección.

**Corrección:** `cuttingTypeId`, `palletsHeight`, `containerPositioning`,
`belowDeck` y `reason` (obligatorio, hasta 300 caracteres).

**Verificadora:** `name`, `ruc`, `address`, `contacts[]`.

---

### Workflow (que la web orquesta)

```
Agregar Hojas de Corte: lista GET /export/cutting-sheet/pending
        ↓ elegir un envío de insumos
/export/add-cutting-sheet/[id]: resumen del embarque + formulario
        ↓
POST /export/cutting-sheet  →  { id, version, pdfUrl, emailRecipients }
        ↓
el envío sale de pendientes; la hoja aparece en "Hojas de Corte"
        ↓ "Corregir" en la fila
/export/cutting-sheets/[id]: datos actuales de la hoja + motivo
        ↓
PUT /export/cutting-sheets/:id  →  { id, version, pdfUrl, emailRecipients }
```

- El formulario muestra el embarque en solo lectura (`DisplayField`,
  `ReadOnlyDateGrid`) para revisar antes de generar.
- El backend envía el PDF por correo a la exportadora, al cliente, al productor
  y a cada contacto de la finca que tenga correo; la respuesta trae la lista en
  `emailRecipients`.
- Hay una hoja por envío de insumos. Si hay que cambiarla, se **corrige**: el
  backend la vuelve a dibujar con el mismo número como versión siguiente,
  marcada CORREGIDA, y la reenvía. El enlace de los correos anteriores abre la
  versión vigente.
- La tabla muestra la versión (*Original* o *CORREGIDA vN*); el detalle de la
  fila, el motivo de la última corrección.
- La pantalla de corrección busca la hoja en el listado ya cargado (no hay
  detalle por id) y parte de sus valores; el motivo empieza vacío.
- Las opciones de altura de pallets y de posición del contenedor, el *bajo
  cubierta* que sale de la posición y si la alícuota lleva pallets
  (`boxBrandHasPallets`) están en `utils/cuttingSheetOptions.ts` para el alta,
  la corrección y el lote.

### Hojas por lote

Con dos o más hojas pendientes, arriba de la lista aparece *Generar varias a
la vez* (`CuttingSheetBatchPanel`): una fila por envío, ordenada por fecha de
corte, con su tipo de corte, su altura de pallets y su posición.

- El tipo de corte ofrece los de la alícuota (o todos si no tiene) y queda
  elegido si es uno solo; la altura queda en N/A si la alícuota no lleva
  pallets (`initialSheetRow`, `utils/cuttingSheetBatch.ts`)
- *Posición para las elegidas* y *Altura para las que llevan pallets* llenan
  de una vez las filas marcadas. Cambiar un valor de una fila la marca
- *Generar las hojas (N)* se habilita cuando cada fila marcada tiene sus tres
  valores; un modal recuerda que cada hoja sale por correo antes de mandar
  `POST /export/cutting-sheet/batch` con `sheetBatchBody`
- La respuesta `{ created, failed }` deja un aviso con el enlace al PDF de
  cada hoja generada y otro con las que quedaron pendientes y por qué; esas
  siguen marcadas. La petición lleva su propio timeout de tres minutos

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Lista de pendientes | `components/export/cutting-sheet/{PendingCuttingSheetList, PendingCuttingSheetCard}.tsx` |
| Hojas por lote | `components/export/cutting-sheet/CuttingSheetBatchPanel.tsx`, `hooks/export/cuttingSheet/createCuttingSheetBatch.ts`, `utils/cuttingSheetBatch.ts`, `types/cuttingSheetBatch.ts` |
| Formulario | `components/export/cutting-sheet/CuttingSheetForm.tsx` |
| Corrección | `components/export/cutting-sheet/CorrectCuttingSheetForm.tsx` |
| Vista del embarque | `components/export/cutting-sheet/{DisplayField, ReadOnlyDateGrid}.tsx` |
| Hojas generadas | `components/export/cutting-sheet/table-cutting-sheets/` |
| Tipos de corte | `components/export/cutting-type/` |
| Verificadoras | `components/verifier/` |
| Páginas | `app/dashboard/export/{cutting-sheets, cutting-sheets/[id], add-cutting-sheet, add-cutting-sheet/[id]}/page.tsx`, `app/dashboard/box-brands/{cutting-types, cutting-types/[id], add-cutting-type, verifiers, add-verifier}/page.tsx` |
| Tipos | `types/cuttingSheet*.ts`, `types/cuttingType.ts`, `types/verifier/` |
| Hooks | `hooks/export/cuttingSheet/`, `hooks/export/cutting-type/`, `hooks/verifier/` |

- Generar la hoja invalida `cuttingSheets` y `cuttingSheetsPending`; corregirla
  invalida `cuttingSheets`.
- `hooks/export/cuttingSheet/getExportsSentPending.ts` exporta
  `useCuttingSheetsPending`: el nombre del archivo no coincide con el del hook.
- `next.config.js` permite imágenes de `*.r2.cloudflarestorage.com`, de donde
  vienen logos y artes como URLs firmadas que caducan a las dos horas. El
  optimizador de imágenes de Next está apagado (`images.unoptimized`): el
  navegador las pide directo a R2.

> En el menú este módulo es *Calidad*. Sus pantallas están repartidas entre
> `/dashboard/export/` (hojas) y `/dashboard/box-brands/` (tipos de corte y
> verificadoras). Verificadoras y tipos de corte comparten la entrada
> *Verificadoras y Tipos de Corte*, con una pestaña cada uno
> (`QUALITY_CATALOG_TABS`).
