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
import { useDeposits } from '../../hooks/deposit/getDeposits';
import { DepositResponse } from '../../types/deposit/deposit.response';

interface DepositSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setDeposit?: (deposit: Partial<DepositResponse>) => void;
  onChange?: (newValue: Partial<DepositResponse>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<DepositResponse>,
  false,
  GroupBase<Partial<DepositResponse>>
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

const depositComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<DepositResponse>,
      false,
      GroupBase<Partial<DepositResponse>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const DepositSelectBase: React.FC<DepositSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setDeposit,
}) => {
  const { data = [], isLoading, error } = useDeposits();

  const handleChange = (
    newValue: SingleValue<Partial<DepositResponse>>
  ): void => {
    if (setDeposit) {
      setDeposit(newValue as Partial<DepositResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<DepositResponse>);
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
        !!error ? serverErrorMessage(error) : 'No hay depositos disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<DepositResponse>) => `${opt.name}`}
      getOptionValue={(opt: Partial<DepositResponse>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<DepositResponse>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={depositComponents}
    />
  );
};

export default DepositSelectBase;
