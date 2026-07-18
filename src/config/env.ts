type PublicEnvironment = Readonly<{
  appUrl?: string;
}>;

export function getPublicEnvironment(): PublicEnvironment {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return appUrl ? { appUrl } : {};
}
