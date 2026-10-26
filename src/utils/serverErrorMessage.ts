import { isAxiosError } from 'axios';

interface ValidationIssue {
  constraints?: Record<string, string>;
  children?: ValidationIssue[];
}

function validationMessages(issues: ValidationIssue[]): string[] {
  return issues.flatMap((issue) => [
    ...Object.values(issue.constraints ?? {}),
    ...validationMessages(issue.children ?? []),
  ]);
}

const NEST_DEFAULT_500 = 'Internal server error';
const SERVER_PROBLEM =
  'El servidor tuvo un problema. Inténtalo de nuevo en un momento.';
const NO_CONNECTION =
  'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.';
const TIMED_OUT =
  'El servidor tardó demasiado en responder. Inténtalo de nuevo.';

// On a 400 the backend puts the readable detail in `errors` (a sentence, or
// the list of validation issues) and a fixed generic text in `message`.
export function serverErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error'
): string {
  if (isAxiosError(error) && error.response) {
    const { errors, message } = error.response.data ?? {};

    if (typeof errors === 'string' && errors) return errors;
    if (Array.isArray(errors)) {
      const messages = validationMessages(errors);
      if (messages.length > 0) return messages.join('. ');
    }
    if (error.response.status >= 500 && message === NEST_DEFAULT_500) {
      return SERVER_PROBLEM;
    }
    return message || fallback;
  }

  // Axios answers in English when the request never got a response.
  if (isAxiosError(error)) {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
      ? TIMED_OUT
      : NO_CONNECTION;
  }
  return error instanceof Error ? error.message : fallback;
}
