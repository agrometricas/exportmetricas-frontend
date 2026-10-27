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
import { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useTransports } from '../../hooks/transport/getTransports';
import { usePagination } from '../../hooks/usePagination';
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
  ): JSX.Element => (
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
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error } = useTransports(paginationParams);
  const router = useRouter();
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;
  useEffect(() => {
    if (!!error) {
      const { response } = error as any;
      const { data } = response;
      const { statusCode } = data;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

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
        !!error
          ? (error as any).response.data.message
          : 'No hay trasnportes disponible/s'
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
