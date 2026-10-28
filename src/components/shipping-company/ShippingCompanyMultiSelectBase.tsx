import { MultiValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { CatalogMultiSelect } from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyResponse } from '../../types/shippingCompany.response';

interface ShippingCompanyMultiSelectBaseProps {
  name?: string;

  field?: FieldInputProps<number[]>;
  placeholder: string;
  setShippingCompanies?: (
    shippingCompanies: Partial<ShippingCompanyResponse>[]
  ) => void;
  onChange?: (newValues: Partial<ShippingCompanyResponse>[]) => void;
}

const ShippingCompanyMultiSelectBase: React.FC<
  ShippingCompanyMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setShippingCompanies }) => {
  const { data, isLoading, error } = useShippingCompanies();

  const handleChange = (
    newValues: MultiValue<Partial<ShippingCompanyResponse>>
  ): void => {
    if (setShippingCompanies) {
      setShippingCompanies(newValues as Partial<ShippingCompanyResponse>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<ShippingCompanyResponse>[]);
    }
  };

  return (
    <CatalogMultiSelect<Partial<ShippingCompanyResponse>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay naviero/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValues) =>
        handleChange(newValues as Partial<ShippingCompanyResponse>[])
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
    />
  );
};

export default ShippingCompanyMultiSelectBase;
