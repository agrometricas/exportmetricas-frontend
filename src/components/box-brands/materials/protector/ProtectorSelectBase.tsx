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
import { useProtectors } from '../../../../hooks/box-brand/materials/protector/getProtectors';
import { ProtectorType } from '../../../../types/box-brand/materials/protector';

interface ProtectorSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setProtector?: (protector: Partial<ProtectorType>) => void;
  onChange?: (newValue: Partial<ProtectorType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ProtectorType>,
  false,
  GroupBase<Partial<ProtectorType>>
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

const protectorComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ProtectorType>,
      false,
      GroupBase<Partial<ProtectorType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ProtectorSelectBase: React.FC<ProtectorSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setProtector,
  onChange,
}) => {
  const { data, isLoading, error } = useProtectors();

  const handleChange = (
    newValue: SingleValue<Partial<ProtectorType>>
  ): void => {
    if (setProtector) setProtector(newValue as Partial<ProtectorType>);
    if (onChange) onChange(newValue as Partial<ProtectorType>);
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
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay protector/es disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<ProtectorType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<ProtectorType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ProtectorType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={protectorComponents}
    />
  );
};

export default ProtectorSelectBase;
