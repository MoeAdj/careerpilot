import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      {/* Hero Section */}
      <section className="text-center">
        <p className="mb-4 text-blue-400 font-semibold uppercase tracking-widest">
          CareerPilot
        </p>

        <h1 className="text-6xl font-extrabold leading-tight">
          Land Your Next Internship Faster
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-400">
          Track applications, analyze resumes, prepare for interviews, and
          organize your entire job search in one place.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/login"
            className="rounded-2xl bg-blue-500 px-8 py-4 font-bold text-white transition hover:bg-blue-400"
          >
            Get Started
          </Link>

          <a
            href="#features"
            className="rounded-2xl border border-slate-700 px-8 py-4 hover:bg-slate-900"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mt-32 grid gap-6 md:grid-cols-3"
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-bold">
            📋 Track Applications
          </h3>

          <p className="mt-3 text-slate-400">
            Keep every company, role, note, deadline, and status organized in
            one place.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-bold">
            📄 Resume Analysis
          </h3>

          <p className="mt-3 text-slate-400">
            Compare your resume against job descriptions and receive instant
            feedback.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-bold">
            🚀 Interview Ready
          </h3>

          <p className="mt-3 text-slate-400">
            Stay on top of interviews, offers, and follow-ups without losing
            track.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-32">
        <h2 className="text-center text-4xl font-bold">
          Why Students Choose CareerPilot
        </h2>

        <p className="mt-4 text-center text-slate-400">
          Built specifically for students looking for internships, co-ops, and
          full-time opportunities.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
            <div className="text-5xl font-extrabold text-blue-400">
              50+
            </div>

            <p className="mt-2 text-slate-400">
              Applications Tracked
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
            <div className="text-5xl font-extrabold text-green-400">
              AI
            </div>

            <p className="mt-2 text-slate-400">
              Resume Analysis & Feedback
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
            <div className="text-5xl font-extrabold text-yellow-400">
              1 Place
            </div>

            <p className="mt-2 text-slate-400">
              Manage Your Entire Job Search
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-32">
        <h2 className="text-center text-4xl font-bold">
          Student Feedback
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-300">
              "CareerPilot helped me keep track of every internship application
              during recruiting season."
            </p>

            <p className="mt-4 font-bold text-blue-400">
              Computer Science Student
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-300">
              "The resume feedback feature helped me identify skills missing
              from job descriptions."
            </p>

            <p className="mt-4 font-bold text-blue-400">
              Software Engineering Student
            </p>
          </div>
        </div>
      </section>
<section className="mt-32">
  <h2 className="mb-10 text-center text-4xl font-bold">
    See CareerPilot In Action
  </h2>

  <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
    <img
      src="/dashboard-preview.png"
      alt="CareerPilot Dashboard"
      className="w-full rounded-2xl"
    />
  </div>
</section>
      {/* CTA */}
      <section className="mt-32 text-center">
        <h2 className="text-5xl font-bold">
          Ready to Get Hired?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-400">
          Join CareerPilot and take control of your internship and job search
          today.
        </p>

        <Link
          to="/login"
          className="mt-10 inline-block rounded-2xl bg-blue-500 px-10 py-4 text-lg font-bold text-white transition hover:bg-blue-400"
        >
          Start For Free
        </Link>
      </section>
      <footer className="mt-32 border-t border-slate-800 pt-8 text-center text-slate-500">
  © 2026 CareerPilot • Built by Mohamed Aidja
</footer>
    </main>
  );
}