import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useParaseals } from '@/hooks/box-brand/materials/paraseal/getParaseals';
import { ParasealType } from '@/types/box-brand/materials/paraseal';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface ParasealSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setParaseal?: (paraseal: Partial<ParasealType>) => void;
  onChange?: (newValue: Partial<ParasealType>) => void;
}

const ParasealSelectBase: React.FC<ParasealSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setParaseal,
  onChange,
}) => {
  const { data, isLoading, error } = useParaseals();

  const handleChange = (newValue: SingleValue<Partial<ParasealType>>): void => {
    if (setParaseal) setParaseal(newValue as Partial<ParasealType>);
    if (onChange) onChange(newValue as Partial<ParasealType>);
  };

  return (
    <CatalogSelect<Partial<ParasealType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay paraseal/es disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ParasealSelectBase;
