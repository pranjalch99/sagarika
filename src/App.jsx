import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  Heart,
  Image as ImageIcon,
  Lock,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import {
  finalLetter,
  gallery,
  letters,
  reasons,
  receipts,
  siteCopy,
  timeline,
} from "./data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function assetPath(src) {
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;
}

function Reveal({ children, delay = 0, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0 : 0.75,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 58 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        top: (index * 53) % 100,
        size: 1 + (index % 3),
        delay: (index % 9) * 0.35,
        duration: 3.4 + (index % 5) * 0.45,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-16rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-rose/20 blur-3xl" />
      <div className="absolute right-[-12rem] top-[20%] h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute bottom-[-14rem] left-[25%] h-[30rem] w-[30rem] rounded-full bg-wine/50 blur-3xl" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-blush shadow-[0_0_12px_rgba(255,214,223,0.7)]"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.18, 0.85, 0.22], scale: [1, 1.7, 1] }}
          transition={{
            repeat: Infinity,
            duration: star.duration,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-4xl leading-tight text-blush md:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/64 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}

function Modal({ item, onClose, children, labelledBy = "modal-title" }) {
  useEffect(() => {
    if (!item) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-night/78 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.07] shadow-2xl shadow-black/50 backdrop-blur-2xl"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-night/70 text-white transition hover:border-rose/40 hover:text-blush"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (value.trim().toLowerCase() === siteCopy.password) {
      setError("");
      onUnlock();
      return;
    }

    setError("Almost. Try the name that this whole little universe belongs to.");
  }

  return (
    <motion.main
      className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.7 }}
    >
      <StarField />
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/12 bg-white/[0.07] p-6 text-center shadow-glow backdrop-blur-2xl sm:p-8"
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
          <Lock size={24} />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold/80">
          Private
        </p>
        <h1 className="font-display text-4xl leading-tight text-blush">
          {siteCopy.passwordHeading}
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/62">{siteCopy.passwordSubtext}</p>
        <label className="mt-7 block text-left text-sm font-medium text-white/70">
          Password
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            type="password"
            autoComplete="off"
            autoFocus
            className="mt-2 w-full rounded-2xl border border-white/12 bg-night/60 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-rose/60 focus:ring-4 focus:ring-rose/10"
            placeholder="Enter password"
          />
        </label>
        <AnimatePresence>
          {error ? (
            <motion.p
              className="mt-3 text-left text-sm text-rose"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-gold px-5 py-3 font-semibold text-night shadow-gold transition hover:scale-[1.01] active:scale-[0.99]"
        >
          <Sparkles size={18} />
          Unlock
        </button>
      </motion.form>
    </motion.main>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-5 py-24"
    >
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      <div className="container-narrow relative z-10">
        <motion.p
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold/85 backdrop-blur-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <Heart size={14} />
          For Sagarika, From Pranjal
        </motion.p>
        <motion.h1
          className="max-w-5xl font-display text-6xl leading-[0.95] text-blush sm:text-7xl md:text-8xl lg:text-9xl"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {siteCopy.heroTitle}
        </motion.h1>
        <motion.p
          className="mt-7 max-w-2xl text-xl leading-9 text-white/70 md:text-2xl"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {siteCopy.heroLine}
        </motion.p>
        <motion.button
          type="button"
          onClick={() => scrollToId("timeline")}
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-blush px-6 py-4 font-semibold text-night shadow-glow transition hover:bg-white active:scale-[0.98]"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.65 }}
        >
          {siteCopy.heroButton}
          <ArrowDown size={18} />
        </motion.button>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="section-pad relative">
      <SectionHeader
        eyebrow="Chapter one"
        title="How It All Started"
        subtitle="From one DM to Vietnam, somehow every small moment became a memory."
      />
      <div className="container-narrow relative">
        <div className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-rose/0 via-rose/45 to-gold/0 md:left-1/2 md:block" />
        <div className="space-y-5 md:space-y-8">
          {timeline.map((item, index) => (
            <Reveal key={item.date} delay={index * 0.05}>
              <article
                className={`relative rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-glow backdrop-blur-xl md:w-[calc(50%-2.25rem)] md:p-7 ${
                  index % 2 ? "md:ml-auto" : ""
                }`}
              >
                <span className="mb-4 inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {item.date}
                </span>
                <h3 className="font-display text-3xl text-blush md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-white/66">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="gallery" className="section-pad">
      <SectionHeader
        eyebrow="Photographs"
        title="Little Pieces of Us"
        subtitle="A few frames, a lot of feeling, and so many things between the lines."
      />
      <div className="container-wide columns-1 gap-4 sm:columns-2 lg:columns-4">
        {gallery.map((item, index) => (
          <Reveal key={item.src} delay={index * 0.06} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setSelected(item)}
              className={`group relative block w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] text-left shadow-glow ${
                index === 1 ? "lg:mt-16" : ""
              }`}
            >
              <img
                src={assetPath(item.src)}
                alt={item.title}
                className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/92 via-night/35 to-transparent p-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-blush">
                  <ImageIcon size={16} />
                  {item.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-white/62">
                  {item.caption}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <Modal item={selected} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid max-h-[90vh] md:grid-cols-[1fr_20rem]">
            <img
              src={assetPath(selected.src)}
              alt={selected.title}
              className="h-full max-h-[72vh] w-full object-contain bg-black/30 md:max-h-[90vh]"
            />
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/80">
                Memory
              </p>
              <h3 id="modal-title" className="mt-3 font-display text-4xl text-blush">
                {selected.title}
              </h3>
              <p className="mt-4 leading-8 text-white/66">{selected.caption}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}

function ReceiptsSection() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="section-pad">
      <SectionHeader
        eyebrow="Before us"
        title="The Tiny Receipts"
        subtitle="A few saved pieces from the nervous, hopeful beginning."
      />
      <div className="container-wide grid gap-4 md:grid-cols-3">
        {receipts.map((item, index) => (
          <Reveal key={item.src} delay={index * 0.07}>
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="group relative h-[28rem] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] text-left shadow-gold"
            >
              <img
                src={assetPath(item.src)}
                alt={item.title}
                className="h-full w-full object-cover object-top opacity-[0.72] grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/80">
                  {item.date}
                </span>
                <span className="mt-2 block font-display text-3xl text-blush">
                  {item.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-white/66">
                  {item.note}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <Modal item={selected} onClose={() => setSelected(null)}>
        {selected ? (
          <div>
            <img
              src={assetPath(selected.src)}
              alt={selected.title}
              className="max-h-[74vh] w-full object-contain bg-black/40"
            />
            <div className="p-6">
              <h3 id="modal-title" className="font-display text-3xl text-blush">
                {selected.title}
              </h3>
              <p className="mt-2 text-white/62">{selected.note}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}

function LettersSection() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="section-pad">
      <SectionHeader
        eyebrow="Keep these"
        title="Open When Letters"
        subtitle="Small pieces of me for the moments when you need them."
      />
      <div className="container-wide grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {letters.map((letter, index) => (
          <Reveal key={letter.title} delay={index * 0.06}>
            <button
              type="button"
              onClick={() => setSelected(letter)}
              className="group flex min-h-56 w-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 text-left shadow-glow backdrop-blur-xl transition hover:-translate-y-1 hover:border-rose/35"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                <Heart size={17} />
              </span>
              <span className="font-display text-3xl leading-tight text-blush">
                {letter.title}
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <Modal item={selected} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="p-7 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/80">
              Letter
            </p>
            <h3 id="modal-title" className="mt-3 font-display text-5xl text-blush">
              {selected.title}
            </h3>
            <p className="mt-6 text-lg leading-9 text-white/72">{selected.body}</p>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}

function ReasonsSection() {
  return (
    <section className="section-pad">
      <SectionHeader
        eyebrow="Twelve small truths"
        title="Reasons I Love You"
        subtitle="Not the full list. Just enough to make the page blush."
      />
      <div className="container-wide grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason, index) => (
          <Reveal key={reason} delay={(index % 6) * 0.04}>
            <motion.article
              className="min-h-40 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-5 shadow-glow backdrop-blur-xl"
              whileHover={{ y: -5, borderColor: "rgba(255, 143, 179, 0.35)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/70">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <p className="mt-5 font-display text-3xl leading-tight text-blush">
                {reason}
              </p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalLetter() {
  return (
    <section className="section-pad">
      <div className="container-narrow">
        <Reveal>
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.065] p-6 shadow-glow backdrop-blur-2xl md:p-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold/80">
              Final note
            </p>
            <h2 className="font-display text-5xl leading-tight text-blush md:text-7xl">
              {finalLetter.title}
            </h2>
            <p className="mt-7 text-lg leading-9 text-white/72 md:text-xl md:leading-10">
              {finalLetter.text}
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function EndingSection() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden px-5 py-24 text-center">
      <div className="container-narrow relative z-10">
        <Reveal>
          <p className="mx-auto max-w-4xl font-display text-5xl leading-tight text-blush md:text-7xl">
            {siteCopy.endingLine}
          </p>
          <button
            type="button"
            onClick={() => scrollToId("hero")}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.08] px-6 py-4 font-semibold text-blush shadow-gold backdrop-blur-xl transition hover:border-rose/40 hover:bg-white/[0.12]"
          >
            <RefreshCw size={18} />
            Replay our story
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function StorySite() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen overflow-hidden"
    >
      <StarField />
      <Hero />
      <Timeline />
      <GallerySection />
      <ReceiptsSection />
      <LettersSection />
      <ReasonsSection />
      <FinalLetter />
      <EndingSection />
    </motion.div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <StorySite key="story" />
      ) : (
        <PasswordGate key="password" onUnlock={() => setUnlocked(true)} />
      )}
    </AnimatePresence>
  );
}
