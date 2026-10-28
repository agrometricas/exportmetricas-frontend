import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyType } from '../../types/shippingCompany';

interface ShippingCompanyMultiSelectBaseProps {
  name?: string;

  field?: FieldInputProps<number[]>;
  placeholder: string;
  setShippingCompanies?: (
    shippingCompanies: Partial<ShippingCompanyType>[]
  ) => void;
  onChange?: (newValues: Partial<ShippingCompanyType>[]) => void;
}

const ShippingCompanyMultiSelectBase: React.FC<
  ShippingCompanyMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setShippingCompanies }) => {
  const { data, isLoading, error } = useShippingCompanies();

  const handleChange = (
    newValues: MultiValue<Partial<ShippingCompanyType>>
  ): void => {
    if (setShippingCompanies) {
      setShippingCompanies(newValues as Partial<ShippingCompanyType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<ShippingCompanyType>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<ShippingCompanyType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay naviero/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValues) =>
        handleChange(newValues as Partial<ShippingCompanyType>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default ShippingCompanyMultiSelectBase;
