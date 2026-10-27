'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdAgriculture } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import EditBusinessForm from '../../../../../components/business/edit/EditBusinessForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useBusiness } from '../../../../../hooks/business/getBusiness';
import { BusinessDetail } from '../../../../../types/merchant/businessDetail';

function EditBusinessPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBusiness({ businessId: id });
  const business = data as unknown as BusinessDetail | undefined;

  return (
    <CardPage
      icon={MdAgriculture}
      title='Editar finca'
      description='Datos, ubicación, códigos, contactos y certificados de la finca'
    >
      {isLoading || !business ? (
        <LoadingState />
      ) : (
        <EditBusinessForm business={business} />
      )}
    </CardPage>
  );
}

export default IsOnboarding(EditBusinessPage);
