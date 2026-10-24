export interface DocumentValues {
  type: string;
  number: string;
  containerId: string;
  issuedAt: string;
  expiresAt: string;
  file: File | null;
}

export const EMPTY_DOCUMENT: DocumentValues = {
  type: '',
  number: '',
  containerId: '',
  issuedAt: '',
  expiresAt: '',
  file: null,
};

// What is left empty is not sent, so the backend reads it as not given.
export function bookingDocumentBody(values: DocumentValues): FormData {
  const body = new FormData();
  body.append('type', values.type);
  body.append('number', values.number.trim());
  if (values.containerId) body.append('containerId', values.containerId);
  if (values.issuedAt) body.append('issuedAt', values.issuedAt);
  if (values.expiresAt) body.append('expiresAt', values.expiresAt);
  if (values.file) body.append('file', values.file);
  return body;
}
