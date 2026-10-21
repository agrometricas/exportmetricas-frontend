import { AxiosError, isAxiosError } from 'axios';

// A request made with `responseType: 'blob'` gets its error body as a Blob
// too; parsing it back to JSON lets `serverErrorMessage` read the detail.
export async function withJsonErrorBody(error: unknown): Promise<unknown> {
  if (!isAxiosError(error) || !(error.response?.data instanceof Blob)) {
    return error;
  }
  try {
    const body = JSON.parse(await error.response.data.text());
    return Object.assign(error, {
      response: { ...error.response, data: body },
    }) as AxiosError;
  } catch {
    return error;
  }
}
