import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useSachets } from '../../../../hooks/box-brand/materials/sachet/getSachets';
import { SachetType } from '../../../../types/box-brand/materials/sachet';

interface SachetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setSachet?: (sachet: Partial<SachetType>) => void;
  onChange?: (newValue: Partial<SachetType>) => void;
}

const SachetSelectBase: React.FC<SachetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSachet,
  onChange,
}) => {
  const { data, isLoading, error } = useSachets();

  const handleChange = (newValue: SingleValue<Partial<SachetType>>): void => {
    if (setSachet) setSachet(newValue as Partial<SachetType>);
    if (onChange) onChange(newValue as Partial<SachetType>);
  };

  return (
    <CatalogSelect<Partial<SachetType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay sachet/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default SachetSelectBase;
