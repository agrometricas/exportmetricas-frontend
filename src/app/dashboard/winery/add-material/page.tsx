'use client';
import { Formik } from 'formik';
import React from 'react';
import { MdInventory2 } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import ImportExporterStockDrawer from '../../../../components/winery/ImportExporterStockDrawer';
import { MaterialList } from '../../../../components/winery/MaterialList';

function AddMaterialPage(): React.JSX.Element {
  return (
    <Formik
      initialValues={{ 'import-exporter-stock': null }}
      onSubmit={() => undefined}
    >
      {() => (
        <CardPage
          icon={MdInventory2}
          title='Agregar Stock de Materiales'
          description='Completa la carga manual o importa desde archivo'
          actions={<ImportExporterStockDrawer />}
          width='wide'
        >
          <MaterialList />
        </CardPage>
      )}
    </Formik>
  );
}

export default IsOnboarding(AddMaterialPage);
