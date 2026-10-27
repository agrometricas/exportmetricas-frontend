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
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useContainerSealPlastics } from '../../../../hooks/box-brand/additions/container-seal-plastic/getContainerSealPlastics';
import { ContainerSealPlasticType } from '../../../../types/box-brand/additions/containerSealPlastic';

interface ContainerSealPlasticSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setContainerSealPlastic?: (
    containerSealPlastic: Partial<ContainerSealPlasticType>
  ) => void;
  onChange?: (newValue: Partial<ContainerSealPlasticType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ContainerSealPlasticType>,
  false,
  GroupBase<Partial<ContainerSealPlasticType>>
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
      Partial<ContainerSealPlasticType>,
      false,
      GroupBase<Partial<ContainerSealPlasticType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ContainerSealPlasticSelectBase: React.FC<
  ContainerSealPlasticSelectBaseProps
> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setContainerSealPlastic,
  onChange,
}) => {
  const { data = [], isLoading, error } = useContainerSealPlastics();

  useEffect(() => {
    if (!!setContainerSealPlastic)
      setContainerSealPlastic(
        (data as Partial<ContainerSealPlasticType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<ContainerSealPlasticType>
      );
  }, [field?.value, setContainerSealPlastic, data]);

  const handleChange = (
    newValue: SingleValue<Partial<ContainerSealPlasticType>>
  ): void => {
    if (setContainerSealPlastic) {
      setContainerSealPlastic(newValue as Partial<ContainerSealPlasticType>);
    }
    if (onChange) {
      onChange(newValue as Partial<ContainerSealPlasticType>);
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
          : 'Ya no hay plásticos de cierre contenedor disponibles'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<ContainerSealPlasticType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<ContainerSealPlasticType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<ContainerSealPlasticType>) =>
                opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default ContainerSealPlasticSelectBase;
