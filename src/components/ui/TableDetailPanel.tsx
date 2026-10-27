import { Box } from '@chakra-ui/react';
import React from 'react';

// Material React Table puts the panel in a cell as wide as all the columns.
// Sticky, and as wide as the visible table (cqw, see brandMuiTheme), it stays
// in view while the table scrolls sideways.
export default function TableDetailPanel({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Box position='sticky' left={0} width='100cqw' px={6}>
      {children}
    </Box>
  );
}
