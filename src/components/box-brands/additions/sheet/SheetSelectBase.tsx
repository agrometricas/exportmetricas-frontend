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
import { useSheets } from '../../../../hooks/box-brand/additions/sheet/getSheets';
import { SheetType } from '../../../../types/box-brand/additions/sheet';

interface SheetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setSheet?: (sheet: Partial<SheetType>) => void;
  onChange?: (newValue: Partial<SheetType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<SheetType>,
  false,
  GroupBase<Partial<SheetType>>
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

const pesticideComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<SheetType>,
      false,
      GroupBase<Partial<SheetType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const SheetSelectBase: React.FC<SheetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  setSheet,
  onChange,
}) => {
  const { data = [], isLoading, error } = useSheets();
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

  useEffect(() => {
    if (!!setSheet)
      setSheet(
        (data as Partial<SheetType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<SheetType>
      );
  }, [field?.value, setSheet, data]);

  const handleChange = (newValue: SingleValue<Partial<SheetType>>): void => {
    if (setSheet) {
      setSheet(newValue as Partial<SheetType>);
    }
    if (onChange) {
      onChange(newValue as Partial<SheetType>);
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
          : 'Ya no hay hojas disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<SheetType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<SheetType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<SheetType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default SheetSelectBase;
