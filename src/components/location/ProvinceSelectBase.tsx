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
import { useProvinces } from '@/hooks/location/getProvinces';
import { Province } from '@/types/location/province';

const chakraStyles: ChakraStylesConfig<Province, false, GroupBase<Province>> = {
  container: (provided) => ({ ...provided, w: 'full' }),
  placeholder: (provided) => ({ ...provided, color: 'fg.muted' }),
  input: (provided) => ({ ...provided, color: 'fg.heading' }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'border',
  }),
};

const provinceComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<Province, false, GroupBase<Province>>
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='16px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

interface ProvinceSelectBaseProps {
  name: string;
  placeholder: string;
  countryId?: number;
  field?: FieldInputProps<number>;
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
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

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
    <ChakraSelect
      {...field}
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
      components={provinceComponents}
    />
  );
};

export default ProvinceSelectBase;
