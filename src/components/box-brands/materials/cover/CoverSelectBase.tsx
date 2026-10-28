import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useCovers } from '@/hooks/box-brand/materials/cover/getCovers';
import { CoverType } from '@/types/box-brand/materials/cover';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface CoverSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setCover?: (cover: Partial<CoverType>) => void;
  onChange?: (newValue: Partial<CoverType>) => void;
}

const CoverSelectBase: React.FC<CoverSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCover,
  onChange,
}) => {
  const { data, isLoading, error } = useCovers();

  const handleChange = (newValue: SingleValue<Partial<CoverType>>): void => {
    if (setCover) setCover(newValue as Partial<CoverType>);
    if (onChange) onChange(newValue as Partial<CoverType>);
  };

  return (
    <CatalogSelect<Partial<CoverType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay cubierta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default CoverSelectBase;
