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
import { useCovers } from '@/hooks/box-brand/materials/cover/getCovers';
import { CoverType } from '@/types/box-brand/materials/cover';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface CoverSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setCover?: (cover: Partial<CoverType>) => void;
  onChange?: (newValue: Partial<CoverType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<CoverType>,
  false,
  GroupBase<Partial<CoverType>>
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

const coverComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<CoverType>,
      false,
      GroupBase<Partial<CoverType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CoverSelectBase: React.FC<CoverSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCover,
  onChange,
}) => {
  const { data, isLoading, error } = useCovers();

  const handleChange = (newValue: SingleValue<Partial<CoverType>>): void => {
    if (setCover) setCover(newValue as Partial<CoverType>);
    if (onChange) onChange(newValue as Partial<CoverType>);
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
        error ? serverErrorMessage(error) : 'Ya no hay cubierta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<CoverType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<CoverType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<CoverType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={coverComponents}
    />
  );
};

export default CoverSelectBase;
