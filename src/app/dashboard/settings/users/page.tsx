'use client';
import React from 'react';
import { MdGroup } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import UsersManager from '../../../../components/exporter-user/UsersManager';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function UsersPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdGroup}
      title='Usuarios'
      description='Quién entra a la exportadora y en qué áreas trabaja cada uno.'
      width='wide'
    >
      <UsersManager />
    </CardPage>
  );
}

export default IsOnboarding(UsersPage);
