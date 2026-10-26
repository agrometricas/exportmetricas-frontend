/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useMettoLabels } from '../../../../hooks/box-brand/container/metto-label/getMettoLabels';
import { usePagination } from '../../../../hooks/usePagination';
import { MettoLabelType } from '../../../../types/box-brand/container/mettoLabel';

interface MettoLabelSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setMettoLabel?: (mettoLabel: Partial<MettoLabelType>) => void;
  onChange?: (newValue: Partial<MettoLabelType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<MettoLabelType>,
  false,
  GroupBase<Partial<MettoLabelType>>
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

const mettoLabelComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<MettoLabelType>,
      false,
      GroupBase<Partial<MettoLabelType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const MettoLabelSelectBase: React.FC<MettoLabelSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setMettoLabel,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useMettoLabels(paginationParams);
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

  const handleChange = (
    newValue: SingleValue<Partial<MettoLabelType>>
  ): void => {
    if (setMettoLabel) setMettoLabel(newValue as Partial<MettoLabelType>);
    if (onChange) onChange(newValue as Partial<MettoLabelType>);
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
          : 'Ya no hay etiqueta/s metto disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<MettoLabelType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<MettoLabelType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<MettoLabelType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={mettoLabelComponents}
    />
  );
};

export default MettoLabelSelectBase;
