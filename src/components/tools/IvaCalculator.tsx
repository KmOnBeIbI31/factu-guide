import { useMemo, useState } from 'preact/hooks';
import { computeInvoice, formatEUR } from '../../lib/iva';

const IVA_OPTIONS = [0, 4, 10, 21];
const IRPF_OPTIONS = [7, 15, 19];

export default function IvaCalculator() {
  const [base, setBase] = useState(1000);
  const [ivaRate, setIvaRate] = useState(21);
  const [retencionOn, setRetencionOn] = useState(false);
  const [retencionRate, setRetencionRate] = useState(15);

  const breakdown = useMemo(
    () =>
      computeInvoice({
        base: Math.max(0, base),
        ivaRate,
        retencionRate: retencionOn ? retencionRate : 0,
      }),
    [base, ivaRate, retencionOn, retencionRate],
  );

  return (
    <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-card">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="block">
          <span class="block text-sm font-medium text-ink mb-1">Base imponible (€)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={base}
            onInput={(e) =>
              setBase(Number.parseFloat((e.currentTarget as HTMLInputElement).value) || 0)
            }
            class="block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </label>
        <label class="block">
          <span class="block text-sm font-medium text-ink mb-1">Tipo IVA</span>
          <select
            value={ivaRate}
            onChange={(e) =>
              setIvaRate(Number.parseInt((e.currentTarget as HTMLSelectElement).value, 10))
            }
            class="block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {IVA_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </select>
        </label>
      </div>

      <label class="mt-4 inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={retencionOn}
          onChange={(e) => setRetencionOn((e.currentTarget as HTMLInputElement).checked)}
          class="rounded border-zinc-300 text-brand-500 focus:ring-brand-500"
        />
        Aplicar retención IRPF
      </label>

      {retencionOn && (
        <label class="mt-3 block max-w-xs">
          <span class="block text-sm font-medium text-ink mb-1">Tipo IRPF</span>
          <select
            value={retencionRate}
            onChange={(e) =>
              setRetencionRate(Number.parseInt((e.currentTarget as HTMLSelectElement).value, 10))
            }
            class="block w-full rounded-md border border-zinc-300 px-3 py-2"
          >
            {IRPF_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </select>
        </label>
      )}

      <table class="mt-6 w-full text-sm">
        <tbody class="divide-y divide-zinc-200">
          <tr>
            <td class="py-2 text-ink-muted">Base imponible</td>
            <td class="py-2 text-right font-medium">{formatEUR(breakdown.base)}</td>
          </tr>
          <tr>
            <td class="py-2 text-ink-muted">IVA ({ivaRate}%)</td>
            <td class="py-2 text-right font-medium">{formatEUR(breakdown.iva)}</td>
          </tr>
          {retencionOn && (
            <tr>
              <td class="py-2 text-ink-muted">Retención IRPF (-{retencionRate}%)</td>
              <td class="py-2 text-right font-medium text-red-700">
                {formatEUR(breakdown.retencion)}
              </td>
            </tr>
          )}
          <tr class="bg-surface-raised">
            <td class="py-2 font-bold text-ink">Total a cobrar</td>
            <td class="py-2 text-right font-bold text-ink">{formatEUR(breakdown.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
