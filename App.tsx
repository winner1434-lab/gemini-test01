
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole, Property, Notification } from './types';
import { MOCK_USER_AM, MOCK_USER_ADMIN, MOCK_PROPERTIES } from './constants';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RateManager from './components/RateManager';
import EventCenter from './components/EventCenter';
import NotificationsPanel from './components/NotificationsPanel';

interface AuthContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'rates' | 'events'>('dashboard');
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const login = (u: User) => setUser(u);
  const logout = () => {
    setUser(null);
    setActiveProperty(null);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotif = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  // Filter properties based on role
  const filteredProperties = user.role === UserRole.ADMIN 
    ? MOCK_PROPERTIES 
    : MOCK_PROPERTIES.filter(p => user.managedPropertyIds.includes(p.id));

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="flex min-h-screen bg-slate-50 overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          role={user.role} 
        />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {currentPage === 'dashboard' && 'System Overview'}
                {currentPage === 'rates' && 'Rate & Inventory Management'}
                {currentPage === 'events' && 'External Event Intelligence'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {user.role === UserRole.ADMIN ? 'Administrator Access' : `Account Manager: ${user.username}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-full hover:bg-white transition-all shadow-sm border border-slate-200"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && (
              <Dashboard 
                properties={filteredProperties} 
                onSelectProperty={(p) => {
                  setActiveProperty(p);
                  setCurrentPage('rates');
                }} 
              />
            )}
            {currentPage === 'rates' && (
              <RateManager 
                properties={filteredProperties} 
                activeProperty={activeProperty} 
                setActiveProperty={setActiveProperty}
                onNotify={addNotification}
              />
            )}
            {currentPage === 'events' && (
              <EventCenter 
                properties={filteredProperties}
                onNotify={addNotification}
              />
            )}
          </div>
        </main>

        {isNotificationsOpen && (
          <NotificationsPanel 
            notifications={notifications} 
            onClose={() => setIsNotificationsOpen(false)} 
            onClear={() => setNotifications([])}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default App;
