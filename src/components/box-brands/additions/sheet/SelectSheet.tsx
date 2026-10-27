import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldSheetSelect from './InputFieldSheetSelect';
import { SheetType } from '../../../../types/box-brand/additions/sheet';
import InputFieldQuantity from '../../../ui/form/InputFieldQuantity';

interface SelectSheetProps {
  name1: string;
  name2: string;
  isDisabledRemove?: boolean;
  sheetSelect?: Partial<SheetType>;
  setSheetSelect?: (sheet: Partial<SheetType> | null) => void;
  onClickRemove?: () => void;
}

const SelectSheet: React.FC<SelectSheetProps> = ({
  name1,
  name2,
  isDisabledRemove,
  sheetSelect,
  setSheetSelect,
  onClickRemove,
}) => {
  const [sheet, setSheet] = useState<Partial<SheetType> | null>(null);

  useEffect(() => {
    if (!!sheetSelect) {
      setSheet(sheetSelect);
    }
  }, [sheetSelect]);

  useEffect(() => {
    if (!!setSheetSelect) {
      setSheetSelect(sheet);
    }
  }, [sheet, setSheetSelect]);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
      <InputFieldSheetSelect
        name={name1}
        label={'Tipo de Hoja'}
        placeholder={'Seleccione el Tipo de Hoja'}
        setSheet={setSheet}
      />

      <InputFieldQuantity name={name2} label={'Cantidad'} />

      <Box></Box>

      <Box display='flex' alignItems='flex-end'>
        <Button
          variant='solid'
          colorPalette='red'
          disabled={isDisabledRemove}
          onClick={onClickRemove}
          width={'100%'}
        >
          Eliminar Sheet
        </Button>
      </Box>
    </SimpleGrid>
  );
};

export default SelectSheet;
