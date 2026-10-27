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
import { useMerchants } from '../../hooks/merchants/getMerchants';
import { MerchantResponse } from '../../types/merchant/merchant.response';

interface ProducerSelectBaseProps {
  name?: string;
  field?: FieldInputProps<unknown>;
  placeholder: string;
  setProducer?: (producer: Partial<MerchantResponse>) => void;
  onChange?: (newValue: Partial<MerchantResponse>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<MerchantResponse>,
  false,
  GroupBase<Partial<MerchantResponse>>
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

const producerComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<MerchantResponse>,
      false,
      GroupBase<Partial<MerchantResponse>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild><MdOutlineArrowDropDownCircle /></Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const ProducerSelectBase: React.FC<ProducerSelectBaseProps> = ({
  name,
  placeholder,
  field,
  onChange,
  setProducer,
}) => {
  const { data = [], isLoading, error } = useMerchants();
  const router = useRouter();

  useEffect(() => {
    if (!!error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { response } = error as any;
      const { data } = response;
      const { statusCode } = data;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
    <ChakraSelect
      {...field}
      name={name}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (provided) =>
          (({
            ...provided,
            zIndex: 100,
          }) as CSSObjectWithLabel),
      }}

      chakraStyles={chakraStyles}
      noOptionsMessage={() =>
        !!error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).response.data.message
          : 'Ya no hay productor/es disponible/s'
      }
      isLoading={isLoading}
      options={data}
      getOptionLabel={(opt: Partial<MerchantResponse>) => `${opt.businessName}`}
      getOptionValue={(opt: Partial<MerchantResponse>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find((opt: Partial<MerchantResponse>) => opt.id === field?.value)
          : null
      }
      placeholder={placeholder}
      components={producerComponents}
    />
  );
};

export default ProducerSelectBase;
