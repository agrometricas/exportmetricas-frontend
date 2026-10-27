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
import { usePallets } from '@/hooks/box-brand/materials/pallet/getPallets';
import { PalletType } from '@/types/box-brand/materials/pallet';

interface PalletSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setPallet?: (pallet: Partial<PalletType>) => void;
  onChange?: (newValue: Partial<PalletType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<PalletType>,
  false,
  GroupBase<Partial<PalletType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'fg.muted',
    h: 'auto',
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

const palletComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<PalletType>,
      false,
      GroupBase<Partial<PalletType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const PalletSelectBase: React.FC<PalletSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setPallet,
  onChange,
}) => {
  const { data, isLoading, error } = usePallets();
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

  const handleChange = (newValue: SingleValue<Partial<PalletType>>): void => {
    if (setPallet) setPallet(newValue as Partial<PalletType>);
    if (onChange) onChange(newValue as Partial<PalletType>);
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
        error
          ? (error as any).response.data.message
          : 'Ya no hay pallet/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<PalletType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<PalletType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<PalletType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={palletComponents}
    />
  );
};

export default PalletSelectBase;
