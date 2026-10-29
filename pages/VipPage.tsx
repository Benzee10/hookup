import React from 'react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { VIP_SEO } from '../seo';

/* ------------------------------------------------------------------ *
 * Links
 * ------------------------------------------------------------------ */

const telegramLink = 'https://t.me/beaifuloul';
const whatsappLink = 'https://vip-redirect.vercel.app';
const videosLink = 'https://html-starter-6nu.pages.dev/';
const adminShortLink = 'https://lovelydates.short.gy/rdgHt1';

/* ------------------------------------------------------------------ *
 * Small building blocks
 * ------------------------------------------------------------------ */

/** Solid play triangle used inside every call-to-action button. */
const PlayIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
  </svg>
);

/** The high-contrast pink/red action button (icon + label, full width of the card). */
const ActionButton: React.FC<{ href: string; label: string; action: string }> = ({ href, label, action }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${action} — ${label}`}
    className="mt-auto inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#ff3b5c] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#ff3b5c]/20 transition-all duration-200 hover:bg-[#ff5c78] hover:shadow-[#ff3b5c]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3b5c]"
  >
    <PlayIcon />
    <span>{action}</span>
  </a>
);

type VipCard = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  image: string;
  action: string;
  badge: string;
};

/** A single content card: image on top, bold title below, action button at the bottom. */
const VipContentCard: React.FC<{ card: VipCard }> = ({ card }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3b5c]/40 hover:shadow-[0_20px_45px_-15px_rgba(255,59,92,0.45)]">
    {/* No fixed aspect ratio and no cropping: every GIF renders at its full width and
        full length. Very tall GIFs are capped at 75vh and letterboxed instead of cut. */}
    <div className="relative bg-black">
      <img
        src={card.image}
        alt={`${card.title} — Premium Connect VIP preview`}
        className="mx-auto block h-auto w-full max-h-[75vh] object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
        {card.badge}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
        {card.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{card.blurb}</p>
      <div className="mt-6">
        <ActionButton href={card.href} label={card.title} action={card.action} />
      </div>
    </div>
  </article>
);

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const vipCards: VipCard[] = [
  {
    id: 'telegram',
    title: 'Telegram',
    blurb: 'Join the private channel for daily drops and direct access to the community.',
    href: telegramLink,
    image: 'https://imagex1.sx.cdn.live/images/pinporn/2022/03/19/26898223.gif?width=460',
    action: 'Join',
    badge: 'VIP',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Group',
    blurb: 'Step into the group chat where members swap links, tips and fresh content.',
    href: whatsappLink,
    image: 'https://imagex1.sx.cdn.live/images/pinporn/2022/01/30/26640740.gif?width=460',
    action: 'Join',
    badge: 'VIP',
  },
  {
    id: 'mzansi',
    title: 'Mzansi Videos',
    blurb: 'Browse the full Mzansi collection — new clips added as they land.',
    href: videosLink,
    image:
      'https://porngif.co/wp-content/uploads/2023/08/149168-big-donk-cakey-likes-to-shake-that-enormous-soft-rump-no-ass-shots-all-natural.gif',
    action: 'Watch',
    badge: 'VIP',
  },
  {
    id: 'student',
    title: 'Student Videos',
    blurb: 'Stream the student collection anytime, straight from the vault.',
    href: videosLink,
    image: 'https://myteenwebcam.com/fapp/gifs/8618e56516c85f4d39bcb967244a07b7.gif',
    action: 'Watch',
    badge: 'VIP',
  },
];

const steps: Array<[string, string]> = [
  ['Pick your room', 'Choose Telegram, the WhatsApp group or one of the video vaults above.'],
  ['Tap the button', 'Every card opens its destination in a new tab — no detours.'],
  ['Stay in the loop', 'Turn on notifications so you never miss a fresh drop.'],
];

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

const VipPageContent: React.FC = () => (
  <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#ff3b5c] selection:text-white">
    {/* Top bar */}
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">Premium Connect / VIP</span>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Members only · Private community</span>
      </div>
    </header>

    <main>
      {/* Hero */}
      <section className="px-6 pb-12 pt-16 text-center sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 inline-block rounded-full border border-[#ff3b5c]/30 bg-[#ff3b5c]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff6b83]">
            The VIP directory
          </p>
          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl">
            Everything VIP.<br />
            <span className="text-[#ff3b5c]">One place.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Pick a room below — the Telegram channel, the WhatsApp group, or one of the video collections.
            Every card opens in a new tab.
          </p>
        </div>
      </section>

      {/* VIP content grid — 1 column on mobile, 2 columns on desktop */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">VIP content</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {vipCards.length} rooms
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {vipCards.map((card) => (
              <VipContentCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
            How it works
          </h2>
          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(([title, text], i) => (
              <li key={title} className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff3b5c] text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Ready to dive in?</h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Start with the Telegram channel, then work your way through the rest of the directory.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#ff3b5c] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#ff5c78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3b5c]"
            >
              <PlayIcon />
              Join Telegram
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-[#1a1a1a] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              WhatsApp Group
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Questions about access?{' '}
            <a
              href={adminShortLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 hover:text-[#ff3b5c]"
            >
              Contact the admin
            </a>
          </p>
        </div>
      </section>
    </main>

    <footer className="border-t border-white/10 px-6 py-8 text-center">
      <p className="mx-auto max-w-2xl text-xs leading-relaxed text-zinc-500">
        All links open external destinations in a new tab. Membership details and any payment terms are handled by the
        admin. Please respect the privacy of every member and keep shared content inside the community.
      </p>
    </footer>
  </div>
);

// Wraps the page so the social media (Open Graph + Twitter/X) preview tags are applied
// whenever the VIP route is mounted. `index.html` carries the same tags statically for
// crawlers that do not execute JavaScript.
const VipPage: React.FC = () => {
  useSeoMeta(VIP_SEO);
  return <VipPageContent />;
};

export default VipPage;
