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
    return message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
