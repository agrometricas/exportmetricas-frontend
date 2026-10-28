import { SingleValue } from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React, { useEffect } from 'react';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useContainerSealPlastics } from '../../../../hooks/box-brand/additions/container-seal-plastic/getContainerSealPlastics';
import { ContainerSealPlasticType } from '../../../../types/box-brand/additions/containerSealPlastic';

interface ContainerSealPlasticSelectBaseProps {
  name?: string;
  field?: FieldInputProps<number | ''>;
  placeholder: string;
  isReadOnly?: boolean;
  setContainerSealPlastic?: (
    containerSealPlastic: Partial<ContainerSealPlasticType>
  ) => void;
  onChange?: (newValue: Partial<ContainerSealPlasticType>) => void;
}

const ContainerSealPlasticSelectBase: React.FC<
  ContainerSealPlasticSelectBaseProps
> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setContainerSealPlastic,
  onChange,
}) => {
  const { data = [], isLoading, error } = useContainerSealPlastics();

  useEffect(() => {
    if (!!setContainerSealPlastic)
      setContainerSealPlastic(
        (data as Partial<ContainerSealPlasticType>[]).find(
          (pesticide) => pesticide.id === field?.value
        ) as Partial<ContainerSealPlasticType>
      );
  }, [field?.value, setContainerSealPlastic, data]);

  const handleChange = (
    newValue: SingleValue<Partial<ContainerSealPlasticType>>
  ): void => {
    if (setContainerSealPlastic) {
      setContainerSealPlastic(newValue as Partial<ContainerSealPlasticType>);
    }
    if (onChange) {
      onChange(newValue as Partial<ContainerSealPlasticType>);
    }
  };

  return (
    <CatalogSelect<Partial<ContainerSealPlasticType>>
      field={field}
      name={name}
      noOptionsMessage={() =>
        !!error
          ? serverErrorMessage(error)
          : 'Ya no hay plásticos de cierre contenedor disponibles'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data.find(
              (opt: Partial<ContainerSealPlasticType>) =>
                opt.id === field?.value
            )
          : undefined
      }
      placeholder={placeholder}
    />
  );
};

export default ContainerSealPlasticSelectBase;
