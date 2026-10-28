import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useBands } from '../../../../hooks/box-brand/materials/band/getBands';
import { BandType } from '../../../../types/box-brand/materials/band';

interface BandSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setBand?: (band: Partial<BandType>) => void;
  onChange?: (newValue: Partial<BandType>) => void;
}

const BandSelectBase: React.FC<BandSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBand,
  onChange,
}) => {
  const { data, isLoading, error } = useBands();

  const handleChange = (newValue: SingleValue<Partial<BandType>>): void => {
    if (setBand) setBand(newValue as Partial<BandType>);
    if (onChange) onChange(newValue as Partial<BandType>);
  };

  return (
    <CatalogSelect<Partial<BandType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay banda/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default BandSelectBase;
