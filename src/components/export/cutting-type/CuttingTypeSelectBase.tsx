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
import { useCuttingTypes } from '../../../hooks/export/cutting-type/getCuttingTypes';
import { CuttingType } from '../../../types/cuttingType';

interface CuttingTypeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setCuttingType?: (cuttingType: Partial<CuttingType>) => void;
  onChange?: (newValue: Partial<CuttingType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<CuttingType>,
  false,
  GroupBase<Partial<CuttingType>>
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

const cuttingTypeComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<CuttingType>,
      false,
      GroupBase<Partial<CuttingType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CuttingTypeSelectBase: React.FC<CuttingTypeSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setCuttingType,
}) => {
  const { data = [], isLoading, error } = useCuttingTypes();

  const handleChange = (newValue: SingleValue<Partial<CuttingType>>): void => {
    if (setCuttingType) {
      setCuttingType(newValue as Partial<CuttingType>);
    }

    if (onChange) {
      onChange(newValue as Partial<CuttingType>);
    }
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
        !!error ? serverErrorMessage(error) : 'Ya no hay corte/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<CuttingType>) => `${opt.shipmentType}`}
      getOptionValue={(opt: Partial<CuttingType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<CuttingType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={cuttingTypeComponents}
    />
  );
};

export default CuttingTypeSelectBase;
