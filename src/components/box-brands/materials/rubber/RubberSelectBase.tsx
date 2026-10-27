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
import { useRubbers } from '../../../../hooks/box-brand/materials/rubber/getRubbers';
import { RubberType } from '../../../../types/box-brand/materials/rubber';

interface RubberSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setRubber?: (rubber: Partial<RubberType>) => void;
  onChange?: (newValue: Partial<RubberType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<RubberType>,
  false,
  GroupBase<Partial<RubberType>>
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

const rubberComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<RubberType>,
      false,
      GroupBase<Partial<RubberType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const RubberSelectBase: React.FC<RubberSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setRubber,
  onChange,
}) => {
  const { data, isLoading, error } = useRubbers();

  const handleChange = (newValue: SingleValue<Partial<RubberType>>): void => {
    if (setRubber) setRubber(newValue as Partial<RubberType>);
    if (onChange) onChange(newValue as Partial<RubberType>);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay liga/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<RubberType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<RubberType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<RubberType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={rubberComponents}
    />
  );
};

export default RubberSelectBase;
