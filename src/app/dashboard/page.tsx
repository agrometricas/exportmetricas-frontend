'use client';
import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import IsOnboarding from '../../components/ui/IsOnboarding';

const DashboardPage = (): React.JSX.Element => {
  return <Dashboard />;
};

export default IsOnboarding(DashboardPage);
