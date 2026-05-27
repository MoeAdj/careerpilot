import { useState } from 'react';
import { apiRequest } from '../api/client';

type LoginPageProps = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const path = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const body = mode === 'signup' ? { name, email, password } : { email, password };
      const data = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(body)
      });
//storing the username just so it can desplay the username message
      localStorage.setItem('careerpilot_token', data.token);
localStorage.setItem('careerpilot_user', JSON.stringify(data.user));
onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <main className="mx-auto grid min-h-[80vh] max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
      <section className="flex flex-col justify-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">Fall 2026 Co-op Search</p>
        <h2 className="mb-5 text-5xl font-extrabold leading-tight">
          Track every application like you are serious about getting hired.
        </h2>
        <p className="max-w-xl text-lg text-slate-300">
          I built this because applying for co-ops gets messy fast. CareerPilot keeps companies,
          roles, notes, and statuses in one place so the job search feels less random.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h3 className="mb-2 text-2xl font-bold">{mode === 'signup' ? 'Create account' : 'Welcome back'}</h3>
        <p className="mb-6 text-slate-400">Use any test email while running locally.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-xl p-3"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-xl p-3"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl p-3"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button className="w-full rounded-xl bg-blue-500 px-4 py-3 font-semibold hover:bg-blue-400">
            {mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          className="mt-5 text-sm text-blue-300 hover:text-blue-200"
        >
          {mode === 'signup' ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </section>
    </main>
  );
}
