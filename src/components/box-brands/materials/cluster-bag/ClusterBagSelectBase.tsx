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
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useClusterBags } from '../../../../hooks/box-brand/materials/cluster-bag/getClusterBags';
import { ClusterBagType } from '../../../../types/box-brand/materials/clusterBag';

interface ClusterBagSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
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

const clusterBagComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<ClusterBagType>,
      false,
      GroupBase<Partial<ClusterBagType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
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
  const { data, isLoading, error } = useClusterBags();

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
          ({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay cluster bag/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<ClusterBagType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<ClusterBagType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<ClusterBagType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={clusterBagComponents}
    />
  );
};

export default ClusterBagSelectBase;
