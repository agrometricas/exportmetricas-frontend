export interface ServerErrorResponse {
  statusCode: number;
  message: string;
  errors: string;
  model?: string;
  prop?: string;
}
