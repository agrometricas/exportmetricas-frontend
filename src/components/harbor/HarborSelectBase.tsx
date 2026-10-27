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
import { useHarborsByType } from '../../hooks/export/harbor/getHarborsByType';
import { HarborType } from '../../types/harbor';

interface HarborSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  type: 'Nacional' | 'Internacional';
  setHarbor?: (harbor: Partial<HarborType>) => void;
  onChange?: (newValue: Partial<HarborType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<HarborType>,
  false,
  GroupBase<Partial<HarborType>>
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

const harborComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<HarborType>,
      false,
      GroupBase<Partial<HarborType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const HarborSelectBase: React.FC<HarborSelectBaseProps> = ({
  name,
  placeholder,
  field,
  type,
  onChange,
  setHarbor,
}) => {
  const { data = [], isLoading, error } = useHarborsByType({ type });

  const handleChange = (newValue: SingleValue<Partial<HarborType>>): void => {
    if (setHarbor) {
      setHarbor(newValue as Partial<HarborType>);
    }

    if (onChange) {
      onChange(newValue as Partial<HarborType>);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay puerto/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<HarborType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<HarborType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<HarborType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={harborComponents}
    />
  );
};

export default HarborSelectBase;
