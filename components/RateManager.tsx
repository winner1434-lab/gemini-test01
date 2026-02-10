
import React, { useState, useEffect } from 'react';
import { Property, RateData, RateSource } from '../types';

interface RateManagerProps {
  properties: Property[];
  activeProperty: Property | null;
  setActiveProperty: (p: Property) => void;
  onNotify: (n: { title: string, message: string, type: 'INFO' | 'ALERT' | 'SUCCESS' }) => void;
}

const RateManager: React.FC<RateManagerProps> = ({ properties, activeProperty, setActiveProperty, onNotify }) => {
  const [rates, setRates] = useState<RateData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize mock rate data when property changes
  useEffect(() => {
    if (activeProperty) {
      generateMockRates();
    }
  }, [activeProperty]);

  const generateMockRates = () => {
    const data: RateData[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Randomize source for demo
      let source = RateSource.ORIGINAL;
      let status: 'OPEN' | 'CLOSED' = 'OPEN';
      let price = 3200 + Math.floor(Math.random() * 500);

      if (i === 5) {
        source = RateSource.EVENT_STOP_SELL;
        status = 'CLOSED';
      }
      if (i === 2) {
        source = RateSource.MANUAL;
        price = 4500;
      }

      data.push({
        date: dateStr,
        price,
        status,
        source,
        inventory: status === 'CLOSED' ? 0 : Math.floor(Math.random() * 5) + 1,
        originalPrice: 3200
      });
    }
    setRates(data);
  };

  const handleFetch = (force = false) => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      onNotify({
        title: force ? "Full PMS Sync Complete" : "Inventory Incremental Update",
        message: force ? "All local data has been overwritten by PMS master." : "Updated 4 missing days from PMS data source.",
        type: 'SUCCESS'
      });
    }, 1500);
  };

  const handleSyncToPMS = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onNotify({
        title: "PMS Sync Success",
        message: `Successfully synchronized rates for ${activeProperty?.name} to remote PMS server.`,
        type: 'SUCCESS'
      });
    }, 2000);
  };

  const toggleStatus = (index: number) => {
    const newRates = [...rates];
    newRates[index].status = newRates[index].status === 'OPEN' ? 'CLOSED' : 'OPEN';
    newRates[index].source = RateSource.MANUAL;
    setRates(newRates);
  };

  if (!activeProperty) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Select a property to manage</h3>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {properties.map(p => (
            <button 
              key={p.id}
              onClick={() => setActiveProperty(p)}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{activeProperty.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">PMS CONNECTED</span>
              <span className="text-xs text-slate-400">Keelung, District {activeProperty.district}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleFetch(false)}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {isFetching ? 'Fetching...' : 'Check Missing Days'}
          </button>
          <button 
            onClick={() => handleFetch(true)}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-all disabled:opacity-50"
          >
            Force Pull from PMS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Price Sources Legend */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Legend</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className="text-sm text-slate-600 font-medium">Original (PMS)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-slate-600 font-medium">Manual Override</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600 font-medium">Event Stop-Sell</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100">
              <button 
                onClick={handleSyncToPMS}
                disabled={isSyncing}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isSyncing ? 'Syncing...' : 'Confirm & Push to PMS'}
              </button>
              <p className="text-[10px] text-slate-400 mt-2 text-center">Changes will be visible to travelers immediately.</p>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
              <span className="text-sm font-bold text-slate-500">Upcoming 14 Days</span>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-slate-200 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <button className="p-1 hover:bg-slate-200 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 border-r border-b border-slate-100">
              {rates.map((rate, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border-l border-t border-slate-100 min-h-[140px] flex flex-col justify-between transition-all ${rate.status === 'CLOSED' ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-400">
                        {new Date(rate.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        rate.source === RateSource.ORIGINAL ? 'bg-slate-300' :
                        rate.source === RateSource.MANUAL ? 'bg-indigo-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="mt-2">
                      <p className={`text-lg font-bold ${rate.status === 'CLOSED' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        ${rate.price.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">{rate.source.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">Inventory: {rate.inventory}</span>
                    </div>
                    <button 
                      onClick={() => toggleStatus(idx)}
                      className={`w-full py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
                        rate.status === 'OPEN' 
                          ? 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white' 
                          : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white'
                      }`}
                    >
                      {rate.status === 'OPEN' ? 'Close Room' : 'Open Room'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateManager;
