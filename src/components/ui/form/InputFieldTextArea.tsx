import { Text, Textarea, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface InputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const InputFieldTextArea: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
}) => {
  const [field, meta] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      {label && (
        <Field.Label fontSize='sm' mb='8px'>
          <Text display='flex' alignItems='center'>
            {label}
          </Text>
        </Field.Label>
      )}
      <Textarea {...field} placeholder={placeholder || label} />
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldTextArea;
