import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { usePallets } from '@/hooks/box-brand/materials/pallet/getPallets';
import { PalletType } from '@/types/box-brand/materials/pallet';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface PalletSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setPallet?: (pallet: Partial<PalletType>) => void;
  onChange?: (newValue: Partial<PalletType>) => void;
}

const PalletSelectBase: React.FC<PalletSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setPallet,
  onChange,
}) => {
  const { data, isLoading, error } = usePallets();

  const handleChange = (newValue: SingleValue<Partial<PalletType>>): void => {
    if (setPallet) setPallet(newValue as Partial<PalletType>);
    if (onChange) onChange(newValue as Partial<PalletType>);
  };

  return (
    <CatalogSelect<Partial<PalletType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay pallet/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default PalletSelectBase;
