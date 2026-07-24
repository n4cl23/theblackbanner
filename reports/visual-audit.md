# Sprint 16 — Auditoria visual

## Escopo

Foram auditadas 18 áreas públicas: Home, Reinos, Mapa, Personagens,
Guardiões, Bestiário, Atlas, Criaturas, Coleções, Miniaturas, Timeline, Lore,
Crônicas, Galeria, Guia de impressão, páginas de erro, loading states e empty
states.

## Diagnóstico

- Seis route groups repetiam a mesma composição de header, conteúdo e footer.
- Arquivos editoriais utilizavam escalas próximas, porém sem uma atmosfera
  compartilhada ou ritmo previsível.
- O menu não comunicava a rota ativa no desktop nem no mobile.
- Títulos extremos e grids técnicos apresentavam risco de overflow abaixo de
  375 px.
- Os cards já possuíam famílias específicas por entidade; a auditoria preservou
  essas diferenças em vez de introduzir um card universal.
- O sistema já respeitava `prefers-reduced-motion` e não carregava animações
  pesadas.

## Implementação

- `PublicShell` tornou-se o núcleo de composição dos route groups públicos.
- O shell aplica atmosferas próprias para arquivos, Bestiário, Atlas/mundo,
  coleções e leitura, variando textura, luz e ritmo — não apenas cor.
- `CinematicHero` estabelece contrato reutilizável para imagem, overlay, área
  negativa, escala responsiva e tons contextuais.
- Personagens, Bestiário e Coleções receberam tratamento coerente de arquivo
  cinematográfico.
- Header desktop, dropdown e menu mobile agora expõem `aria-current` e estado
  visual ativo.
- Proteções globais de mídia, containers, títulos e overflow cobrem 320 px até
  ultrawide.
- Animações permanecem curtas, funcionais e anuladas sob reduced motion.

## Performance

O trabalho adiciona apenas CSS e componentes React locais. Não foram adicionadas
bibliotecas, fontes, vídeos, GLBs, scripts terceiros ou novos client boundaries.
`PublicShell` é Server Component; somente o header mantém a fronteira client já
existente.

## Fora do escopo

- Nenhuma regra de negócio foi alterada.
- Nenhum dado, banco ou migration foi modificado.
- Nenhuma mídia ou lore oficial foi inventada.
- Production não foi alterada.
- Sprint 17 não foi iniciada.
