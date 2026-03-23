import React from 'react';
 
export default function ReturnSummary({ summary, onDone }) {
  const { vehicle, summary: charges } = summary;
 
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Return Complete</p>
      <h2 className="mt-2 text-3xl font-black text-slate-900">Rental Summary</h2>
      <p className="mt-1 text-sm text-slate-600">Thanks for riding with RentTrack. Here is your final breakdown.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Vehicle</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{vehicle.name}</p>
          <p className="mt-1 text-sm text-slate-600">ID #{vehicle.id}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Duration</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{charges.duration_hours} hour(s)</p>
          <p className="mt-1 text-sm text-slate-600">Billed in full-hour increments</p>
        </article>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-5 text-slate-100">
        <div className="flex items-center justify-between text-sm">
          <span>Rate</span>
          <span className="font-semibold">${charges.rate_per_hour}/hour</span>
        </div>
        <div className="mt-3 h-px bg-slate-700" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm">Total Charge</span>
          <span className="text-3xl font-black text-emerald-300">${charges.total_charge}</span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        Back to Vehicles
      </button>
    </section>
  );
}
