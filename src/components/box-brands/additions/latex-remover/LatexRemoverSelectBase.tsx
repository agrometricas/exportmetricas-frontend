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
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useLatexRemovers } from '../../../../hooks/box-brand/additions/latex-remover/getLatexRemovers';
import { usePagination } from '../../../../hooks/usePagination';
import { LatexRemoverType } from '../../../../types/box-brand/additions/latexRemover';

interface LatexRemoverSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
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
    color: 'gray.600',
    h: 'auto',
  }),
  input: (provided) => ({
    ...provided,
    color: 'gray.900',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'gray.200',
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
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
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
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useLatexRemovers(paginationParams);
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
          ({ ...provided, zIndex: 100 }) as CSSObjectWithLabel,
      }}
      useBasicStyles
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error
          ? (error as any).response.data.message
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
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
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={latexRemoverComponents}
    />
  );
};

export default LatexRemoverSelectBase;
