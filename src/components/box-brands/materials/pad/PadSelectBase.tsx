import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { usePads } from '@/hooks/box-brand/materials/pad/getPads';
import { PadType } from '@/types/box-brand/materials/pad';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface PadSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setPad?: (pad: Partial<PadType>) => void;
  onChange?: (newValue: Partial<PadType>) => void;
}

const PadSelectBase: React.FC<PadSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setPad,
  onChange,
}) => {
  const { data, isLoading, error } = usePads();

  const handleChange = (newValue: SingleValue<Partial<PadType>>): void => {
    if (setPad) setPad(newValue as Partial<PadType>);
    if (onChange) onChange(newValue as Partial<PadType>);
  };

  return (
    <CatalogSelect<Partial<PadType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay pad/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default PadSelectBase;
