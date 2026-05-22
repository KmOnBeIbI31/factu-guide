import { useState } from 'preact/hooks';
import { validateNif } from '../../lib/nif';
import { buildVerifactuXml, computeHash } from '../../lib/verifactu-xml';

type FormState = {
  emisorNif: string;
  emisorRazon: string;
  receptorNif: string;
  receptorRazon: string;
  serie: string;
  numero: string;
  fecha: string;
  descripcion: string;
  base: number;
  ivaRate: number;
  huellaAnterior: string;
};

const TODAY = new Date().toISOString().slice(0, 10);

export default function VerifactuXmlDemo() {
  const [form, setForm] = useState<FormState>({
    emisorNif: 'B12345674',
    emisorRazon: 'Acme Servicios SL',
    receptorNif: '12345678Z',
    receptorRazon: 'Juan Pérez',
    serie: '2026',
    numero: '001',
    fecha: TODAY,
    descripcion: 'Servicios de desarrollo',
    base: 1000,
    ivaRate: 21,
    huellaAnterior: '',
  });
  const [xml, setXml] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);

    if (!validateNif(form.emisorNif).valid) {
      setError('NIF emisor inválido');
      return;
    }
    if (!validateNif(form.receptorNif).valid) {
      setError('NIF receptor inválido');
      return;
    }
    if (form.base <= 0) {
      setError('Base imponible debe ser mayor que 0');
      return;
    }
    if (form.huellaAnterior && !/^[0-9A-F]{64}$/i.test(form.huellaAnterior)) {
      setError('Huella anterior debe ser hex de 64 chars');
      return;
    }

    const generated = buildVerifactuXml({
      emisor: { nif: form.emisorNif, razon: form.emisorRazon },
      receptor: { nif: form.receptorNif, razon: form.receptorRazon },
      serie: form.serie,
      numero: form.numero,
      fecha: form.fecha,
      descripcion: form.descripcion,
      base: form.base,
      ivaRate: form.ivaRate,
      huellaAnterior: form.huellaAnterior.toUpperCase(),
    });
    setXml(generated);
    setHash(await computeHash(generated));
  }

  function download() {
    if (!xml) return;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verifactu-${form.serie}-${form.numero}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div class="space-y-6">
      <form
        onSubmit={onSubmit}
        class="rounded-xl border border-zinc-200 bg-white p-6 shadow-card grid gap-4 md:grid-cols-2"
      >
        <Field label="NIF emisor" value={form.emisorNif} onInput={(v) => update('emisorNif', v)} />
        <Field
          label="Razón emisor"
          value={form.emisorRazon}
          onInput={(v) => update('emisorRazon', v)}
        />
        <Field
          label="NIF receptor"
          value={form.receptorNif}
          onInput={(v) => update('receptorNif', v)}
        />
        <Field
          label="Razón receptor"
          value={form.receptorRazon}
          onInput={(v) => update('receptorRazon', v)}
        />
        <Field label="Serie" value={form.serie} onInput={(v) => update('serie', v)} />
        <Field label="Número" value={form.numero} onInput={(v) => update('numero', v)} />
        <Field
          label="Fecha (YYYY-MM-DD)"
          type="date"
          value={form.fecha}
          onInput={(v) => update('fecha', v)}
        />
        <Field
          label="Tipo IVA (%)"
          type="number"
          value={String(form.ivaRate)}
          onInput={(v) => update('ivaRate', Number.parseFloat(v) || 0)}
        />
        <Field
          label="Descripción operación"
          value={form.descripcion}
          onInput={(v) => update('descripcion', v)}
          class="md:col-span-2"
        />
        <Field
          label="Base imponible (€)"
          type="number"
          value={String(form.base)}
          onInput={(v) => update('base', Number.parseFloat(v) || 0)}
        />
        <Field
          label="Huella anterior (opcional, hex 64)"
          value={form.huellaAnterior}
          onInput={(v) => update('huellaAnterior', v)}
        />
        <div class="md:col-span-2 flex items-center justify-end gap-3">
          {error && <span class="text-sm text-red-700">{error}</span>}
          <button
            type="submit"
            class="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Generar XML
          </button>
        </div>
      </form>

      {xml && (
        <div class="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Preview pedagógico.</strong> La huella canónica AEAT incluye un timestamp
          server-side; solo el servidor real puede generar la huella oficial. Usa{' '}
          <a href="/mcp" class="underline font-semibold">
            verifactu-mcp
          </a>{' '}
          para emitir de verdad.
        </div>
      )}

      {xml && (
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-card">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-semibold text-ink">XML generado</h3>
            <div class="flex gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(xml)}
                class="rounded-md bg-surface-sunken px-3 py-1.5 text-xs hover:bg-surface-raised"
              >
                Copiar
              </button>
              <button
                type="button"
                onClick={download}
                class="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
              >
                Descargar
              </button>
            </div>
          </div>
          <pre class="overflow-x-auto rounded-md bg-zinc-900 p-4 text-xs text-zinc-100">
            <code>{xml}</code>
          </pre>
          {hash && (
            <div class="mt-4">
              <div class="text-xs text-ink-subtle">Huella SHA-256 (heurística):</div>
              <code class="block break-all rounded bg-surface-sunken p-2 font-mono text-xs">
                {hash}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onInput: (v: string) => void;
  type?: string;
  class?: string;
}) {
  const { label, value, onInput, type = 'text', class: cls = '' } = props;
  return (
    <label class={`block ${cls}`}>
      <span class="block text-sm font-medium text-ink mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onInput={(e) => onInput((e.currentTarget as HTMLInputElement).value)}
        class="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
    </label>
  );
}
