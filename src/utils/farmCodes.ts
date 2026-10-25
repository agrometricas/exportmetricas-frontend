import * as Yup from 'yup';

const FARM_CODES = {
  MAGAP: {
    pattern: /^[A-Za-z0-9]{6}$/,
    message: 'Debe tener 6 letras o números, sin espacios',
  },
  AGROCALIDAD: {
    pattern: /^[A-Za-z0-9]{6,12}$/,
    message: 'Debe tener de 6 a 12 letras o números, sin espacios',
  },
} as const;

export type FarmCodeKind = keyof typeof FARM_CODES;

export const FARM_CODE_LABELS: Record<FarmCodeKind, string> = {
  MAGAP: 'Código MAGAP (6 caracteres)',
  AGROCALIDAD: 'Código AGROCALIDAD (6 a 12 caracteres)',
};

export function isFarmCode(kind: FarmCodeKind, code: string): boolean {
  return FARM_CODES[kind].pattern.test(code);
}

// The backend checks only a code that changed, so a farm saved before the
// rule keeps its code when anything else is edited.
export function farmCodeSchema(
  kind: FarmCodeKind,
  saved?: string
): Yup.StringSchema<string> {
  return Yup.string()
    .trim()
    .required('Requerido')
    .test(
      'farm-code',
      FARM_CODES[kind].message,
      (value) => !value || value === saved || isFarmCode(kind, value)
    );
}
