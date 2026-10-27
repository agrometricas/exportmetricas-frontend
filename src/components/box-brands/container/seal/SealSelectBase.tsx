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
import { useSeals } from '../../../../hooks/box-brand/container/seal/getSeals';
import { SealType } from '../../../../types/box-brand/container/seal';

interface SealSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setSeal?: (seal: Partial<SealType>) => void;
  onChange?: (newValue: Partial<SealType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<SealType>,
  false,
  GroupBase<Partial<SealType>>
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

const sealComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<SealType>,
      false,
      GroupBase<Partial<SealType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const SealSelectBase: React.FC<SealSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSeal,
  onChange,
}) => {
  const { data, isLoading, error } = useSeals();

  const handleChange = (newValue: SingleValue<Partial<SealType>>): void => {
    if (setSeal) setSeal(newValue as Partial<SealType>);
    if (onChange) onChange(newValue as Partial<SealType>);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay sello/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<SealType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<SealType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<SealType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={sealComponents}
    />
  );
};

export default SealSelectBase;
