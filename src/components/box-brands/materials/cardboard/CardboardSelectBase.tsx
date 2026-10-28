import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useCardboards } from '@/hooks/box-brand/materials/cardboard/getCardboards';
import { CardboardType } from '@/types/box-brand/materials/cardboard';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface CardboardSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setCardboard?: (cardboard: Partial<CardboardType>) => void;
  onChange?: (newValue: Partial<CardboardType>) => void;
}

const CardboardSelectBase: React.FC<CardboardSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCardboard,
  onChange,
}) => {
  const { data, isLoading, error } = useCardboards();

  const handleChange = (
    newValue: SingleValue<Partial<CardboardType>>
  ): void => {
    if (setCardboard) setCardboard(newValue as Partial<CardboardType>);
    if (onChange) onChange(newValue as Partial<CardboardType>);
  };

  return (
    <CatalogSelect<Partial<CardboardType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay cartón/es disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default CardboardSelectBase;
