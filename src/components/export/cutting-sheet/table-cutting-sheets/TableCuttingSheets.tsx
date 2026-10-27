/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Button, Center } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { BsFileEarmarkPdf } from 'react-icons/bs';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailCuttingSheets from './DetailCuttingSheets';
import { useCuttingSheets } from '../../../../hooks/export/cuttingSheet/getCuttingSheets';
import { sheetVersionLabel } from '../../../../utils/cuttingSheetOptions';

const TableCuttingSheets = (): React.JSX.Element => {
  const { rows: data, error, tableOptions } = useCuttingSheets();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const { response } = error as any;
      const { data: dataRes } = response;
      const { statusCode } = dataRes;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Hoja de Corte',
        columns: [
          {
            accessorKey: 'id',
            header: 'Nº',
            Cell: ({ cell }) => `#${cell.getValue()}`,
            size: 10,
            enableColumnActions: false,
          },
          {
            accessorKey: 'version',
            header: 'Versión',
            size: 120,
            Cell: ({ cell }): React.JSX.Element => {
              const version = cell.getValue<number>();
              return (
                <Badge colorPalette={version > 1 ? 'orange' : 'gray'}>
                  {sheetVersionLabel(version)}
                </Badge>
              );
            },
          },
        ],
      },
      {
        header: 'Detalles de Corte',
        columns: [
          {
            accessorKey: 'containerPositioning',
            header: 'Posicionamiento del Contenedor',
          },
          {
            accessorKey: 'palletsHeight',
            header: 'Altura de Pallets',
          },
          {
            accessorKey: 'exportSent.export.boxBrand.name',
            header: 'Marca de Caja',
          },
        ],
      },
      {
        header: 'Datos Comerciales',
        columns: [
          {
            accessorKey: 'exportSent.export.merchant.businessName',
            header: 'Productor',
          },
          {
            accessorKey: 'exportSent.export.business.name',
            header: 'Finca',
          },
          {
            accessorKey: 'exportSent.export.harborDeparture.name',
            header: 'Puerto de Salida',
          },
          {
            accessorKey: 'exportSent.export.harborDestination.name',
            header: 'Puerto de Destino',
          },
          {
            accessorKey: 'exportSent.export.client.businessName',
            header: 'Cliente',
          },
        ],
      },
      {
        header: 'Documentos',
        columns: [
          {
            accessorKey: 'pdfUrl',
            header: 'Acceso al PDF',
            Cell: ({ cell }): React.JSX.Element => {
              const url = cell.getValue();
              return typeof url === 'string' && url ? (
                <Center>
                  <a href={url} target='_blank' rel='noopener noreferrer'>
                    <button
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Ver PDF
                      <BsFileEarmarkPdf
                        color='red'
                        style={{ marginLeft: '5px' }}
                      />
                    </button>
                  </a>
                </Center>
              ) : (
                <span>No disponible</span>
              );
            },
            size: 150,
          },
          {
            id: 'correct',
            header: '',
            size: 100,
            enableColumnActions: false,
            Cell: ({ row }): React.JSX.Element => (
              <Button size='sm' variant='outline' colorPalette='green' asChild>
                <Link_Next
                  href={`/dashboard/export/cutting-sheets/${row.original.id}`}
                >
                  Corregir
                </Link_Next>
              </Button>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    ...tableOptions,
    enableColumnOrdering: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      columnPinning: {
        left: ['mrt-row-expand', 'id'],
        right: ['pdfUrl', 'correct'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '80%' } },
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <TableDetailPanel>
        <DetailCuttingSheets cuttingSheet={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableCuttingSheets;
