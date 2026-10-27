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
import { useReinforcements } from '@/hooks/box-brand/materials/reinforcement/getReinforcements';
import { usePagination } from '@/hooks/usePagination';
import { ReinforcementType } from '@/types/box-brand/materials/reinforcement';

interface ReinforcementSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
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
    color: 'gray.600',
    h: 'auto',
  }),
  input: (provided) => ({
    ...provided,
    color: 'gray.900',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'gray.200',
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
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useReinforcements(paginationParams);
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
          ? (error as any).response.data.message
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
