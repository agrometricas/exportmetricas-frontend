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
import { useTransports } from '../../hooks/transport/getTransports';
import { TransportResponse } from '../../types/transport/transport.response';

interface TransportSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setTransport?: (transport: Partial<TransportResponse>) => void;
  onChange?: (newValue: Partial<TransportResponse>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<TransportResponse>,
  false,
  GroupBase<Partial<TransportResponse>>
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

const transportComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<TransportResponse>,
      false,
      GroupBase<Partial<TransportResponse>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const TransportSelectBase: React.FC<TransportSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setTransport,
}) => {
  const { data = [], isLoading, error } = useTransports();
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  const handleChange = (
    newValue: SingleValue<Partial<TransportResponse>>
  ): void => {
    if (setTransport) {
      setTransport(newValue as Partial<TransportResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<TransportResponse>);
    }
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={menuPortalTarget}
      styles={{
        menuPortal: (provided) =>
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'No hay trasnportes disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<TransportResponse>) => `${opt.name}`}
      getOptionValue={(opt: Partial<TransportResponse>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<TransportResponse>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={transportComponents}
    />
  );
};

export default TransportSelectBase;
