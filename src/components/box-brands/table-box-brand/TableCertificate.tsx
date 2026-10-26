import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';

type CertificateType = {
  id: number;
  name: string;
};

const TableCertificate = ({
  certificates,
}: {
  certificates: CertificateType[];
}): React.JSX.Element => {
  const columns = useMemo<MRT_ColumnDef<Partial<CertificateType>>[]>(
    () => [{ accessorKey: 'name', header: 'Nombre' }],
    []
  );

  const table = useMaterialReactTable({
    localization: MRT_Localization_ES,
    columns,
    data: certificates,
    enableColumnActions: false,
    enableSorting: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
  });
  return <MaterialReactTable table={table} />;
};

export default TableCertificate;
