import { useEffect, useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { apiRequest } from '../api/client';

type Application = {
  id: number;
  company: string;
  position: string;
  status: string;
  location: string;
  notes: string;
  date_applied: string;
};

export default function Dashboard() {
  const user  = JSON.parse(
    localStorage.getItem('careerpilot_user') || '{}'
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<{ score: number; feedback: string } | null>(null);

  async function loadApplications() {
    const data = await apiRequest('/applications');
    setApplications(data);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      interviews: applications.filter((app) => app.status === 'Interview').length,
      offers: applications.filter((app) => app.status === 'Offer').length,
      rejected: applications.filter((app) => app.status === 'Rejected').length
    };
  }, [applications]);
  const chartData = [
  {
    name: 'Applied',
    value: applications.filter(app => app.status === 'Applied').length
  },
  {
    name: 'Interview',
    value: applications.filter(app => app.status === 'Interview').length
  },
  {
    name: 'Offer',
    value: applications.filter(app => app.status === 'Offer').length
  },
  {
    name: 'Rejected',
    value: applications.filter(app => app.status === 'Rejected').length
  }
];

  async function addApplication(event: React.FormEvent) {
    event.preventDefault();

    await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({ company, position, status, notes })
    });

    setCompany('');
    setPosition('');
    setStatus('Applied');
    setNotes('');
    loadApplications();
  }
async function deleteApplication(id: number) {
  await apiRequest(`/applications/${id}`, {
    method: 'DELETE'
  });

  loadApplications();
}

