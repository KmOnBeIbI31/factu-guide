import { describe, expect, it } from 'vitest';
import { buildVerifactuXml, computeHash, escapeXml } from '../../src/lib/verifactu-xml';

const SAMPLE = {
  emisor: { nif: 'B12345674', razon: 'Acme Servicios SL' },
  receptor: { nif: '12345678Z', razon: 'Juan Pérez' },
  serie: '2026',
  numero: '001',
  fecha: '2026-05-21',
  descripcion: 'Servicios de desarrollo',
  base: 1000,
  ivaRate: 21,
  huellaAnterior: '',
};

describe('buildVerifactuXml', () => {
  it('produces XML containing all input fields', () => {
    const xml = buildVerifactuXml(SAMPLE);
    expect(xml).toContain('<IDEmisorFactura>B12345674</IDEmisorFactura>');
    expect(xml).toContain('<NumSerieFactura>2026/001</NumSerieFactura>');
    expect(xml).toContain('<BaseImponibleOImporteNoSujeto>1000.00</BaseImponibleOImporteNoSujeto>');
    expect(xml).toContain('<CuotaRepercutida>210.00</CuotaRepercutida>');
  });

  it('escapes special XML characters in descripcion', () => {
    const xml = buildVerifactuXml({ ...SAMPLE, descripcion: '<script> & "evil" & \'x\'' });
    expect(xml).toContain('&lt;script&gt; &amp; &quot;evil&quot; &amp; &apos;x&apos;');
    expect(xml).not.toContain('<script>');
  });

  it('emits RegistroAnterior with previous huella when huellaAnterior is provided', () => {
    const prev = 'A'.repeat(64);
    const xml = buildVerifactuXml({ ...SAMPLE, huellaAnterior: prev });
    expect(xml).toContain(`<RegistroAnterior><Huella>${prev}</Huella></RegistroAnterior>`);
    expect(xml).not.toContain('<PrimerRegistro>S</PrimerRegistro>');
  });
});

describe('escapeXml', () => {
  it('escapes all five reserved entities', () => {
    expect(escapeXml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&apos;');
  });
});

describe('computeHash', () => {
  it('produces uppercase 64-char hex SHA-256', async () => {
    const hash = await computeHash('hello');
    expect(hash).toMatch(/^[0-9A-F]{64}$/);
    expect(hash).toBe('2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824');
  });
});
