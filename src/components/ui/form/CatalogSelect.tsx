'use client';
import { Icon } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  CSSObjectWithLabel,
  DropdownIndicatorProps,
  GroupBase,
  Props as SelectProps,
  Select as ChakraSelect,
  chakraComponents,
} from 'chakra-react-select';
import { FieldInputProps } from 'formik';
import React from 'react';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';

type CatalogOption = { id?: number | '' | null; name?: string | null };

type CatalogSelectProps<T extends CatalogOption> = SelectProps<
  T,
  false,
  GroupBase<T>
> & {
  field?: FieldInputProps<unknown>;
};

const styles = {
  menuPortal: (provided: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...provided,
    zIndex: 100,
  }),
};

function chakraStyles<T, IsMulti extends boolean>(): ChakraStylesConfig<
  T,
  IsMulti,
  GroupBase<T>
> {
  return {
    container: (provided) => ({ ...provided, w: 'full' }),
    placeholder: (provided) => ({ ...provided, color: 'fg.muted', h: 'auto' }),
    input: (provided) => ({ ...provided, color: 'fg.heading' }),
    option: (provided) => ({
      ...provided,
      borderBottom: '1px solid',
      borderColor: 'border',
    }),
  };
}

function DropdownIndicator<T, IsMulti extends boolean>(
  props: DropdownIndicatorProps<T, IsMulti, GroupBase<T>>
): React.JSX.Element {
  return (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='13px' asChild>
        <MdOutlineArrowDropDownCircle />
      </Icon>
    </chakraComponents.DropdownIndicator>
  );
}

// One select for the catalogs a form picks from by id. By default it labels an
// option by its name and shows the option whose id is the field's value; a
// select that needs something else passes it.
export default function CatalogSelect<T extends CatalogOption>({
  field,
  options,
  value,
  getOptionLabel = (option): string => `${option.name}`,
  getOptionValue = (option): string => (option.id ? option.id.toString() : ''),
  ...props
}: CatalogSelectProps<T>): React.JSX.Element {
  const selected =
    value !== undefined
      ? value
      : field?.value
        ? ((options as T[] | undefined)?.find(
            (option) => option.id === field.value
          ) ?? null)
        : null;

  return (
    <ChakraSelect<T, false, GroupBase<T>>
      {...field}
      menuPortalTarget={
        typeof document !== 'undefined' ? document.body : undefined
      }
      styles={styles}
      chakraStyles={chakraStyles<T, false>()}
      components={{ DropdownIndicator }}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      value={selected}
      {...props}
    />
  );
}

type CatalogMultiSelectProps<T extends CatalogOption> = SelectProps<
  T,
  true,
  GroupBase<T>
> & {
  field?: FieldInputProps<unknown>;
};

// The same select for a field that holds a list of ids.
export function CatalogMultiSelect<T extends CatalogOption>({
  field,
  options,
  value,
  getOptionLabel = (option): string => `${option.name}`,
  getOptionValue = (option): string => (option.id ? option.id.toString() : ''),
  ...props
}: CatalogMultiSelectProps<T>): React.JSX.Element {
  const ids = Array.isArray(field?.value) ? (field.value as unknown[]) : null;
  const selected =
    value !== undefined
      ? value
      : ids
        ? ((options as T[] | undefined)?.filter((option) =>
            ids.some((id) => id === option.id)
          ) ?? [])
        : [];

  return (
    <ChakraSelect<T, true, GroupBase<T>>
      {...field}
      isMulti
      menuPortalTarget={
        typeof document !== 'undefined' ? document.body : undefined
      }
      styles={styles}
      chakraStyles={chakraStyles<T, true>()}
      components={{ DropdownIndicator }}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      value={selected}
      {...props}
    />
  );
}
