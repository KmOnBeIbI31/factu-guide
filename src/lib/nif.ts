const DNI_RE = /^(\d{8})([A-Z])$/;
const NIE_RE = /^([XYZ])(\d{7})([A-Z])$/;
const LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const NIE_MAP: Record<string, string> = { X: '0', Y: '1', Z: '2' };

const CIF_RE = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/;
const CIF_CONTROL_LETTERS = 'JABCDEFGHI';
const CIF_LETTER_ALWAYS = new Set(['P', 'Q', 'R', 'S', 'N', 'W']);
const CIF_DIGIT_ALWAYS = new Set(['A', 'B', 'E', 'H']);

const ORG_TYPES: Record<string, string> = {
  A: 'Sociedad Anónima',
  B: 'Sociedad Limitada',
  C: 'Sociedad Colectiva',
  D: 'Sociedad Comanditaria',
  E: 'Comunidad de bienes',
  F: 'Sociedad Cooperativa',
  G: 'Asociación',
  H: 'Comunidad de propietarios',
  J: 'Sociedad civil',
  N: 'Entidad extranjera',
  P: 'Corporación local',
  Q: 'Organismo público',
  R: 'Congregación religiosa',
  S: 'Órgano de la Administración',
  U: 'Unión temporal de empresas',
  V: 'Otros tipos',
  W: 'Establecimiento permanente no residente',
};

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

  const cif = CIF_RE.exec(s);
  if (cif) {
    const [, orgLetter, body, control] = cif;
    let sumEven = 0;
    let sumOdd = 0;
    for (let i = 0; i < body.length; i++) {
      const d = Number.parseInt(body[i], 10);
      if ((i + 1) % 2 === 0) {
        sumEven += d;
      } else {
        const doubled = d * 2;
        sumOdd += Math.floor(doubled / 10) + (doubled % 10);
      }
    }
    const total = sumEven + sumOdd;
    const controlDigit = (10 - (total % 10)) % 10;
    const controlLetter = CIF_CONTROL_LETTERS[controlDigit];

    let expected: string;
    if (CIF_LETTER_ALWAYS.has(orgLetter)) {
      expected = controlLetter;
    } else if (CIF_DIGIT_ALWAYS.has(orgLetter)) {
      expected = String(controlDigit);
    } else {
      expected = control; // accept both
    }

    const matches = CIF_LETTER_ALWAYS.has(orgLetter)
      ? control === controlLetter
      : CIF_DIGIT_ALWAYS.has(orgLetter)
        ? control === String(controlDigit)
        : control === controlLetter || control === String(controlDigit);

    if (!matches) {
      return {
        valid: false,
        reason: `Dígito control CIF inválido: esperado ${expected}, recibido ${control}`,
      };
    }

    return {
      valid: true,
      type: 'CIF',
      normalized: s,
      orgType: ORG_TYPES[orgLetter],
    };
  }

  return { valid: false, reason: 'Formato no reconocido' };
}
