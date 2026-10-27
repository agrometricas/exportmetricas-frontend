import { chakra } from '@chakra-ui/react';

// The label, error and helper of a Field need a Field.Root around them; these
// look the same and stand alone, for a label over a read-only value.
export const FormLabel = chakra('label', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    textAlign: 'start',
    textStyle: 'sm',
    fontWeight: 'medium',
    userSelect: 'none',
    mb: '2',
  },
});

export const FormErrorText = chakra('div', {
  base: { textStyle: 'xs', color: 'fg.error', mt: '2' },
});

export const FormHelperText = chakra('div', {
  base: { textStyle: 'xs', color: 'fg.muted', mt: '2' },
});
