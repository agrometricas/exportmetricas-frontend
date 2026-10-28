import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import ClientByHarborSelectBase from './ClientByHarborSelectBase';
import ClientSelectBase from './ClientSelectBase';
import { ClientResponse } from '../../types/client.response';

interface InputFieldClientSelectProps {
  name: string;
  label: string;
  placeholder: string;
  harbor?: number;
  isHarbor?: boolean;
  setClient?: (client: Partial<ClientResponse>) => void;
}

const InputFieldClientSelect: React.FC<InputFieldClientSelectProps> = ({
  name,
  label,
  placeholder,
  harbor,
  isHarbor,
  setClient,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      {isHarbor && (
        <ClientByHarborSelectBase
          name={name}
          placeholder={placeholder}
          onChange={(newValue) => helpers.setValue(newValue?.id)}
          field={field}
          setClient={setClient}
          harbor={harbor}
        />
      )}

      {!isHarbor && (
        <ClientSelectBase
          name={name}
          placeholder={placeholder}
          onChange={(newValue) => helpers.setValue(newValue?.id)}
          field={field}
          setClient={setClient}
        />
      )}

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldClientSelect;
