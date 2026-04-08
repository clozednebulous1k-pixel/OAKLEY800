import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

type Inscricao = {
  id: string;
  nome: string;
  curso: string;
  semestre: string;
  created_at: string;
};

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setError('Supabase não configurado.');
      setLoading(false);
      return;
    }
    const { data: session } = await sb.auth.getSession();
    if (!session.session) {
      navigate('/admin/login', { replace: true });
      return;
    }
    const { data, error: qErr } = await sb
      .from('inscricoes')
      .select('id, nome, curso, semestre, created_at')
      .order('created_at', { ascending: false });
    if (qErr) {
      setError(qErr.message);
      setRows([]);
    } else {
      setRows((data as Inscricao[]) ?? []);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError('Configure o .env com as chaves do Supabase.');
      return;
    }
    load();
  }, [load]);

  const handleLogout = async () => {
    const sb = getSupabase();
    await sb?.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('pt-BR');
    } catch {
      return iso;
    }
  };

  return (
    <div className="admin-page admin-page--wide">
      <div className="admin-panel">
        <header className="admin-panel__header">
          <h1 className="admin-panel__title">Inscrições</h1>
          <div className="admin-panel__actions">
            <button type="button" className="admin-form__submit admin-form__submit--ghost" onClick={() => load()}>
              Atualizar
            </button>
            <button type="button" className="admin-form__submit" onClick={handleLogout}>
              Sair
            </button>
            <Link to="/" className="admin-card__back admin-card__back--inline">
              Site
            </Link>
          </div>
        </header>

        {loading && <p className="admin-panel__muted">Carregando…</p>}
        {error && <p className="admin-card__error">{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <p className="admin-panel__muted">Nenhuma inscrição ainda.</p>
        )}

        {!loading && rows.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Curso</th>
                  <th>Semestre</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.created_at)}</td>
                    <td>{r.nome}</td>
                    <td>{r.curso}</td>
                    <td>{r.semestre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
