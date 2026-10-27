/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  CSSObjectWithLabel,
  SingleValue,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useBoxBrands } from '@/hooks/box-brand/getBoxBrands';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { BoxBrandType } from '../../types/box-brand/boxBrand';

interface BoxBrandSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setBoxBrand?: (brand: Partial<BoxBrandType>) => void;
  onChange?: (newValue: Partial<BoxBrandType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<BoxBrandType>,
  false,
  GroupBase<Partial<BoxBrandType>>
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

const brandComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<BoxBrandType>,
      false,
      GroupBase<Partial<BoxBrandType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const BoxBrandSelectBase: React.FC<BoxBrandSelectBaseProps> = ({
  setBoxBrand,
  onChange,
  field,
  placeholder,
  name,
}) => {
  const { data = [], isLoading, error } = useBoxBrands();
  const onlyOption: Partial<BoxBrandType> | null =
    data.length === 1 ? data[0] : null;

  const handleChange = (newValue: SingleValue<Partial<BoxBrandType>>): void => {
    if (setBoxBrand) {
      setBoxBrand(newValue as Partial<BoxBrandType>);
    }
    if (onChange) {
      onChange(newValue as Partial<BoxBrandType>);
    }
  };

  useEffect(() => {
    if (field && !field.value && onlyOption) handleChange(onlyOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyOption, field?.value]);

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
          ? serverErrorMessage(error)
          : 'Ya no hay tipo/s de caja disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<BoxBrandType>) =>
        `${opt.brand?.name} - ${opt.name}`
      }
      getOptionValue={(opt: Partial<BoxBrandType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<BoxBrandType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={brandComponents}
    />
  );
};

export default BoxBrandSelectBase;
