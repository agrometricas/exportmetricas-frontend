/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  SingleValue,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useStrippings } from '../../../../hooks/box-brand/container/stripping/getStrippings';
import { usePagination } from '../../../../hooks/usePagination';
import { StrippingType } from '../../../../types/box-brand/container/stripping';

interface StrippingSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setStripping?: (stripping: Partial<StrippingType>) => void;
  onChange?: (newValue: Partial<StrippingType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<StrippingType>,
  false,
  GroupBase<Partial<StrippingType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'gray.600',
    h: 'auto',
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

const strippingComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<StrippingType>,
      false,
      GroupBase<Partial<StrippingType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const StrippingSelectBase: React.FC<StrippingSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setStripping,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useStrippings(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (!!error) {
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
    newValue: SingleValue<Partial<StrippingType>>
  ): void => {
    if (setStripping) setStripping(newValue as Partial<StrippingType>);
    if (onChange) onChange(newValue as Partial<StrippingType>);
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
      noOptionsMessage={() =>
        !!error
          ? (error as any).response.data.message
          : 'Ya no hay zuncho/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<StrippingType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<StrippingType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<StrippingType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={strippingComponents}
    />
  );
};

export default StrippingSelectBase;
