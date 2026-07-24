export default function MiniaturesLoading() {
  return (
    <main
      className="mx-auto min-h-[70vh] max-w-[90rem] animate-pulse px-5 py-24"
      role="status"
    >
      <p className="text-aged-gold-500 uppercase">
        Carregando arquivo de miniaturas…
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="bg-coal-900 aspect-[3/4]" key={index} />
        ))}
      </div>
    </main>
  );
}
