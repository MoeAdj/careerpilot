import { BriefcaseBusiness } from 'lucide-react';

type HeaderProps = {
  onLogout: () => void;
  isLoggedIn: boolean;
};

export default function Header({ onLogout, isLoggedIn }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-blue-500 p-2">
          <BriefcaseBusiness size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold">CareerPilot</h1>
          <p className="text-sm text-slate-400">Co-op tracking made less stressful</p>
        </div>
      </div>

      {isLoggedIn && (
        <button
          onClick={onLogout}
          className="rounded-xl bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
        >
          Log out
        </button>
      )}
    </header>
  );
}
