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
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 2.8 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '2rem 4rem',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-start',
      mixBlendMode: 'difference'
    }}
  >
    <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}>
      OAKLEY<span style={{ color: 'var(--oakley-red)' }}>.</span>
    </div>
  </motion.header>
);

const App: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const eventListSectionRef = useRef<HTMLElement>(null);
  const modelBgRef = useRef<HTMLImageElement>(null);

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
    const removeLenisScroll = lenis.on('scroll', ScrollTrigger.update);

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

    // Horizontal Scroll Gallery Logic (Pinning)
    if (pinSectionRef.current && pinWrapRef.current) {
      const pinWrapWidth = pinWrapRef.current.scrollWidth;
      const horizontalScrollLength = pinWrapWidth - window.innerWidth;

      gsap.to(pinWrapRef.current, {
        scrollTrigger: {
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

    // Fade dinâmico da foto do Modelo apenas na tela de Listagem de Eventos
    if (modelBgRef.current && eventListSectionRef.current) {
      gsap.to(modelBgRef.current, {
        opacity: 0.3, // Brilho suave da foto no fundo para não ofuscar o texto
        scrollTrigger: {
          trigger: eventListSectionRef.current,
          start: "top 60%", // Começa a aparecer quando a lista chega no meio da tela
          end: "bottom 40%", // Some quando a lista sai de foco
          toggleActions: "play reverse play reverse", // Anima in-and-out perfeitamente
        }
      });
    }

    return () => {
      removeLenisScroll();
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <Loader />
      <Cursor />
      <Header />
      
      {/* Camada Dinâmica da Foto de Fundo da Sessão de Lista (z-index: -2) */}
      <img ref={modelBgRef} src="/modelo.jpg.jpeg" alt="Modelo Oakley" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -2, opacity: 0, filter: 'grayscale(0.5)' }} />

      <Background3D /> {/* Óculos Flutuante + Ondas (z-index: -1) */}

      <main ref={contentRef} style={{ position: 'relative', zIndex: 10 }}>
        
        <section className="section-wrapper section-wrapper--hero" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(2rem, 8vw, 10vw)' }}>
          <div style={{ flex: 1, paddingRight: '4rem' }}>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 3 }}
              className="headline-large"
            >
              FANTÁSTICO MUNDO.
            </motion.h1>
          </div>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
             <GuestListForm />
          </div>
        </section>

        <section className="section-wrapper section-wrapper--compact gsap-reveal" style={{ alignItems: 'flex-start' }}>
          <div style={{ maxWidth: '800px', background: 'rgba(0,0,0,0.4)', padding: '2rem', backdropFilter: 'blur(5px)', borderRadius: '8px' }}>
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

        {/* REFFED SECTION CAUSING DYNAMIC BACKGROUND TO SHOW */}
        <section ref={eventListSectionRef} className="section-wrapper" style={{ alignItems: 'center' }}>
           <ul className="event-list" style={{ background: 'rgba(0,0,0,0.6)', padding: '3rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
              <li className="event-list-item gsap-reveal">Palco 360</li>
              <li className="event-list-item gsap-reveal">Ativações imersivas e experiências de marca</li>
              <li className="event-list-item gsap-reveal">Brindes exclusivos Oakley</li>
              <li className="event-list-item gsap-reveal" style={{ fontSize: '1rem', color: 'var(--oakley-red)' }}>Evento para maiores de 18 anos</li>
              <li className="event-list-item gsap-reveal" style={{ fontSize: '1rem', opacity: 0.6 }}>Este evento celebra a cultura do funk e do DJ em todas as suas expressões</li>
           </ul>
        </section>

        <section className="section-wrapper gsap-reveal" style={{ minHeight: '50vh', textAlign: 'center', justifyContent: 'center' }}>
           <div style={{ padding: '3rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.7)', borderRadius: '8px', backdropFilter: 'blur(15px)' }}>
             <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ALERTA DE ACESSO</h2>
             <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
               O ingresso é <strong>GRATUITO</strong>, mas para acessar o evento, precisa estar cadastrado.<br/> 
               <span style={{ color: 'var(--oakley-red)', fontWeight: 'bold' }}>NÃO ENTRA SEM NOME NA LISTA.</span><br/>
               O seu ingresso garante acesso ao evento completo!
             </p>
           </div>
        </section>

      </main>
    </>
  );
};

export default App;
