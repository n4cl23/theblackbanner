import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PublicShell } from '@/components/layout/public-shell';

vi.mock('@/components/layout/site-header', () => ({
  SiteHeader: () => <header>Header</header>,
}));

vi.mock('@/components/layout/site-footer', () => ({
  SiteFooter: () => <footer>Footer</footer>,
}));

describe('PublicShell', () => {
  it('consolidates the public layout and exposes the selected area', () => {
    const { container } = render(
      <PublicShell area="bestiary">
        <main id="main-content">Codex</main>
      </PublicShell>,
    );

    expect(
      screen.getByRole('link', { name: /skip to content/i }),
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveTextContent('Codex');
    expect(container.firstChild).toHaveClass('public-area-bestiary');
  });
});
