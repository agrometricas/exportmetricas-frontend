import { Grid, GridItem, Input, NumberInput, Field } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import { PesticideCocktailPart } from '../../../types/box-brand/post-harvest/pesticideCocktailPart';

interface InputFieldSentPesticideProps {
  name: string;
  pesticideSelected: Partial<PesticideCocktailPart>;
  quantity: number | '';
  placeholder?: string;
  showNumberInput?: boolean;
}

const InputFieldSentPesticide: React.FC<InputFieldSentPesticideProps> = ({
  name,
  pesticideSelected,
  quantity,
  placeholder,
  showNumberInput = true,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleBlur = (event: React.FocusEvent): void => {
    field.onBlur(event);

    helpers.setValue(Number(meta.value));
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      helpers.setValue(Number(field.value));
    }
  };

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched}>
      <Grid templateColumns='repeat(10, 1fr)' gap={5} alignItems='center'>
        <GridItem colSpan={2}>
          <Field.Label fontSize='sm' m={0} width={'100%'}>
            {`${pesticideSelected.pesticide?.name}: `}
          </Field.Label>
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            name={`${name}.activeIngredient`}
            p={'0px'}
            pl={'8px'}
            value={`${pesticideSelected.pesticide?.activeIngredient}`}
            readOnly={true}
            _hover={{ borderColor: 'gray.200' }}
            cursor={'not-allowed'}
            opacity={0.8}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            name={`${name}.dose`}
            p={'0px'}
            pl={'8px'}
            textAlign={'left'}
            value={`${pesticideSelected.pesticide?.dose}`}
            readOnly={true}
            _hover={{ borderColor: 'gray.200' }}
            cursor={'not-allowed'}
            opacity={0.8}
          />
        </GridItem>
        <GridItem colSpan={3}>
          <Input
            name={`${name}.presentation`}
            p={'0px'}
            pl={'8px'}
            value={`${pesticideSelected.pesticide?.presentation}`}
            readOnly={true}
            _hover={{ borderColor: 'gray.200' }}
            cursor={'not-allowed'}
            opacity={0.8}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            name={`${name}.need`}
            value={quantity}
            textAlign={'left'}
            p={'0px'}
            pl={'8px'}
            readOnly={true}
            _hover={{ borderColor: 'gray.200' }}
            cursor={'not-allowed'}
            opacity={0.8}
          />
        </GridItem>
        {showNumberInput && (
          <GridItem colSpan={1}>
            <NumberInput.Root {...field}>
              <NumberInput.Input
                {...field}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || pesticideSelected.pesticide?.name}
                textAlign='left'
                px={'16px'}
              />
            </NumberInput.Root>
          </GridItem>
        )}
      </Grid>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputFieldSentPesticide;
