import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

import { Cursor } from '../components/Cursor';
import { Loader } from '../components/Loader';
import { Background3D } from '../components/Background3D';
import { GuestListForm } from '../components/GuestListForm';
import { VerticalImageGallery } from '../components/VerticalImageGallery';
import { SiteHeader } from '../components/SiteHeader';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const verticalGallerySectionRef = useRef<HTMLElement>(null);
  const phraseGallerySectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const endBgRef = useRef<HTMLImageElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const eventListSectionRef = useRef<HTMLElement>(null);
  const lastSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll('.gsap-reveal');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
            },
          }
        );
      });
    }

    const MAX_BG = 0.42;
    const MAX_BG_END = 0.5;
    const updateScrollChrome = () => {
      const heroImg = heroBgRef.current;
      const endImg = endBgRef.current;
      const hero = heroSectionRef.current;
      const eventListSection = eventListSectionRef.current;
      const last = lastSectionRef.current;
      const footer = footerRef.current;
      if (!last || !hero) return;

      const vh = window.innerHeight;
      const heroR = hero.getBoundingClientRect();
      const lastR = last.getBoundingClientRect();
      const eventListR = eventListSection?.getBoundingClientRect();

      let heroOp = 0;
      let endOp = 0;

      if (heroR.bottom > 0 && heroR.top < vh) {
        const blend = Math.min(1, heroR.bottom / (vh * 0.45));
        heroOp = Math.max(heroOp, MAX_BG * blend);
      }

      if (eventListR && eventListR.bottom > 0) {
        const enter = Math.min(
          1,
          Math.max(0, (vh * 0.94 - eventListR.top) / (vh * 0.52))
        );
        endOp = Math.max(endOp, MAX_BG_END * enter);
      }

      if (lastR.bottom > 0 && lastR.top < vh) {
        const travel = vh * 0.45;
        const t = Math.min(1, Math.max(0, (vh - lastR.top) / travel));
        endOp = Math.max(endOp, MAX_BG_END * t);
      }

      if (heroImg) heroImg.style.opacity = String(heroOp);
      if (endImg) endImg.style.opacity = String(endOp);

      if (footer) {
        let ft = 0;
        if (lastR.bottom > 0 && lastR.top < vh + vh * 0.35) {
          ft = Math.min(1, Math.max(0, (vh * 1.15 - lastR.top) / (vh * 0.5)));
        }
        footer.style.opacity = String(ft);
        footer.style.transform = `translateY(${(1 - ft) * 20}px)`;
        footer.style.pointerEvents = ft > 0.12 ? 'auto' : 'none';
        footer.setAttribute('aria-hidden', ft < 0.08 ? 'true' : 'false');
      }
    };

    const removeLenisScroll = lenis.on('scroll', () => {
      ScrollTrigger.update();
      updateScrollChrome();
    });
    updateScrollChrome();
    const onResize = () => {
      ScrollTrigger.refresh();
      updateScrollChrome();
    };
    window.addEventListener('resize', onResize);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      updateScrollChrome();
    });

    return () => {
      window.removeEventListener('resize', onResize);
      removeLenisScroll();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Loader />
      <Cursor />
      <SiteHeader />

      <img
        ref={heroBgRef}
        src="/hero-background.png"
        alt=""
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center center',
          transform: 'scale(0.98)',
          transformOrigin: 'center center',
          zIndex: -2,
          opacity: 0,
        }}
      />

      <img
        ref={endBgRef}
        src="/modelo.jpg.jpeg"
        alt=""
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center center',
          transform: 'scale(0.98)',
          transformOrigin: 'center center',
          zIndex: -2,
          opacity: 0,
        }}
      />

      <Background3D />

      <main ref={contentRef} style={{ position: 'relative', zIndex: 10 }}>
        <section
          ref={heroSectionRef}
          className="section-wrapper section-wrapper--hero hero-landing"
        >
          <div className="hero-landing__headline">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 3 }}
              className="headline-large"
            >
              FANTÁSTICO MUNDO.
            </motion.h1>
          </div>

          <div className="hero-landing__form">
            <GuestListForm />
          </div>
        </section>

        <section
          className="section-wrapper section-wrapper--compact gsap-reveal"
          style={{ alignItems: 'flex-start' }}
        >
          <div
            className="experience-card"
            style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '2rem',
              backdropFilter: 'blur(5px)',
              borderRadius: '8px',
            }}
          >
            <h3 className="sub-headline" style={{ color: 'var(--oakley-red)' }}>
              A Experiência
            </h3>
            <p
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 3rem)',
                lineHeight: '1.2',
                fontWeight: 300,
                marginBottom: '2rem',
              }}
            >
              Para fechar o semestre com tudo, chega a primeira edição do{' '}
              <strong style={{ color: '#fff' }}>Fantástico Mundo da Oakley</strong>, no Senac Nações
              Unidas.
            </p>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                lineHeight: '1.4',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Em uma edição mais que especial, a Oakley convida um DJ diretamente do underground do
              funk para comandar uma experiência imersiva que conecta música, cultura e atitude.
            </p>
          </div>
        </section>

        <VerticalImageGallery galleryRef={verticalGallerySectionRef} />

        <section
          id="sectionPhraseGallery"
          ref={phraseGallerySectionRef}
          className="section-wrapper section-wrapper--phrase-gallery"
        >
          <h2 className="phrase-gallery__headline gsap-reveal">
            Uma noite que vai entrar pra história da cultura urbana. Vivencie a verdadeira atitude
            Oakley.
          </h2>
          <div className="phrase-gallery__images">
            <figure className="phrase-gallery__figure gsap-reveal">
              <img src="/galeria1.jpg.jpeg" alt="Festa Oakley vista de cima" />
            </figure>
            <figure className="phrase-gallery__figure gsap-reveal">
              <img src="/galeria2.jpg.jpeg" alt="Galera no evento" />
            </figure>
            <figure className="phrase-gallery__figure gsap-reveal">
              <img src="/galeria3.jpg.jpeg" alt="DJ no palco underground" />
            </figure>
            <figure className="phrase-gallery__figure gsap-reveal">
              <img src="/galeria4.jpg.jpeg" alt="Estilo das ruas" />
            </figure>
          </div>
        </section>

        <section
          ref={eventListSectionRef}
          className="section-wrapper section-wrapper--event-list-block"
        >
          <ul
            className="event-list event-list-shell"
            style={{
              background: 'rgba(0,0,0,0.6)',
              padding: '3rem',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <li className="event-list-item gsap-reveal">Palco 360</li>
            <li className="event-list-item gsap-reveal">Ativações imersivas e experiências de marca</li>
            <li className="event-list-item gsap-reveal">Brindes exclusivos Oakley</li>
            <li
              className="event-list-item gsap-reveal"
              style={{ fontSize: '1rem', color: 'var(--oakley-red)' }}
            >
              Evento para maiores de 18 anos
            </li>
            <li className="event-list-item gsap-reveal" style={{ fontSize: '1rem', opacity: 0.6 }}>
              Este evento celebra a cultura do funk e do DJ em todas as suas expressões
            </li>
          </ul>

          <div ref={lastSectionRef} className="alerta-inline gsap-reveal">
            <div className="alerta-card">
              <p className="alerta-card__collab">OAKLEY x SUBMUNDO x FUNK</p>
              <h2 className="alerta-card__title">ALERTA DE ACESSO</h2>
              <p className="alerta-card__text">
                O ingresso é <strong>GRATUITO</strong>, mas para acessar o evento, precisa estar
                cadastrado.
              </p>
              <p className="alerta-card__warn">NÃO ENTRA SEM NOME NA LISTA.</p>
              <p className="alerta-card__text alerta-card__text--last">
                O seu ingresso garante acesso ao evento completo!
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer ref={footerRef} className="site-footer">
        <div className="site-footer__brand">OAKLEY x SUBMUNDO x FUNK</div>
        <p className="site-footer__meta">Senac Nações Unidas · Evento 18+</p>
        <small className="site-footer__copy">© {new Date().getFullYear()} Oakley Brasil</small>
      </footer>
    </>
  );
};

export default LandingPage;
