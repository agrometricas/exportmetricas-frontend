import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useSeals } from '../../../../hooks/box-brand/container/seal/getSeals';
import { SealType } from '../../../../types/box-brand/container/seal';

interface SealSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setSeal?: (seal: Partial<SealType>) => void;
  onChange?: (newValue: Partial<SealType>) => void;
}

const SealSelectBase: React.FC<SealSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSeal,
  onChange,
}) => {
  const { data, isLoading, error } = useSeals();

  const handleChange = (newValue: SingleValue<Partial<SealType>>): void => {
    if (setSeal) setSeal(newValue as Partial<SealType>);
    if (onChange) onChange(newValue as Partial<SealType>);
  };

  return (
    <CatalogSelect<Partial<SealType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay sello/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default SealSelectBase;
