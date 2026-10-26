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
import { usePackingTapes } from '@/hooks/box-brand/materials/packingtape/getPackingTapes';
import { usePagination } from '@/hooks/usePagination';
import { PackingTapeType } from '@/types/box-brand/materials/packingtape';

interface PackingTapeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setPackingTape?: (packingTape: Partial<PackingTapeType>) => void;
  onChange?: (newValue: Partial<PackingTapeType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<PackingTapeType>,
  false,
  GroupBase<Partial<PackingTapeType>>
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

const packingTapeComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<PackingTapeType>,
      false,
      GroupBase<Partial<PackingTapeType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const PackingTapeSelectBase: React.FC<PackingTapeSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setPackingTape,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = usePackingTapes(paginationParams);
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

  const handleChange = (
    newValue: SingleValue<Partial<PackingTapeType>>
  ): void => {
    if (setPackingTape) setPackingTape(newValue as Partial<PackingTapeType>);
    if (onChange) onChange(newValue as Partial<PackingTapeType>);
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
          : 'Ya no hay packingTape/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<PackingTapeType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<PackingTapeType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<PackingTapeType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={packingTapeComponents}
    />
  );
};

export default PackingTapeSelectBase;
