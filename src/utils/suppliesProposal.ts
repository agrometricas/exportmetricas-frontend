export function proposedQuantity<K extends string>(
  lines: ReadonlyArray<{ quantity: number } & Record<K, number>> | undefined,
  key: K,
  id: number | '' | undefined
): number | '' {
  return lines?.find((line) => line[key] === id)?.quantity ?? '';
}
