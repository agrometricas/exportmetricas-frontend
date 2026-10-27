/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  MultiValue,
  chakraComponents,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { usePesticides } from '../../../../hooks/box-brand/post-harvest/pesticide/getPesticides';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface PesticideMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setPesticides?: (pesticides: Partial<PesticideType>[]) => void;
  onChange?: (newValues: Partial<PesticideType>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<PesticideType>,
  true,
  GroupBase<Partial<PesticideType>>
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

const pesticideComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<PesticideType>,
      true,
      GroupBase<Partial<PesticideType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const PesticideMultiSelectBase: React.FC<PesticideMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setPesticides,
}) => {
  const { data, isLoading, error } = usePesticides();

  const handleChange = (
    newValues: MultiValue<Partial<PesticideType>>
  ): void => {
    if (setPesticides) {
      setPesticides(newValues as Partial<PesticideType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<PesticideType>[]);
    }
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
          : 'Ya no hay pesticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(pesticide: Partial<PesticideType>) =>
        `${pesticide.brandName} - ${pesticide.name}`
      }
      getOptionValue={(pesticide: Partial<PesticideType>) =>
        pesticide.id ? pesticide.id.toString() : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<PesticideType>[])
      }
      value={
        field?.value
          ? data.filter(
              (opt: Partial<PesticideType>) => field.value.indexOf(opt.id) >= 0
            )
          : []
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default PesticideMultiSelectBase;
