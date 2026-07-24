# Validação do Atlas — Sprint 15

Data: 2026-07-23. Conteúdo local provisório, sem alteração de banco ou Production.

## Inventário

- Reinos: 3
- Regiões: 3
- Biomas: 3
- Criaturas vinculadas: 4
- Pontos de interesse: 3
- Camadas implementadas: 7
- Canvas ou biblioteca 3D: nenhum

## Arquitetura e acessibilidade

- Server Components fazem composição e consulta; apenas o mapa interativo é client component.
- Consultas independentes usam `Promise.all` e `cache` por request.
- SVG possui nomes acessíveis, controles mínimos de 44 px, foco, teclado e reduced motion.
- Mobile troca a superfície visual pela lista funcional equivalente.
- Ausência de dados continua explícita; nenhum reino, criatura ou evento foi inventado.

## Riscos conhecidos

- Dois dos três pontos possuem coordenadas; a Mata dos Ossos permanece apenas na alternativa textual porque sua fonte canônica registra coordenadas nulas.
- As imagens e descrições continuam marcadas como estudos provisórios.
- Não foram habilitadas cidades ou rotas por ausência de registros canônicos próprios.

## Gates finais

- `npm ci`: aprovado, 633 pacotes auditados, 0 vulnerabilidades.
- `format:check`: aprovado.
- `lint`: aprovado, zero warnings.
- `typecheck`: aprovado.
- Vitest: 82/82 testes aprovados em 20 arquivos.
- Playwright: 27/27 cenários desktop/mobile aprovados.
- Build: aprovado com Next.js 16.2.11; 52 páginas geradas.
- Segurança: Next.js, Prisma, PostCSS, Sharp, Hono, fast-uri e find-my-way receberam patches compatíveis; `npm audit` final sem vulnerabilidades.
