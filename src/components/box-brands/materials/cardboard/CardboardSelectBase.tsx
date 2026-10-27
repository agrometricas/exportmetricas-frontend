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
import { useCardboards } from '@/hooks/box-brand/materials/cardboard/getCardboards';
import { CardboardType } from '@/types/box-brand/materials/cardboard';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface CardboardSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setCardboard?: (cardboard: Partial<CardboardType>) => void;
  onChange?: (newValue: Partial<CardboardType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<CardboardType>,
  false,
  GroupBase<Partial<CardboardType>>
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

const cardboardComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<CardboardType>,
      false,
      GroupBase<Partial<CardboardType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CardboardSelectBase: React.FC<CardboardSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCardboard,
  onChange,
}) => {
  const { data, isLoading, error } = useCardboards();

  const handleChange = (
    newValue: SingleValue<Partial<CardboardType>>
  ): void => {
    if (setCardboard) setCardboard(newValue as Partial<CardboardType>);
    if (onChange) onChange(newValue as Partial<CardboardType>);
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
        error ? serverErrorMessage(error) : 'Ya no hay cartón/es disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<CardboardType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<CardboardType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<CardboardType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={cardboardComponents}
    />
  );
};

export default CardboardSelectBase;
