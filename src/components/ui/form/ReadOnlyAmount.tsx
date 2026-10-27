import { Input, InputGroup, Field } from '@chakra-ui/react';
import React from 'react';

interface ReadOnlyAmountProps {
  label: string;
  value?: number;
}

const ReadOnlyAmount: React.FC<ReadOnlyAmountProps> = ({ label, value }) => {
  return (
    <Field.Root w='100%'>
      <Field.Label fontSize='sm' mb={'8px'}>
        {label}
      </Field.Label>
      <InputGroup
        w='100%'
        startElement={<>$</>}
        startElementProps={{
          pointerEvents: 'none',
          color: 'fg.subtle',
          fontSize: '1.2em',
        }}
      >
        <Input
          readOnly
          textAlign='right'
          placeholder={label}
          value={value === undefined ? '' : value.toFixed(2)}
        />
      </InputGroup>
    </Field.Root>
  );
};

export default ReadOnlyAmount;
