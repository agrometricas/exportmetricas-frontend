type Named = { name: string } | null | undefined;

// A harbor's city and country are optional: shown only when they are there.
export function harborPlace(harbor: {
  name: string;
  city?: Named;
  country?: Named;
}): string {
  const where = [harbor.city?.name, harbor.country?.name].filter(Boolean);
  return where.length > 0
    ? `${harbor.name} (${where.join(', ')})`
    : harbor.name;
}
