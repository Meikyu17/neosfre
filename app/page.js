import Image from "next/image";
import HeroAudioPanel from "./components/hero-audio-panel";
import Reveal from "./components/reveal";
import RevealText from "./components/reveal-text";
import SplitTitle from "./components/split-title";
import TiltCard from "./components/tilt-card";
import Magnetic from "./components/magnetic";
import SectionLine from "./components/section-line";

const pillars = [
  {
    index: "01",
    title: "Clarté",
    heading: "Une lisibilité pure",
    description:
      "Chaque couche sonore garde une fonction nette pour laisser respirer l'image, la voix et le silence.",
  },
  {
    index: "02",
    title: "Minimalisme",
    heading: "Rien de superflu",
    description:
      "Des choix réduits à l'essentiel pour privilégier l'impact, l'espace négatif et l'intention.",
  },
  {
    index: "03",
    title: "Adaptabilité",
    heading: "Une matière évolutive",
    description:
      "Le design sonore s'ajuste au lieu, au format et au récit pour rester juste dans chaque contexte.",
  },
];

const services = [
  {
    index: "01",
    eyebrow: "Composition & Mixage",
    title: "Pour l'image",
    description:
      "Documentaires, fictions, publicités. Une écriture sonore qui structure le regard sans l'encombrer.",
    points: [
      "Direction musicale et palette émotionnelle",
      "Sound design minimal et textures de profondeur",
      "Mixage stéréo ou spatial selon le support",
    ],
    surfaceClassName: "service-surface",
    illustration: "/illustrations/image.png",
  },
  {
    index: "02",
    eyebrow: "Prestations live",
    title: "Sets ambient",
    description:
      "Interventions pour galeries d'art et lieux insolites, pensées comme des environnements sensibles.",
    points: [
      "Performances modulaires et respiration lente",
      "Adaptation au lieu, au flux et à l'acoustique",
      "Présence sonore élégante pour expériences immersives",
    ],
    surfaceClassName: "service-surface service-surface-alt",
    illustration: "/illustrations/image copy.png",
  },
];

const portfolio = [
  {
    title: "INSISTE",
    subtitle: "Un film de Ben Popincourt",
    role: "Composition & mixage",
    description:
      "Exemple de réalisation pour laquelle l'agence a conçu la composition originale et le mixage final.",
    imageSrc: "/portfolio/insiste.jpeg",
    imageAlt: "Cover du film INSISTE",
  },
  {
    title: "Araucaria",
    subtitle: "Un film de Jeanne Frenkel et Cosme Castro",
    role: "Composition & mixage",
    description:
      "Exemple de réalisation où l'agence a assuré la composition sonore et le mixage dans une approche sensible et immersive.",
    imageSrc: "/portfolio/araucaria.jpeg",
    imageAlt: "Cover du film Araucaria",
  },
];

