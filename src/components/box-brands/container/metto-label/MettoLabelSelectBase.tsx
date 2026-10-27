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
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useMettoLabels } from '../../../../hooks/box-brand/container/metto-label/getMettoLabels';
import { MettoLabelType } from '../../../../types/box-brand/container/mettoLabel';

interface MettoLabelSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
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

const mettoLabelComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<MettoLabelType>,
      false,
      GroupBase<Partial<MettoLabelType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
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
  const { data, isLoading, error } = useMettoLabels();

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
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay etiqueta/s metto disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<MettoLabelType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<MettoLabelType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<MettoLabelType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={mettoLabelComponents}
    />
  );
};

export default MettoLabelSelectBase;
