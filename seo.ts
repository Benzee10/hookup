// Single source of truth for the VIP page's social media (Open Graph / Twitter) preview.
// The same values are hardcoded in index.html so crawlers that never execute JavaScript
// (Telegram, WhatsApp, Facebook, X/Twitter, Discord, ...) still see the preview.
export const VIP_PREVIEW_IMAGE =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbSENKiQ1eTjpbpteYwcb2t0u1DI3lSA04XXixKatAHL53VcLaE_MsHX0&s=10';

export type SeoMeta = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  /** Absolute URL of the page being shared. Leave undefined to use the current location. */
  url?: string;
  siteName?: string;
  /** Twitter/X card type. Defaults to `summary_large_image` whenever an image is provided. */
  twitterCard?: string;
};

export const VIP_SEO: SeoMeta = {
  title: 'Premium Connect VIP — Exclusive Previews (18+)',
  description:
    'A look inside the VIP community: exclusive previews and private access, shared through Telegram. Adults only, 18+.',
  image: VIP_PREVIEW_IMAGE,
  imageAlt: 'Preview of the Premium Connect VIP experience — adults only, 18+',
  siteName: 'Premium Connect',
  twitterCard: 'summary_large_image',
};
