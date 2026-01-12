import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
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

  return (
    <>
      {/* SUCCESS NOTIFICATION BOX */}
      {successMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-yellow-500/90 border border-yellow-400 text-black px-4 py-3 rounded-xl flex items-center justify-between shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-bold uppercase italic">{successMsg}</span>
            </div>
            <button 
              onClick={() => setSuccessMsg('')} 
              className="ml-4 hover:scale-110 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <nav className="flex items-center justify-between px-6 py-6 md:px-12 border-b border-gray-800 bg-black sticky top-0 z-50">
        <Link to={user ? "/home" : "/login"} className="text-2xl font-black tracking-tighter italic text-white">
          The Bold Room<span className="text-yellow-400">.</span>
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-white">
          {user && (
            <>
              <Link to="/events" className="hover:text-yellow-400 transition-colors">Events</Link>
              <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
              <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
            </>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] text-gray-500 font-mono uppercase">
              {user.email}
            </span>
            <button 
              onClick={handleLogout}
              className="px-5 py-2 border border-yellow-400 text-yellow-400 rounded-full text-xs font-bold uppercase hover:bg-yellow-400 hover:text-black transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="px-5 py-2 bg-yellow-400 text-black rounded-full text-xs font-bold uppercase hover:bg-white transition-all"
          >
            Login
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;