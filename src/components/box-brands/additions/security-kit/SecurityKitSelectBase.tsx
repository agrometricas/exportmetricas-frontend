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
import { useSecurityKits } from '../../../../hooks/box-brand/additions/security-kit/getSecurityKits';
import { SecurityKitType } from '../../../../types/box-brand/additions/securityKit';

interface SecurityKitSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setSecurityKit?: (securityKit: Partial<SecurityKitType>) => void;
  onChange?: (newValue: Partial<SecurityKitType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<SecurityKitType>,
  false,
  GroupBase<Partial<SecurityKitType>>
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
      Partial<SecurityKitType>,
      false,
      GroupBase<Partial<SecurityKitType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const SecurityKitSelectBase: React.FC<SecurityKitSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setSecurityKit,
  onChange,
}) => {
  const { data = [], isLoading, error } = useSecurityKits();
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
    if (!!setSecurityKit)
      setSecurityKit(
        (data as Partial<SecurityKitType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<SecurityKitType>
      );
  }, [field?.value, setSecurityKit, data]);

  const handleChange = (
    newValue: SingleValue<Partial<SecurityKitType>>
  ): void => {
    if (setSecurityKit) {
      setSecurityKit(newValue as Partial<SecurityKitType>);
    }
    if (onChange) {
      onChange(newValue as Partial<SecurityKitType>);
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
          : 'Ya no hay kits de seguridad disponibles'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<SecurityKitType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<SecurityKitType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<SecurityKitType>) => opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
      components={pesticideComponents}
    />
  );
};

export default SecurityKitSelectBase;
