import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useThermographs } from '../../../../hooks/box-brand/container/thermograph/getThermographs';
import { ThermographType } from '../../../../types/box-brand/container/thermograph';

interface ThermographSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setThermo?: (thermo: Partial<ThermographType>) => void;
  onChange?: (newValue: Partial<ThermographType>) => void;
}

const ThermographSelectBase: React.FC<ThermographSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setThermo,
  onChange,
}) => {
  const { data, isLoading, error } = useThermographs();

  const handleChange = (
    newValue: SingleValue<Partial<ThermographType>>
  ): void => {
    if (setThermo) setThermo(newValue as Partial<ThermographType>);
    if (onChange) onChange(newValue as Partial<ThermographType>);
  };

  return (
    <CatalogSelect<Partial<ThermographType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay termografo/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ThermographSelectBase;
