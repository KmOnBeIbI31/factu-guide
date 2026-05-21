import { describe, expect, it } from 'vitest';
import { articleSchema, webApplicationSchema, websiteSchema } from '../../src/lib/seo';

describe('articleSchema', () => {
  it('returns @type Article with publisher and author', () => {
    const s = articleSchema({
      title: 'Test',
      description: 'desc',
      url: 'https://factu.guide/guias/test',
      publishedAt: new Date('2026-05-21'),
      updatedAt: new Date('2026-05-22'),
      sources: [{ label: 'Boe', url: 'https://www.boe.es/x' }],
    });
    expect(s['@type']).toBe('Article');
    expect(s.author['@type']).toBe('Person');
    expect(s.publisher['@type']).toBe('Organization');
    expect(s.citation).toHaveLength(1);
    expect(s.dateModified).toBe('2026-05-22T00:00:00.000Z');
  });

  it('omits citation when sources is undefined and falls back to publishedAt for dateModified', () => {
    const s = articleSchema({
      title: 'T',
      description: 'd',
      url: 'https://factu.guide/x',
      publishedAt: new Date('2026-05-21'),
    });
    expect(s.citation).toBeUndefined();
    expect(s.dateModified).toBe('2026-05-21T00:00:00.000Z');
  });
});

describe('websiteSchema', () => {
  it('returns @type WebSite with SearchAction', () => {
    const s = websiteSchema();
    expect(s['@type']).toBe('WebSite');
    expect(s.potentialAction['@type']).toBe('SearchAction');
  });
});

describe('webApplicationSchema', () => {
  it('returns @type WebApplication', () => {
    const s = webApplicationSchema({ name: 'Validador NIF', url: 'https://factu.guide/x' });
    expect(s['@type']).toBe('WebApplication');
    expect(s.applicationCategory).toBe('BusinessApplication');
  });
});
