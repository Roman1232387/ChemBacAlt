import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = 'Numele este obligatoriu.';
  if (!f.email.trim()) e.email = 'Email-ul este obligatoriu.';
  else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Format email invalid.';
  if (!f.password) e.password = 'Parola este obligatorie.';
  else if (f.password.length < 6) e.password = 'Parola trebuie să aibă minim 6 caractere.';
  if (f.password !== f.confirmPassword) e.confirmPassword = 'Parolele nu se potrivesc.';
  return e;
}

export function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: '', email: '', password: '', confirmPassword: ''
  });
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
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate('/dashboard', { replace: true });
    } catch { /* error displayed via context */ }
  };

  const fe = (f: keyof FormErrors) => (touched[f] ? errors[f] : undefined);

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '1px solid rgba(0,212,170,0.06)',
          top: -200,
          right: -100
        }} />
        <div style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(245,158,11,0.05)',
          bottom: -100,
          left: -50
        }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
        <div className="card" style={{
          border: '1px solid var(--border-active)',
          boxShadow: '0 0 60px rgba(0,212,170,0.07)',
          padding: '48px 40px'
        }}>
          {/* Header */}
          <div className="text-center mb-6">
            <div style={{ fontSize: '3rem', color: 'var(--teal)', marginBottom: 8 }}>⚗</div>
            <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>ChimieBAC</h1>
            <p className="text-muted" style={{ fontSize: '0.92rem' }}>
              Creează-ți cont pentru a accesa platforma
            </p>
          </div>

          {/* Server error */}
          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nume complet</label>
              <input
                id="name" name="name" type="text" autoComplete="name"
                className={`form-input${fe('name') ? ' is-error' : ''}`}
                value={form.name} onChange={handleChange} onBlur={handleBlur}
                placeholder="ex: Ion Popescu"
              />
              {fe('name') && <span className="form-error">⚠ {fe('name')}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                className={`form-input${fe('email') ? ' is-error' : ''}`}
                value={form.email} onChange={handleChange} onBlur={handleBlur}
                placeholder="exemplu@scoala.ro"
              />
              {fe('email') && <span className="form-error">⚠ {fe('email')}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Parola</label>
              <input
                id="password" name="password" type="password" autoComplete="new-password"
                className={`form-input${fe('password') ? ' is-error' : ''}`}
                value={form.password} onChange={handleChange} onBlur={handleBlur}
                placeholder="••••••••"
              />
              {fe('password') && <span className="form-error">⚠ {fe('password')}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirmă parola</label>
              <input
                id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
                className={`form-input${fe('confirmPassword') ? ' is-error' : ''}`}
                value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                placeholder="••••••••"
              />
              {fe('confirmPassword') && <span className="form-error">⚠ {fe('confirmPassword')}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={isLoading} style={{ marginTop: 4 }}>
              {isLoading
                ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Se creează contul...</>
                : 'Creează cont →'}
            </button>
          </form>

          {/* Login link */}
          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Ai deja cont?{' '}
              <Link to="/login" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>
                Autentifică-te →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}