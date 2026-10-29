// Single source of truth for the VIP page's social media (Open Graph / Twitter) preview.
// The same values are hardcoded in index.html so crawlers that never execute JavaScript
// (Telegram, WhatsApp, Facebook, X/Twitter, Discord, ...) still see the preview.
export const VIP_PREVIEW_IMAGE =
  'https://i.postimg.cc/ht4MyL1W/images-q-tbn-ANd9Gc-Tm-Q-8jzp-SN5ADr-Qfc-XJh5-X8Ah-CRwalnd-H9-rfc-QEXS-za4-KDV-8DF-7r-s-10.jpg';

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
  title: 'Premium Connect VIP — Members Directory',
  description:
    'Everything VIP in one place: the Telegram channel, the WhatsApp group and the video collections. Pick a room and jump in.',
  image: VIP_PREVIEW_IMAGE,
  imageAlt: 'Premium Connect VIP members directory',
  siteName: 'Premium Connect',
  twitterCard: 'summary_large_image',
};
