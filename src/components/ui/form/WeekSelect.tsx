'use client';

import { Icon } from '@chakra-ui/react';
import {
  Select as ChakraSelect,
  chakraComponents,
  ChakraStylesConfig,
  DropdownIndicatorProps,
  GroupBase,
  CSSObjectWithLabel,
  SingleValue,
} from 'chakra-react-select';
import {
  getISOWeek,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
} from 'date-fns';
import React from 'react';
import { FaAngleDown } from 'react-icons/fa6';

interface WeekOption {
  label: string;
  value: number;
}

interface WeekSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  month: number;
}

const chakraStyles: ChakraStylesConfig<
  WeekOption,
  false,
  GroupBase<WeekOption>
> = {
  container: (provided) => ({
    ...provided,
    w: 'full',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid',
    borderColor: 'border',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'fg.muted',
  }),
  input: (provided) => ({
    ...provided,
    color: 'fg.heading',
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '200px',
  }),
};

const components = {
  DropdownIndicator: (
    props: DropdownIndicatorProps<WeekOption, false, GroupBase<WeekOption>>
  ): React.JSX.Element => (
    <chakraComponents.DropdownIndicator {...props}>
      <Icon boxSize='14px' asChild>
        <FaAngleDown />
      </Icon>
    </chakraComponents.DropdownIndicator>
  ),
};

export default function WeekSelect({
  value,
  onChange,
  placeholder = 'Filtrar por semana',
  month,
}: WeekSelectProps): React.JSX.Element {
  const monthStart = startOfMonth(new Date(new Date().getFullYear(), month));
  const monthEnd = endOfMonth(monthStart);
  const weekDates = eachWeekOfInterval({ start: monthStart, end: monthEnd });
  const weeksOptions: WeekOption[] = weekDates.map((date) => {
    let weekNum = getISOWeek(date);
    if (month === 0 && weekNum === 52) {
      weekNum = 0;
    }
    return { label: `Semana ${weekNum + 1}`, value: weekNum + 1 };
  });
  const selectedOption =
    weeksOptions.find((opt) => opt.value === value) ?? null;

  const handleChange = (option: SingleValue<WeekOption>): void => {
    if (option) {
      onChange(option.value);
    } else {
      onChange(null);
    }
  };

  return (
    <ChakraSelect
      isSearchable={false}
      options={weeksOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      isClearable
      chakraStyles={chakraStyles}
      components={components}
      menuPortalTarget={
        typeof window !== 'undefined' ? document.body : undefined
      }
      styles={{
        menuPortal: (base) =>
          ({
            ...base,
            zIndex: 100,
          }) as CSSObjectWithLabel,
      }}
    />
  );
}
