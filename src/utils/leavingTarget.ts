export interface LinkClick {
  href: string;
  opensElsewhere: boolean;
  modified: boolean;
}

// The page this click goes to inside the app, or null when it stays here,
// opens somewhere else, or leaves the app (the browser asks on its own then).
export function leavingTarget(
  click: LinkClick | null,
  current: string
): string | null {
  if (!click || click.modified || click.opensElsewhere) return null;
  const to = new URL(click.href, current);
  const here = new URL(current);
  if (to.origin !== here.origin) return null;
  if (to.pathname === here.pathname && to.search === here.search) return null;
  return `${to.pathname}${to.search}${to.hash}`;
}
