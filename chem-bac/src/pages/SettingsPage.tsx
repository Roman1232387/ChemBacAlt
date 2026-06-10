import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../services/axiosInstance';

export function SettingsPage() {
  const { user, logout } = useAuth();
  
  useEffect(() => {
    // Curățare în caz că a rămas light-mode activ
    document.body.classList.remove('light-mode');
    localStorage.removeItem('chembac_theme');
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm("Ești sigur că vrei să ștergi contul? Această acțiune este ireversibilă.");
    if (confirmed) {
      try {
        await axiosInstance.delete(`/user?id=${user.id}`);
        logout();
      } catch (err: any) {
        const msg = err.response?.data?.message || "Eroare la ștergerea contului.";
        window.alert(msg);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h2>Setări Cont</h2>
          <p className="page-header__sub">Gestionează profilul și preferințele tale pe ChemBAC.</p>
        </div>
      </div>

      <div className="grid-form-1" style={{ maxWidth: 700 }}>
        {/* Secțiune Profil */}
        <div className="card mb-6" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="sidebar__avatar" style={{ width: 64, height: 64, fontSize: '1.4rem', border: '2px solid var(--teal)' }}>
              {user.avatarInitials}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, margin: 0, fontSize: '1.3rem' }}>{user.name}</h3>
              <p className="text-sm text-muted">{user.role === 'admin' ? 'Administrator Platformă' : 'Elev la ChemBAC'}</p>
            </div>
          </div>

          <div className="flex-col gap-3">
            <div className="settings-row">
              <div className="settings-row__label">
                <span>📧</span> Adresă Email
              </div>
              <div className="settings-row__value">{user.email}</div>
            </div>
            <div className="settings-row">
              <div className="settings-row__label">
                <span>🆔</span> ID Utilizator
              </div>
              <div className="settings-row__value">#{user.id.toString().padStart(4, '0')}</div>
            </div>
            <div className="settings-row">
              <div className="settings-row__label">
                <span>📅</span> Membru din
              </div>
              <div className="settings-row__value">Iunie 2026</div>
            </div>
          </div>
        </div>

        {/* Secțiune Securitate */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontSize: '1.4rem' }}>🛡️</span>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, margin: 0 }}>Securitate și Acces</h3>
          </div>
          
          <div className="flex justify-between items-center p-5" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Parolă</div>
              <div className="text-sm text-muted">Ultima modificare: Acum 2 zile</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => window.alert("Funcționalitatea de schimbare a parolei va fi disponibilă în curând.")}>
              Schimbă parola
            </button>
          </div>
        </div>


        {/* Zonă Periculoasă */}
        <div className="card">
          <h3 className="mb-4 text-red" style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>Zonă Periculoasă</h3>
          <div className="flex-col gap-3">
            <div className="flex justify-between items-center p-4 border border-red" style={{ borderRadius: 'var(--r-md)', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--red)' }}>Resetează progresul</div>
                <div className="text-sm text-muted">Șterge istoricul lecțiilor citite și temelor parcurse.</div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={() => {
                  if (window.confirm('Ești sigur că vrei să resetezi progresul?')) {
                    localStorage.removeItem('chembac_progress');
                    window.alert('Progresul a fost resetat.');
                    window.location.reload();
                  }
                }}
              >
                Resetează
              </button>
            </div>

            <div className="flex justify-between items-center p-4 border border-red" style={{ borderRadius: 'var(--r-md)', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--red)' }}>Șterge Contul</div>
                <div className="text-sm text-muted">Toate datele tale vor fi șterse definitiv.</div>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="btn btn-danger btn-sm"
              >
                Șterge cont
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
