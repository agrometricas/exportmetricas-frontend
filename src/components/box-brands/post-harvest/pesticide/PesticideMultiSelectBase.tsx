/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  MultiValue,
  chakraComponents,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { usePesticides } from '../../../../hooks/box-brand/post-harvest/pesticide/getPesticides';
import { usePagination } from '../../../../hooks/usePagination';
import { PesticideType } from '../../../../types/box-brand/post-harvest/pesticide';

interface PesticideMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setPesticides?: (pesticides: Partial<PesticideType>[]) => void;
  onChange?: (newValues: Partial<PesticideType>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<PesticideType>,
  true,
  GroupBase<Partial<PesticideType>>
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

const pesticideComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<PesticideType>,
      true,
      GroupBase<Partial<PesticideType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const PesticideMultiSelectBase: React.FC<PesticideMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setPesticides,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = usePesticides(paginationParams);
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
    newValues: MultiValue<Partial<PesticideType>>
  ): void => {
    if (setPesticides) {
      setPesticides(newValues as Partial<PesticideType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<PesticideType>[]);
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
        !!error
          ? (error as any).response.data.message
          : 'Ya no hay pesticida/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(pesticide: Partial<PesticideType>) =>
        `${pesticide.brandName} - ${pesticide.name}`
      }
      getOptionValue={(pesticide: Partial<PesticideType>) =>
        pesticide.id ? pesticide.id.toString() : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<PesticideType>[])
      }
      value={
        field?.value
          ? data.filter(
              (opt: Partial<PesticideType>) => field.value.indexOf(opt.id) >= 0
            )
          : []
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default PesticideMultiSelectBase;
