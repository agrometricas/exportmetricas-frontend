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

Dos campos del tipo de corte se rotulan distinto de lo que su nombre sugiere:
`shipmentType` es *Nombre del Tipo de Corte* y `transportDetail` es *Detalle del
Termógrafo*.

Valores habituales, útiles para revisar lo que se escribe: calibre de 39 a 46
grados, largo de dedo de 9 pulgadas, de 2 a 4 cuñas por caja, saneos 1, 2 o N/A,
y de 3 a 6 dedos por clúster.

**Hoja de corte:** `exportSentId`, `cuttingTypeId`, `palletsHeight`,
`containerPositioning`, `belowDeck`.

**Verificadora:** `name`, `ruc`, `address`, `contacts[]`.

---

### Workflow (que la web orquesta)

```
Agregar Hojas de Corte: lista GET /export/cutting-sheet/pending
        ↓ elegir un envío de insumos
/export/add-cutting-sheet/[id]: resumen del embarque + formulario
        ↓
POST /export/cutting-sheet  →  { success, pdfUrl, emailRecipients }
        ↓
el envío sale de pendientes; la hoja aparece en "Hojas de Corte"
```

- El formulario muestra el embarque en solo lectura (`DisplayField`,
  `ReadOnlyDateGrid`) para revisar antes de generar.
- El backend envía el PDF por correo a la exportadora, al cliente y al productor
  que tengan correo registrado; la respuesta trae la lista en `emailRecipients`.
- Una hoja no se regenera ni se edita: hay una por envío de insumos.

---

### En la app web (mapa de archivos)

| Pieza | Archivo |
|-------|---------|
| Lista de pendientes | `components/export/cutting-sheet/{PendingCuttingSheetList, PendingCuttingSheetCard}.tsx` |
| Formulario | `components/export/cutting-sheet/CuttingSheetForm.tsx` |
| Vista del embarque | `components/export/cutting-sheet/{DisplayField, ReadOnlyDateGrid}.tsx` |
| Hojas generadas | `components/export/cutting-sheet/table-cutting-sheets/` |
| Tipos de corte | `components/export/cutting-type/` |
| Verificadoras | `components/verifier/` |
| Páginas | `app/dashboard/export/{cutting-sheets, add-cutting-sheet, add-cutting-sheet/[id]}/page.tsx`, `app/dashboard/box-brands/{cutting-types, add-cutting-type, verifiers, add-verifier}/page.tsx` |
| Tipos | `types/cuttingSheet*.ts`, `types/cuttingType.ts`, `types/verifier/` |
| Hooks | `hooks/export/cuttingSheet/`, `hooks/export/cutting-type/`, `hooks/verifier/` |

- Generar la hoja invalida `cuttingSheets` y `cuttingSheetsPending`.
- `hooks/export/cuttingSheet/getExportsSentPending.ts` exporta
  `useCuttingSheetsPending`: el nombre del archivo no coincide con el del hook.
- `next.config.js` permite imágenes de `*.r2.cloudflarestorage.com`, de donde
  vienen logos y artes como URLs firmadas que caducan a las dos horas.

> En el menú este módulo es *Calidad*. Sus pantallas están repartidas entre
> `/dashboard/export/` (hojas) y `/dashboard/box-brands/` (tipos de corte y
> verificadoras).
