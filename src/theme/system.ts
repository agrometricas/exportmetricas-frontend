import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// Tokens of the brand design system (design-system.md at the repo root of
// agrometricas). Gray is the brand's slate, so every default component that
// reads gray (borders, muted text, surfaces) comes out in the brand's tone.
const slate = {
  25: { value: '#F8FBFD' },
  50: { value: '#EEF2F6' },
  100: { value: '#E1E9F0' },
  200: { value: '#DBE3EA' },
  300: { value: '#BDD0DF' },
  400: { value: '#97ADC0' },
  500: { value: '#6B8299' },
  600: { value: '#4E6478' },
  700: { value: '#33454F' },
  800: { value: '#17314D' },
  900: { value: '#0F1D2C' },
  950: { value: '#07111B' },
};

const config = defineConfig({
  globalCss: {
    'html, body': { bg: 'bg.canvas', color: 'fg', fontFamily: 'body' },
    '.num': { fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  },
  theme: {
    tokens: {
      colors: {
        green: {
          50: { value: '#E9F8F0' },
          100: { value: '#C6F7DA' },
          200: { value: '#9DF0BE' },
          300: { value: '#6FE3A3' },
          400: { value: '#4BD184' },
          500: { value: '#22B96A' },
          600: { value: '#0D9E55' },
          700: { value: '#0D7A4A' },
          800: { value: '#0A5C39' },
          900: { value: '#073B25' },
          950: { value: '#052A1B' },
        },
        slate,
        gray: slate,
      },
      fonts: {
        heading: { value: 'var(--font-inter), system-ui, sans-serif' },
        body: { value: 'var(--font-inter), system-ui, sans-serif' },
      },
      radii: {
        sm: { value: '6px' },
        md: { value: '10px' },
        lg: { value: '16px' },
        xl: { value: '24px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: {
            value: { _light: '{colors.slate.25}', _dark: '{colors.slate.950}' },
          },
          panel: { value: { _light: 'white', _dark: '{colors.slate.900}' } },
          thead: {
            value: { _light: '{colors.slate.50}', _dark: '{colors.slate.800}' },
          },
        },
        fg: {
          DEFAULT: {
            value: {
              _light: '{colors.slate.700}',
              _dark: '{colors.slate.100}',
            },
          },
          heading: { value: { _light: '{colors.slate.950}', _dark: 'white' } },
          muted: {
            value: {
              _light: '{colors.slate.500}',
              _dark: '{colors.slate.400}',
            },
          },
          brand: {
            value: {
              _light: '{colors.green.700}',
              _dark: '{colors.green.400}',
            },
          },
        },
        green: {
          solid: {
            value: {
              _light: '{colors.green.600}',
              _dark: '{colors.green.400}',
            },
          },
          contrast: { value: { _light: 'white', _dark: '{colors.slate.950}' } },
          fg: {
            value: {
              _light: '{colors.green.700}',
              _dark: '{colors.green.400}',
            },
          },
          muted: {
            value: {
              _light: '{colors.green.100}',
              _dark: '{colors.green.900}',
            },
          },
          subtle: {
            value: { _light: '{colors.green.50}', _dark: '{colors.green.950}' },
          },
          emphasized: {
            value: {
              _light: '{colors.green.200}',
              _dark: '{colors.green.800}',
            },
          },
          focusRing: {
            value: {
              _light: '{colors.green.600}',
              _dark: '{colors.green.400}',
            },
          },
        },
      },
      shadows: {
        sm: {
          value: {
            _light: '0 1px 2px rgba(7,17,27,.06)',
            _dark: '0 1px 2px rgba(0,0,0,.4)',
          },
        },
        md: {
          value: {
            _light: '0 4px 12px rgba(7,17,27,.08)',
            _dark: '0 4px 16px rgba(0,0,0,.45)',
          },
        },
        lg: {
          value: {
            _light: '0 12px 32px rgba(7,17,27,.10)',
            _dark: '0 30px 80px rgba(0,0,0,.35)',
          },
        },
      },
    },
    textStyles: {
      h1: {
        value: {
          fontSize: '30px',
          lineHeight: '36px',
          fontWeight: '700',
          letterSpacing: '-0.02em',
        },
      },
      h2: {
        value: {
          fontSize: '24px',
          lineHeight: '30px',
          fontWeight: '700',
          letterSpacing: '-0.02em',
        },
      },
      h3: {
        value: {
          fontSize: '19px',
          lineHeight: '26px',
          fontWeight: '600',
          letterSpacing: '-0.02em',
        },
      },
      body: {
        value: { fontSize: '14px', lineHeight: '21px', fontWeight: '400' },
      },
      caption: {
        value: { fontSize: '12px', lineHeight: '16px', fontWeight: '500' },
      },
      overline: {
        value: {
          fontSize: '11px',
          lineHeight: '14px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
