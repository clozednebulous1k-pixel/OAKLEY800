import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export const GuestListForm: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!formRef.current) return;
      const rect = formRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(formRef.current, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.5
      });
    };

    const handleMouseLeave = () => {
      if (!formRef.current) return;
      gsap.to(formRef.current, {
        rotateX: 0,
        rotateY: 0,
        ease: "power3.out",
        duration: 0.8
      });
    };

    const currentForm = formRef.current;
    if (currentForm) {
      currentForm.addEventListener('mousemove', handleMouseMove);
      currentForm.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentForm) {
        currentForm.removeEventListener('mousemove', handleMouseMove);
        currentForm.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nome = (form.elements.namedItem('nome') as HTMLInputElement).value.trim();
    const curso = (form.elements.namedItem('curso') as HTMLInputElement).value.trim();
    const semestre = (form.elements.namedItem('semestre') as HTMLInputElement).value.trim();

    if (!isSupabaseConfigured()) {
      alert(
        'Cadastro indisponível: configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja database/README.md).'
      );
      return;
    }

    const sb = getSupabase();
    if (!sb) return;

    setSubmitting(true);
    const { error } = await sb.from('inscricoes').insert({ nome, curso, semestre });
    setSubmitting(false);

    if (error) {
      alert(`Não foi possível salvar: ${error.message}`);
      return;
    }

    if (formRef.current) {
      gsap.to(formRef.current, {
        scale: 1.02,
        y: -10,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    }
    alert('Cadastro realizado com sucesso! Ingresso garantido.');
    form.reset();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      ref={formRef} 
      className="premium-form"
    >
      <div style={{ marginBottom: 'clamp(0.85rem, 3vw, 1.35rem)' }}>
        <h3 className="sub-headline" style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', color: 'var(--oakley-red)' }}>O Cadastro</h3>
        <h2 className="premium-form__title" style={{ marginBottom: '0.5rem' }}>O fantástico mundo da Oakley</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Vai ficar de fora dessa?</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" id="nome" name="nome" className="form-input" required placeholder=" " />
          <label htmlFor="nome" className="form-label">Nome</label>
        </div>
        
        <div className="form-group">
          <input type="text" id="curso" name="curso" className="form-input" required placeholder=" " />
          <label htmlFor="curso" className="form-label">Curso</label>
        </div>
        
        <div className="form-group">
          <input type="text" id="semestre" name="semestre" className="form-input" required placeholder=" " />
          <label htmlFor="semestre" className="form-label">Semestre</label>
        </div>
        
        <button type="submit" className="premium-button" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Garantir Acesso VIP'}
        </button>
      </form>
    </motion.div>
  );
};
