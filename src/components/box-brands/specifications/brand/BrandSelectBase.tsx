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
import { useBrands } from '@/hooks/box-brand/specifications/brand/getBrands';
import { usePagination } from '@/hooks/usePagination';
import { BrandType } from '@/types/box-brand/specifications/brand';

const chakraStyles: ChakraStylesConfig<
  BrandType,
  false,
  GroupBase<BrandType>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'gray.600',
  }),
  input: (provided) => ({
    ...provided,
    color: 'gray.900',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'gray.200',
  }),
};

const brandComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<BrandType, false, GroupBase<BrandType>>
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const BrandSelectBase: React.FC<{
  setBrand?: (brand: BrandType) => void;
  onChange?: (newValue: BrandType) => void;
  name: string;
  field?: FieldInputProps<any>;
  placeholder: string;
}> = ({ setBrand, onChange, field, placeholder, name }) => {
  const { paginationParams } = usePagination();
  const { data, isLoading } = useBrands(paginationParams);

  const handleChange = (newValue: SingleValue<BrandType>): void => {
    if (setBrand) setBrand(newValue as BrandType);
    if (onChange) onChange(newValue as BrandType);
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          ({ ...provided, zIndex: 100 }) as CSSObjectWithLabel,
      }}
      useBasicStyles
      chakraStyles={chakraStyles}
      noOptionsMessage={() => 'brand box not found'}
      isLoading={isLoading}
      options={data}
      getOptionLabel={(brand: BrandType) => `${brand.name}`}
      getOptionValue={(brand: BrandType) => brand.id.toString()}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: BrandType) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={brandComponents}
    />
  );
};

export default BrandSelectBase;
