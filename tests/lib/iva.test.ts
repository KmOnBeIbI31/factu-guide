import { describe, expect, it } from 'vitest';
import { computeInvoice, formatEUR } from '../../src/lib/iva';

describe('computeInvoice', () => {
  it('computes IVA at 21% with no retención', () => {
    const r = computeInvoice({ base: 1000, ivaRate: 21, retencionRate: 0 });
    expect(r.iva).toBeCloseTo(210, 2);
    expect(r.retencion).toBe(0);
    expect(r.total).toBeCloseTo(1210, 2);
  });

  it('computes IVA at 10%', () => {
    const r = computeInvoice({ base: 1000, ivaRate: 10, retencionRate: 0 });
    expect(r.iva).toBeCloseTo(100, 2);
    expect(r.total).toBeCloseTo(1100, 2);
  });

  it('applies IRPF retención after IVA', () => {
    const r = computeInvoice({ base: 1000, ivaRate: 21, retencionRate: 15 });
    expect(r.retencion).toBeCloseTo(-150, 2);
    expect(r.total).toBeCloseTo(1060, 2);
  });

  it('handles zero base', () => {
    const r = computeInvoice({ base: 0, ivaRate: 21, retencionRate: 15 });
    expect(r.total).toBe(0);
  });

  it('rounds half-even at 2 decimals', () => {
    const r = computeInvoice({ base: 0.125, ivaRate: 0, retencionRate: 0 });
    expect(r.base).toBe(0.12); // banker's rounding (even floor stays)
  });

  it('rounds up when diff > 0.5', () => {
    const r = computeInvoice({ base: 0.127, ivaRate: 0, retencionRate: 0 });
    expect(r.base).toBe(0.13);
  });

  it("banker's rounding rounds odd floor up at exact .5", () => {
    const r = computeInvoice({ base: 0.135, ivaRate: 0, retencionRate: 0 });
    expect(r.base).toBe(0.14);
  });
});

describe('formatEUR', () => {
  it('formats with es-ES locale', () => {
    expect(formatEUR(1234.5)).toMatch(/1\.234,50/);
  });
});
