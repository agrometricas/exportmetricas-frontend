import { AlertProps } from '@mui/material/Alert';
import { MRT_RowData, MRT_TableState } from 'material-react-table';
import { serverErrorMessage } from './serverErrorMessage';

export interface ListQueryStatus {
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
}

export interface ListTableOptions {
  enableSorting: boolean;
  muiToolbarAlertBannerProps?: AlertProps;
  state: Pick<
    MRT_TableState<MRT_RowData>,
    'isLoading' | 'showAlertBanner' | 'showProgressBars'
  >;
}

export function listTableOptions({
  error,
  isLoading,
  isFetching,
}: ListQueryStatus): ListTableOptions {
  return {
    // The skeletons are placeholder rows with every cell null. A click to
    // sort reads the first row through the column's accessor, and most
    // accessors expect a real row.
    enableSorting: !isLoading,
    // Without it a failed load reads as an empty list.
    muiToolbarAlertBannerProps: error
      ? {
          color: 'error',
          children: serverErrorMessage(error, 'No se pudo cargar la lista'),
        }
      : undefined,
    state: {
      isLoading,
      showAlertBanner: !!error,
      showProgressBars: isFetching && !isLoading,
    },
  };
}
