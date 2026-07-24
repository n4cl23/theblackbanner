import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorldMap } from '@/features/world/components/world-map';
import { kingdomPresentations } from '@/features/world/data/world-presentation.mock';

const kingdoms = kingdomPresentations.map((item, index) => ({
  ...item,
  title: `Reino ${index + 1}`,
  sigil: '✦',
}));

describe('WorldMap', () => {
  it('selects a kingdom from the accessible alternative and exposes its link', () => {
    render(<WorldMap kingdoms={kingdoms} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Selecionar na lista: Reino 2' }),
    );
    expect(
      screen.getByRole('link', { name: /abrir arquivo/i }),
    ).toHaveAttribute('href', '/world/kingdoms/kingdom-iron-march');
  });

  it('supports keyboard selection on SVG territories', () => {
    render(<WorldMap kingdoms={kingdoms} />);
    const territory = screen.getByRole('button', {
      name: 'Selecionar Reino 1',
    });
    fireEvent.keyDown(territory, { key: 'ArrowRight' });
    expect(
      screen.getByRole('button', { name: 'Selecionar na lista: Reino 2' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('provides zoom controls and disabled future layers', () => {
    render(<WorldMap kingdoms={kingdoms} />);
    expect(screen.getByRole('button', { name: 'Aumentar zoom' })).toBeEnabled();
    expect(screen.getByLabelText(/Cidades/)).toBeDisabled();
  });
});
