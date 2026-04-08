import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const sb = getSupabase();
    if (!sb) {
      setError('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
      return;
    }
    setLoading(true);
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1 className="admin-card__title">Admin Oakley</h1>
        <p className="admin-card__hint">Acesso restrito ao painel de inscrições.</p>

        {!isSupabaseConfigured() && (
          <p className="admin-card__warn">
            Defina as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no
            arquivo <code>.env</code> (veja <code>database/README.md</code>).
          </p>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <label className="admin-form__label">
            E-mail
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-form__input"
            />
          </label>
          <label className="admin-form__label">
            Senha
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-form__input"
            />
          </label>
          {error && <p className="admin-card__error">{error}</p>}
          <button type="submit" className="admin-form__submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <Link to="/" className="admin-card__back">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
