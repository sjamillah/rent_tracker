import React, { useState } from 'react';
import VehicleList from './VehicleList';
import ActiveRental from './ActiveRental';
import ReturnSummary from './ReturnSummary';
 
export default function App() {
  const [screen,  setScreen]  = useState('list');
  const [rental,  setRental]  = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [summary, setSummary] = useState(null);

  const stepClass = (name) => (
    `rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
      screen === name
        ? 'bg-slate-900 text-white'
        : 'border border-slate-300 bg-white text-slate-600'
    }`
  );
 
  function handleRent(selectedVehicle) {
    fetch('http://localhost:4000/api/rentals/start', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ vehicle_id: selectedVehicle.id })
    })
    .then(res => res.json())
    .then(data => {
      setRental(data);
      setVehicle(selectedVehicle);
      setScreen('active');
    });
  }
 
  function handleReturn(rentalId) {
    fetch(`http://localhost:4000/api/rentals/return/${rentalId}`, { method: 'POST' })
    .then(res => res.json())
    .then(data => { setSummary(data); setScreen('summary'); });
  }
 
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-cyan-50 px-4 py-8 md:py-12">
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Smart Vehicle Rentals</p>
              <h1 className="mt-2 text-4xl font-black text-slate-900">RentTrack</h1>
              <p className="mt-2 text-sm text-slate-600">Browse vehicles, track live rental time, and return with a clear billing summary.</p>
            </div>
            <div className="flex gap-2">
              <span className={stepClass('list')}>Choose</span>
              <span className={stepClass('active')}>Track</span>
              <span className={stepClass('summary')}>Summary</span>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur-sm md:p-6">
          {screen === 'list'    && <VehicleList onRent={handleRent} />}
          {screen === 'active'  && <ActiveRental rental={rental} vehicle={vehicle} onReturn={handleReturn} />}
          {screen === 'summary' && <ReturnSummary summary={summary} onDone={() => setScreen('list')} />}
        </section>
      </div>
    </main>
  );
}
