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
import { useLids } from '@/hooks/box-brand/materials/lid/getLids';
import { LidType } from '@/types/box-brand/materials/lid';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface LidSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setLid?: (lid: Partial<LidType>) => void;
  onChange?: (newValue: Partial<LidType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<LidType>,
  false,
  GroupBase<Partial<LidType>>
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

const lidComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<LidType>,
      false,
      GroupBase<Partial<LidType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const LidSelectBase: React.FC<LidSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLid,
  onChange,
}) => {
  const { data, isLoading, error } = useLids();

  const handleChange = (newValue: SingleValue<Partial<LidType>>): void => {
    if (setLid) setLid(newValue as Partial<LidType>);
    if (onChange) onChange(newValue as Partial<LidType>);
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
        error ? serverErrorMessage(error) : 'Ya no hay tapa/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<LidType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<LidType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<LidType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={lidComponents}
    />
  );
};

export default LidSelectBase;
