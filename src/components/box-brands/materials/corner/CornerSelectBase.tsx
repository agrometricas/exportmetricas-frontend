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
import { useCorners } from '@/hooks/box-brand/materials/corner/getCorners';
import { usePagination } from '@/hooks/usePagination';
import { CornerType } from '@/types/box-brand/materials/corner';

interface CornerSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setCorner?: (corner: Partial<CornerType>) => void;
  onChange?: (newValue: Partial<CornerType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<CornerType>,
  false,
  GroupBase<Partial<CornerType>>
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

const cornerComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<CornerType>,
      false,
      GroupBase<Partial<CornerType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CornerSelectBase: React.FC<CornerSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setCorner,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useCorners(paginationParams);
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

  const handleChange = (newValue: SingleValue<Partial<CornerType>>): void => {
    if (setCorner) setCorner(newValue as Partial<CornerType>);
    if (onChange) onChange(newValue as Partial<CornerType>);
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
          : 'Ya no hay corner/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<CornerType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<CornerType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<CornerType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={cornerComponents}
    />
  );
};

export default CornerSelectBase;
