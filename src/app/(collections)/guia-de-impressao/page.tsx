import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Guia de impressão 3D',
  description:
    'Guia técnico provisório para preparação e acabamento de miniaturas.',
  alternates: { canonical: '/guia-de-impressao' },
};
const chapters = [
  [
    'Preparação',
    'Inspecione malha, escala, drenagem e integridade antes de fatiar.',
  ],
  [
    'Escala',
    'Confirme a medida nominal e preserve proporções entre base, personagem e acessórios.',
  ],
  [
    'Orientação',
    'Incline superfícies amplas para reduzir área por camada e marcas de suporte.',
  ],
  [
    'Suportes',
    'Distribua cargas, proteja detalhes e simule ilhas antes da exportação.',
  ],
  [
    'Resina',
    'Escolha material conforme detalhe, flexibilidade e resistência exigidos pela peça.',
  ],
  [
    'Exposição',
    'Calibre a impressora com testes próprios; valores não são universais.',
  ],
  [
    'Cura',
    'Lave e cure conforme a ficha do fabricante, evitando sobrecura de partes finas.',
  ],
  [
    'Segurança',
    'Use luvas, ventilação, proteção ocular e descarte responsável. Resina líquida é tóxica.',
  ],
  [
    'Acabamento',
    'Remova suportes após lavagem, lixe com proteção e preencha emendas quando necessário.',
  ],
  [
    'Pintura',
    'Aplique primer compatível, camadas finas e selagem adequada ao uso.',
  ],
  [
    'Troubleshooting',
    'Falhas de adesão pedem revisão de nivelamento, exposição, suportes e temperatura.',
  ],
] as const;
export default function PrintingGuidePage() {
  return (
    <main className="mx-auto max-w-[80rem] px-5 py-20 sm:px-8">
      <header className="max-w-4xl">
        <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
          Oficina de Asterheim · guia provisório
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
          Da resina à relíquia
        </h1>
        <p className="text-parchment-200/60 mt-8 text-lg">
          Orientações gerais para impressão MSLA. Sempre prevalecem as
          instruções do fabricante da resina e da impressora.
        </p>
      </header>
      <ol className="mt-20 grid gap-px bg-stone-600/25 md:grid-cols-2">
        {chapters.map(([title, text], index) => (
          <li className="bg-coal-950 min-h-56 p-8" key={title}>
            <span className="text-aged-gold-500 font-display text-4xl opacity-35">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-display mt-5 text-3xl uppercase">{title}</h2>
            <p className="text-parchment-200/60 mt-4 leading-relaxed">{text}</p>
          </li>
        ))}
      </ol>
      <aside className="border-blood-700 bg-blood-700/10 mt-12 border p-7">
        <h2 className="font-display text-2xl uppercase">
          Segurança não é opcional
        </h2>
        <p className="text-parchment-200/70 mt-3">
          Não toque resina líquida sem proteção. Não descarte no esgoto.
          Consulte sempre a SDS do material utilizado.
        </p>
      </aside>
    </main>
  );
}
