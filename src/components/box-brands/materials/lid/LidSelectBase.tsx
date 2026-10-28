import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useLids } from '@/hooks/box-brand/materials/lid/getLids';
import { LidType } from '@/types/box-brand/materials/lid';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface LidSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setLid?: (lid: Partial<LidType>) => void;
  onChange?: (newValue: Partial<LidType>) => void;
}

const LidSelectBase: React.FC<LidSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLid,
  onChange,
}) => {
  const { data, isLoading, error } = useLids();

  const handleChange = (newValue: SingleValue<Partial<LidType>>): void => {
    if (setLid) setLid(newValue as Partial<LidType>);
    if (onChange) onChange(newValue as Partial<LidType>);
  };

  return (
    <CatalogSelect<Partial<LidType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        error ? serverErrorMessage(error) : 'Ya no hay tapa/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default LidSelectBase;
