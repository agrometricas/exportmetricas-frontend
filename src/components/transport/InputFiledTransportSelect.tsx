import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import TransportSelectBase from './TransportSelectBase';
import { TransportResponse } from '../../types/transport/transport.response';

interface InputFieldTransportSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setTransport?: (transport: Partial<TransportResponse>) => void;
}

const InputFieldTransportSelect: React.FC<InputFieldTransportSelectProps> = ({
  name,
  label,
  placeholder,
  setTransport,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <TransportSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setTransport={setTransport}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldTransportSelect;
