
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { MOCK_USER_AM, MOCK_USER_ADMIN } from '../constants';

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('account_manager_01');
  const [password, setPassword] = useState('demo1234');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to verify pwd
    setTimeout(() => {
      setIsLoading(false);
      if ((username === 'account_manager_01' && password === 'demo1234') || 
          (username === 'system_admin' && password === 'admin1234')) {
        setStep(2);
        setError('');
      } else {
        setError('Invalid credentials. (Hint: am/demo1234 or admin/admin1234)');
      }
    }, 800);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate TOTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (totp === '123456') { // Mock valid TOTP
        const selectedUser = username === 'system_admin' ? MOCK_USER_ADMIN : MOCK_USER_AM;
        login(selectedUser);
      } else {
        setError('Incorrect verification code. Try 123456');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-200">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">SmartPMS Pro</h2>
            <p className="text-slate-500 mt-2">Property Management & Intelligence</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Enter your account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-200 transition-all flex justify-center items-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-slate-100 p-4 rounded-lg inline-block mb-4">
                  <svg className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">Authenticator Code Required</p>
                </div>
                <p className="text-sm text-slate-600">Enter the 6-digit code from your app</p>
              </div>
              <div>
                <input 
                  type="text" 
                  maxLength={6}
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-4 text-center text-3xl font-mono tracking-widest rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="000000"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Back
                </button>
                <button 
                  disabled={isLoading}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-200 transition-all flex justify-center items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Verify'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Secured with bcrypt and encrypted TOTP storage.<br/>
              Access Token (JWT) expires in 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
