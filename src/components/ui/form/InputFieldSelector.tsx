import { Flex, NativeSelect, Field } from '@chakra-ui/react';
import { useField } from 'formik';

interface OptionsProps {
  name: string;
  id: number | string;
}

interface InputFieldSelectorProps {
  name: string;
  label: string;
  options: OptionsProps[];
  placeholder?: string;
  isDisabled?: boolean;
  flexDirection?: 'column' | 'row';
  alignItems?: 'flex-start' | 'flex-end';
}

const InputFieldSelector: React.FC<InputFieldSelectorProps> = ({
  name,
  label,
  options,
  placeholder = 'Seleccione una opción',
  isDisabled,
  flexDirection = 'column',
}) => {
  const [field, meta] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched} width={'100%'}>
      <Flex
        flexDirection={flexDirection}
        alignItems={flexDirection === 'row' ? 'center' : 'flex-start'}
      >
        {label && (
          <Flex
            flex={flexDirection === 'row' ? '1' : 'none'}
            minWidth={flexDirection === 'row' ? '15%' : '100%'}
            maxWidth={flexDirection === 'row' ? '25%' : '100%'}
            alignItems='center'
            marginRight={flexDirection === 'row' ? '2%' : '0'}
            mb={flexDirection === 'column' ? '8px' : '0'}
          >
            <Field.Label
              fontSize='sm'
              m={0}
              textAlign={flexDirection === 'row' ? 'left' : 'center'}
              overflow='hidden'
            >
              {label}
            </Field.Label>
          </Flex>
        )}
        <Flex
          flex={label ? '2' : '1'}
          width='100%'
          marginLeft={label ? '0' : '0'}
        >
          <NativeSelect.Root disabled={isDisabled}>
            <NativeSelect.Field {...field}>
              <option value={!isDisabled ? '' : 'N/A'}>
                {!isDisabled ? placeholder : `N/A`}
              </option>
              {options.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      </Flex>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldSelector;
