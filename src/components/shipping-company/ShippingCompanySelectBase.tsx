import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  SingleValue,
  chakraComponents,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyType } from '../../types/shippingCompany';

interface ShippingCompanySelectBaseProps {
  name: string;
  placeholder: string;
  value?: number;
  onChange: (newValue: Partial<ShippingCompanyType> | null) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ShippingCompanyType>,
  false,
  GroupBase<Partial<ShippingCompanyType>>
> = {
  container: (provided) => ({ ...provided, w: 'full' }),
  placeholder: (provided) => ({ ...provided, color: 'fg.muted' }),
  input: (provided) => ({ ...provided, color: 'fg.heading' }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'border',
  }),
};

const shippingCompanyComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ShippingCompanyType>,
      false,
      GroupBase<Partial<ShippingCompanyType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

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
    <ChakraSelect
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        error ? 'Error al cargar navieras' : 'No hay navieras disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ShippingCompanyType>) => opt.name || ''}
      getOptionValue={(opt: Partial<ShippingCompanyType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        data.find((opt: Partial<ShippingCompanyType>) => opt.id === value) ??
        null
      }
      placeholder={placeholder}
      components={shippingCompanyComponents}
    />
  );
};

export default ShippingCompanySelectBase;
