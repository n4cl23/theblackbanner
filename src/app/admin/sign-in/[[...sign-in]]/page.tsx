import { SignIn } from '@clerk/nextjs';
export default function AdminSignInPage() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-5">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <SignIn path="/admin/sign-in" routing="path" />
      ) : (
        <section className="max-w-xl text-center">
          <h1 className="font-display text-5xl uppercase">
            Autenticação indisponível
          </h1>
          <p className="mt-5">
            Clerk não está configurado neste ambiente. Nenhum acesso
            administrativo foi liberado.
          </p>
        </section>
      )}
    </main>
  );
}
