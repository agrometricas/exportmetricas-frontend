import { useEffect, useRef } from 'react';

// Runs only when the N/A switch flips. On mount the field keeps what the form
// already holds (a copied box brand); a ref that skips the first run would not
// survive Strict Mode running every effect twice.
export function useBanChange(
  state: boolean | undefined,
  onChange: () => void
): void {
  const previous = useRef(state);
  useEffect(() => {
    if (previous.current === state) return;
    previous.current = state;
    onChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}
