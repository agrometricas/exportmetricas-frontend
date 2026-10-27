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
import { useVerifiers } from '../../hooks/verifier/getVerifiers';
import { VerifierResponse } from '../../types/verifier/verifier.response';

interface VerifierSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setVerifier?: (verifier: Partial<VerifierResponse>) => void;
  onChange?: (newValue: Partial<VerifierResponse>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<VerifierResponse>,
  false,
  GroupBase<Partial<VerifierResponse>>
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

const verifierComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<VerifierResponse>,
      false,
      GroupBase<Partial<VerifierResponse>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const VerifierSelectBase: React.FC<VerifierSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setVerifier,
}) => {
  const { data = [], isLoading, error } = useVerifiers();
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
  }, [error, router]);

  const handleChange = (
    newValue: SingleValue<Partial<VerifierResponse>>
  ): void => {
    if (setVerifier) {
      setVerifier(newValue as Partial<VerifierResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<VerifierResponse>);
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
          : 'No hay verificadoras disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<VerifierResponse>) => `${opt.name}`}
      getOptionValue={(opt: Partial<VerifierResponse>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<VerifierResponse>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={verifierComponents}
    />
  );
};

export default VerifierSelectBase;
