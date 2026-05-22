/// <reference types="astro/client" />

interface Window {
  adsbygoogle: unknown[];
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}

interface ImportMetaEnv {
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
