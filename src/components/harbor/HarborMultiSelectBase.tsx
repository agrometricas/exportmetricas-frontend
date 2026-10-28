import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useHarborsByType } from '../../hooks/export/harbor/getHarborsByType';
import { HarborType } from '../../types/harbor';

interface HarborMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  type: string | 'Nacional' | 'Internacional';
  setHarbors?: (harbors: Partial<HarborType>[]) => void;
  onChange?: (newValues: Partial<HarborType>[]) => void;
}

const HarborMultiSelectBase: React.FC<HarborMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  type,
  onChange,
  setHarbors,
}) => {
  const { data, isLoading, error } = useHarborsByType({ type });

  const handleChange = (newValues: MultiValue<Partial<HarborType>>): void => {
    if (setHarbors) {
      setHarbors(newValues as Partial<HarborType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<HarborType>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<HarborType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay puerto/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(harbor: Partial<HarborType>) =>
        harbor.country?.name
          ? `${harbor.name} - ${harbor.country.name}`
          : `${harbor.name}`
      }
      onChange={(newValues) => handleChange(newValues as Partial<HarborType>[])}
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default HarborMultiSelectBase;
