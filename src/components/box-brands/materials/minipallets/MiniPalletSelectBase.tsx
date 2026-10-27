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
import { useMiniPallets } from '@/hooks/box-brand/materials/minipallet/getMiniPallets';
import { MiniPalletType } from '@/types/box-brand/materials/minipallet';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface MiniPalletSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
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

const minipalletComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<MiniPalletType>,
      false,
      GroupBase<Partial<MiniPalletType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
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
  const { data, isLoading, error } = useMiniPallets();

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
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        error
          ? serverErrorMessage(error)
          : 'Ya no hay mini pallet/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<MiniPalletType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<MiniPalletType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<MiniPalletType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={minipalletComponents}
    />
  );
};

export default MiniPalletSelectBase;
