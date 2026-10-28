import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useMiniPallets } from '@/hooks/box-brand/materials/minipallet/getMiniPallets';
import { MiniPalletType } from '@/types/box-brand/materials/minipallet';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface MiniPalletSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setMiniPallet?: (minipallet: Partial<MiniPalletType>) => void;
  onChange?: (newValue: Partial<MiniPalletType>) => void;
}

const MiniPalletSelectBase: React.FC<MiniPalletSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setMiniPallet,
  onChange,
}) => {
  const { data, isLoading, error } = useMiniPallets();

  const handleChange = (
    newValue: SingleValue<Partial<MiniPalletType>>
  ): void => {
    if (setMiniPallet) setMiniPallet(newValue as Partial<MiniPalletType>);
    if (onChange) onChange(newValue as Partial<MiniPalletType>);
  };

  return (
    <CatalogSelect<Partial<MiniPalletType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error
          ? serverErrorMessage(error)
          : 'Ya no hay mini pallet/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default MiniPalletSelectBase;
