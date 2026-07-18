export interface ModelInspectorAsset {
  src: string;
  format: 'glb';
  poster?: string;
  credit?: string;
}
export interface ModelInspectorProps {
  asset: ModelInspectorAsset | null;
  label: string;
}
export function ModelInspectorContract({ asset, label }: ModelInspectorProps) {
  return (
    <section
      aria-label={`Inspeção 3D de ${label}`}
      className="grid min-h-72 place-items-center border border-dashed border-stone-600/30 text-center"
    >
      <div>
        <span className="text-aged-gold-500 text-4xl" aria-hidden="true">
          ◇
        </span>
        <h3 className="font-display mt-5 text-2xl">Inspeção tridimensional</h3>
        <p className="text-parchment-200/45 mt-3 max-w-md">
          {asset
            ? `GLB preparado: ${asset.src}`
            : 'Contrato preparado. O visualizador será implementado quando existir um GLB real validado.'}
        </p>
      </div>
    </section>
  );
}