async function updateApplicationStatus(id: number, status: string) {
  await apiRequest(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });

  loadApplications();
}
  async function checkResume() {
    console.log('Resume Text:', resumeText);
    console.log('Job Description:', jobDescription);

    const data = await apiRequest('/resume/feedback', {
      method: 'POST',
      body: JSON.stringify({
  resumeText,
  jobDescription
})
    });

    setResumeResult(data);
  }

  return (
    <div className="flex min-h-screen">

  <aside className="w-72 border-r border-slate-800 bg-slate-950 p-6">
  <h1 className="mb-8 text-3xl font-extrabold text-white">
    CareerPilot
  </h1>

  <nav className="space-y-3">
    <div className="cursor-pointer rounded-xl bg-blue-500/20 px-4 py-3 text-blue-300 transition-all hover:bg-blue-500/30">
      🏠 Dashboard
    </div>

    <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
      📋 Applications
    </div>

    <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
      📄 Resume Review
    </div>

    <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
      📊 Analytics
    </div>

    <div className="cursor-pointer rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
      ⚙️ Settings
    </div>
  </nav>

  <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-sm text-slate-400">
      Signed in as
    </p>

    <p className="mt-2 font-bold text-white">
      {user.name || 'Student'}
    </p>

    <p className="text-sm text-slate-500">
      get your first job today!!!
    </p>
  </div>
</aside>

  <main className="flex-1 px-8 py-8">
      <section className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-600/20 via-slate-900 to-slate-900 p-8">
  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
    CareerPilot
  </p>

  <h1 className="mt-3 text-5xl font-extrabold">
    Welcome back, {user.name || 'Student'} 👋
  </h1>

  <p className="mt-4 max-w-2xl text-lg text-slate-300">
    Track applications, interviews, offers, and resume feedback in one place.
  </p>
  <div className="mt-6">
  <div className="mb-2 flex justify-between text-sm text-slate-400">
    <span>Application Goal</span>
    <span>{applications.length}/50</span>
  </div>

  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
    <div
      className="h-full rounded-full bg-blue-500 transition-all"
      style={{
        width: `${Math.min((applications.length / 50) * 100, 100)}%`
      }}
    />
  </div>
</div>
</section>
      <section className="mb-10 grid gap-5 md:grid-cols-4">
        <StatCard label="Applications" value={stats.total} />
        <StatCard label="Interviews" value={stats.interviews} />
        <StatCard label="Offers" value={stats.offers} />
        <StatCard label="Rejected" value={stats.rejected} />
      </section>
      <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900 p-6">
  <h2 className="mb-4 text-2xl font-bold">
    Application Analytics
  </h2>

  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          outerRadius={100}
          label
        >
          <Cell fill="#3b82f6" />
          <Cell fill="#facc15" />
          <Cell fill="#22c55e" />
          <Cell fill="#ef4444" />
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>

      <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <form onSubmit={addApplication} className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-4 text-2xl font-bold">Add application</h2>

            <div className="space-y-3">
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="w-full rounded-xl p-3" />
              <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" className="w-full rounded-xl p-3" />

              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl p-3">
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="min-h-24 w-full rounded-xl p-3" />

              <button className="w-full rounded-xl bg-blue-500 py-3 font-semibold hover:bg-blue-400">Save application</button>
            </div>
          </form>

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-3 text-2xl font-bold">AI Resume Analyzer</h2>
            <p className="mb-3 text-sm text-slate-400">Upload your resume and compare it against a job description to identify missing skills and improve your chances of landing interviews.</p>
            <input
  type="file"
  accept=".pdf"
  onChange={async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('careerpilot_token');

    const response = await fetch(
  `${import.meta.env.VITE_API_URL}/resume/upload`,
  {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || ''}`
        },
        body: formData
      }
    );

    const data = await response.json();

    setResumeText(data.resumeText);

console.log('AFTER SET:', data.resumeText);
  }}
  className="w-full rounded-xl border border-slate-700 p-3"
/>

<p className="mt-2 text-sm text-green-400">
  {resumeText
    ? 'PDF uploaded and ready to analyze ✅'
    : 'Upload a PDF resume'}
</p>

<textarea
  value={jobDescription}
  onChange={(e) => setJobDescription(e.target.value)}
  placeholder="Paste job description here..."
  className="mt-3 min-h-32 w-full rounded-xl p-3"
/>
            <button onClick={checkResume} className="mt-3 w-full rounded-xl bg-emerald-500 py-3 font-semibold hover:bg-emerald-400">Check resume</button>
            {resumeResult && (
              <div className="mt-4 rounded-2xl bg-slate-800 p-4">
                <p className="font-bold">Score: {resumeResult.score}/100</p>
                <p className="mt-2 text-sm text-slate-300">{resumeResult.feedback}</p>
              </div>
            )}
          </div>
        </div>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
  <div>
    <h2 className="text-3xl font-bold">Application Pipeline</h2>
    <p className="text-slate-400">
      Track every company you're applying to.
    </p>
  </div>

  <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
    {applications.length} Active
  </div>
</div>

          <div className="space-y-3">
            {applications.length === 0 && <p className="text-slate-400">No applications yet. Add your first one.</p>}

            {applications.map((app) => (
              <article
  key={app.id}
  className="rounded-3xl border border-slate-700 bg-slate-800/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
  <p className="text-xs uppercase tracking-widest text-slate-500">
    Company
  </p>

  <p className="mt-1 text-lg font-bold text-white">
    {app.company}
  </p>

  <p className="text-slate-300">
  {app.position}
</p>

<p className="mt-1 text-sm text-slate-500">
  Applied: {new Date(app.date_applied).toLocaleDateString()}
</p>
</div>
                  <select
  value={app.status}
  onChange={(e) =>
    updateApplicationStatus(app.id, e.target.value)
  }
  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
  app.status === 'Offer'
    ? 'border-green-500 bg-green-500/20 text-green-300'
    : app.status === 'Interview'
    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300'
    : app.status === 'Rejected'
    ? 'border-red-500 bg-red-500/20 text-red-300'
    : 'border-blue-500 bg-blue-500/20 text-blue-300'
}`}
>
  <option>Applied</option>
  <option>Interview</option>
  <option>Offer</option>
  <option>Rejected</option>
</select>
                </div>
                {app.notes && (
  <div className="mt-4 border-t border-slate-700 pt-4">
    <p className="text-sm text-slate-400">{app.notes}</p>
  </div>
)}
<div className="mt-4 flex justify-end">
  <button
  onClick={() => {
  if (confirm('Delete this application?')) {
    deleteApplication(app.id);
  }
}}
  className="rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30"
>
  Delete
</button>
</div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="group rounded-3xl border border-slate-700 bg-slate-900/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl">
      <p className="text-sm uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-4 text-5xl font-extrabold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Updated in real time
      </p>
    </div>
  );
}
