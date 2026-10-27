/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Icon, Text } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  MultiValue,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useCertificates } from '../../hooks/utils/getCertificates';
import { Certificate } from '../../types/utils/certificate';

interface CertificateMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setCertificates?: (certificates: Partial<Certificate>[]) => void;
  onChange?: (newValues: Partial<Certificate>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<Certificate>,
  true,
  GroupBase<Partial<Certificate>>
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

const certificateComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<Certificate>,
      true,
      GroupBase<Partial<Certificate>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const CertificateMultiSelectBase: React.FC<CertificateMultiSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setCertificates,
}) => {
  const { data, isLoading, error } = useCertificates();
  const router = useRouter();
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;
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

  const handleChange = (newValues: MultiValue<Partial<Certificate>>): void => {
    if (setCertificates) {
      setCertificates(newValues as Partial<Certificate>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<Certificate>[]);
    }
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      isMulti
      menuPortalTarget={menuPortalTarget}
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
          : 'Ya no hay certificados disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<Certificate>) => `${opt.name}`}
      formatOptionLabel={(opt: Partial<Certificate>, { context }) =>
        context === 'menu' && opt.description ? (
          <Box>
            <Text>{opt.name}</Text>
            <Text fontSize='xs' color='fg.muted'>
              {opt.description}
            </Text>
          </Box>
        ) : (
          opt.name
        )
      }
      getOptionValue={(opt: Partial<Certificate>) =>
        opt.id ? String(opt.id) : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<Certificate>[])
      }
      value={
        field?.value
          ? data?.filter(
              (opt: Partial<Certificate>) => field.value.indexOf(opt.id) >= 0
            )
          : []
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={certificateComponents}
    />
  );
};

export default CertificateMultiSelectBase;
