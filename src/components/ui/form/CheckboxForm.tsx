import { Checkbox, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface CheckboxProps {
  name: string;
  label: string;
  onChange?: (checked: boolean) => void;
}

const CheckboxForm: React.FC<CheckboxProps> = ({ name, label, onChange }) => {
  const [field, meta, helpers] = useField<boolean>(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Checkbox.Root
        name={name}
        checked={!!field.value}
        onCheckedChange={({ checked }) => {
          helpers.setValue(checked === true);
          onChange?.(checked === true);
        }}
        colorPalette='green'
      >
        <Checkbox.HiddenInput onBlur={field.onBlur} />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>{label}</Checkbox.Label>
      </Checkbox.Root>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default CheckboxForm;
