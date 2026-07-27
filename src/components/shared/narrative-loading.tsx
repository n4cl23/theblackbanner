type LoadingArea =
  | "home"
  | "atlas"
  | "kingdom"
  | "characters"
  | "bestiary"
  | "collections";

const loadingCopy: Record<
  LoadingArea,
  { eyebrow: string; message: string }
> = {
  home: {
    eyebrow: "Chronicles of Asterheim",
    message: "Acendendo o Farol…",
  },
  atlas: {
    eyebrow: "Arquivo dos Cartógrafos Reais",
    message: "Abrindo o Atlas Real…",
  },
  kingdom: {
    eyebrow: "Registro territorial",
    message: "Recuperando os registros do Reino…",
  },
  characters: {
    eyebrow: "Arquivo de Asterheim",
    message: "Abrindo o arquivo de personagens…",
  },
  bestiary: {
    eyebrow: "Códice de campo",
    message: "Catalogando criaturas ancestrais…",
  },
  collections: {
    eyebrow: "Acervo de miniaturas",
    message: "Preparando o arquivo de miniaturas…",
  },
};

export function NarrativeLoading({ area }: { area: LoadingArea }) {
  const copy = loadingCopy[area];

  return (
    <main className="narrative-loading" aria-busy="true" role="status">
      <div className="narrative-loading__mark" aria-hidden="true">
        <span>ᚨ</span>
      </div>
      <p>{copy.eyebrow}</p>
      <h1>{copy.message}</h1>
      <div className="narrative-loading__embers" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </main>
  );
}
