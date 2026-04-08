import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

import { Cursor } from './components/Cursor';
import { Loader } from './components/Loader';
import { Background3D } from './components/Background3D';
import { GuestListForm } from './components/GuestListForm';
import { VerticalImageGallery } from './components/VerticalImageGallery';

gsap.registerPlugin(ScrollTrigger);

const Header = () => (
  <motion.header 
    className="site-header"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 2.8 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-start',
      mixBlendMode: 'difference'
    }}
  >
    <div className="site-header__logo" style={{ fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}>
      OAKLEY<span style={{ color: 'var(--oakley-red)' }}>.</span>
    </div>
  </motion.header>
);

const App: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const modelBgRef = useRef<HTMLImageElement>(null);
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
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            }
          }
        );
      });
    }

    // Foto de fundo + rodapé: mesma lógica no scroll do Lenis
    const MAX_BG = 0.42;
    const updateScrollChrome = () => {
      const img = modelBgRef.current;
      const eventList = eventListSectionRef.current;
      const last = lastSectionRef.current;
      const footer = footerRef.current;
      const pinEl = pinSectionRef.current;
      if (!last) return;

      const vh = window.innerHeight;
      const lastR = last.getBoundingClientRect();
      const eventListR = eventList?.getBoundingClientRect();

      // Foto só depois de terminar o scroll horizontal (pin + scrub completo)
      const stPin = ScrollTrigger.getById('st-horizontal-pin');
      let horizontalDone = false;
      if (stPin) {
        horizontalDone = stPin.progress >= 0.998;
      } else if (pinEl) {
        const pr = pinEl.getBoundingClientRect();
        horizontalDone = pr.bottom < 0;
      }

      let op = 0;

      if (img) {
        if (horizontalDone) {
          // Lista de eventos + ALERTA: fade da foto após a faixa horizontal
          if (eventListR && eventListR.bottom > 0 && eventListR.top < vh + vh * 0.45) {
            const t = Math.min(
              1,
              Math.max(0, (vh * 1.2 - eventListR.top) / (vh * 0.58))
            );
            op = Math.max(op, MAX_BG * t);
          }

          if (lastR.bottom > 0 && lastR.top < vh) {
            const travel = vh * 0.55;
            const t = Math.min(1, Math.max(0, (vh - lastR.top) / travel));
            op = Math.max(op, MAX_BG * t);
          }
        }

        img.style.opacity = String(op);
      }

      // Rodapé aparece ao chegar perto da última seção (ALERTA)
      if (footer) {
        let ft = 0;
        if (lastR.bottom > 0 && lastR.top < vh + vh * 0.35) {
          ft = Math.min(
            1,
            Math.max(0, (vh * 1.15 - lastR.top) / (vh * 0.5))
          );
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

    // Horizontal Scroll Gallery Logic (Pinning)
    if (pinSectionRef.current && pinWrapRef.current) {
      const pinWrapWidth = pinWrapRef.current.scrollWidth;
      const horizontalScrollLength = pinWrapWidth - window.innerWidth;

      gsap.to(pinWrapRef.current, {
        scrollTrigger: {
          id: 'st-horizontal-pin',
          trigger: pinSectionRef.current,
          pin: true,
          scrub: 1, // Smooth scrubbing
          start: "top top",
          end: () => `+=${pinWrapWidth}`
        },
        x: -horizontalScrollLength,
        ease: "none"
      });
    }

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
      <Header />
      
      {/* Mesma foto de fundo do restante do site, visível desde o hero (sem partículas no canvas) */}
      <img
        ref={modelBgRef}
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
          zIndex: -2,
          opacity: 0,
          filter: 'grayscale(0.5)',
        }}
      />

      <Background3D /> {/* Óculos 3D (z-index: -1) */}

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

        <section className="section-wrapper section-wrapper--compact gsap-reveal" style={{ alignItems: 'flex-start' }}>
          <div className="experience-card" style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', backdropFilter: 'blur(5px)', borderRadius: '8px' }}>
            <h3 className="sub-headline" style={{ color: 'var(--oakley-red)' }}>A Experiência</h3>
            <p style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)', lineHeight: '1.2', fontWeight: 300, marginBottom: '2rem' }}>
              Para fechar o semestre com tudo, chega a primeira edição do <strong style={{color: '#fff'}}>Fantástico Mundo da Oakley</strong>, no Senac Nações Unidas.
            </p>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', lineHeight: '1.4', color: 'rgba(255,255,255,0.7)' }}>
              Em uma edição mais que especial, a Oakley convida um DJ diretamente do underground do funk para comandar uma experiência imersiva que conecta música, cultura e atitude.
            </p>
          </div>
        </section>

        <VerticalImageGallery />

        {/* --- HORIZONTAL PINNED GALLERY SECTION --- */}
        <section id="sectionPin" ref={pinSectionRef}>
          <div className="pin-wrap" ref={pinWrapRef}>
            <h2>Uma noite que vai entrar pra história da cultura urbana. Vivencie a verdadeira atitude Oakley.</h2>
            <img src="/galeria1.jpg.jpeg" alt="Festa Oakley vista de cima" />
            <img src="/galeria2.jpg.jpeg" alt="Galera no evento" />
            <img src="/galeria3.jpg.jpeg" alt="DJ no palco underground" />
            <img src="/galeria4.jpg.jpeg" alt="Estilo das ruas" />
          </div>
        </section>

        {/* Lista + ALERTA no mesmo bloco — card compacto centralizado abaixo das infos */}
        <section
          ref={eventListSectionRef}
          className="section-wrapper section-wrapper--event-list-block"
        >
          <ul className="event-list event-list-shell" style={{ background: 'rgba(0,0,0,0.6)', padding: '3rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
            <li className="event-list-item gsap-reveal">Palco 360</li>
            <li className="event-list-item gsap-reveal">Ativações imersivas e experiências de marca</li>
            <li className="event-list-item gsap-reveal">Brindes exclusivos Oakley</li>
            <li className="event-list-item gsap-reveal" style={{ fontSize: '1rem', color: 'var(--oakley-red)' }}>Evento para maiores de 18 anos</li>
            <li className="event-list-item gsap-reveal" style={{ fontSize: '1rem', opacity: 0.6 }}>Este evento celebra a cultura do funk e do DJ em todas as suas expressões</li>
          </ul>

          <div ref={lastSectionRef} className="alerta-inline gsap-reveal">
            <div className="alerta-card">
              <p className="alerta-card__collab">OAKLEY x SUBMUNDO x FUNK</p>
              <h2 className="alerta-card__title">ALERTA DE ACESSO</h2>
              <p className="alerta-card__text">
                O ingresso é <strong>GRATUITO</strong>, mas para acessar o evento, precisa estar cadastrado.
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
        <div className="site-footer__brand">
          OAKLEY x SUBMUNDO x FUNK
        </div>
        <p className="site-footer__meta">Senac Nações Unidas · Evento 18+</p>
        <small className="site-footer__copy">© {new Date().getFullYear()} Oakley Brasil</small>
      </footer>
    </>
  );
};

export default App;
