import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft, User, MailCheck } from 'lucide-react';
import { EstudoVagLogo } from './EstudoVagLogo';
import { supabase, getAuthRedirectUrl } from '../lib/supabase';

export type AuthMode = 'login' | 'signup' | 'forgot' | 'update-password';

interface LoginScreenProps {
  onBackToLanding?: () => void;
  onPasswordUpdated?: () => void;
  initialMode?: AuthMode;
  isDarkMode?: boolean;
}

const describeAuthError = (error: { message?: string; code?: string; status?: number }) => {
  const code = error.code || '';
  const message = (error.message || '').toLowerCase();

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada (e o spam) e clique no link de confirmação.';
  }
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'E-mail ou senha inválidos.';
  }
  if (code === 'weak_password' || message.includes('password should')) {
    return 'Senha muito fraca. Use pelo menos 6 caracteres, combinando letras e números.';
  }
  if (code === 'email_address_invalid') {
    return 'Este endereço de e-mail não é válido. Use um e-mail real.';
  }
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || error.status === 429) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.';
  }
  if (code === 'email_address_not_authorized') {
    return 'O envio de e-mails para este endereço não está liberado no servidor. Configure um SMTP personalizado para enviar a qualquer e-mail.';
  }
  if (code === 'same_password') {
    return 'A nova senha deve ser diferente da anterior.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente em instantes.';
};

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBackToLanding,
  onPasswordUpdated,
  initialMode = 'login',
  isDarkMode = true,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setInfo(null);
    setSentToEmail(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const cleanEmail = email.trim().toLowerCase();

    if (mode !== 'update-password' && !cleanEmail) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    if (mode === 'signup' && !nome.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    if (mode !== 'forgot' && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if ((mode === 'signup' || mode === 'update-password') && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (signInError) setError(describeAuthError(signInError));
      } else if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
            data: { nome: nome.trim() },
          },
        });
        if (signUpError) {
          setError(describeAuthError(signUpError));
        } else if (data.user && data.user.identities && data.user.identities.length === 0) {
          setSentToEmail(cleanEmail);
        } else if (!data.session) {
          setSentToEmail(cleanEmail);
        }
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: getAuthRedirectUrl(),
        });
        if (resetError) {
          setError(describeAuthError(resetError));
        } else {
          setInfo('Se houver uma conta com esse e-mail, você receberá um link para redefinir a senha.');
        }
      } else if (mode === 'update-password') {
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError(describeAuthError(updateError));
        } else {
          onPasswordUpdated?.();
        }
      }
    } catch {
      setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!sentToEmail) return;
    setError(null);
    setIsLoading(true);
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: sentToEmail,
      options: { emailRedirectTo: getAuthRedirectUrl() },
    });
    setIsLoading(false);
    if (resendError) {
      setError(describeAuthError(resendError));
    } else {
      setInfo('E-mail de confirmação reenviado.');
    }
  };

  const titles: Record<AuthMode, { title: string; subtitle: string; cta: string }> = {
    login: {
      title: 'Entrar na sua conta',
      subtitle: 'Estudos personalizados com questões geradas do seu material.',
      cta: 'Entrar',
    },
    signup: {
      title: 'Criar sua conta',
      subtitle: 'Enviaremos um link de confirmação para o seu e-mail.',
      cta: 'Criar conta',
    },
    forgot: {
      title: 'Recuperar senha',
      subtitle: 'Informe seu e-mail para receber o link de redefinição.',
      cta: 'Enviar link',
    },
    'update-password': {
      title: 'Definir nova senha',
      subtitle: 'Escolha uma nova senha para acessar sua conta.',
      cta: 'Salvar nova senha',
    },
  };

  const inputClass = `w-full text-xs font-medium pl-10 pr-3.5 py-3 rounded-xl border focus:outline-hidden transition-all ${
    isDarkMode
      ? 'bg-[#0d121c] border-[#1f2b3e] text-white focus:border-[#0284c7] placeholder:text-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
  }`;
  const labelClass = `block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;

  const current = titles[mode];

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors ${
        isDarkMode ? 'bg-[#0a0e17] text-white' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0284c7]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#ea580c]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {onBackToLanding && mode !== 'update-password' && (
          <div className="mb-6 flex items-center">
            <button
              type="button"
              onClick={onBackToLanding}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-[#111726]/80 border-[#233144] text-slate-300 hover:text-white hover:border-[#0284c7]'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Voltar para apresentação</span>
            </button>
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <div className="mb-3 transition-transform hover:scale-105">
            <EstudoVagLogo size={76} isDarkMode={isDarkMode} />
          </div>
          <div className="flex items-center text-2xl font-black tracking-tight">
            <span className="text-[#0284c7]">estudo</span>
            <span className="text-[#ea580c]">vag</span>
          </div>
          <span className="text-[11px] tracking-wider text-slate-400 uppercase mt-1 font-bold">
            Aplicativo de Estudos Inteligentes
          </span>
        </div>

        <div
          className={`rounded-3xl p-7 sm:p-9 shadow-2xl border backdrop-blur-xl transition-all ${
            isDarkMode
              ? 'bg-[#111726]/90 border-[#1f2c42] shadow-black/50'
              : 'bg-white/95 border-slate-200 shadow-slate-200'
          }`}
        >
          {sentToEmail ? (
            <div className="flex flex-col items-center text-center gap-4" role="status">
              <div className="w-14 h-14 rounded-2xl bg-[#0284c7]/15 flex items-center justify-center">
                <MailCheck className="w-7 h-7 text-[#38bdf8]" />
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Confirme seu e-mail
              </h1>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enviamos um link de confirmação para{' '}
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sentToEmail}</span>.
                Clique no link para ativar sua conta e entrar automaticamente.
              </p>

              {error && (
                <div className="w-full p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  {error}
                </div>
              )}
              {info && (
                <div className="w-full p-3 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {info}
                </div>
              )}

              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isLoading}
                className="text-xs font-bold text-[#38bdf8] hover:underline cursor-pointer disabled:opacity-50"
              >
                Não recebeu? Reenviar e-mail
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full mt-2 py-3 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#0284c7] to-[#ea580c] hover:opacity-95 transition-all cursor-pointer"
              >
                Voltar para o login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {current.title}
                </h1>
                <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {current.subtitle}
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 text-center"
                >
                  {error}
                </div>
              )}
              {info && (
                <div
                  role="status"
                  className="mb-4 p-3 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center"
                >
                  {info}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="auth-nome" className={labelClass}>
                      Nome completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="auth-nome"
                        type="text"
                        autoComplete="name"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="João da Silva"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {mode !== 'update-password' && (
                  <div>
                    <label htmlFor="auth-email" className={labelClass}>
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="joao@email.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {mode !== 'forgot' && (
                  <div>
                    <label htmlFor="auth-password" className={labelClass}>
                      {mode === 'update-password' ? 'Nova senha' : 'Senha'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {(mode === 'signup' || mode === 'update-password') && (
                  <div>
                    <label htmlFor="auth-confirm-password" className={labelClass}>
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="auth-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-black text-sm tracking-wide text-white bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Aguarde...
                    </span>
                  ) : (
                    <>
                      <span>{current.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {mode !== 'update-password' && (
                <div className="mt-6 pt-5 border-t border-slate-700/30 flex items-center justify-between text-xs">
                  {mode === 'login' ? (
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="font-semibold text-slate-400 hover:text-[#38bdf8] transition-colors cursor-pointer"
                    >
                      Não tenho conta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-semibold text-slate-400 hover:text-[#38bdf8] transition-colors cursor-pointer"
                    >
                      Já tenho conta
                    </button>
                  )}

                  {mode !== 'forgot' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="font-semibold text-slate-400 hover:text-[#f97316] transition-colors cursor-pointer"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Ambiente Seguro • EstudoVag Inteligência Médica
        </p>
      </div>
    </div>
  );
};
