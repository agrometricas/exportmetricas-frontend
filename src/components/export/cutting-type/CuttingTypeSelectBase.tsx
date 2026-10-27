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
import { useCuttingTypes } from '../../../hooks/export/cutting-type/getCuttingTypes';
import { usePagination } from '../../../hooks/usePagination';
import { CuttingType } from '../../../types/cuttingType';

interface CuttingTypeSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setCuttingType?: (cuttingType: Partial<CuttingType>) => void;
  onChange?: (newValue: Partial<CuttingType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<CuttingType>,
  false,
  GroupBase<Partial<CuttingType>>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'gray.600',
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

const cuttingTypeComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<CuttingType>,
      false,
      GroupBase<Partial<CuttingType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CuttingTypeSelectBase: React.FC<CuttingTypeSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setCuttingType,
}) => {
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error } = useCuttingTypes(paginationParams);
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

  const handleChange = (newValue: SingleValue<Partial<CuttingType>>): void => {
    if (setCuttingType) {
      setCuttingType(newValue as Partial<CuttingType>);
    }

    if (onChange) {
      onChange(newValue as Partial<CuttingType>);
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
          ? (error as any).response.data.message
          : 'Ya no hay corte/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<CuttingType>) => `${opt.shipmentType}`}
      getOptionValue={(opt: Partial<CuttingType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<CuttingType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={cuttingTypeComponents}
    />
  );
};

export default CuttingTypeSelectBase;
