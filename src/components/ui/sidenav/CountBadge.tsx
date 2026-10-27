import { Badge } from '@chakra-ui/react';
import React from 'react';

interface WithCount {
  count?: number;
}

export function countOf(badge?: WithCount, count?: number): number | undefined {
  if (typeof count === 'number' && count > 0) return count;
  if (badge?.count && badge.count > 0) return badge.count;
  return undefined;
}

export function CountBadge({
  value,
}: {
  value?: number;
}): React.JSX.Element | null {
  if (!value) return null;
  return (
    <Badge
      colorPalette='red'
      variant='solid'
      size='sm'
      rounded='full'
      minW='5'
      justifyContent='center'
    >
      {value > 99 ? '99+' : value}
    </Badge>
  );
}
