import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ErrorProps {
  code: string; icon: string; title: string; description: React.ReactNode;
  actions: React.ReactNode;
}

function ErrorLayout({ code, icon, title, description, actions }: ErrorProps) {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '4rem', marginBottom: 8 }}>{icon}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '5rem', fontWeight: 700, color: 'var(--teal)', opacity: 0.15, lineHeight: 1, marginBottom: -8, letterSpacing: -4 }}>
          {code}
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 14 }}>{title}</h1>
        <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: 32 }}>{description}</p>
        <div className="flex justify-center gap-4 flex-wrap">{actions}</div>
      </div>
    </div>
  );
}

export function Page401() {
  return (
    <ErrorLayout code="401" icon="🔐" title="Autentificare necesară"
      description="Trebuie să fii autentificat pentru a accesa această pagină."
      actions={<Link to="/login" className="btn btn-primary btn-lg">Autentifică-te →</Link>}
    />
  );
}

export function Page403() {
  const navigate = useNavigate();
  return (
    <ErrorLayout code="403" icon="🚫" title="Acces interzis"
      description="Nu ai permisiunea de a accesa această resursă. Contactează un administrator dacă crezi că este o eroare."
      actions={<>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>← Înapoi</button>
        <Link to="/dashboard" className="btn btn-primary btn-lg">Acasă</Link>
      </>}
    />
  );
}

export function Page404() {
  const { isAuthenticated } = useAuth();
  return (
    <ErrorLayout code="404" icon="⚗" title="Pagina nu a fost găsită"
      description={
        <>
          Această pagină s-a volatilizat precum un gaz nobil.<br />
          Pagina pe care o cauți nu există sau a fost mutată.
        </>
      }
      actions={
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
          ← Înapoi acasă
        </Link>
      }
    />
  );
}

export function Page500() {
  const navigate = useNavigate();
  return (
    <ErrorLayout code="500" icon="⚠" title="Eroare internă de server"
      description="A apărut o eroare neașteptată. Încearcă din nou mai târziu sau reîncarcă pagina."
      actions={<>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate(0)}>↻ Reîncărcare</button>
        <Link to="/dashboard" className="btn btn-primary btn-lg">Acasă</Link>
      </>}
    />
  );
}
