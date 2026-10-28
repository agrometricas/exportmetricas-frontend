import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useStickers } from '../../../../hooks/box-brand/additions/sticker/getStickers';
import { StickerType } from '../../../../types/box-brand/additions/sticker';

interface StickerSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setSticker?: (sticker: Partial<StickerType>) => void;
  onChange?: (newValue: Partial<StickerType>) => void;
}

const StickerSelectBase: React.FC<StickerSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setSticker,
  onChange,
}) => {
  const { data = [], isLoading, error } = useStickers();

  useEffect(() => {
    if (!!setSticker)
      setSticker(
        (data as Partial<StickerType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<StickerType>
      );
  }, [field?.value, setSticker, data]);

  const handleChange = (newValue: SingleValue<Partial<StickerType>>): void => {
    if (setSticker) {
      setSticker(newValue as Partial<StickerType>);
    }
    if (onChange) {
      onChange(newValue as Partial<StickerType>);
    }
  };

  return (
    <CatalogSelect<Partial<StickerType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay stickers disponibles'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<StickerType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default StickerSelectBase;
