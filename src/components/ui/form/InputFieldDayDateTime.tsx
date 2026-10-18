import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import { INVALID_DAY_DATE } from './InputFieldDayDate';
import {
  atHourMinute,
  formatDayMonthYear,
  formatHourMinute,
  maskDayMonthYear,
  maskHourMinute,
  parseDayMonthYear,
} from '../../../utils/dayMonthYear';

interface InputFieldDayDateTimeProps {
  name: string;
  label?: string;
}

// A day in DD/MM/AAAA and a time in HH:mm, held as one ISO string of the
// moment they name in local time: the native datetime input follows the
// browser language and its old wrapper shifted the hour.
const InputFieldDayDateTime: React.FC<InputFieldDayDateTimeProps> = ({
  name,
  label,
}) => {
  const [field, meta, helpers] = useField<string | Date | ''>(name);
  const [day, setDay] = useState(formatDayMonthYear(field.value || null));
  const [time, setTime] = useState(formatHourMinute(field.value || null));

  useEffect(() => {
    if (field.value === INVALID_DAY_DATE) return;
    setDay(formatDayMonthYear(field.value || null));
    setTime(formatHourMinute(field.value || null));
  }, [field.value]);

  const commit = (nextDay: string, nextTime: string): void => {
    if (!nextDay && !nextTime) {
      helpers.setValue('');
      return;
    }
    const date = parseDayMonthYear(nextDay);
    const moment = date ? atHourMinute(date.toISOString(), nextTime) : null;
    helpers.setValue(moment ?? INVALID_DAY_DATE);
  };

  return (
    <FormControl id={name} isInvalid={!!meta.error && meta.touched}>
      <Flex flexDirection='column'>
        {label && (
          <FormLabel fontSize='sm' mb='8px'>
            {label}
          </FormLabel>
        )}
        <HStack spacing={2}>
          <Input
            name={field.name}
            onBlur={field.onBlur}
            value={day}
            onChange={(e) => {
              const next = maskDayMonthYear(e.target.value);
              setDay(next);
              commit(next, time);
            }}
            placeholder='DD/MM/AAAA'
            inputMode='numeric'
          />
          <Input
            onBlur={field.onBlur}
            name={field.name}
            value={time}
            onChange={(e) => {
              const next = maskHourMinute(e.target.value);
              setTime(next);
              commit(day, next);
            }}
            placeholder='HH:mm'
            inputMode='numeric'
            maxW='110px'
          />
        </HStack>
        {meta.error && meta.touched && (
          <FormErrorMessage mt='8px' mb='16px'>
            {meta.error}
          </FormErrorMessage>
        )}
      </Flex>
    </FormControl>
  );
};

export default InputFieldDayDateTime;
