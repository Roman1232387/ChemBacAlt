import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.email.trim()) e.email = 'Email-ul este obligatoriu.';
  else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Format email invalid.';
  if (!f.password) e.password = 'Parola este obligatorie.';
  else if (f.password.length < 6) e.password = 'Parola trebuie sa aiba minim 6 caractere.';
  return e;
}

export function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) clearError();
  }, [error, clearError]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch {}
  };

  const fillDemo = (role: 'admin' | 'user') => {
    clearError();
    if (role === 'admin') setForm({ email: 'admin@chimie-bac.ro', password: 'Admin123!' });
    else setForm({ email: 'elev@chimie-bac.ro', password: 'Elev123!' });
  };

  const fe = (f: keyof FormErrors) => (touched[f] ? errors[f] : undefined);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(0,212,170,0.06)',
            top: -200,
            right: -100,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(245,158,11,0.05)',
            bottom: -100,
            left: -50,
          }}
        />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
        <div
          className="card"
          style={{
            border: '1px solid var(--border-active)',
            boxShadow: '0 0 60px rgba(0,212,170,0.07)',
            padding: '48px 40px',
          }}
        >
          <div className="text-center mb-6">
            <div style={{ fontSize: '3rem', color: 'var(--teal)', marginBottom: 8 }}>⚗</div>
            <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>ChimieBAC</h1>
            <p className="text-muted" style={{ fontSize: '0.92rem' }}>
              Autentifica-te pentru a accesa platforma
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`form-input${fe('email') ? ' is-error' : ''}`}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="exemplu@scoala.ro"
              />
              {fe('email') && <span className="form-error">⚠ {fe('email')}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Parola
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`form-input${fe('password') ? ' is-error' : ''}`}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
              />
              {fe('password') && <span className="form-error">⚠ {fe('password')}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={isLoading}
              style={{ marginTop: 4 }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Se
                  conecteaza...
                </>
              ) : (
                'Autentificare ->'
              )}
            </button>
          </form>

          <p
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Conturi demo:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { role: 'admin' as const, label: 'Admin', email: 'admin@chimie-bac.ro' },
              { role: 'user' as const, label: 'Elev Demo', email: 'elev@chimie-bac.ro' },
            ].map(({ role, label, email }) => (
              <button
                key={role}
                onClick={() => fillDemo(role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '10px 14px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'left',
                  transition: 'all var(--t-fast)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                <span className={`badge badge-${role === 'admin' ? 'amber' : 'teal'}`}>{label}</span>
                {email}
              </button>
            ))}
          </div>

          <p
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Contul tau:
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Daca ai un cont inregistrat, foloseste formularul de mai sus pentru autentificare.
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Nu ai cont?{' '}
              <Link to="/register" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>
                  {'Creeaza-ti unul ->'}
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
