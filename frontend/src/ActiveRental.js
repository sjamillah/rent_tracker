import React, { useEffect, useState } from 'react';
 
export default function ActiveRental({ rental, vehicle, onReturn }) {
  const [elapsed, setElapsed] = useState(0);
 
  useEffect(() => {
    if (!rental?.start_time) {
      return undefined;
    }

    const interval = setInterval(() => {
      const startTime = new Date(rental.start_time);
      const now       = new Date();
      setElapsed(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [rental?.start_time]);

  if (!rental || !vehicle) {
    return (
      <div className="px-4 py-3 text-sm border rounded-xl border-amber-200 bg-amber-50 text-amber-800">
        Rental details are not available yet. Please go back and start a rental again.
      </div>
    );
  }
 
  const hours   = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  const pad = n => String(n).padStart(2, '0');
 
  const currentHours = Math.max(1, Math.ceil(elapsed / 3600));
  const runningCost  = (currentHours * vehicle.rate_per_hour).toFixed(2);
  const isRecentlyStarted = elapsed < 300;
 
  return (
    <section className="max-w-3xl p-6 mx-auto border shadow-lg rounded-2xl border-slate-200 bg-white/90 backdrop-blur-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rental In Progress</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{vehicle.name}</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isRecentlyStarted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isRecentlyStarted ? 'Started recently' : 'Running'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="p-4 border rounded-xl border-slate-200 bg-slate-50">
          <p className="text-xs font-medium tracking-wide uppercase text-slate-500">Elapsed Time</p>
          <p className="mt-2 text-3xl font-black tabular-nums text-slate-900 md:text-4xl">
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </p>
        </article>

        <article className="p-4 border rounded-xl border-slate-200 bg-slate-50">
          <p className="text-xs font-medium tracking-wide uppercase text-slate-500">Estimated Charge</p>
          <p className="mt-2 text-3xl font-black text-emerald-700 md:text-4xl">${runningCost}</p>
          <p className="mt-1 text-xs text-slate-500">Based on {currentHours} billable hour{currentHours > 1 ? 's' : ''}</p>
        </article>

        <article className="p-4 border rounded-xl border-slate-200 bg-slate-50">
          <p className="text-xs font-medium tracking-wide uppercase text-slate-500">Rate</p>
          <p className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">${vehicle.rate_per_hour}</p>
          <p className="mt-1 text-xs text-slate-500">Per hour, minimum billing 1 hour</p>
        </article>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mt-6 text-sm rounded-xl bg-slate-900 text-slate-200">
        <p>
          Vehicle ID: <span className="font-semibold">#{vehicle.id}</span>
        </p>
        <button
          onClick={() => onReturn(rental.id)}
          className="px-5 py-2 font-semibold text-white transition rounded-lg bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Return Vehicle
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Billing note: total is calculated by rounding up elapsed time to the next full hour.
      </p>
    </section>
  );
}
