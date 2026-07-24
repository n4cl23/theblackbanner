# Sprint 22.2 — Matriz de lacunas visuais V1 → V2

Auditoria realizada em 24 de julho de 2026. A V1 foi usada exclusivamente
como referência visual, editorial e funcional. Nenhum componente ou código da
V1 foi copiado.

| Área | Elementos reconhecíveis na V1 | Lacuna observada na V2 antes da sprint | Reconstrução ou melhoria na V2 | Prioridade |
| --- | --- | --- | --- | --- |
| Home | Hero narrativo, coleções, mapa, Guardiões, eras, ritmo de códice | A rota `/pt-br` exibia somente hero e CTA; a Home completa existia apenas em `/` e continha seções vazias | Home cinematográfica completa também em `/pt-br`; estados vazios substituídos por portais editoriais; hierarquia, molduras e atmosfera reforçadas | Crítica |
| Menu | Marca completa, amplo inventário do universo e seletor de idioma | Marca reduzida e áreas editoriais ausentes | Assinatura Chronicles of Asterheim, marcador rúnico, Art Bible, Impressão 3D, Projeto e Contato reintegrados sem romper a organização atual | Crítica |
| Footer | Universo, coleções, idiomas e contato | Rodapé funcional, porém curto e com linguagem de ambiente técnico | Rodapé em três áreas, newsletter visual, idiomas, narrativa autoral e textura ambiental | Alta |
| Personagens | Retratos narrativos, epítetos, coleção e relação com o mundo | Arquivo existente, mas não promovido na Home localizada | Portal cinematográfico com imagem ambiental; família visual própria para Guardiões; links preservados para páginas editoriais existentes | Alta |
| Coleções | Capítulos distintos, símbolos, identidade e história | Listagem textual com tratamento uniforme | Molduras de códice, superfícies profundas e tratamento editorial; páginas continuam alimentadas pelo repository aprovado | Alta |
| Miniaturas | Imagem dominante e vínculo narrativo com a coleção | Catálogo correto, porém próximo de um grid comercial | Família `miniature-card`, imagem 3:4 dominante, ornamentos, especificações secundárias e hero preservado | Crítica |
| Atlas | Mapa ilustrado, reinos, locais, Guardiões e criaturas | Atlas funcional, mas pouco anunciado na Home localizada | Portal cartográfico ambiental, preview de territórios e CTA de exploração sem antecipar a Sprint 23 | Alta |
| Bestiário | Códice de criaturas e leitura de campo | Seção vazia na Home por ausência de destaques aprovados | Seção ambiental com entrada explícita para o códice; família visual de criatura preparada | Alta |
| Timeline | Eras, sequência e peso histórico | Bloco vazio quando não havia histórias promovidas | Portal editorial para a timeline, sem inventar eventos para preencher lacunas | Alta |
| Lore | Arquivos, crônicas e relações | Navegação disponível, mas pouco integrada à assinatura visual | Mantido como arquivo narrativo; navegação e footer recuperam sua posição no universo | Média |
| Guia de impressão | Conteúdo técnico associado às miniaturas | Existia, mas estava escondido sob “Guia” | Nome “Impressão 3D” restaurado no menu de Projeto e rota atual preservada | Alta |
| Galeria | Área própria e forte presença visual | Disponível somente como âncora pouco evidente | Mantida como capítulo amplo da Home, com imagens ambientais e acesso global | Média |

## Direção aplicada

- Ambiente permanece protagonista; nenhuma composição nova depende de pose
  frontal de personagem.
- Ouro envelhecido funciona como acento, não como preenchimento dominante.
- Molduras usam cantos, filetes e superfícies metálicas em vez de cards SaaS.
- Estados editoriais ausentes não são preenchidos com lore inventado.
- A arquitetura moderna da V2, os repositories, SSR e rotas aprovadas foram
  preservados.
- A Home localizada reutiliza a experiência canônica da própria V2; não há
  dependência de infraestrutura ou código da V1.

## Famílias visuais

- `miniature-card`: proporção vertical, imagem dominante e metal envelhecido.
- `creature-card`: acento orgânico e leitura de códice de campo.
- `guardian-card`: escala monumental, sombra profunda e juramento como foco.
- `kingdom-card`: paisagem, cartografia e acento mineral.
- `codex-card`: núcleo estrutural compartilhado, com ornamentos discretos.

## Pendências que exigem conteúdo aprovado

- Destaques individuais de personagens, criaturas, reinos e eventos não serão
  inventados.
- Vídeos e GLBs só aparecem quando associados e autorizados.
- Marketplaces não foi incluído na navegação porque ainda não existe uma
  superfície funcional aprovada.
- Novas imagens sociais específicas por entidade dependem da curadoria
  editorial de cada página.
