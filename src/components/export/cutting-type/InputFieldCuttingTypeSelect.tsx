import { Flex, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import CuttingTypeSelectBase from './CuttingTypeSelectBase';
import { CuttingType } from '../../../types/cuttingType';

interface InputFieldCuttingTypeSelectProps {
  name: string;
  label: string;
  placeholder: string;
  flexDirection?: 'column' | 'row';
  setCuttingType?: (cuttingType: Partial<CuttingType>) => void;
}

const InputFieldCuttingTypeSelect: React.FC<
  InputFieldCuttingTypeSelectProps
> = ({ name, label, placeholder, setCuttingType, flexDirection = 'column' }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Flex
        flexDirection={flexDirection}
        alignItems={flexDirection === 'row' ? 'center' : 'flex-start'}
      >
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
        <Flex
          flex={label ? '2' : '1'}
          width='100%'
          marginLeft={label ? '0' : '0'}
        >
          <CuttingTypeSelectBase
            name={name}
            placeholder={placeholder}
            onChange={(newValue) => helpers.setValue(newValue?.id)}
            field={field}
            setCuttingType={setCuttingType}
          />
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

export default InputFieldCuttingTypeSelect;
