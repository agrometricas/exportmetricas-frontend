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
import { useReinforcements } from '@/hooks/box-brand/materials/reinforcement/getReinforcements';
import { ReinforcementType } from '@/types/box-brand/materials/reinforcement';
import { serverErrorMessage } from '@/utils/serverErrorMessage';

interface ReinforcementSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setReinforcement?: (reinforcement: Partial<ReinforcementType>) => void;
  onChange?: (newValue: Partial<ReinforcementType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ReinforcementType>,
  false,
  GroupBase<Partial<ReinforcementType>>
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

const reinforcementComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ReinforcementType>,
      false,
      GroupBase<Partial<ReinforcementType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ReinforcementSelectBase: React.FC<ReinforcementSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setReinforcement,
  onChange,
}) => {
  const { data, isLoading, error } = useReinforcements();

  const handleChange = (
    newValue: SingleValue<Partial<ReinforcementType>>
  ): void => {
    if (setReinforcement)
      setReinforcement(newValue as Partial<ReinforcementType>);
    if (onChange) onChange(newValue as Partial<ReinforcementType>);
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
        error
          ? serverErrorMessage(error)
          : 'Ya no hay reinforcement/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<ReinforcementType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<ReinforcementType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<ReinforcementType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={reinforcementComponents}
    />
  );
};

export default ReinforcementSelectBase;
