import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import DepositSelectBase from './DepositSelectBase';
import { DepositResponse } from '../../types/deposit/deposit.response';

interface InputFieldDepositSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setDeposit?: (deposit: Partial<DepositResponse>) => void;
}

const InputFieldDepositSelect: React.FC<InputFieldDepositSelectProps> = ({
  name,
  label,
  placeholder,
  setDeposit,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <DepositSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setDeposit={setDeposit}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldDepositSelect;
