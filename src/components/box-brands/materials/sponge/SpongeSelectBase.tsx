import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useSponges } from '@/hooks/box-brand/materials/sponge/getSponges';
import { SpongeType } from '@/types/box-brand/materials/sponge';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface SpongeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setSponge?: (sponge: Partial<SpongeType>) => void;
  onChange?: (newValue: Partial<SpongeType>) => void;
}

const SpongeSelectBase: React.FC<SpongeSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSponge,
  onChange,
}) => {
  const { data, isLoading, error } = useSponges();

  const handleChange = (newValue: SingleValue<Partial<SpongeType>>): void => {
    if (setSponge) setSponge(newValue as Partial<SpongeType>);
    if (onChange) onChange(newValue as Partial<SpongeType>);
  };

  return (
    <CatalogSelect<Partial<SpongeType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay esponja/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default SpongeSelectBase;
