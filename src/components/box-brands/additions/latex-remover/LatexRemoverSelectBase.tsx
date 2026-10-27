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
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useLatexRemovers } from '../../../../hooks/box-brand/additions/latex-remover/getLatexRemovers';
import { LatexRemoverType } from '../../../../types/box-brand/additions/latexRemover';

interface LatexRemoverSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setLatexRemover?: (latexRemover: Partial<LatexRemoverType>) => void;
  onChange?: (newValue: Partial<LatexRemoverType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<LatexRemoverType>,
  false,
  GroupBase<Partial<LatexRemoverType>>
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

const latexRemoverComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<LatexRemoverType>,
      false,
      GroupBase<Partial<LatexRemoverType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const LatexRemoverSelectBase: React.FC<LatexRemoverSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setLatexRemover,
  onChange,
}) => {
  const { data, isLoading, error } = useLatexRemovers();

  const handleChange = (
    newValue: SingleValue<Partial<LatexRemoverType>>
  ): void => {
    if (setLatexRemover) setLatexRemover(newValue as Partial<LatexRemoverType>);
    if (onChange) onChange(newValue as Partial<LatexRemoverType>);
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
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<LatexRemoverType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<LatexRemoverType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<LatexRemoverType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={latexRemoverComponents}
    />
  );
};

export default LatexRemoverSelectBase;
