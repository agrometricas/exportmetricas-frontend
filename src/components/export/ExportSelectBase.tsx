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
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { ExportType } from '@/types/export';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useExportsPending } from '../../hooks/export/getExportsPending';

interface ExportSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setExport?: (exportSelected: Partial<ExportType>) => void;
  onChange?: (newValue: Partial<ExportType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ExportType>,
  false,
  GroupBase<Partial<ExportType>>
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
      Partial<ExportType>,
      false,
      GroupBase<Partial<ExportType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ExportSelectBase: React.FC<ExportSelectBaseProps> = ({
  name,
  field,
  placeholder,
  onChange,
  setExport,
}) => {
  const { data, isLoading, error } = useExportsPending();

  const handleChange = (newValue: SingleValue<Partial<ExportType>>): void => {
    if (setExport) {
      setExport(newValue as Partial<ExportType>);
    }
    if (onChange) {
      onChange(newValue as Partial<ExportType>);
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
          ? serverErrorMessage(error)
          : 'Ya no hay exportacion/es pendiente/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<ExportType>) => `${opt.id}`}
      getOptionValue={(opt: Partial<ExportType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ExportType>) => opt.id === field?.value)
          : undefined
      }
      placeholder={placeholder}
      components={brandComponents}
    />
  );
};

export default ExportSelectBase;
