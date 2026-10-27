import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  CSSObjectWithLabel,
  MultiValue,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useIncoterms } from '../../hooks/export/client/incoterm/getIncoterms';

export interface IncotermType {
  id: number;
  name: string;
}

interface IncotermMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number[]>;
  placeholder: string;
  setIncoterms?: (incoterms: Partial<IncotermType>[]) => void;
  onChange?: (newValues: Partial<IncotermType>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<IncotermType>,
  true,
  GroupBase<Partial<IncotermType>>
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

const incotermComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<IncotermType>,
      true,
      GroupBase<Partial<IncotermType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const IncotermMultiSelectBase: React.FC<IncotermMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setIncoterms,
}) => {
  const { data, isLoading, error } = useIncoterms();

  const handleChange = (newValues: MultiValue<Partial<IncotermType>>): void => {
    if (setIncoterms) {
      setIncoterms(newValues as Partial<IncotermType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<IncotermType>[]);
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
        !!error ? serverErrorMessage(error) : 'Ya no hay puerto/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(incoterm: Partial<IncotermType>) => `${incoterm.name}`}
      getOptionValue={(incoterm: Partial<IncotermType>) =>
        incoterm.id ? incoterm.id.toString() : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<IncotermType>[])
      }
      value={
        field?.value
          ? data?.filter((opt: Partial<IncotermType>) =>
              field.value.some((id) => id === opt.id)
            )
          : []
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={incotermComponents}
    />
  );
};

export default IncotermMultiSelectBase;
