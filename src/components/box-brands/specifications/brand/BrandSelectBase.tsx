import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useBrands } from '@/hooks/box-brand/specifications/brand/getBrands';
import { BrandType } from '@/types/box-brand/specifications/brand';

const BrandSelectBase: React.FC<{
  setBrand?: (brand: BrandType) => void;
  onChange?: (newValue: BrandType) => void;
  name: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
}> = ({ setBrand, onChange, field, placeholder, name }) => {
  const { data, isLoading } = useBrands();

  const handleChange = (newValue: SingleValue<BrandType>): void => {
    if (setBrand) setBrand(newValue as BrandType);
    if (onChange) onChange(newValue as BrandType);
  };

  return (
    <CatalogSelect<BrandType>
      field={field}
      name={name}
      noOptionsMessage={() => 'brand box not found'}
      isLoading={isLoading}
      options={data}
      getOptionValue={(brand: BrandType) => brand.id.toString()}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: BrandType) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default BrandSelectBase;
