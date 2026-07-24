# Gap funcional V1 → V2

| Área          | V1                                           | V2                                    | Decisão             | Ação segura                                    |
| ------------- | -------------------------------------------- | ------------------------------------- | ------------------- | ---------------------------------------------- |
| Navegação     | Ampla, 17 áreas e três locales               | Hierarquia autoral consolidada        | CONSOLIDAR          | Mapear destinos sem importar estrutura V1      |
| Busca         | Não comprovada como busca global no crawl    | Busca local tipada                    | MANTER_V2           | Indexar conteúdo aprovado da V1                |
| Filtros       | Presentes em arquivos editoriais específicos | Filtros por domínio e URL             | MANTER_V2           | Migrar apenas taxonomias aprovadas             |
| Atlas         | 6 reinos, pontos e criaturas                 | 3 reinos mockados, mapa SVG acessível | CONSOLIDAR          | Migrar conteúdo V1 para contratos V2           |
| Mapa          | Atlas editorial por rotas                    | SVG com zoom, pan, teclado e lista    | MANTER_V2           | V1 alimenta dados, não implementação           |
| Personagens   | Arquivo editorial extenso                    | 4 mocks estruturais                   | MIGRAR_COM_CORREÇÃO | Revisão humana de canonicidade e relações      |
| Coleções      | 6 coleções                                   | 2 mocks e 4 miniaturas                | MIGRAR_COM_CORREÇÃO | Normalizar membros, escala e mídia             |
| Miniaturas    | Misturadas a personagens/coleções            | Contrato técnico e STL privado        | MANTER_V2           | Criar registros sem expor arquivos             |
| Coroas        | 6 coroas dedicadas                           | Modelo local parcial                  | MIGRAR_COM_CORREÇÃO | Preservar relações reino/Guardião              |
| Guardiões     | 6 Guardiões dedicados                        | 1 mock estrutural                     | MIGRAR_COM_CORREÇÃO | Validar duplicidade personagem/Guardião        |
| Timeline      | Não declarada no sitemap                     | Timeline conectada                    | MANTER_V2           | Extrair eventos somente de fonte aprovada      |
| Galeria       | Área dedicada                                | Galerias por domínio                  | CONSOLIDAR          | Deduplicar mídia antes da associação           |
| Art Bible     | Área dedicada e localizada                   | Ausente como rota pública             | MIGRAR_COM_CORREÇÃO | Definir acesso e modelo editorial              |
| Impressão 3D  | Área dedicada                                | Guia e contratos técnicos             | CONSOLIDAR          | Normalizar escala e segurança                  |
| Idiomas       | 507 URLs em três locales                     | Fallback explícito e 40 URLs          | MANTER_V2           | Não reutilizar traduções idênticas sem revisão |
| CMS           | Não identificado publicamente                | CMS protegido e versionado            | MANTER_V2           | Importação futura via adapters                 |
| SEO           | Sitemap/hreflang com rota PT duplicada       | Canonical, hreflang e sitemap         | MANTER_V2           | Migrar metadata após revisão                   |
| Marketplaces  | 5 páginas de destino                         | Futuro marketplace fora do escopo     | ARQUIVAR            | Revalidar links e estratégia comercial         |
| About/Contact | Áreas localizadas                            | Ausentes na navegação atual           | MIGRAR_COM_CORREÇÃO | Revisar dados institucionais                   |

## Ordem de migração recomendada

1. estabilizar schemas e regras de publicação;
2. revisar e importar conteúdo base aprovado;
3. resolver relações contra IDs existentes;
4. deduplicar, otimizar e associar mídia;
5. criar redirects e rotas sem substituir a arquitetura V2;
6. adaptar componentes autorais existentes;
7. revisar cada locale sem fallback silencioso;
8. migrar metadata, canonical e hreflang;
9. executar integridade, unitários, acessibilidade e E2E;
10. publicar Preview e obter aprovação humana.

## Gates obrigatórios para a Sprint 20

- decisão editorial para todos os itens `REVISÃO_HUMANA`;
- mapa definitivo de slugs e redirects;
- verificação dos direitos e créditos de mídia;
- nenhuma referência quebrada;
- nenhuma tradução incompleta publicada;
- backup e plano de rollback antes de qualquer persistência.
