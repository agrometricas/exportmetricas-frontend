/* eslint-disable react-hooks/exhaustive-deps */
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
import React, { useEffect, useState } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useCities } from '@/hooks/location/getCities';
import { City } from '@/types/location/city';

const chakraStyles: ChakraStylesConfig<City, false, GroupBase<City>> = {
  container: (provided) => ({ ...provided, w: 'full' }),
  placeholder: (provided) => ({ ...provided, color: 'fg.muted' }),
  input: (provided) => ({ ...provided, color: 'fg.heading' }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'border',
  }),
};

const cityComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<City, false, GroupBase<City>>
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='16px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

interface CitySelectBaseProps {
  name: string;
  placeholder: string;
  provinceId?: number;
  resetOnParentChange?: boolean;
  onChange?: (newValue: City | null) => void;
  field?: FieldInputProps<number | ''>;
}

const CitySelectBase: React.FC<CitySelectBaseProps> = ({
  name,
  placeholder,
  provinceId,
  resetOnParentChange = true,
  field,
  onChange,
}) => {
  const { data, isLoading } = useCities(provinceId);
  const [internalValue, setInternalValue] = useState<City | null>(null);
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  useEffect(() => {
    if (field?.value) {
      const selected = data?.find((city) => city.id === field.value) || null;
      setInternalValue(selected);
    } else {
      setInternalValue(null);
    }
  }, [field?.value, data]);

  useEffect(() => {
    if (!provinceId) {
      if (resetOnParentChange) {
        setInternalValue(null);
        onChange?.(null);
      }
      return;
    }

    if (data && data.length > 0) {
      const selectedCityId = field?.value;
      const selectedCity = data?.find((city) => city.id === selectedCityId);

      if (!selectedCity && resetOnParentChange) {
        setInternalValue(null);
        onChange?.(null);
      }
    }
  }, [provinceId, data]);

  const handleChange = (newValue: SingleValue<City>): void => {
    setInternalValue(newValue || null);
    onChange?.(newValue || null);
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
      noOptionsMessage={() => 'Ciudades no encontradas'}
      isLoading={isLoading}
      options={data}
      getOptionLabel={(city) => city.name}
      getOptionValue={(city) => city.id.toString()}
      onChange={handleChange}
      value={
        field?.value
          ? data?.find((opt) => opt.id === field.value) || internalValue
          : internalValue
      }
      placeholder={placeholder}
      components={cityComponents}
    />
  );
};

export default CitySelectBase;
