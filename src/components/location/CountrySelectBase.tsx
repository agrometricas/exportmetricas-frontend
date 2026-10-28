import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useCountries } from '../../hooks/location/getCountries';
import { Country } from '../../types/location/country';

const CountrySelectBase: React.FC<{
  setCountry?: (country: Country) => void;
  onChange?: (newValue: Country) => void;
  name: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
}> = ({ setCountry, onChange, field, placeholder, name }) => {
  const { data, isLoading } = useCountries();
  const handleChange = (newValue: SingleValue<Country>): void => {
    if (setCountry) setCountry(newValue as Country);
    if (onChange) onChange(newValue as Country);
  };

  return (
    <CatalogSelect<Country>
      field={field}
      instanceId={name}
      name={name}
      noOptionsMessage={() => 'Paises no encontrados'}
      isLoading={isLoading}
      options={data}
      getOptionValue={(country: Country) => country.id.toString()}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Country) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default CountrySelectBase;
