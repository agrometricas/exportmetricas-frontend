/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  CSSObjectWithLabel,
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  SingleValue,
  chakraComponents,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useStaples } from '../../../../hooks/box-brand/container/staple/getStaples';
import { StapleType } from '../../../../types/box-brand/container/staple';

interface StapleSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setStaple?: (staple: Partial<StapleType>) => void;
  onChange?: (newValue: Partial<StapleType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<StapleType>,
  false,
  GroupBase<Partial<StapleType>>
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

const stableComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<StapleType>,
      false,
      GroupBase<Partial<StapleType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const StapleSelectBase: React.FC<StapleSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setStaple,
  onChange,
}) => {
  const { data, isLoading, error } = useStaples();

  const handleChange = (newValue: SingleValue<Partial<StapleType>>): void => {
    if (setStaple) setStaple(newValue as Partial<StapleType>);
    if (onChange) onChange(newValue as Partial<StapleType>);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay grapa/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<StapleType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<StapleType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<StapleType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={stableComponents}
    />
  );
};

export default StapleSelectBase;
