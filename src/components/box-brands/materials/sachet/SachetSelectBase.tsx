/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useSachets } from '../../../../hooks/box-brand/materials/sachet/getSachets';
import { usePagination } from '../../../../hooks/usePagination';
import { SachetType } from '../../../../types/box-brand/materials/sachet';

interface SachetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setSachet?: (sachet: Partial<SachetType>) => void;
  onChange?: (newValue: Partial<SachetType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<SachetType>,
  false,
  GroupBase<Partial<SachetType>>
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

const sachetComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<SachetType>,
      false,
      GroupBase<Partial<SachetType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const SachetSelectBase: React.FC<SachetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSachet,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useSachets(paginationParams);
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

  const handleChange = (newValue: SingleValue<Partial<SachetType>>): void => {
    if (setSachet) setSachet(newValue as Partial<SachetType>);
    if (onChange) onChange(newValue as Partial<SachetType>);
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
          : 'Ya no hay sachet/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<SachetType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<SachetType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<SachetType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={sachetComponents}
    />
  );
};

export default SachetSelectBase;
