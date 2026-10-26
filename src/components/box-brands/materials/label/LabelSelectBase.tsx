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
import { useLabels } from '../../../../hooks/box-brand/materials/label/getLabels';
import { usePagination } from '../../../../hooks/usePagination';
import { LabelType } from '../../../../types/box-brand/materials/label';

interface LabelSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setLabel?: (label: Partial<LabelType> | null) => void;
  onChange?: (newValue: Partial<LabelType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<LabelType>,
  false,
  GroupBase<Partial<LabelType>>
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

const labelComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<LabelType>,
      false,
      GroupBase<Partial<LabelType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const LabelSelectBase: React.FC<LabelSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLabel,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useLabels(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (!!error) {
      const { response } = error as any;
      const { data } = response;
      const { statusCode } = data;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleChange = (newValue: SingleValue<Partial<LabelType>>): void => {
    if (setLabel) setLabel(newValue as Partial<LabelType>);
    if (onChange) onChange(newValue as Partial<LabelType>);
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          ({ ...provided, zIndex: 100 }) as CSSObjectWithLabel,
      }}
      useBasicStyles
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error
          ? (error as any).response.data.message
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<LabelType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<LabelType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<LabelType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={labelComponents}
    />
  );
};

export default LabelSelectBase;
