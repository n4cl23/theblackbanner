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
      '/world',
    );
    expect(
      screen.getByRole('link', {
        name: 'Selecionar idioma',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Busca' })).toBeInTheDocument();
  });

  it('exposes recovered areas and closes the mobile menu with Escape', () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const mobile = screen.getByRole('navigation', {
      name: 'Mobile navigation',
    });
    expect(mobile).toHaveTextContent('Atlas');
    expect(mobile).toHaveTextContent('Miniaturas');
    expect(mobile).toHaveTextContent('Guardiões');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeInTheDocument();
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
