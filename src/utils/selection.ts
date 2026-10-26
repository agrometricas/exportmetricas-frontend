export function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id];
}

// Material React Table keeps a selection as { [rowId]: true }.
export function selectionToIds(selection: Record<string, boolean>): number[] {
  return Object.entries(selection)
    .filter(([, selected]) => selected)
    .map(([id]) => Number(id));
}

export function idsToSelection(ids: number[]): Record<string, boolean> {
  return Object.fromEntries(ids.map((id) => [String(id), true]));
}
