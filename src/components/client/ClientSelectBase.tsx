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
import { useClients } from '../../hooks/export/client/getClients';
import { usePagination } from '../../hooks/usePagination';
import { ClientType } from '../../types/client';

interface ClientSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setClient?: (client: Partial<ClientType>) => void;
  onChange?: (newValue: Partial<ClientType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ClientType>,
  false,
  GroupBase<Partial<ClientType>>
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

const clientComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ClientType>,
      false,
      GroupBase<Partial<ClientType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild><MdOutlineArrowDropDownCircle /></Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ClientSelectBase: React.FC<ClientSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setClient,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useClients({
    ...paginationParams,
  });

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

  const handleChange = (newValue: SingleValue<Partial<ClientType>>): void => {
    if (setClient) {
      setClient(newValue as Partial<ClientType>);
    }

    if (onChange) {
      onChange(newValue as Partial<ClientType>);
    }
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          (({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel),
      }}

      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error
          ? (error as any).response.data.message
          : 'Ya no hay cliente/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ClientType>) => `${opt.businessName}`}
      getOptionValue={(opt: Partial<ClientType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ClientType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      components={clientComponents}
    />
  );
};

export default ClientSelectBase;
