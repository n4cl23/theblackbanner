import { fireEvent, render, screen } from '@testing-library/react';

import { SiteHeader } from '@/components/layout/site-header';

describe('SiteHeader', () => {
  it('renders the main navigation and future controls with accessible names', () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Asterheim' })).toHaveAttribute(
      'href',
      '#asterheim',
    );
    expect(
      screen.getByRole('button', {
        name: 'Language selector — prepared for future localization',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Search — coming in a future sprint' }),
    ).toBeInTheDocument();
  });

  it('opens, navigates, and closes the mobile menu', () => {
    render(<SiteHeader />);
    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen
        .getByRole('navigation', { name: 'Mobile navigation' })
        .querySelector('a')!,
    );
    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeInTheDocument();
  });

  it('switches to the solid treatment after scrolling', () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 100,
    });
    const { container } = render(<SiteHeader />);
    fireEvent.scroll(window);
    expect(container.querySelector('header')).toHaveClass('bg-coal-950/95');
  });
});
