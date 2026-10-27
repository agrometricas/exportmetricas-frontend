/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  CSSObjectWithLabel,
  SingleValue,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useCountries } from '../../hooks/location/getCountries';
import { Country } from '../../types/location/country';

const chakraStyles: ChakraStylesConfig<Country, false, GroupBase<Country>> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'fg.muted',
  }),
  input: (provided) => ({
    ...provided,
    color: 'fg.heading',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'border',
  }),
};

const countryComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<Country, false, GroupBase<Country>>
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CountrySelectBase: React.FC<{
  setCountry?: (country: Country) => void;
  onChange?: (newValue: Country) => void;
  name: string;
  field?: FieldInputProps<any>;
  placeholder: string;
}> = ({ setCountry, onChange, field, placeholder, name }) => {
  const { data, isLoading } = useCountries();
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  const handleChange = (newValue: SingleValue<Country>): void => {
    if (setCountry) setCountry(newValue as Country);
    if (onChange) onChange(newValue as Country);
  };

  return (
    <ChakraSelect
      {...field}
      instanceId={name}
      name={name}
      menuPortalTarget={menuPortalTarget}
      styles={{
        menuPortal: (provided) =>
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() => 'Paises no encontrados'}
      isLoading={isLoading}
      options={data}
      getOptionLabel={(country: Country) => `${country.name}`}
      getOptionValue={(country: Country) => country.id.toString()}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Country) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      components={countryComponents}
    />
  );
};

export default CountrySelectBase;
