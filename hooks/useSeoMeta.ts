import { useEffect } from 'react';
import type { SeoMeta } from '../seo';

type TouchedTag = {
  element: HTMLMetaElement;
  previousContent: string | null;
  created: boolean;
};

/**
 * Keeps the document title and the social sharing tags (Open Graph + Twitter/X card) in sync
 * with the mounted page. `index.html` ships the same tags statically so crawlers that never
 * execute JavaScript (Telegram, WhatsApp, Facebook, Discord, X, ...) still see the preview;
 * this hook keeps `seo.ts` the single source of truth on the client and restores whatever it
 * touched when the page unmounts.
 */
export const useSeoMeta = (meta: SeoMeta) => {
  useEffect(() => {
    const previousTitle = document.title;
    const touched: TouchedTag[] = [];

    const upsertMeta = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      const created = !element;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      touched.push({ element, previousContent: element.getAttribute('content'), created });
      element.setAttribute('content', value);
    };

    const url =
      meta.url ??
      (typeof window === 'undefined' ? undefined : `${window.location.origin}${window.location.pathname}`);
    const twitterCard = meta.twitterCard ?? (meta.image ? 'summary_large_image' : undefined);

    if (meta.title) {
      document.title = meta.title;
      upsertMeta('property', 'og:title', meta.title);
      upsertMeta('name', 'twitter:title', meta.title);
    }
    if (meta.description) {
      upsertMeta('name', 'description', meta.description);
      upsertMeta('property', 'og:description', meta.description);
      upsertMeta('name', 'twitter:description', meta.description);
    }
    if (meta.siteName) upsertMeta('property', 'og:site_name', meta.siteName);
    if (meta.image) {
      upsertMeta('property', 'og:image', meta.image);
      upsertMeta('property', 'og:image:secure_url', meta.image);
      upsertMeta('name', 'twitter:image', meta.image);
    }
    if (meta.imageAlt) {
      upsertMeta('property', 'og:image:alt', meta.imageAlt);
      upsertMeta('name', 'twitter:image:alt', meta.imageAlt);
    }
    if (twitterCard) upsertMeta('name', 'twitter:card', twitterCard);
    if (url) upsertMeta('property', 'og:url', url);

    return () => {
      document.title = previousTitle;
      touched.forEach(({ element, previousContent, created }) => {
        if (created) {
          element.remove();
          return;
        }
        if (previousContent === null) element.removeAttribute('content');
        else element.setAttribute('content', previousContent);
      });
    };
  }, [meta.title, meta.description, meta.image, meta.imageAlt, meta.siteName, meta.url, meta.twitterCard]);
};

export default useSeoMeta;
