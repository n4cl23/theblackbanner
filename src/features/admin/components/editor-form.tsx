'use client';
import { useActionState } from 'react';
import { saveContent } from '@/features/admin/actions/content-actions';
import type { ContentEntity } from '@/generated/prisma/client';
export function EditorForm({
  type,
  entity,
}: {
  type: string;
  entity?: ContentEntity | null;
}) {
  const [state, action, pending] = useActionState(saveContent, {
    ok: false,
    message: '',
  });
  const body =
    entity?.body && typeof entity.body === 'object' && 'content' in entity.body
      ? String(entity.body.content)
      : '';
  return (
    <form action={action} className="grid gap-5 border border-stone-600/25 p-6">
      <h2 className="font-display text-3xl uppercase">
        {entity ? 'Editar registro' : 'Novo rascunho'}
      </h2>
      <input name="id" type="hidden" value={entity?.id ?? ''} />
      <input name="version" type="hidden" value={entity?.version ?? 0} />
      <input name="type" type="hidden" value={type} />
      <label>
        Título
        <input
          className="bg-coal-950 mt-2 min-h-12 w-full border px-3"
          defaultValue={entity?.title}
          name="title"
          required
        />
      </label>
      <label>
        Slug
        <input
          className="bg-coal-950 mt-2 min-h-12 w-full border px-3"
          defaultValue={entity?.slug}
          name="slug"
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          required
        />
      </label>
      <label>
        Idioma
        <select
          className="bg-coal-950 mt-2 min-h-12 w-full border px-3"
          defaultValue={entity?.locale ?? 'PT_BR'}
          name="locale"
        >
          <option>PT_BR</option>
          <option>EN</option>
          <option>ES</option>
        </select>
      </label>
      <label>
        Subtítulo
        <input
          className="bg-coal-950 mt-2 min-h-12 w-full border px-3"
          defaultValue={entity?.subtitle ?? ''}
          name="subtitle"
        />
      </label>
      <label>
        Resumo
        <textarea
          className="bg-coal-950 mt-2 min-h-24 w-full border p-3"
          defaultValue={entity?.excerpt ?? ''}
          name="excerpt"
        />
      </label>
      <label>
        Conteúdo
        <textarea
          className="bg-coal-950 mt-2 min-h-64 w-full border p-3"
          defaultValue={body}
          name="content"
          required
        />
      </label>
      <label>
        Ordem
        <input
          className="bg-coal-950 ml-3 w-24 border p-2"
          defaultValue={entity?.sortOrder ?? 0}
          min="0"
          name="sortOrder"
          type="number"
        />
      </label>
      <label>
        <input
          className="mr-2"
          defaultChecked={entity?.featured}
          name="featured"
          type="checkbox"
        />
        Destaque
      </label>
      <button
        className="border-aged-gold-500/50 min-h-12 border uppercase disabled:opacity-50"
        disabled={pending}
      >
        {pending
          ? 'Salvando…'
          : entity
            ? 'Salvar alterações'
            : 'Criar rascunho'}
      </button>
      {state.message ? (
        <p
          className={state.ok ? 'text-green-300' : 'text-red-300'}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
