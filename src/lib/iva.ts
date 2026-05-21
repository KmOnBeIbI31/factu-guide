export type Breakdown = {
  base: number;
  iva: number;
  ivaRate: number;
  retencion: number;
  retencionRate: number;
  total: number;
};

export type InvoiceInput = {
  base: number;
  ivaRate: number;
  retencionRate: number;
};

function roundHalfEven(n: number, decimals = 2): number {
  const factor = 10 ** decimals;
  const scaled = n * factor;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  let rounded: number;
  if (diff < 0.5) {
    rounded = floor;
  } else if (diff > 0.5) {
    rounded = floor + 1;
  } else {
    rounded = floor % 2 === 0 ? floor : floor + 1;
  }
  return rounded / factor;
}

export function computeInvoice(input: InvoiceInput): Breakdown {
  const base = roundHalfEven(input.base);
  const iva = roundHalfEven(base * (input.ivaRate / 100));
  const retencionRaw = roundHalfEven(base * (input.retencionRate / 100));
  const retencion = retencionRaw === 0 ? 0 : -retencionRaw;
  const total = roundHalfEven(base + iva + retencion);
  return {
    base,
    iva,
    ivaRate: input.ivaRate,
    retencion,
    retencionRate: input.retencionRate,
    total,
  };
}

export function formatEUR(n: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    useGrouping: 'always',
  }).format(n);
}
