import { Input, InputGroup, IconButton, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface InputFieldProps {
  name: string;
  label: string;
}

const InputFieldPassword: React.FC<InputFieldProps> = ({ name, label }) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = (): void => setShowPassword((prev) => !prev);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>
      <InputGroup
        endElement={
          <>
            <IconButton
              size='md'
              variant='ghost'
              aria-label={
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              onClick={toggleShowPassword}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </IconButton>
          </>
        }
      >
        <Input
          {...field}
          type={showPassword ? 'text' : 'password'}
          placeholder={label}
        />
      </InputGroup>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldPassword;
