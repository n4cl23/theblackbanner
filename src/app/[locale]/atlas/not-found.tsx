import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-6xl uppercase">
          Território não documentado
        </h1>
        <Link
          className="mt-7 inline-flex min-h-12 items-center border px-6"
          href="/pt-br/atlas"
        >
          Retornar ao Atlas
        </Link>
      </div>
    </main>
  );
}
