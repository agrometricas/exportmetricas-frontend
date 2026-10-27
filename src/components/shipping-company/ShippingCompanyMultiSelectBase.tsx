import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  MultiValue,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { usePagination } from '../../hooks/usePagination';
import { ShippingCompanyType } from '../../types/shippingCompany';

interface ShippingCompanyMultiSelectBaseProps {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: FieldInputProps<any>;
  placeholder: string;
  setShippingCompanies?: (
    shippingCompanies: Partial<ShippingCompanyType>[]
  ) => void;
  onChange?: (newValues: Partial<ShippingCompanyType>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ShippingCompanyType>,
  true,
  GroupBase<Partial<ShippingCompanyType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'fg.muted',
  }),
  input: (provided) => ({
    ...provided,
    color: 'fg.heading',
  }),
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
      true,
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

const ShippingCompanyMultiSelectBase: React.FC<
  ShippingCompanyMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setShippingCompanies }) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useShippingCompanies(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (!!error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { response } = error as any;
      const { data } = response;
      const { statusCode } = data;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
    <ChakraSelect
      {...field}
      name={name}
      isMulti
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
        !!error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response.data.message
          : 'Ya no hay naviero/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(shippingCompany: Partial<ShippingCompanyType>) =>
        `${shippingCompany.name}`
      }
      getOptionValue={(shippingCompany: Partial<ShippingCompanyType>) =>
        shippingCompany.id ? shippingCompany.id.toString() : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<ShippingCompanyType>[])
      }
      value={
        field?.value
          ? data.filter(
              (opt: Partial<ShippingCompanyType>) =>
                field.value.indexOf(opt.id) >= 0
            )
          : []
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={shippingCompanyComponents}
    />
  );
};

export default ShippingCompanyMultiSelectBase;
