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
import { useSachets } from '../../../../hooks/box-brand/materials/sachet/getSachets';
import { SachetType } from '../../../../types/box-brand/materials/sachet';

interface SachetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setSachet?: (sachet: Partial<SachetType>) => void;
  onChange?: (newValue: Partial<SachetType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<SachetType>,
  false,
  GroupBase<Partial<SachetType>>
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

const sachetComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<SachetType>,
      false,
      GroupBase<Partial<SachetType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const SachetSelectBase: React.FC<SachetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSachet,
  onChange,
}) => {
  const { data, isLoading, error } = useSachets();
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

  const handleChange = (newValue: SingleValue<Partial<SachetType>>): void => {
    if (setSachet) setSachet(newValue as Partial<SachetType>);
    if (onChange) onChange(newValue as Partial<SachetType>);
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
          : 'Ya no hay sachet/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<SachetType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<SachetType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<SachetType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={sachetComponents}
    />
  );
};

export default SachetSelectBase;
