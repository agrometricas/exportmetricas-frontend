import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import BoxBrandSelectBase from './BoxBrandSelectBase';
import { BoxBrandType } from '../../types/box-brand/boxBrand';

interface InputFieldBoxBrandSelectProps {
  name: string;
  label: string;
  placeholder: string;
  setBoxBrand?: (brand: Partial<BoxBrandType>) => void;
}

const InputFieldBoxBrandSelect: React.FC<InputFieldBoxBrandSelectProps> = ({
  name,
  label,
  placeholder,
  setBoxBrand,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>

      <BoxBrandSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
        setBoxBrand={setBoxBrand}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldBoxBrandSelect;
