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
import { useBottoms } from '../../../../hooks/box-brand/materials/bottom/getBottoms';
import { BottomType } from '../../../../types/box-brand/materials/bottom';

interface BottomSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setBottom?: (band: Partial<BottomType>) => void;
  onChange?: (newValue: Partial<BottomType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<BottomType>,
  false,
  GroupBase<Partial<BottomType>>
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

const bandComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<BottomType>,
      false,
      GroupBase<Partial<BottomType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const BottomSelectBase: React.FC<BottomSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBottom,
  onChange,
}) => {
  const { data, isLoading, error } = useBottoms();

  const handleChange = (newValue: SingleValue<Partial<BottomType>>): void => {
    if (setBottom) setBottom(newValue as Partial<BottomType>);
    if (onChange) onChange(newValue as Partial<BottomType>);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay fondo/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<BottomType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<BottomType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<BottomType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={bandComponents}
    />
  );
};

export default BottomSelectBase;
