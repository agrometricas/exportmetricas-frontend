/* eslint-disable react-hooks/exhaustive-deps */
import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect, useState } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useCities } from '@/hooks/location/getCities';
import { City } from '@/types/location/city';

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
    <CatalogSelect<City>
      field={field}
      instanceId={name}
      name={name}
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
    />
  );
};

export default CitySelectBase;
