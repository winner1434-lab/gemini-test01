
import React, { useState } from 'react';
import { ExternalEvent, Property } from '../types';
import { MOCK_EVENTS } from '../constants';

interface EventCenterProps {
  properties: Property[];
  onNotify: (n: { title: string, message: string, type: 'INFO' | 'ALERT' | 'SUCCESS' }) => void;
}

const EventCenter: React.FC<EventCenterProps> = ({ properties, onNotify }) => {
  const [events, setEvents] = useState<ExternalEvent[]>(MOCK_EVENTS);
  const [radius, setRadius] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Simplified distance calculation for demo
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111; // Approx km
  };

  const runImpactAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const affected = [];
      for (const event of events) {
        for (const property of properties) {
          const dist = calculateDistance(event.lat, event.lng, property.lat, property.lng);
          if (dist <= radius) {
            affected.push(`${property.name} (${event.name})`);
          }
        }
      }
      onNotify({
        title: "Rule Engine: Impact Analysis Complete",
        message: `Detected ${affected.length} properties within range of high-scale events. Triggering Auto Stop-Sell.`,
        type: 'ALERT'
      });
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Detected External Events</h3>
                <p className="text-sm text-slate-400">Scraped from local ticketing and social platforms</p>
              </div>
              <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Scraper
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {events.map(event => (
                <div key={event.id} className="p-6 hover:bg-slate-50 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${event.scale === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{event.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>{event.date}</span>
                          <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${event.scale === 'HIGH' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {event.scale} SCALE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Rule Engine Config</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Distance Radius (km)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="text-lg font-bold text-indigo-600 w-8">{radius}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Properties within this radius will be automatically closed for high-impact events.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Auto Action</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked readOnly className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-600">Stop Sell (High Scale Events)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked readOnly className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-600">Send AM Notifications (Line/Email)</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={runImpactAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isAnalyzing ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Impact Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className="text-sm font-bold uppercase tracking-widest">AI Suggestion</h4>
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "Based on the scale of the Mayday Concert at Taipei Arena, properties within Xinyi district are expected to reach 100% occupancy 45 days in advance. Recommended action: Increase Base Rate by 25% for leftover inventory or Stop Sell for direct bookings."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCenter;
