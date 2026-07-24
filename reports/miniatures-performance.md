# Performance de miniaturas — Sprint 14

- Listagem usa `next/image`, proporção 3:4, `sizes` responsivo e carregamento lazy padrão abaixo da dobra.
- Apenas o banner do hero é prioritário; cards não recebem preload.
- O grid reserva proporção antes da imagem, reduzindo CLS.
- Não há GLB no bundle nem biblioteca 3D pesada.
- Não há vídeo carregado; slots ausentes são comunicados editorialmente.
- Três imagens WebP públicas existentes são reutilizadas por quatro registros; nenhum arquivo duplicado foi criado.
- Filtros operam em quatro registros no cliente e sincronizam a URL, sem nova requisição ou waterfall.
- Risco: os covers ambientais de 1920 px são maiores que thumbnails dedicadas. Criar derivados somente quando mídia final for aprovada.
- Build local limpo aprovado em Next.js 16.2.10; as duas rotas localizadas de miniaturas foram reconhecidas como server-rendered sob demanda.
