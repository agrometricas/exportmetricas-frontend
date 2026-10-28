import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useBusinessesByMerchantId } from '../../hooks/business/getBusinesses';
import { BusinessType } from '../../types/merchant/business';

interface BusinessSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  merchant?: number;
  setBusiness?: (business: Partial<BusinessType>) => void;
  onChange?: (newValue: Partial<BusinessType>) => void;
}

const BusinessSelectBase: React.FC<BusinessSelectBaseProps> = ({
  name,
  placeholder,
  field,
  merchant,
  onChange,
  setBusiness,
}) => {
  const { data, isLoading, isPlaceholderData, error } =
    useBusinessesByMerchantId({ id: merchant ?? 0 });

  // keepPreviousData would otherwise offer the farm of the producer chosen
  // before as the only option.
  const onlyOption: Partial<BusinessType> | null =
    !isPlaceholderData && data?.length === 1 ? data[0] : null;

  const handleChange = (newValue: SingleValue<Partial<BusinessType>>): void => {
    if (setBusiness) {
      setBusiness(newValue as Partial<BusinessType>);
    }

    if (onChange) {
      onChange(newValue as Partial<BusinessType>);
    }
  };

  useEffect(() => {
    if (field && !field.value && onlyOption) handleChange(onlyOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyOption, field?.value]);

  return (
    <CatalogSelect<Partial<BusinessType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error ? serverErrorMessage(error) : 'Ya no hay finca/s disponible/s'
      }
      isLoading={isLoading}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default BusinessSelectBase;
