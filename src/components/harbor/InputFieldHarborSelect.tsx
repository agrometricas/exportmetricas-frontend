import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import HarborSelectBase from './HarborSelectBase';
import { HarborType } from '../../types/harbor';

interface InputFieldHarborSelectProps {
  name: string;
  label: string;
  placeholder: string;
  type: 'Nacional' | 'Internacional';
  setHarbor?: (harbor: Partial<HarborType>) => void;
}

const InputFieldHarborSelect: React.FC<InputFieldHarborSelectProps> = ({
  name,
  label,
  placeholder,
  type,
  setHarbor,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <HarborSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setHarbor={setHarbor}
        type={type}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldHarborSelect;
