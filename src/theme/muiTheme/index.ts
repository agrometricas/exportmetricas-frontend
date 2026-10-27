import { createTheme, Theme } from '@mui/material/styles';

// Material React Table renders with MUI: the same brand tokens as the Chakra
// system (src/theme/system.ts), so tables match the page in light and dark.
const BRAND = {
  light: {
    primary: '#0D9E55',
    background: '#F8FBFD',
    paper: '#FFFFFF',
    text: '#33454F',
    secondaryText: '#6B8299',
    divider: '#DBE3EA',
  },
  dark: {
    primary: '#4BD184',
    background: '#07111B',
    paper: '#0F1D2C',
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
      background: { default: colors.background, paper: colors.paper },
      text: { primary: colors.text, secondary: colors.secondaryText },
      divider: colors.divider,
    },
    typography: { fontFamily: 'var(--font-inter), system-ui, sans-serif' },
    shape: { borderRadius: 10 },
  });
}
