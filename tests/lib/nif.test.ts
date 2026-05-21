import { describe, expect, it } from 'vitest';
import { validateNif } from '../../src/lib/nif';

describe('validateNif — DNI', () => {
  it('accepts a valid DNI', () => {
    expect(validateNif('12345678Z')).toEqual({
      valid: true,
      type: 'DNI',
      normalized: '12345678Z',
    });
  });

  it('rejects a DNI with the wrong control letter', () => {
    const result = validateNif('12345678A');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/letra de control/i);
  });

  it('rejects a DNI with non-digit body', () => {
    const result = validateNif('1234567XZ');
    expect(result.valid).toBe(false);
  });

  it('treats lowercase as uppercase', () => {
    expect(validateNif('12345678z')).toMatchObject({ valid: true, type: 'DNI' });
  });

  it('strips dashes and dots', () => {
    expect(validateNif('12.345.678-Z')).toMatchObject({ valid: true, type: 'DNI' });
  });

  it('flags empty input', () => {
    const result = validateNif('');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toMatch(/vacío|empty/i);
  });
});
