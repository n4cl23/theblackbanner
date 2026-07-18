import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const config = [
  {
    ignores: [
      '.next/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
  prettier,
];

export default config;
