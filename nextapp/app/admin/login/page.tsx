'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginCustom } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginForm = async (formData: FormData) => {
    setError('');
    setLoading(true);

    try {
      const result = await loginCustom(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.replace('/admin');
      }
    } catch (err: any) {
      console.error('Erro no cliente:', err);
      setError('Ocorreu um problema ao conectar com o servidor.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background-color: #1A0D09;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(126, 28, 28, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(55, 29, 16, 0.3) 0%, transparent 60%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: var(--font-body);
        }

        .login-checking {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .login-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(244, 239, 230, 0.1);
          border-top-color: #7E1C1C;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-card {
          background-color: #F4EFE6;
          width: 100%;
          max-width: 440px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(126, 28, 28, 0.3);
          animation: fadeUp 0.5s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-header {
          background-color: #7E1C1C;
          padding: 40px 40px 35px;
          text-align: center;
          border-bottom: 4px solid #5A1414;
        }

        .login-logo {
          display: block;
          margin: 0 auto 20px;
          filter: brightness(0) invert(1);
          opacity: 0.95;
        }

        .login-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(244, 239, 230, 0.12);
          border: 1px solid rgba(244, 239, 230, 0.25);
          color: #F4EFE6;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .login-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          background-color: #90EE90;
          border-radius: 50%;
          box-shadow: 0 0 6px #90EE90;
        }

        .login-title {
          font-family: var(--font-headings);
          color: #F4EFE6;
          font-size: 1.4rem;
          margin: 16px 0 6px;
          letter-spacing: 1px;
        }

        .login-subtitle {
          color: rgba(244, 239, 230, 0.65);
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .login-body {
          padding: 36px 40px 40px;
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #371D10;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .login-input-wrapper {
          position: relative;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #7E1C1C;
          opacity: 0.6;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1.5px solid #DBCDBA;
          border-radius: 4px;
          font-size: 0.95rem;
          font-family: Inter, system-ui, Arial, sans-serif;
          color: #371D10;
          background-color: #FEFCF8;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-input:focus {
          border-color: #7E1C1C;
          box-shadow: 0 0 0 3px rgba(126, 28, 28, 0.1);
          background-color: #fff;
        }

        .login-input::placeholder {
          color: #B0A090;
          font-weight: 400;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #FFF0F0;
          border: 1px solid #FFBCBC;
          border-left: 4px solid #7E1C1C;
          color: #7E1C1C;
          padding: 12px 14px;
          border-radius: 4px;
          font-size: 0.82rem;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .login-btn {
          width: 100%;
          background-color: #7E1C1C;
          color: #F4EFE6;
          border: none;
          padding: 15px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-btn:hover:not(:disabled) {
          background-color: #5A1414;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(244, 239, 230, 0.3);
          border-top-color: #F4EFE6;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .login-footer-text {
          text-align: center;
          margin-top: 24px;
          font-size: 0.72rem;
          color: #B0A090;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .login-footer-text::before,
        .login-footer-text::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: #DBCDBA;
        }

        .login-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 0.78rem;
          color: #7E1C1C;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: opacity 0.2s;
        }
        .login-back:hover { opacity: 0.7; }

        @media (max-width: 480px) {
          .login-header { padding: 30px 24px 26px; }
          .login-body { padding: 28px 24px 32px; }
          .login-title { font-size: 1.1rem; }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <Image
              src="/logo_marca.png"
              alt="Casa de Tradição"
              width={110}
              height={55}
              className="login-logo"
              style={{ height: '55px', width: 'auto' }}
            />
            <h1 className="login-title">Portal Administrativo</h1>
            <p className="login-subtitle">Acesso exclusivo para administradores</p>
            <div style={{ marginTop: 14 }}>
              <span className="login-badge">Área Restrita</span>
            </div>
          </div>

          {/* Body */}
          <div className="login-body">
            <form action={handleLoginForm} noValidate>
              {error && (
                <div className="login-error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="login-field">
                <label className="login-label" htmlFor="email">E-mail</label>
                <div className="login-input-wrapper">
                  <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="login-input"
                    placeholder="admin@casadetradicao.com"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">Senha</label>
                <div className="login-input-wrapper">
                  <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="login-input"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="login-btn-spinner" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Entrar no Painel
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="login-footer-text">Acesso seguro</p>

            <a href="/" className="login-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
