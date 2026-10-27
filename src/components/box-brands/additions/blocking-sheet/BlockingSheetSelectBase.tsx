/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  DropdownIndicatorProps,
  Select as ChakraSelect,
  GroupBase,
  chakraComponents,
  SingleValue,
  CSSObjectWithLabel,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { useBlockingSheets } from '../../../../hooks/box-brand/additions/blocking-sheet/getBlockingSheets';
import { BlockingSheetType } from '../../../../types/box-brand/additions/blockingSheet';

interface BlockingSheetSelectBaseProps {
  name?: string;
  field?: FieldInputProps<any>;
  placeholder: string;
  isReadOnly?: boolean;
  setBlockingSheet?: (blockingSheet: Partial<BlockingSheetType>) => void;
  onChange?: (newValue: Partial<BlockingSheetType>) => void;
}

const chakraStyles: ChakraStylesConfig<
  Partial<BlockingSheetType>,
  false,
  GroupBase<Partial<BlockingSheetType>>
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

const blockingSheetComponents = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<
      Partial<BlockingSheetType>,
      false,
      GroupBase<Partial<BlockingSheetType>>
    >
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

const BlockingSheetSelectBase: React.FC<BlockingSheetSelectBaseProps> = ({
  name,
  field,
  placeholder,
  isReadOnly = false,
  setBlockingSheet,
  onChange,
}) => {
  const { data, isLoading, error } = useBlockingSheets();
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
    newValue: SingleValue<Partial<BlockingSheetType>>
  ): void => {
    if (setBlockingSheet)
      setBlockingSheet(newValue as Partial<BlockingSheetType>);
    if (onChange) onChange(newValue as Partial<BlockingSheetType>);
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
          ? (error as any).response.data.message
          : 'Ya no hay etiqueta/s disponible/s'
      }
      isLoading={isLoading}
      readOnly={isReadOnly}
      options={data}
      getOptionLabel={(opt: Partial<BlockingSheetType>) => `${opt.name}`}
      getOptionValue={(opt: Partial<BlockingSheetType>) =>
        opt.id ? opt.id.toString() : ''
      }
      onChange={(newValue) => handleChange(newValue)}
      value={
        field?.value
          ? data?.find(
              (opt: Partial<BlockingSheetType>) => opt.id === field?.value
            )
          : null
      }
      placeholder={placeholder}
      components={blockingSheetComponents}
    />
  );
};

export default BlockingSheetSelectBase;
