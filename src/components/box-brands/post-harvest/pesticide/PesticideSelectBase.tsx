import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  SingleValue,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { usePesticides } from '../../../../hooks/box-brand/post-harvest/pesticide/getPesticides';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface PesticideSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  setPesticide?: (pesticide: Partial<PesticideType>) => void;
  onChange?: (newValue: Partial<PesticideType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<PesticideType>,
  false,
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
      false,
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

const PesticideSelectBase: React.FC<PesticideSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setPesticide,
  onChange,
}) => {
  const { data = [], isLoading, error } = usePesticides();

  useEffect(() => {
    if (!!setPesticide)
      setPesticide(
        (data as Partial<PesticideType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<PesticideType>
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field?.value]);

  const handleChange = (
    newValue: SingleValue<Partial<PesticideType>>
  ): void => {
    if (setPesticide) {
      setPesticide(newValue as Partial<PesticideType>);
    }
    if (onChange) {
      onChange(newValue as Partial<PesticideType>);
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
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay pesticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<PesticideType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<PesticideType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<PesticideType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default PesticideSelectBase;