export default function HomePage() {
  return (
    <main id="top" className="page-shell">
      <header className="site-header">
        <nav className="site-nav" aria-label="Navigation principale">
          <a href="#top" className="nav-brand">
            Neosfere
          </a>
          <div style={{ display: "flex", gap: "2rem" }}>
            <a href="#devis" className="nav-link">Devis</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </nav>
      </header>

      <section className="section hero-section">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">Studio sonore / Paris / 2026</p>
          </Reveal>
          <SplitTitle className="hero-title" delay={0.08}>NEOSFERE</SplitTitle>
          <Reveal delay={0.16}>
            <p className="hero-subtitle">L'architecture du silence et du son.</p>
          </Reveal>
          <Reveal delay={0.24}>
            <Magnetic>
              <a href="#manifesto" className="cta-link">
                Explorer l'espace
                <span className="cta-arrow" aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal className="hero-panel-wrap" delay={0.18}>
          <HeroAudioPanel />
        </Reveal>
      </section>

      <section id="manifesto" className="section bordered-section">
        <SectionLine />
        <div className="content-block">
          <Reveal>
            <p className="eyebrow">La démarche</p>
          </Reveal>
          <RevealText as="blockquote" className="manifest-quote" delay={0.08}>
            Le son ne doit pas seulement être entendu, il doit être ressenti
            comme un environnement.
          </RevealText>
        </div>

        <div className="grid-shell pillars-grid">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.08}>
              <article className="card">
                <p className="card-index">
                  {pillar.index} / {pillar.title}
                </p>
                <h2 className="card-title">{pillar.heading}</h2>
                <p className="card-description">{pillar.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="services" className="section bordered-section">
        <SectionLine />
        <div className="section-heading">
          <div>
            <Reveal>
              <p className="eyebrow">Services</p>
            </Reveal>
            <RevealText as="h2" className="section-title" delay={0.08}>Deux champs d'intervention</RevealText>
          </div>
          <Reveal delay={0.16}>
            <p className="section-intro">
              Une exécution sobre, précise et immersive pour l'image comme pour
              la performance in situ.
            </p>
          </Reveal>
        </div>

        <div className="grid-shell services-grid">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.1}>
              <TiltCard className="card service-card">
                <Image
                  src={service.illustration}
                  alt={service.title}
                  width={400}
                  height={300}
                  className="service-illustration"
                />
                <p className="card-index">
                  {service.index} / {service.eyebrow}
                </p>
                <h3 className="card-title service-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
                <ul className="service-list">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Magnetic>
                  <a href="#devis" className="cta-link service-cta">
                    Demander un devis
                    <span className="cta-arrow" aria-hidden="true">↗</span>
                  </a>
                </Magnetic>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="portfolio" className="section bordered-section">
        <SectionLine />
        <div className="section-heading">
          <div>
            <Reveal>
              <p className="eyebrow">Portfolio</p>
            </Reveal>
            <RevealText as="h2" className="section-title" delay={0.08}>Réalisations</RevealText>
          </div>

        </div>

        <div className="grid-shell portfolio-grid">
          {portfolio.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.1}>
              <TiltCard className="card portfolio-card">
                <div className="portfolio-poster">
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 960px) 100vw, 42rem"
                    className="portfolio-image"
                  />
                </div>
                <div className="portfolio-meta">
                  <h3 className="portfolio-title">{project.title}</h3>
                  <p className="portfolio-subtitle">{project.subtitle}</p>
                </div>
                <div className="portfolio-copy">
                  <p className="card-index">{project.role}</p>
                  <p className="card-description">{project.description}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="devis" className="section bordered-section">
        <SectionLine />
        <div className="section-heading">
          <div>
            <Reveal>
              <p className="eyebrow">Devis</p>
            </Reveal>
            <RevealText as="h2" className="section-title" delay={0.08}>Un projet en tête ?</RevealText>
          </div>
          <Reveal delay={0.16}>
            <p className="section-intro">
              Décrivez votre projet et recevez une réponse sous 48h.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <form
            className="devis-form"
            action="mailto:contact@neosfere.studio"
            method="post"
            encType="text/plain"
          >
            <div className="devis-row">
              <label className="devis-field">
                <span className="devis-label">Nom</span>
                <input
                  className="devis-input"
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  required
                />
              </label>
              <label className="devis-field">
                <span className="devis-label">Type de projet</span>
                <select className="devis-input devis-select" name="type">
                  <option value="">Sélectionner</option>
                  <option value="image">Pour l'image</option>
                  <option value="live">Sets ambient</option>
                </select>
              </label>
            </div>
            <label className="devis-field">
              <span className="devis-label">Email</span>
              <input
                className="devis-input"
                type="email"
                name="email"
                placeholder="votre@email.com"
                required
              />
            </label>
            <label className="devis-field">
              <span className="devis-label">Projet</span>
              <textarea
                className="devis-input devis-textarea"
                name="message"
                placeholder="Décrivez votre projet…"
                required
              />
            </label>
            <Magnetic>
              <button type="submit" className="cta-link devis-submit">
                Envoyer la demande
                <span className="cta-arrow" aria-hidden="true">↗</span>
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </section>

      <footer id="contact" className="site-footer bordered-section">
        <div className="footer-inner">
          <div>
            <p className="eyebrow">Contact</p>
            <a href="mailto:contact@neosfere.studio" className="footer-mail">
              contact@neosfere.fr
            </a>
            <p className="footer-meta">Paris / Remote</p>
          </div>
          <p className="footer-signature">Modern. Elegant. Future.</p>
        </div>
      </footer>
    </main>
  );
}
