import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useCorners } from '@/hooks/box-brand/materials/corner/getCorners';
import { CornerType } from '@/types/box-brand/materials/corner';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface CornerSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setCorner?: (corner: Partial<CornerType>) => void;
  onChange?: (newValue: Partial<CornerType>) => void;
}

const CornerSelectBase: React.FC<CornerSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCorner,
  onChange,
}) => {
  const { data, isLoading, error } = useCorners();

  const handleChange = (newValue: SingleValue<Partial<CornerType>>): void => {
    if (setCorner) setCorner(newValue as Partial<CornerType>);
    if (onChange) onChange(newValue as Partial<CornerType>);
  };

  return (
    <CatalogSelect<Partial<CornerType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay corner/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default CornerSelectBase;
