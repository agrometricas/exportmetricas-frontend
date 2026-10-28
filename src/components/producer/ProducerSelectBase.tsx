import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useMerchants } from '../../hooks/merchants/getMerchants';
import { MerchantResponse } from '../../types/merchant/merchant.response';

interface ProducerSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setProducer?: (producer: Partial<MerchantResponse>) => void;
  onChange?: (newValue: Partial<MerchantResponse>) => void;
}

const ProducerSelectBase: React.FC<ProducerSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setProducer,
}) => {
  const { data = [], isLoading, error } = useMerchants();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleChange = (newValue: SingleValue<Partial<MerchantResponse>>) => {
    if (setProducer) {
      setProducer(newValue as Partial<MerchantResponse>);
    }

    if (onChange) {
      onChange(newValue as Partial<MerchantResponse>);
    }
  };

  return (
    <CatalogSelect<Partial<MerchantResponse>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay productor/es disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<MerchantResponse>) => `${opt.businessName}`}
      onChange={(newValue) => handleChange(newValue)}
      placeholder={placeholder}
    />
  );
};

export default ProducerSelectBase;
