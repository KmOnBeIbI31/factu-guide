const SITE_URL = 'https://factu.guide';
const AUTHOR_NAME = 'Adrián Sánchez Quijada';
const AUTHOR_URL = `${SITE_URL}/sobre`;

export type ArticleData = {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  updatedAt?: Date;
  sources?: Array<{ label: string; url: string }>;
};

const ORG = {
  '@type': 'Organization',
  name: 'factu.guide',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
};

const PERSON = {
  '@type': 'Person',
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
  sameAs: [
    'https://github.com/KmOnBeIbI31',
    'https://www.linkedin.com/in/adri%C3%A1n-s%C3%A1nchez-quijada-a7016a353/',
  ],
};

export function articleSchema(article: ArticleData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt.toISOString(),
    dateModified: (article.updatedAt ?? article.publishedAt).toISOString(),
    author: PERSON,
    publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.url },
    isPartOf: { '@type': 'WebSite', name: 'factu.guide', url: SITE_URL },
    citation: article.sources?.map((s) => ({
      '@type': 'CreativeWork',
      name: s.label,
      url: s.url,
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'factu.guide',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webApplicationSchema(opts: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    url: opts.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (browser)',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR' },
    publisher: ORG,
  };
}
