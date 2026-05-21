const DNI_RE = /^(\d{8})([A-Z])$/;
const NIE_RE = /^([XYZ])(\d{7})([A-Z])$/;
const LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const NIE_MAP: Record<string, string> = { X: '0', Y: '1', Z: '2' };

export type NifResult =
  | { valid: true; type: 'DNI' | 'NIE' | 'CIF'; normalized: string; orgType?: string }
  | { valid: false; reason: string };

function dniLetter(num: number): string {
  return LETTERS[num % 23];
}

function normalize(raw: string): string {
  return raw.replace(/[\s.\-]/g, '').toUpperCase();
}

export function validateNif(raw: string): NifResult {
  if (!raw || raw.trim() === '') {
    return { valid: false, reason: 'Entrada vacía (empty)' };
  }
  const s = normalize(raw);

  const dni = DNI_RE.exec(s);
  if (dni) {
    const [, num, letter] = dni;
    const expected = dniLetter(Number.parseInt(num, 10));
    if (letter !== expected) {
      return {
        valid: false,
        reason: `Letra de control errónea: esperada ${expected}, recibida ${letter}`,
      };
    }
    return { valid: true, type: 'DNI', normalized: s };
  }

  const nie = NIE_RE.exec(s);
  if (nie) {
    const [, prefix, body, letter] = nie;
    const numeric = `${NIE_MAP[prefix]}${body}`;
    const expected = dniLetter(Number.parseInt(numeric, 10));
    if (letter !== expected) {
      return {
        valid: false,
        reason: `Letra de control errónea NIE: esperada ${expected}, recibida ${letter}`,
      };
    }
    return { valid: true, type: 'NIE', normalized: s };
  }

  return { valid: false, reason: 'Formato no reconocido' };
}
