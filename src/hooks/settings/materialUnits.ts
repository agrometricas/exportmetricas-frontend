import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery } from 'react-query';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import { MaterialUnitsResponse } from '../../types/materialUnits';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getMaterialUnits(): Promise<AxiosResponse<MaterialUnitsResponse>> {
  return axios.get('/settings/material-units');
}

export function useMaterialUnits(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery(['materialUnits'], getMaterialUnits));
}

type UnitsBody = { units: { materialType: string; unit: string }[] };

function updateMaterialUnits(body: UnitsBody): Promise<AxiosResponse<MaterialUnitsResponse>> {
  return axios.put('/settings/material-units', body);
}

export function useUpdateMaterialUnits(): UseMutationResult<
  AxiosResponse<MaterialUnitsResponse>,
  AxiosError<ServerErrorResponse>,
  UnitsBody
> {
  return useMutation(updateMaterialUnits);
}
