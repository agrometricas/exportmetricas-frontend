// An empty number input holds '' in Formik; the backend rejects '' for an
// optional number, so it is left out of the body instead.
export const optionalNumber = (
  value: number | '' | null | undefined,
): number | undefined =>
  value === '' || value === null || value === undefined || Number.isNaN(value)
    ? undefined
    : Number(value);
