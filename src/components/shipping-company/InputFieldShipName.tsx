import React from 'react';
import { useVessels } from '../../hooks/export/shippingCompany/getVessels';
import { Vessel } from '../../types/vessel';
import InputFieldPlain from '../ui/form/InputFieldPlain';

interface InputFieldShipNameProps {
  name: string;
  label: string;
  shippingCompanyId: number | '';
}

export default function InputFieldShipName({
  name,
  label,
  shippingCompanyId,
}: InputFieldShipNameProps): React.JSX.Element {
  const { data } = useVessels(shippingCompanyId);
  const vessels = (data ?? []) as Vessel[];
  return (
    <InputFieldPlain
      name={name}
      label={label}
      suggestions={vessels.map((vessel) => vessel.name)}
    />
  );
}
