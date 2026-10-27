import { createTheme, Theme } from '@mui/material/styles';

// Material React Table renders with MUI: the same brand tokens as the Chakra
// system (src/theme/system.ts), so tables match the page in light and dark.
const BRAND = {
  light: {
    primary: '#0D9E55',
    surface: '#FFFFFF',
    thead: '#EEF2F6',
    text: '#33454F',
    secondaryText: '#6B8299',
    divider: '#DBE3EA',
  },
  dark: {
    primary: '#4BD184',
    surface: '#0F1D2C',
    thead: '#17314D',
    text: '#E1E9F0',
    secondaryText: '#97ADC0',
    divider: '#17314D',
  },
};

export function brandMuiTheme(mode: 'light' | 'dark'): Theme {
  const colors = BRAND[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      // Material React Table paints its rows with background.default.
      background: { default: colors.surface, paper: colors.surface },
      text: { primary: colors.text, secondary: colors.secondaryText },
      divider: colors.divider,
    },
    typography: { fontFamily: 'var(--font-inter), system-ui, sans-serif' },
    shape: { borderRadius: 10 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          elevation2: {
            boxShadow: 'none',
            border: `1px solid ${colors.divider}`,
            // Most lists sit inside a Chakra card, which already draws the edge.
            '.chakra-card__root &': { border: 'none', borderRadius: 0 },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: colors.divider,
            // A pinned column is see-through by default (the columns that
            // scroll under it show behind its text), and its ::before paints
            // near-white over the cell, also in the header and in dark mode.
            '&[data-pinned="true"]': {
              opacity: 1,
              backgroundColor: colors.surface,
            },
            '&&[data-pinned="true"]::before': {
              backgroundColor: 'transparent',
            },
          },
          head: {
            // Material React Table paints header cells through sx, which comes
            // after the theme: the doubled class outranks it.
            '&&': { backgroundColor: colors.thead },
            color: colors.secondaryText,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          },
        },
      },
    },
  });
}
