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
import { useClusterBags } from '../../../../hooks/box-brand/materials/cluster-bag/getClusterBags';
import { usePagination } from '../../../../hooks/usePagination';
import { ClusterBagType } from '../../../../types/box-brand/materials/clusterBag';

interface ClusterBagSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setClusterBag?: (clusterBag: Partial<ClusterBagType>) => void;
  onChange?: (newValue: Partial<ClusterBagType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<ClusterBagType>,
  false,
  GroupBase<Partial<ClusterBagType>>
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

const clusterBagComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ClusterBagType>,
      false,
      GroupBase<Partial<ClusterBagType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon as={MdOutlineArrowDropDownCircle} size='13px' />
    </chakraComponents.DropdownIndicator>
  ),
};

const ClusterBagSelectBase: React.FC<ClusterBagSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setClusterBag,
  onChange,
}) => {
  const { paginationParams } = usePagination();
  const { data, isLoading, error } = useClusterBags(paginationParams);
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
    newValue: SingleValue<Partial<ClusterBagType>>
  ): void => {
    if (setClusterBag) setClusterBag(newValue as Partial<ClusterBagType>);
    if (onChange) onChange(newValue as Partial<ClusterBagType>);
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
          : 'Ya no hay cluster bag/s disponible/s'
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<ClusterBagType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<ClusterBagType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find((opt: Partial<ClusterBagType>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      //   onInputChange={(newValue) => {
      //     filterProps.setSearch(newValue);
      //     refetch();
      //   }}
      components={clusterBagComponents}
    />
  );
};

export default ClusterBagSelectBase;
