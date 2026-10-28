import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
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
    <CatalogSelect<Partial<ClusterBagType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay cluster bag/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ClusterBagSelectBase;
