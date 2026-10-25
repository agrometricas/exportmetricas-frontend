export function formatBoxWeight(
  lb: number | '' | null | undefined,
  kg: number | null | undefined
): string {
  if (!lb) return 'N/A';
  return kg ? `${lb} lb (${kg.toFixed(2)} kg)` : `${lb} lb`;
}
