/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Box, Button, Center } from '@chakra-ui/react';
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
import DetailCuttingSheets from './DetailCuttingSheets';
import { useCuttingSheets } from '../../../../hooks/export/cuttingSheet/getCuttingSheets';
import { usePagination } from '../../../../hooks/usePagination';
import { sheetVersionLabel } from '../../../../utils/cuttingSheetOptions';

const TableCuttingSheets = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useCuttingSheets(paginationParams);
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
                <Badge colorScheme={version > 1 ? 'orange' : 'gray'}>
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
              <Button
                as={Link_Next}
                href={`/dashboard/export/cutting-sheets/${row.original.id}`}
                size='sm'
                variant='outline'
                colorScheme='green'
              >
                Corregir
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
    enableColumnOrdering: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: {
        left: ['mrt-row-expand', 'id'],
        right: ['pdfUrl', 'correct'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '80%' } },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        padding: '0px',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          left: '0px',
          maxWidth:
            windowSize.width && windowSize.width >= 768
              ? `${width.md}px`
              : `${width.sm}px`,
          position: 'sticky',
          width: '100%',
        }}
      >
        <DetailCuttingSheets cuttingSheet={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableCuttingSheets;
