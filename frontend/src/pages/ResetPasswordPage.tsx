import { useState } from 'react';
import { apiRequest } from '../api/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const token =
    new URLSearchParams(window.location.search).get('token');

  async function handleReset() {
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setIsError(true);
      setMessage('Password must be at least 8 characters');
      return;
    }

    try {
      const data = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password
        })
      });

      setIsError(false);
      setMessage(data.message);
    } catch (error) {
      setIsError(true);
      setMessage('Password reset failed');
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <h1 className="mb-4 text-3xl font-bold">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 w-full rounded-xl p-3"
        />

        <button
          onClick={handleReset}
          className="w-full rounded-xl bg-blue-500 py-3 font-semibold hover:bg-blue-400"
        >
          Reset Password
        </button>

        {message && (
          <p
            className={`mt-4 ${
              isError ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}