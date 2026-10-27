'use client';

import { Button, Dialog, Portal } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LinkClick, leavingTarget } from '../../../utils/leavingTarget';

function linkClick(event: MouseEvent): LinkClick | null {
  const link =
    event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(link instanceof HTMLAnchorElement)) return null;
  return {
    href: link.href,
    opensElsewhere: link.target === '_blank' || link.hasAttribute('download'),
    modified:
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey,
  };
}

interface UnsavedChangesGuardProps {
  isDirty: boolean;
}

const UnsavedChangesGuard: React.FC<UnsavedChangesGuardProps> = ({
  isDirty,
}) => {
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);

  // Formik already counts a form as dirty while its fields fill themselves on
  // mount, so the guard waits for something the user did: typing, changing a
  // field, picking an option or pressing one of the form's buttons.
  useEffect(() => {
    const form = anchorRef.current?.closest('form');
    const markEdited = (): void => setEdited(true);
    const pointer = (event: PointerEvent): void => {
      const element = event.target instanceof Element ? event.target : null;
      if (
        element?.closest('[role="option"]') ||
        (element?.closest('button') && form?.contains(element))
      ) {
        setEdited(true);
      }
    };
    document.addEventListener('input', markEdited, true);
    document.addEventListener('change', markEdited, true);
    document.addEventListener('pointerdown', pointer, true);
    return () => {
      document.removeEventListener('input', markEdited, true);
      document.removeEventListener('change', markEdited, true);
      document.removeEventListener('pointerdown', pointer, true);
    };
  }, []);

  useEffect(() => {
    if (!isDirty || !edited) return;

    const beforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = '';
    };
    // Captured on the document, before React's own handlers: a Next link
    // never starts navigating while the dialog asks.
    const click = (event: MouseEvent): void => {
      const href = leavingTarget(linkClick(event), window.location.href);
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      setTarget(href);
    };

    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', click, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', click, true);
    };
  }, [isDirty, edited]);

  return (
    <>
      <span ref={anchorRef} hidden />
      <Dialog.Root
        open={target !== null}
        initialFocusEl={() => cancelRef.current}
        placement='center'
        role='alertdialog'
        onOpenChange={(e) => {
          if (!e.open) {
            setTarget(null);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop>
            <Dialog.Positioner>
              <Dialog.Content mx={4}>
                <Dialog.Header>Tienes cambios sin guardar</Dialog.Header>
                <Dialog.Body>
                  Si sales ahora, se pierde lo que llenaste en este formulario.
                </Dialog.Body>
                <Dialog.Footer gap={3}>
                  <Button ref={cancelRef} onClick={() => setTarget(null)}>
                    Seguir editando
                  </Button>
                  <Button
                    colorPalette='red'
                    onClick={() => {
                      if (target) router.push(target);
                      setTarget(null);
                    }}
                  >
                    Salir sin guardar
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Backdrop>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UnsavedChangesGuard;
