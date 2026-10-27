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
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useClientsByHarborId } from '../../hooks/export/client/getClientsByHarborId';
import { ClientType } from '../../types/client';

interface ClientByHarborSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  harbor?: number;
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

const clientComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ClientType>,
      false,
      GroupBase<Partial<ClientType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ClientByHarborSelectBase: React.FC<ClientByHarborSelectBaseProps> = ({
  name,
  placeholder,
  field,
  harbor,
  onChange,
  setClient,
}) => {
  const { data, isLoading, error } = useClientsByHarborId({ id: harbor ?? 0 });

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
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay cliente/s disponible/s'
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
          : null
      }
      placeholder={placeholder}
      components={clientComponents}
    />
  );
};

export default ClientByHarborSelectBase;
