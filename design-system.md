# Design system — app web de Exportmétricas

Traduce a Chakra UI v3 los tokens de la marca. La fuente de verdad es el
`design-system.md` de Agrométricas (raíz del monorepo `agrometricas`): este
archivo no redefine valores, dice dónde vive cada uno en el código.

El tema está en `src/theme/system.ts` (`createSystem` sobre la configuración por
defecto de Chakra) y lo monta `components/Providers.tsx`.

---

## Color

| Token de marca | En el código | Uso |
|---|---|---|
| Verde `green-50` … `green-900` | `green.50` … `green.900` | La escala de la marca. `colorPalette='green'` es el acento de toda la app |
| Pizarra `slate-25` … `slate-950` | `slate.*`, y también `gray.*` | `gray` apunta a la pizarra: los componentes de Chakra que usan gris salen en el tono de la marca |
| Primario (verde 600 en claro, 400 en oscuro) | `green.solid`, texto `green.contrast` | Botón primario: `colorPalette='green'` |
| Texto verde (700 en claro, 400 en oscuro) | `green.fg`, `fg.brand` | Enlaces y acentos de texto |

No hay segundo color de marca. `teal`, `blue` o `purple` como acento no se usan;
los estados usan las paletas semánticas de Chakra (`red`, `orange`, `green`).

### Superficies y texto (claro / oscuro)

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` | blanco | `slate.900` | Lo que pintan los componentes de Chakra (filas de tabla, selectores nativos, pestañas); en oscuro, Chakra lo dejaría negro |
| `bg.canvas` | `slate.25` | `slate.950` | Fondo de página |
| `bg.panel` | blanco | `slate.900` | Tarjeta, panel, modal |
| `bg.thead` | `slate.50` | `slate.800` | Encabezado de tabla |
| `fg` | `slate.700` | `slate.100` | Texto de cuerpo |
| `fg.heading` | `slate.950` | blanco | Títulos |
| `fg.muted` | `slate.500` | `slate.400` | Labels, ayudas, texto atenuado |
| `border` | (gris de Chakra = pizarra) | | Bordes y líneas de tabla |

Una pantalla no elige colores para claro y oscuro: usa estos tokens.
`useColorModeValue` queda solo para lo que no tiene token.

### Gráficos

Las series van en el orden de `CHART_SERIES` (`theme/chartColors.ts`): verde
`#0D9E55` y azul `#4A93E8`, los mismos en claro y en oscuro. Pasan el
validador de paleta contra `bg.panel` en los dos modos (banda de luminosidad,
separación para daltonismo y contraste de 3:1). Los ejes, la grilla y la
leyenda de recharts toman `fg.muted` y `border` por CSS, porque recharts pinta
con atributos SVG y el CSS les gana.

## CSS global

El sistema corre con las *cascade layers* de Chakra apagadas
(`disableLayers`): con capas, los estilos que llegan renderizados del servidor
pueden quedar antes de la declaración del orden, y el reset de Chakra les gana
a los componentes. Sin capas manda la especificidad de siempre: una clase le
gana a un selector de etiqueta. `app/globals.css` solo lleva reglas sobre
etiquetas (`html`, `body`, `a`).

## Tipografía

Inter, cargada con `next/font` (`--font-inter`). Estilos de texto del tema:
`h1` (30/36), `h2` (24/30), `h3` (19/26), `body` (14/21), `caption` (12/16) y
`overline` (11/14, mayúsculas, +0.06em) para encabezados de columna.

El título de la página es `h1` (`h2` en el celular), el de una sección de
formulario es `h3` y una subsección va a 16 px seminegrita. Una sección se
separa de la anterior con una línea y 24 px a cada lado.

Un número que se compara en columna lleva cifras tabulares y va a la derecha:
la clase `num`.

## Espaciado, radio y sombra

- Espaciado en base 4 de Chakra: `1`=4px, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32,
  `12`=48, `16`=64. Nada fuera de esa escala.
- Radios: los componentes de Chakra toman los de la marca por sus radios
  semánticos: `l1` 6px (badge, input chico), `l2` 10px (botón, input), `l3`
  16px (tarjeta, modal). Los radios base (`md`, `lg`, `xl`…) quedan en la escala
  de Chakra, que es con la que están escritas las pantallas.
- Sombras azuladas `sm`, `md`, `lg`; en oscuro la jerarquía la da la superficie.
  Una tarjeta lleva borde y `boxShadow='sm'`; un botón no se levanta al pasar el
  mouse.
- Un borde se escribe `borderWidth='1px'` y su color con `borderColor`: la
  abreviatura `border='1px solid'` pone el color del texto.

## Modo oscuro

Lo maneja `next-themes` (`components/ui/color-mode.tsx`); el selector está en
el menú del usuario. Las tablas de Material React Table toman el modo del mismo
lugar (`useMuiTheme`).
