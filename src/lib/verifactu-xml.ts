export type InvoiceInput = {
  emisor: { nif: string; razon: string };
  receptor: { nif: string; razon: string };
  serie: string;
  numero: string;
  fecha: string; // YYYY-MM-DD
  descripcion: string;
  base: number;
  ivaRate: number;
  huellaAnterior: string;
};

const ESCAPE_MAP: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
};

export function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (ch) => ESCAPE_MAP[ch]);
}

function money(n: number): string {
  return n.toFixed(2);
}

export function buildVerifactuXml(input: InvoiceInput): string {
  const cuota = input.base * (input.ivaRate / 100);
  const numSerie = `${input.serie}/${input.numero}`;
  const fechaDDMMYYYY = input.fecha.split('-').reverse().join('-');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<RegistroAlta>',
    '  <IDFactura>',
    `    <IDEmisorFactura>${escapeXml(input.emisor.nif)}</IDEmisorFactura>`,
    `    <NumSerieFactura>${escapeXml(numSerie)}</NumSerieFactura>`,
    `    <FechaExpedicionFactura>${escapeXml(fechaDDMMYYYY)}</FechaExpedicionFactura>`,
    '  </IDFactura>',
    `  <NombreRazonEmisor>${escapeXml(input.emisor.razon)}</NombreRazonEmisor>`,
    '  <TipoFactura>F1</TipoFactura>',
    `  <DescripcionOperacion>${escapeXml(input.descripcion)}</DescripcionOperacion>`,
    '  <Destinatarios>',
    '    <IDDestinatario>',
    `      <NombreRazon>${escapeXml(input.receptor.razon)}</NombreRazon>`,
    `      <NIF>${escapeXml(input.receptor.nif)}</NIF>`,
    '    </IDDestinatario>',
    '  </Destinatarios>',
    '  <Desglose>',
    '    <DetalleDesglose>',
    '      <Impuesto>01</Impuesto>',
    '      <ClaveRegimen>01</ClaveRegimen>',
    '      <CalificacionOperacion>S1</CalificacionOperacion>',
    `      <TipoImpositivo>${money(input.ivaRate)}</TipoImpositivo>`,
    `      <BaseImponibleOImporteNoSujeto>${money(input.base)}</BaseImponibleOImporteNoSujeto>`,
    `      <CuotaRepercutida>${money(cuota)}</CuotaRepercutida>`,
    '    </DetalleDesglose>',
    '  </Desglose>',
    `  <CuotaTotal>${money(cuota)}</CuotaTotal>`,
    `  <ImporteTotal>${money(input.base + cuota)}</ImporteTotal>`,
    `  <Encadenamiento>${input.huellaAnterior ? `<RegistroAnterior><Huella>${escapeXml(input.huellaAnterior)}</Huella></RegistroAnterior>` : '<PrimerRegistro>S</PrimerRegistro>'}</Encadenamiento>`,
    '</RegistroAlta>',
  ].join('\n');
}

export async function computeHash(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}
