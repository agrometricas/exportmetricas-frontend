import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useHarborsByType } from '../../hooks/export/harbor/getHarborsByType';
import { HarborType } from '../../types/harbor';

interface HarborSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  type: 'Nacional' | 'Internacional';
  setHarbor?: (harbor: Partial<HarborType>) => void;
  onChange?: (newValue: Partial<HarborType>) => void;
}

const HarborSelectBase: React.FC<HarborSelectBaseProps> = ({
  name,
  placeholder,
  field,
  type,
  onChange,
  setHarbor,
}) => {
  const { data = [], isLoading, error } = useHarborsByType({ type });

  const handleChange = (newValue: SingleValue<Partial<HarborType>>): void => {
    if (setHarbor) {
      setHarbor(newValue as Partial<HarborType>);
    }

    if (onChange) {
      onChange(newValue as Partial<HarborType>);
    }
  };

  return (
    <CatalogSelect<Partial<HarborType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay puerto/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default HarborSelectBase;
