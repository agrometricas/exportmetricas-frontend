import { SingleValue } from 'chakra-react-select';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyType } from '../../types/shippingCompany';

interface ShippingCompanySelectBaseProps {
  name: string;
  placeholder: string;
  value?: number;
  onChange: (newValue: Partial<ShippingCompanyType> | null) => void;
}

const ShippingCompanySelectBase: React.FC<ShippingCompanySelectBaseProps> = ({
  name,
  placeholder,
  value,
  onChange,
}) => {
  const { data = [], isLoading, error } = useShippingCompanies();

  const handleChange = (
    newValue: SingleValue<Partial<ShippingCompanyType>>
  ): void => {
    onChange(newValue);
  };

  return (
    <CatalogSelect<Partial<ShippingCompanyType>>
      name={name}
      noOptionsMessage={() =>
        error ? 'Error al cargar navieras' : 'No hay navieras disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ShippingCompanyType>) => opt.name || ''}
      onChange={(newValue) => handleChange(newValue)}
      value={
        data.find((opt: Partial<ShippingCompanyType>) => opt.id === value) ??
        null
      }
      placeholder={placeholder}
    />
  );
};

export default ShippingCompanySelectBase;
