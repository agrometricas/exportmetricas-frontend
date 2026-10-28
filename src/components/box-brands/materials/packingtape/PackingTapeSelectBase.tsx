import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { usePackingTapes } from '@/hooks/box-brand/materials/packingtape/getPackingTapes';
import { PackingTapeType } from '@/types/box-brand/materials/packingtape';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface PackingTapeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setPackingTape?: (packingTape: Partial<PackingTapeType>) => void;
  onChange?: (newValue: Partial<PackingTapeType>) => void;
}

const PackingTapeSelectBase: React.FC<PackingTapeSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setPackingTape,
  onChange,
}) => {
  const { data, isLoading, error } = usePackingTapes();

  const handleChange = (
    newValue: SingleValue<Partial<PackingTapeType>>
  ): void => {
    if (setPackingTape) setPackingTape(newValue as Partial<PackingTapeType>);
    if (onChange) onChange(newValue as Partial<PackingTapeType>);
  };

  return (
    <CatalogSelect<Partial<PackingTapeType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error
          ? serverErrorMessage(error)
          : 'Ya no hay packingTape/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default PackingTapeSelectBase;
