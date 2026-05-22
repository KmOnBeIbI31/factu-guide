import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', (e) => !e.data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  if (!context.site) throw new Error('Astro `site` is not configured');

  return rss({
    title: 'factu.guide — Guías VeriFactu',
    description: 'Cumplimiento, fiscalidad y casos prácticos para autónomos y gestorías.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.publishedAt,
      description: p.data.description,
      link: `/guias/${p.id}`,
    })),
    customData: '<language>es-ES</language>',
  });
}
