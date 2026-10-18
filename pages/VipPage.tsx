import React from 'react';

const telegramLink = 'https://t.me/+HFPeZDgHGmVmMjk0';
const whatsappLink = 'https://wa.me/message/55MRTO2IBU5YA1';
const adminLink = 'https://t.me/Dr_swit';

const JoinButton: React.FC = () => (
  <a
    href={telegramLink}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-8 rounded-xl text-sm uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
  >
    Join the VIP Telegram →
  </a>
);

const Preview: React.FC<{ src: string; number: number }> = ({ src, number }) => (
  <figure className="max-w-lg mx-auto overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
    <img
      src={src}
      alt={`Exclusive VIP content preview ${number} — adults only`}
      className="w-full h-auto"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
    <figcaption className="px-5 py-3 text-xs text-zinc-400 tracking-wide">
      A preview of the VIP experience · 18+ only
    </figcaption>
  </figure>
);

const VipPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
    <header className="border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.3em]">Premium Connect / VIP</span>
        <span className="text-xs text-zinc-400">Adults only · 18+</span>
      </div>
    </header>

    <main>
      <section className="px-6 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="inline-block bg-red-600/15 text-red-400 border border-red-600/30 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest mb-8">
            Your invitation to the exclusive side
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight mb-6">
            More than a preview.<br />
            <span className="text-red-500">Get the VIP experience.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-300 leading-relaxed mb-8">
            Discover exclusive adult content in our private Telegram community.
            Take a look below, then join us for the content you won't find on this page.
          </p>
          <JoinButton />
          <p className="mt-4 mb-12 text-xs text-zinc-500">Opens in Telegram · For adults aged 18 and over</p>
          <Preview src="https://imagex1.sx.cdn.live/images/pinporn/2022/03/19/26898223.gif?width=460" number={1} />
        </div>
      </section>

      <section className="bg-zinc-900/60 border-y border-white/10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-4">Inside the community</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your next favorite destination.</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">A dedicated space for exclusive content, shared directly through Telegram.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Exclusive content', text: 'Go beyond the public previews with content shared inside the VIP channel.' },
              { title: 'One place to explore', text: 'Find the channel’s posts in one dedicated Telegram destination.' },
              { title: 'Stay connected', text: 'Enable Telegram notifications to keep up when new content is shared.' },
            ].map(({ title, text }) => (
              <div key={title} className="bg-black/50 p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-3">{title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>
          <Preview src="https://imagex1.sx.cdn.live/images/pinporn/2022/01/30/26640740.gif?width=460" number={2} />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-4">A glimpse inside</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The preview is just the beginning.</h2>
          <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Like what you see? Head to Telegram to explore the VIP community and find out how to become a member.
          </p>
        </div>
        <Preview src="https://porngif.co/wp-content/uploads/2023/08/149168-big-donk-cakey-likes-to-shake-that-enormous-soft-rump-no-ass-shots-all-natural.gif" number={3} />
        <div className="mt-10 text-center"><JoinButton /></div>
      </section>

      <section className="bg-zinc-900/60 border-y border-white/10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Your VIP experience starts here.</h2>
          <ol className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              ['Open Telegram', 'Tap the join button to open our Telegram invitation.'],
              ['Check the details', 'Review the membership information. Contact the admin if you have questions about access or payment.'],
              ['Explore the channel', 'Once admitted, browse the exclusive content and turn on notifications for future posts.'],
            ].map(([title, text], i) => (
              <li key={title}>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600 font-bold mb-4">{i + 1}</span>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
          <Preview src="https://myteenwebcam.com/fapp/gifs/8618e56516c85f4d39bcb967244a07b7.gif" number={4} />
        </div>
      </section>

      <section className="max-w-3xl mx-auto text-center px-6 py-20">
        <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-4">Make it exclusive</p>
        <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to join us?</h2>
        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
          Your next step is simple. Open the Telegram invitation and get the details on VIP access.
        </p>
        <JoinButton />
        <div className="mt-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-xl text-sm uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Contact me on WhatsApp for VIP
          </a>
        </div>
        <p className="mt-6 text-sm text-zinc-400">
          Questions about membership?{' '}
          <a href={adminLink} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-red-400">Contact the admin</a>
        </p>
      </section>
    </main>

    <footer className="border-t border-white/10 px-6 py-8 text-center">
      <p className="max-w-2xl mx-auto text-xs text-zinc-500 leading-relaxed">
        Adults only (18+). This page contains adult previews. Review membership details and any payment terms with the admin before joining. Respect the privacy of creators and members; do not redistribute private content.
      </p>
    </footer>
  </div>
);

export default VipPage;
