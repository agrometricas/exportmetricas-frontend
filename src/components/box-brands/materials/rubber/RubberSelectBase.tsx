import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useRubbers } from '../../../../hooks/box-brand/materials/rubber/getRubbers';
import { RubberType } from '../../../../types/box-brand/materials/rubber';

interface RubberSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setRubber?: (rubber: Partial<RubberType>) => void;
  onChange?: (newValue: Partial<RubberType>) => void;
}

const RubberSelectBase: React.FC<RubberSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setRubber,
  onChange,
}) => {
  const { data, isLoading, error } = useRubbers();

  const handleChange = (newValue: SingleValue<Partial<RubberType>>): void => {
    if (setRubber) setRubber(newValue as Partial<RubberType>);
    if (onChange) onChange(newValue as Partial<RubberType>);
  };

  return (
    <CatalogSelect<Partial<RubberType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay liga/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default RubberSelectBase;
