import { SingleValue } from 'chakra-react-select';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyResponse } from '../../types/shippingCompany.response';

interface ShippingCompanySelectBaseProps {
  name: string;
  placeholder: string;
  value?: number;
  onChange: (newValue: Partial<ShippingCompanyResponse> | null) => void;
}

const ShippingCompanySelectBase: React.FC<ShippingCompanySelectBaseProps> = ({
  name,
  placeholder,
  value,
  onChange,
}) => {
  const { data = [], isLoading, error } = useShippingCompanies();

  const handleChange = (
    newValue: SingleValue<Partial<ShippingCompanyResponse>>
  ): void => {
    onChange(newValue);
  };

  return (
    <CatalogSelect<Partial<ShippingCompanyResponse>>
      name={name}
      noOptionsMessage={() =>
        error ? 'Error al cargar navieras' : 'No hay navieras disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ShippingCompanyResponse>) => opt.name || ''}
      onChange={(newValue) => handleChange(newValue)}
      value={
        data.find(
          (opt: Partial<ShippingCompanyResponse>) => opt.id === value
        ) ?? null
      }
      placeholder={placeholder}
    />
  );
};

export default ShippingCompanySelectBase;
