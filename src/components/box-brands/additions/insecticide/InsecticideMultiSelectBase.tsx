/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  CSSObjectWithLabel,
  MultiValue,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useInsecticides } from '../../../../hooks/box-brand/additions/insecticide/getInsecticides';
import { InsecticideType } from '../../../../types/box-brand/additions/insecticide';

interface InsecticideMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setInsecticides?: (insecticides: Partial<InsecticideType>[]) => void;
  onChange?: (newValues: Partial<InsecticideType>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<InsecticideType>,
  true,
  GroupBase<Partial<InsecticideType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'fg.muted',
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

const insecticideComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<InsecticideType>,
      true,
      GroupBase<Partial<InsecticideType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const InsecticideMultiSelectBase: React.FC<InsecticideMultiSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setInsecticides,
  onChange,
}) => {
  const { data, isLoading, error } = useInsecticides();

  const handleChange = (
    newValues: MultiValue<Partial<InsecticideType>>
  ): void => {
    if (setInsecticides)
      setInsecticides(newValues as Partial<InsecticideType>[]);
    if (onChange) onChange(newValues as Partial<InsecticideType>[]);
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      isMulti
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
          : 'Ya no hay insecticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<InsecticideType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<InsecticideType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<InsecticideType>[])
      }
      value={
        field?.value
          ? data.filter(
              (opt: Partial<InsecticideType>) =>
                field.value.indexOf(opt.id) >= 0
            )
          : []
      }
      placeholder={placeholder}
      components={insecticideComponents}
    />
  );
};

export default InsecticideMultiSelectBase;
