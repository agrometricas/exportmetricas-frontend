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
import { usePackingTapes } from '@/hooks/box-brand/materials/packingtape/getPackingTapes';
import { PackingTapeType } from '@/types/box-brand/materials/packingtape';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface PackingTapeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
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

const packingTapeComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<PackingTapeType>,
      false,
      GroupBase<Partial<PackingTapeType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
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
  const { data, isLoading, error } = usePackingTapes();

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
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        error
          ? serverErrorMessage(error)
          : 'Ya no hay packingTape/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
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
