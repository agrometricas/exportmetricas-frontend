import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldStickerSelect from './InputFieldStickerSelect';
import { StickerType } from '../../../../types/box-brand/additions/sticker';
import InputFieldQuantity from '../../../ui/form/InputFieldQuantity';

interface SelectStickerProps {
  name1: string;
  name2: string;
  isDisabledRemove?: boolean;
  stickerSelect?: Partial<StickerType>;
  setStickerSelect?: (sticker: Partial<StickerType> | null) => void;
  onClickRemove?: () => void;
}

const SelectSticker: React.FC<SelectStickerProps> = ({
  name1,
  name2,
  isDisabledRemove,
  stickerSelect,
  setStickerSelect,
  onClickRemove,
}) => {
  const [sticker, setSticker] = useState<Partial<StickerType> | null>(null);

  useEffect(() => {
    if (!!stickerSelect) {
      setSticker(stickerSelect);
    }
  }, [stickerSelect]);

  useEffect(() => {
    if (!!setStickerSelect) {
      setStickerSelect(sticker);
    }
  }, [sticker, setStickerSelect]);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
      <InputFieldStickerSelect
        name={name1}
        label={'Sticker'}
        placeholder={'Selecciona el Sticker'}
        setSticker={setSticker}
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
          Eliminar Sticker
        </Button>
      </Box>
    </SimpleGrid>
  );
};

export default SelectSticker;
