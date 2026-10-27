import { Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import AddBrandModal from './AddBrandModal';
import BrandSelectBase from './BrandSelectBase';

interface InputFieldBrandSelectProps {
  name: string;
  label: string;
  placeholder: string;
}

const InputFieldBrandSelect: React.FC<InputFieldBrandSelectProps> = ({
  name,
  label,
  placeholder,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px' h={'21px'}>
        {label} <AddBrandModal />
      </Field.Label>

      <BrandSelectBase
        name={name}
        placeholder={placeholder}
        onChange={(newValue) => helpers.setValue(newValue?.id)}
        field={field}
      />

      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldBrandSelect;
