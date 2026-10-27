import {
  Grid,
  GridItem,
  Input,
  InputGroup,
  NumberInput,
  Field,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import { StickerCocktail } from '../../../types/box-brand/additions/sticker';

interface InputFieldSentStickerProps {
  name: string;
  stickerSelected: Partial<StickerCocktail>;
  quantity: number | '';
  placeholder?: string;
  showNumberInput?: boolean;
  unit?: string;
}

const InputFieldSentSticker: React.FC<InputFieldSentStickerProps> = ({
  name,
  stickerSelected,
  quantity,
  placeholder,
  showNumberInput = true,
  unit,
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
      <Grid templateColumns='repeat(10, 1fr)' alignItems='center'>
        <GridItem colSpan={2}>
          <Field.Label fontSize='sm' m={0} width={'100%'}>
            {`${stickerSelected.sticker?.name}: `}
          </Field.Label>
        </GridItem>
        <GridItem colSpan={4}></GridItem>
        <GridItem colSpan={2}>
          <Input
            name={`${name}.need`}
            value={quantity}
            textAlign={'left'}
            p={'0px'}
            pl={'16px'}
            readOnly={true}
            _hover={{ borderColor: 'gray.200' }}
            cursor={'not-allowed'}
            opacity={0.8}
          />
        </GridItem>
        {showNumberInput && (
          <GridItem colSpan={2} pl={'4px'}>
            <InputGroup
              width={'100%'}
              endElement={unit ? unit : undefined}
              endElementProps={{
                pointerEvents: 'none',
                color: 'gray.500',
                fontSize: '1em',
                mr: '8px',
              }}
            >
              <NumberInput.Root {...field}>
                <NumberInput.Input
                  {...field}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder || stickerSelected.sticker?.name}
                  textAlign='left'
                />
              </NumberInput.Root>
            </InputGroup>
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

export default InputFieldSentSticker;
