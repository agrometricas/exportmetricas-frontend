import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useInsecticides } from '../../../../hooks/box-brand/additions/insecticide/getInsecticides';
import { InsecticideType } from '../../../../types/box-brand/additions/insecticide';

interface InsecticideMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setInsecticides?: (insecticides: Partial<InsecticideType>[]) => void;
  onChange?: (newValues: Partial<InsecticideType>[]) => void;
}

const InsecticideMultiSelectBase: React.FC<InsecticideMultiSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setInsecticides,
  onChange,
}) => {
  const { data, isLoading, error } = useInsecticides();

  const handleChange = (
    newValues: MultiValue<Partial<InsecticideType>>
  ): void => {
    if (setInsecticides)
      setInsecticides(newValues as Partial<InsecticideType>[]);
    if (onChange) onChange(newValues as Partial<InsecticideType>[]);
  };

  return (
    <CatalogMultiSelect<Partial<InsecticideType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay insecticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValues) =>
        handleChange(newValues as Partial<InsecticideType>[])
      }
      placeholder={placeholder}
    />
  );
};

export default InsecticideMultiSelectBase;
