import { useEffect, useMemo, useState } from 'preact/hooks';
import { type NifResult, validateNif } from '../../lib/nif';

const EXAMPLES = ['12345678Z', 'X1234567L', 'B12345674'];

export default function NifValidator() {
  const [raw, setRaw] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebounced(raw), 150);
    return () => clearTimeout(id);
  }, [raw]);

  const result: NifResult | null = useMemo(() => {
    if (!debounced) return null;
    return validateNif(debounced);
  }, [debounced]);

  return (
    <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-card">
      <label class="block">
        <span class="block text-sm font-medium text-ink mb-1">Introduce un NIF, NIE o CIF</span>
        <input
          maxLength={14}
          value={raw}
          onInput={(e) => setRaw((e.currentTarget as HTMLInputElement).value)}
          placeholder="Ej: 12345678Z"
          class="block w-full rounded-md border border-zinc-300 px-3 py-2 text-base font-mono uppercase tracking-wider focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </label>

      {result?.valid && (
        <div class="mt-4 flex items-center gap-3">
          <span class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            ✓ {result.type} válido
          </span>
          {result.orgType && (
            <span class="text-sm text-ink-muted">Organización: {result.orgType}</span>
          )}
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(result.normalized)}
            class="ml-auto text-xs text-brand-600 hover:underline"
          >
            Copiar
          </button>
        </div>
      )}

      {result && !result.valid && (
        <div class="mt-4 rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-900">
          ✗ {result.reason}
        </div>
      )}

      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span class="text-ink-subtle">Probar:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setRaw(ex)}
            class="rounded-full bg-surface-sunken px-2.5 py-1 font-mono hover:bg-surface-raised"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
