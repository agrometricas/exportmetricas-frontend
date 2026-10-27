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
import { useLabels } from '../../../../hooks/box-brand/materials/label/getLabels';
import { LabelType } from '../../../../types/box-brand/materials/label';

interface LabelSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setLabel?: (label: Partial<LabelType> | null) => void;
  onChange?: (newValue: Partial<LabelType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<LabelType>,
  false,
  GroupBase<Partial<LabelType>>
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

const labelComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<LabelType>,
      false,
      GroupBase<Partial<LabelType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const LabelSelectBase: React.FC<LabelSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLabel,
  onChange,
}) => {
  const { data, isLoading, error } = useLabels();

  const handleChange = (newValue: SingleValue<Partial<LabelType>>): void => {
    if (setLabel) setLabel(newValue as Partial<LabelType>);
    if (onChange) onChange(newValue as Partial<LabelType>);
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
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<LabelType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<LabelType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<LabelType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={labelComponents}
    />
  );
};

export default LabelSelectBase;
