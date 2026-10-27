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
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useParaseals } from '@/hooks/box-brand/materials/paraseal/getParaseals';
import { ParasealType } from '@/types/box-brand/materials/paraseal';

interface ParasealSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setParaseal?: (paraseal: Partial<ParasealType>) => void;
  onChange?: (newValue: Partial<ParasealType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ParasealType>,
  false,
  GroupBase<Partial<ParasealType>>
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

const parasealComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ParasealType>,
      false,
      GroupBase<Partial<ParasealType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ParasealSelectBase: React.FC<ParasealSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setParaseal,
  onChange,
}) => {
  const { data, isLoading, error } = useParaseals();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const { response } = error as any;
      if (response?.data?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleChange = (newValue: SingleValue<Partial<ParasealType>>): void => {
    if (setParaseal) setParaseal(newValue as Partial<ParasealType>);
    if (onChange) onChange(newValue as Partial<ParasealType>);
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
          ? (error as any).response.data.message
          : 'Ya no hay paraseal/es disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<ParasealType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<ParasealType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ParasealType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={parasealComponents}
    />
  );
};

export default ParasealSelectBase;
