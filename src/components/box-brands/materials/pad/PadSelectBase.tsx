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
import { usePads } from '@/hooks/box-brand/materials/pad/getPads';
import { usePagination } from '@/hooks/usePagination';
import { PadType } from '@/types/box-brand/materials/pad';

interface PadSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setPad?: (pad: Partial<PadType>) => void;
  onChange?: (newValue: Partial<PadType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<PadType>,
  false,
  GroupBase<Partial<PadType>>
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

const padComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<PadType>,
      false,
      GroupBase<Partial<PadType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const PadSelectBase: React.FC<PadSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setPad,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = usePads(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const { response } = error as any;
      if (response?.data?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleChange = (newValue: SingleValue<Partial<PadType>>): void => {
    if (setPad) setPad(newValue as Partial<PadType>);
    if (onChange) onChange(newValue as Partial<PadType>);
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
        error
          ? (error as any).response.data.message
          : 'Ya no hay pad/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<PadType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<PadType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<PadType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={padComponents}
    />
  );
};

export default PadSelectBase;
