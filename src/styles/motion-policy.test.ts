import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('reduced motion policy', () => {
  it('defines a reduced-motion override for animation and transitions', () => {
    const styles = readFileSync(
      path.resolve(process.cwd(), 'src/styles/globals.css'),
      'utf8',
    );
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styles).toContain('animation-duration: 0.01ms !important');
    expect(styles).toContain('transition-duration: 0.01ms !important');
  });
});
