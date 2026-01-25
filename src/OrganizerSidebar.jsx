import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from './firebase/firebaseConfig';

const OrganizerSidebar = () => {
    const location = useLocation();
    const user = auth.currentUser;

    const menuItems = [
        { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/organizer-dashboard' },
        { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/ManageEvents' },
        { name: 'Messages', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4', path: '#' },
        { name: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', path: '#' },
        { name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '#' },
    ];

    return (
        /* ADDED: sticky top-0, h-screen, and flex-shrink-0 to prevent squashing */
        <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col hidden md:flex sticky top-0 h-screen flex-shrink-0">
            <div className="p-8 text-center border-b border-gray-800">
                <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="font-black uppercase tracking-tighter text-lg overflow-hidden text-ellipsis">
                    {user ? (
                        <p className="text-white text-[10px] break-all">{user.email}</p>
                    ) : (
                        <p className="text-gray-500 text-xs italic">Not logged in</p>
                    )}
                </h2>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                                isActive 
                                ? 'bg-yellow-400 text-black shadow-[0_10px_15px_rgba(250,204,21,0.15)]' 
                                : 'hover:bg-yellow-400/10 text-gray-400 hover:text-yellow-400'
                            }`}
                        >
                            <svg 
                                className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-yellow-400'}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            
            {/* Added: Footer Logout Button for better UX */}
            <div className="p-4 border-t border-gray-800">
                <button 
                    onClick={() => auth.signOut()}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-800 rounded-xl text-xs font-black uppercase text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default OrganizerSidebar;