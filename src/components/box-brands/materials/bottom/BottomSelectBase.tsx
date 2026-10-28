import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useBottoms } from '../../../../hooks/box-brand/materials/bottom/getBottoms';
import { BottomType } from '../../../../types/box-brand/materials/bottom';

interface BottomSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setBottom?: (band: Partial<BottomType>) => void;
  onChange?: (newValue: Partial<BottomType>) => void;
}

const BottomSelectBase: React.FC<BottomSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBottom,
  onChange,
}) => {
  const { data, isLoading, error } = useBottoms();

  const handleChange = (newValue: SingleValue<Partial<BottomType>>): void => {
    if (setBottom) setBottom(newValue as Partial<BottomType>);
    if (onChange) onChange(newValue as Partial<BottomType>);
  };

  return (
    <CatalogSelect<Partial<BottomType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay fondo/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default BottomSelectBase;
