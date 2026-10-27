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
import SelectSheet from './SelectSheet';
import { SheetProps } from '../../AddBoxBrandsForm';

interface Props {
  name: string;
  sheets: SheetProps[];
}

const SelectSheetBanContainer = ({
  name,
  sheets,
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
        Hojas{' '}
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
            {sheets.map((_sheet, index) => {
              isBan && remove(index);

              return (
                <div key={index}>
                  <SelectSheet
                    key={index}
                    name1={`${name}[${index}].sheetId`}
                    name2={`${name}[${index}].quantity`}
                    isDisabledRemove={sheets.length === 1}
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
                onClick={() => push({ sheetId: '', quantity: '' })}
              >
                Agregar Hojas
              </Button>
            </SimpleGrid>
          </>
        )}
      </FieldArray>
    </>
  );
};

export default SelectSheetBanContainer;
