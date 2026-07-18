import { fireEvent, render, screen } from '@testing-library/react';

import { ImageWithFallback, Modal, Tabs } from '@/components/ui/interactive';
import {
  Accordion,
  Button,
  IconButton,
  SkipLink,
} from '@/components/ui/primitives';

describe('Button', () => {
  it('exposes enabled and disabled states', () => {
    render(
      <>
        <Button>Enabled action</Button>
        <Button disabled>Disabled action</Button>
      </>,
    );
    expect(
      screen.getByRole('button', { name: 'Enabled action' }),
    ).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Disabled action' }),
    ).toBeDisabled();
  });
});

describe('basic accessibility', () => {
  it('provides named icon actions and a keyboard skip target', () => {
    render(
      <>
        <SkipLink />
        <IconButton aria-label="Mark location">✦</IconButton>
      </>,
    );
    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main-content');
    expect(
      screen.getByRole('button', { name: 'Mark location' }),
    ).toBeInTheDocument();
  });
});

describe('Tabs keyboard navigation', () => {
  it('moves selection with arrow keys', () => {
    render(
      <Tabs
        items={[
          { label: 'Runes', content: 'Rune panel' },
          { label: 'Sigils', content: 'Sigil panel' },
        ]}
      />,
    );
    const runes = screen.getByRole('tab', { name: 'Runes' });
    const sigils = screen.getByRole('tab', { name: 'Sigils' });
    runes.focus();
    fireEvent.keyDown(runes, { key: 'ArrowRight' });
    expect(sigils).toHaveFocus();
    expect(sigils).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Sigil panel');
  });
});

describe('Modal', () => {
  it('opens and closes with accessible dialog semantics', () => {
    const showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    const close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: showModal,
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: close,
    });
    render(
      <Modal title="Codex entry" trigger={<Button>Open modal</Button>}>
        <p>Dialog content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    expect(
      screen.getByRole('heading', { name: 'Codex entry' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
      'open',
    );
  });
});

describe('Accordion', () => {
  it('uses keyboard-operable native disclosure controls', () => {
    render(
      <Accordion
        items={[{ title: 'Archive entry', content: 'Recovered text' }]}
      />,
    );
    const summary = screen.getByText('Archive entry');
    summary.focus();
    expect(summary).toHaveFocus();
    expect(summary.closest('details')).not.toHaveAttribute('open');
    fireEvent.click(summary);
    expect(summary.closest('details')).toHaveAttribute('open');
  });
});

describe('ImageWithFallback', () => {
  it('replaces a failed image while preserving its accessible name', () => {
    render(
      <ImageWithFallback
        alt="Unavailable artwork"
        fallback="Artwork unavailable"
        height={100}
        src="/missing.webp"
        width={200}
      />,
    );
    fireEvent.error(screen.getByRole('img', { name: 'Unavailable artwork' }));
    expect(
      screen.getByRole('img', { name: 'Unavailable artwork' }),
    ).toHaveTextContent('Artwork unavailable');
  });
});
