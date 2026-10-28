/* eslint-disable react-hooks/exhaustive-deps */
import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect, useState } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useProvinces } from '@/hooks/location/getProvinces';
import { Province } from '@/types/location/province';

interface ProvinceSelectBaseProps {
  name: string;
  placeholder: string;
  countryId?: number;
  field?: FieldInputProps<number | ''>;
  onChange?: (newValue: Province | null) => void;
  resetOnParentChange?: boolean;
}

const ProvinceSelectBase: React.FC<ProvinceSelectBaseProps> = ({
  name,
  placeholder,
  countryId,
  field,
  onChange,
  resetOnParentChange = true,
}) => {
  const { data, isLoading } = useProvinces(countryId);
  const [internalValue, setInternalValue] = useState<Province | null>(null);
  useEffect(() => {
    if (field?.value) {
      const selected =
        data?.find((province) => province.id === field.value) || null;
      setInternalValue(selected);
    } else {
      setInternalValue(null);
    }
  }, [field?.value, data]);

  useEffect(() => {
    if (!countryId) {
      if (resetOnParentChange) {
        setInternalValue(null);
        field?.onChange({
          target: {
            name,
            value: '',
          },
        });
      }
      return;
    }

    if (data && data.length > 0) {
      const selectedProvinceId = field?.value;
      const selectedProvince = data?.find(
        (province) => province.id === selectedProvinceId
      );

      if (!selectedProvince && resetOnParentChange) {
        setInternalValue(null);
        field?.onChange({
          target: {
            name,
            value: '',
          },
        });
      }
    }
  }, [countryId, data]);

  const handleChange = (newValue: SingleValue<Province>): void => {
    setInternalValue(newValue || null);
    onChange?.(newValue || null);
  };

  return (
    <CatalogSelect<Province>
      field={field}
      instanceId={name}
      name={name}
      noOptionsMessage={() => 'Provincias no encontradas'}
      isLoading={isLoading}
      options={data}
      getOptionLabel={(province) => province.name}
      getOptionValue={(province) => province.id.toString()}
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

export default ProvinceSelectBase;
