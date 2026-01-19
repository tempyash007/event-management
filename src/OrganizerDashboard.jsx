import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }, []);

  useEffect(() => {
      if (successMsg) {
        const timer = setTimeout(() => setSuccessMsg(''), 6000);
        return () => clearTimeout(timer);
      }
    }, [successMsg]);

  const handleLogout = async () => {
      try {
        await signOut(auth);
        setSuccessMsg('Successfully logged out. See you soon!');
        navigate('/login');
      } catch (error) {
        console.error("Logout Error:", error);
      }
    };

  // Navigation items for the Sidebar (Left Tray)
  const menuItems = [
    { name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/home' },
    { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/events' },
    { name: 'Messages', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4', path: '#' },
    { name: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', path: '#' },
    { name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '#' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* SIDEBAR (LEFT TRAY) */}
      <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-8 text-center border-b border-gray-800">
          <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-black">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="font-black uppercase tracking-tighter text-lg">Admin Name</h2>
          <p className="text-gray-500 text-xs">admin@events.com</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-yellow-400 hover:text-black transition-all group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black uppercase italic">Dashboard <span className="text-yellow-400">Overview</span></h1>
          <button 
              onClick={handleLogout}
              className="px-5 py-2 border border-yellow-400 text-yellow-400 rounded-full text-xs font-bold uppercase hover:bg-yellow-400 hover:text-black transition-all"
            >
              Logout
            </button>
        </header>

        {/* TOP STATS CARDS (Mirroring your reference image) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Earning', value: '$ 6,420', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z' },
            { label: 'Event Shares', value: '2,840', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
            { label: 'Total Likes', value: '12,580', icon: 'M14 10h4.708a2 2 0 001.94-1.515l1.204-4.816A2 2 0 0019.912 1H4.105a2 2 0 00-1.94 1.515l-1.204 4.816A2 2 0 002.909 10H8v8a2 2 0 11-4 0v-1H2v1a4 4 0 108 0v-8z' },
            { label: 'Avg Rating', value: '4.8', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex items-center justify-between hover:border-yellow-400 transition-colors">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
              </div>
              <div className="text-yellow-400 bg-yellow-400/10 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* DATA VISUALIZATION AREA (Mirroring Bar Chart and Calendar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* BAR CHART PLACEHOLDER */}
          <div className="lg:col-span-2 bg-[#111] p-8 rounded-3xl border border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest italic">Registration Analytics</h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase">
                <span className="flex items-center gap-1 text-yellow-400"><div className="w-2 h-2 bg-yellow-400"></div> 2026</span>
                <span className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 bg-gray-600"></div> 2025</span>
              </div>
            </div>
            {/* Simple CSS-based bar visualization */}
            <div className="flex items-end justify-between h-48 gap-2">
              {[40, 70, 45, 90, 65, 80, 30, 85, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-yellow-400/20 rounded-t-sm relative group overflow-hidden" style={{height: `${h}%`}}>
                    <div className="absolute bottom-0 w-full bg-yellow-400 transition-all duration-700 h-0 group-hover:h-full"></div>
                  </div>
                  <span className="text-[9px] text-gray-600 font-bold">MON</span>
                </div>
              ))}
            </div>
          </div>

          {/* CIRCULAR PROGRESS PLACEHOLDER */}
          <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 flex flex-col items-center justify-center">
             <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="110" className="text-yellow-400" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black">75%</span>
                  <span className="text-[10px] uppercase text-gray-500 font-bold">Target</span>
                </div>
             </div>
             <div className="mt-8 space-y-2 w-full">
                <div className="flex justify-between text-[10px] font-bold uppercase"><span className="text-gray-500">Tickets Sold</span><span>840/1000</span></div>
                <div className="w-full bg-gray-800 h-1"><div className="bg-yellow-400 h-full w-[84%]"></div></div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default OrganizerDashboard;