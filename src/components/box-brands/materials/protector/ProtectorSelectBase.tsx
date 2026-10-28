import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useProtectors } from '../../../../hooks/box-brand/materials/protector/getProtectors';
import { ProtectorType } from '../../../../types/box-brand/materials/protector';

interface ProtectorSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setProtector?: (protector: Partial<ProtectorType>) => void;
  onChange?: (newValue: Partial<ProtectorType>) => void;
}

const ProtectorSelectBase: React.FC<ProtectorSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setProtector,
  onChange,
}) => {
  const { data, isLoading, error } = useProtectors();

  const handleChange = (
    newValue: SingleValue<Partial<ProtectorType>>
  ): void => {
    if (setProtector) setProtector(newValue as Partial<ProtectorType>);
    if (onChange) onChange(newValue as Partial<ProtectorType>);
  };

  return (
    <CatalogSelect<Partial<ProtectorType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay protector/es disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ProtectorSelectBase;
