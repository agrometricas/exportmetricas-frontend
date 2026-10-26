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
import { useCardboards } from '@/hooks/box-brand/materials/cardboard/getCardboards';
import { usePagination } from '@/hooks/usePagination';
import { CardboardType } from '@/types/box-brand/materials/cardboard';

interface CardboardSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setCardboard?: (cardboard: Partial<CardboardType>) => void;
  onChange?: (newValue: Partial<CardboardType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<CardboardType>,
  false,
  GroupBase<Partial<CardboardType>>
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

const cardboardComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<CardboardType>,
      false,
      GroupBase<Partial<CardboardType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const CardboardSelectBase: React.FC<CardboardSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCardboard,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useCardboards(paginationParams);
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
    newValue: SingleValue<Partial<CardboardType>>
  ): void => {
    if (setCardboard) setCardboard(newValue as Partial<CardboardType>);
    if (onChange) onChange(newValue as Partial<CardboardType>);
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
          : 'Ya no hay cartón/es disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<CardboardType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<CardboardType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<CardboardType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={cardboardComponents}
    />
  );
};

export default CardboardSelectBase;
