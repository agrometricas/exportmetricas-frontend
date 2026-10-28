import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useStaples } from '../../../../hooks/box-brand/container/staple/getStaples';
import { StapleType } from '../../../../types/box-brand/container/staple';

interface StapleSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setStaple?: (staple: Partial<StapleType>) => void;
  onChange?: (newValue: Partial<StapleType>) => void;
}

const StapleSelectBase: React.FC<StapleSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setStaple,
  onChange,
}) => {
  const { data, isLoading, error } = useStaples();

  const handleChange = (newValue: SingleValue<Partial<StapleType>>): void => {
    if (setStaple) setStaple(newValue as Partial<StapleType>);
    if (onChange) onChange(newValue as Partial<StapleType>);
  };

  return (
    <CatalogSelect<Partial<StapleType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay grapa/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default StapleSelectBase;
