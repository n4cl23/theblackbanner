'use client';

import Image, { type ImageProps } from 'next/image';
import {
  cloneElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/cn';

export function Modal({
  trigger,
  title,
  children,
}: {
  trigger: ReactElement<{
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }>;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  return (
    <>
      {cloneElement(trigger, { onClick: () => setOpen(true) })}
      <dialog
        aria-labelledby={titleId}
        className="border-aged-gold-500/40 bg-coal-950 text-ivory-100 m-auto w-[min(92vw,38rem)] border p-0 shadow-2xl backdrop:bg-black/80"
        ref={dialogRef}
        onClose={() => setOpen(false)}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <h2 className="font-display text-2xl" id={titleId}>
              {title}
            </h2>
            <button
              aria-label="Close modal"
              className="text-parchment-200/70 hover:text-ivory-100 grid size-11 place-items-center text-xl"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <div className="text-parchment-200/75 mt-6">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export function Drawer({
  trigger,
  title,
  children,
}: {
  trigger: ReactElement<{
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }>;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  function closeDrawer() {
    setOpen(false);
    queueMicrotask(() => returnFocus?.focus());
  }

  function onDrawerKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {cloneElement(trigger, {
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          setReturnFocus(event.currentTarget);
          setOpen(true);
        },
      })}
      {open ? (
        <div
          className="fixed inset-0 z-[60] bg-black/75"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDrawer();
          }}
          role="presentation"
        >
          <aside
            aria-label={title}
            aria-modal="true"
            className="border-aged-gold-500/30 bg-coal-950 ml-auto h-full w-[min(90vw,28rem)] border-l p-6 shadow-2xl"
            onKeyDown={onDrawerKeyDown}
            ref={panelRef}
            role="dialog"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl">{title}</h2>
              <button
                aria-label="Close drawer"
                className="grid size-11 place-items-center text-xl"
                onClick={closeDrawer}
                ref={closeRef}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="text-parchment-200/75 mt-8">{children}</div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function Tabs({
  items,
}: {
  items: Array<{ label: string; content: ReactNode }>;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    if (event.key === 'ArrowLeft')
      next = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    setActive(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <div>
      <div
        aria-label="Design system examples"
        className="flex overflow-x-auto border-b border-stone-600/30"
        role="tablist"
      >
        {items.map((item, index) => (
          <button
            aria-controls={`${id}-panel-${index}`}
            aria-selected={active === index}
            className={cn(
              'min-h-12 shrink-0 border-b-2 px-5 text-xs font-bold tracking-wider uppercase',
              active === index
                ? 'border-aged-gold-500 text-aged-gold-500'
                : 'text-parchment-200/60 border-transparent',
            )}
            id={`${id}-tab-${index}`}
            key={item.label}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            ref={(element) => {
              tabsRef.current[index] = element;
            }}
            role="tab"
            tabIndex={active === index ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          aria-labelledby={`${id}-tab-${index}`}
          className="text-parchment-200/75 py-6"
          hidden={active !== index}
          id={`${id}-panel-${index}`}
          key={item.label}
          role="tabpanel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export function ImageWithFallback({
  fallback,
  alt,
  ...props
}: Omit<ImageProps, 'onError'> & { fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className="bg-iron-800 text-parchment-200/55 grid aspect-video place-items-center text-sm"
        role="img"
        aria-label={alt}
      >
        {fallback}
      </div>
    );
  return <Image alt={alt} onError={() => setFailed(true)} {...props} />;
}
