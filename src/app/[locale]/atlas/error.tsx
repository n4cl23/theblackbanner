'use client';
export default function ErrorState({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-5xl uppercase">
          O mapa se perdeu na névoa
        </h1>
        <button className="mt-7 min-h-12 border px-6" onClick={reset}>
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
