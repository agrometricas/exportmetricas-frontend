import {
  Box,
  Button,
  IconButton,
  SimpleGrid,
  Separator,
} from '@chakra-ui/react';
import { FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaBan } from 'react-icons/fa';
import { FormSubsectionTitle } from '@/components/ui/form/FormSection';
import SelectSticker from './SelectSticker';
import { StickerProps } from '../../AddBoxBrandsForm';

interface Props {
  name: string;
  stickers: StickerProps[];
}

const SelectStickerBanContainer = ({
  name,
  stickers,
}: Props): React.JSX.Element => {
  const [isBan, setIsBan] = useState(false);
  const [firstChange, setFirstChange] = useState(false);

  useEffect(() => {
    if (isBan && !firstChange) {
      setFirstChange(true);
    }
  }, [isBan, firstChange]);

  const setBanState = (): void => {
    setIsBan((prevState) => !prevState);
  };

  return (
    <>
      <FormSubsectionTitle>
        Sticker de trazabilidad{' '}
        {
          <IconButton
            rounded='full'
            ml={'5px'}
            colorPalette={!!isBan ? 'orange' : 'gray'}
            aria-label='Ban'
            size='xs'
            variant={'outline'}
            onClick={setBanState}
          >
            <FaBan size={'20px'} />
          </IconButton>
        }
      </FormSubsectionTitle>
      <FieldArray name={name}>
        {({ push, remove }) => (
          <>
            {stickers.map((_sticker, index) => {
              isBan && remove(index);

              return (
                <div key={index}>
                  <SelectSticker
                    key={index}
                    name1={`${name}[${index}].stickerId`}
                    name2={`${name}[${index}].quantity`}
                    isDisabledRemove={stickers.length === 1}
                    onClickRemove={() => {
                      remove(index);
                    }}
                  />
                  <Separator
                    mt={'16px'}
                    mb={'8px'}
                    borderWidth={'2px'}
                    variant={'dashed'}
                  />
                </div>
              );
            })}
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <Box></Box>
              <Button
                disabled={isBan}
                onClick={() => push({ stickerId: '', quantity: '' })}
              >
                Agregar sticker
              </Button>
            </SimpleGrid>
          </>
        )}
      </FieldArray>
    </>
  );
};

export default SelectStickerBanContainer;
