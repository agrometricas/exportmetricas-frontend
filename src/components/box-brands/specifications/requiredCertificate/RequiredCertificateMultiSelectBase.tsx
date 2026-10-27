/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
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
import { useRequiredCertificates } from '../../../../hooks/box-brand/specifications/certificate/getRequiredCertificates';
import { usePagination } from '../../../../hooks/usePagination';
import { RequiredCertificateType } from '../../../../types/box-brand/specifications/requiredCertificate';

interface RequiredCertificateMultiSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  setCertificates?: (certificates: Partial<RequiredCertificateType>[]) => void;
  onChange?: (newValues: Partial<RequiredCertificateType>[]) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<RequiredCertificateType>,
  true,
  GroupBase<Partial<RequiredCertificateType>>
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
      Partial<RequiredCertificateType>,
      true,
      GroupBase<Partial<RequiredCertificateType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const RequiredCertificateMultiSelectBase: React.FC<
  RequiredCertificateMultiSelectBaseProps
> = ({ name, placeholder, field, onChange, setCertificates }) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useRequiredCertificates(paginationParams);
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

  const handleChange = (
    newValues: MultiValue<Partial<RequiredCertificateType>>
  ): void => {
    if (setCertificates) {
      setCertificates(newValues as Partial<RequiredCertificateType>[]);
    }

    if (onChange) {
      onChange(newValues as Partial<RequiredCertificateType>[]);
    }
  };

  return (
    <ChakraSelect
      {...field}
      name={name}
      isMulti
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
          : 'Ya no hay certificados disponibles'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<RequiredCertificateType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<RequiredCertificateType>) =>
        opt.id ? String(opt.id) : ''
      }
      onChange={(newValues) =>
        handleChange(newValues as Partial<RequiredCertificateType>[])
      }
      value={
        field?.value
          ? data.filter(
              (opt: Partial<RequiredCertificateType>) =>
                field.value.indexOf(opt.id) >= 0
            )
          : []
      }
      closeMenuOnSelect={false}
      placeholder={placeholder}
      components={certificateComponents}
    />
  );
};

export default RequiredCertificateMultiSelectBase;
