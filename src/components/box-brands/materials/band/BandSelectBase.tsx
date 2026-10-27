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
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useBands } from '../../../../hooks/box-brand/materials/band/getBands';
import { BandType } from '../../../../types/box-brand/materials/band';

interface BandSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setBand?: (band: Partial<BandType>) => void;
  onChange?: (newValue: Partial<BandType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<BandType>,
  false,
  GroupBase<Partial<BandType>>
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
      Partial<BandType>,
      false,
      GroupBase<Partial<BandType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const BandSelectBase: React.FC<BandSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBand,
  onChange,
}) => {
  const { data, isLoading, error } = useBands();

  const handleChange = (newValue: SingleValue<Partial<BandType>>): void => {
    if (setBand) setBand(newValue as Partial<BandType>);
    if (onChange) onChange(newValue as Partial<BandType>);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay banda/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<BandType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<BandType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<BandType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={bandComponents}
    />
  );
};

export default BandSelectBase;
