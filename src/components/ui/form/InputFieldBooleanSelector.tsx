import { NativeSelect, Field } from '@chakra-ui/react';
import { useField } from 'formik';

interface InputFieldBooleanSelectorProps {
  name: string;
  label: string;
  placeholder?: string;
}

const options = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

const InputFieldBooleanSelector: React.FC<InputFieldBooleanSelectorProps> = ({
  name,
  label,
  placeholder,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    const boolValue = value === 'true';
    helpers.setValue(boolValue);
  };

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        {label}
      </Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field {...field} onChange={handleChange}>
          {!!placeholder ? (
            <option value={''}>{placeholder}</option>
          ) : (
            <option value={''}>{label}</option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldBooleanSelector;
