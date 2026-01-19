import React, { useState, useEffect } from 'react';
import { auth } from './firebase/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setErrorMsg('');
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Reset link sent! Check your inbox.');
    } catch (error) {
      setErrorMsg(getFriendlyErrorMessage(error.code));
    }
  };

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/network-request-failed': return 'Network error. Check your connection.';
      default: return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 font-sans text-white">
      
      {/* NOTIFICATION BOX (Error/Success) */}
      {(errorMsg || successMsg) && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${errorMsg ? 'bg-red-900/80 border-red-500' : 'bg-yellow-500/90 border-yellow-400 text-black'} border px-4 py-3 rounded-xl flex items-center justify-between shadow-2xl backdrop-blur-md`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold uppercase italic">{errorMsg || successMsg}</span>
            </div>
            <button onClick={() => { setErrorMsg(''); setSuccessMsg(''); }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-[95%] sm:w-full md:max-w-md p-6 md:p-8 space-y-6 bg-[#1a1a1a] rounded-[2rem] border border-gray-800 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase italic">Reset <span className="text-yellow-400">Password</span></h2>
          <p className="text-sm text-gray-500">Enter your email to receive a recovery link.</p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-4 pl-12 bg-[#242424] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-2 font-black text-black bg-yellow-400 rounded-xl hover:bg-white active:scale-95 transition-all shadow-lg uppercase text-sm"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Remember your password? <Link to="/login" className="text-white font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}