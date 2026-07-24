export type CharacterTreatment =
  | 'principal'
  | 'suporte'
  | 'antagonista'
  | 'guardiao'
  | 'colecao';

export interface PersonalityProfile {
  virtues: readonly string[];
  flaws: readonly string[];
  fears: readonly string[];
  desires: readonly string[];
  behavior: string;
  worldview: string;
  internalConflicts: string;
}

export interface CharacterPresentation {
  slug: string;
  epithet: string;
  treatment: CharacterTreatment;
  image: string;
  biography: readonly string[];
  motivations: readonly string[];
  personality: PersonalityProfile;
  mediaCaption: string;
  mediaCredit: string;
}

/** Provisional editorial presentation. Not official Asterheim canon. */
export const characterPresentations: readonly CharacterPresentation[] = [
  {
    slug: 'character-far-watcher',
    epithet: 'Aquele que mede a distância',
    treatment: 'principal',
    image: '/images/home/asterheim-hero.webp',
    biography: [
      'Registro provisório de um batedor que percorre as bordas visíveis de Asterheim.',
      'Sua presença valida narrativas longas sem estabelecer fatos canônicos.',
    ],
    motivations: [
      'Manter a estrada observável',
      'Registrar sinais antes da névoa',
    ],
    personality: {
      virtues: ['Disciplina', 'Paciência'],
      flaws: ['Isolamento', 'Desconfiança'],
      fears: ['Perder o horizonte'],
      desires: ['Encontrar uma rota segura'],
      behavior: 'Observa antes de agir e evita confrontos sem propósito.',
      worldview: 'Toda fronteira é um aviso, não uma promessa.',
      internalConflicts:
        'Proteger os viajantes exige aproximar-se do perigo que prefere estudar à distância.',
    },
    mediaCaption: 'Estudo ambiental provisório — imagem estática',
    mediaCredit: 'The Black Banner V2 · mock interno',
  },
  {
    slug: 'character-banner-bearer',
    epithet: 'A memória que ainda marcha',
    treatment: 'suporte',
    image: '/images/home/kingdoms-expanse.webp',
    biography: ['Arquivo mockado de uma testemunha da Marcha de Ferro.'],
    motivations: ['Preservar o estandarte', 'Reunir testemunhos'],
    personality: {
      virtues: ['Lealdade'],
      flaws: ['Rigidez'],
      fears: ['Ser a última testemunha'],
      desires: ['Restaurar um nome perdido'],
      behavior: 'Fala pouco e transforma lembranças em deveres.',
      worldview: 'Uma marcha termina apenas quando deixa de ser lembrada.',
      internalConflicts:
        'O símbolo que protege também impede qualquer vida fora de sua função.',
    },
    mediaCaption: 'Paisagem da marcha — mock',
    mediaCredit: 'The Black Banner V2 · mock interno',
  },
  {
    slug: 'character-ash-scout',
    epithet: 'Passos onde a cinza não repousa',
    treatment: 'colecao',
    image: '/images/home/bestiary-ruins.webp',
    biography: ['Estudo provisório de personagem para coleção e exploração.'],
    motivations: ['Mapear ruínas', 'Retornar à Vigília'],
    personality: {
      virtues: ['Coragem'],
      flaws: ['Impulsividade'],
      fears: ['Espaços fechados'],
      desires: ['Descobrir uma passagem'],
      behavior: 'Avança rápido e registra depois.',
      worldview: 'Ruínas são portas que esqueceram como abrir.',
      internalConflicts:
        'A curiosidade que mantém a Vigília informada também ameaça sua sobrevivência.',
    },
    mediaCaption: 'Ruínas em estudo — mock',
    mediaCredit: 'The Black Banner V2 · mock interno',
  },
  {
    slug: 'character-veil-keeper',
    epithet: 'A voz atrás do arquivo',
    treatment: 'antagonista',
    image: '/images/home/bestiary-ruins.webp',
    biography: ['Perfil provisório de uma arquivista ligada à Corte Velada.'],
    motivations: ['Conservar o arquivo', 'Ocultar registros perigosos'],
    personality: {
      virtues: ['Erudição'],
      flaws: ['Controle'],
      fears: ['Conhecimento sem guardião'],
      desires: ['Completar o arquivo'],
      behavior: 'Responde com fragmentos e reorganiza a verdade por risco.',
      worldview: 'Nem toda memória merece sobreviver àquele que a encontra.',
      internalConflicts:
        'Preservar conhecimento pode exigir apagá-lo do mundo.',
    },
    mediaCaption: 'Arquivo velado — mock',
    mediaCredit: 'The Black Banner V2 · mock interno',
  },
] as const;

export const guardianPresentation = {
  slug: 'guardian-black-gate',
  symbol: '✦',
  oath: 'Enquanto a pedra recordar, a passagem permanecerá fechada.',
  domain: 'O limiar do Portão Negro',
  relic: 'Chave de cinza sem fechadura',
  worldFunction:
    'Vigiar a passagem entre território catalogado e ruína desconhecida',
  crownBond: 'Vínculo não confirmado com a Coroa Velada',
  image: '/images/home/asterheim-hero.webp',
} as const;

export function getCharacterPresentation(slug: string) {
  return characterPresentations.find((item) => item.slug === slug) ?? null;
}
