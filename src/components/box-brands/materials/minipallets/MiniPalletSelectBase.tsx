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
import { useMiniPallets } from '@/hooks/box-brand/materials/minipallet/getMiniPallets';
import { usePagination } from '@/hooks/usePagination';
import { MiniPalletType } from '@/types/box-brand/materials/minipallet';

interface MiniPalletSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setMiniPallet?: (minipallet: Partial<MiniPalletType>) => void;
  onChange?: (newValue: Partial<MiniPalletType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<MiniPalletType>,
  false,
  GroupBase<Partial<MiniPalletType>>
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

const minipalletComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<MiniPalletType>,
      false,
      GroupBase<Partial<MiniPalletType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const MiniPalletSelectBase: React.FC<MiniPalletSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setMiniPallet,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useMiniPallets(paginationParams);
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
    newValue: SingleValue<Partial<MiniPalletType>>
  ): void => {
    if (setMiniPallet) setMiniPallet(newValue as Partial<MiniPalletType>);
    if (onChange) onChange(newValue as Partial<MiniPalletType>);
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
          : 'Ya no hay mini pallet/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<MiniPalletType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<MiniPalletType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<MiniPalletType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={minipalletComponents}
    />
  );
};

export default MiniPalletSelectBase;
