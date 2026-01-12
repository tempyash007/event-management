import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  console.log(auth?.currentUser?.email);
  const signIn = async () => {
    try {
      setErrorMsg('');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    }
    catch (error) {
      setErrorMsg(getFriendlyErrorMessage(error.code));
    }
  }

  const signInWithGoogle = async () => {
    try {
      setErrorMsg('');
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    }
    catch (error) {
      setErrorMsg(getFriendlyErrorMessage(error.code));
    }
  }

  const getFriendlyErrorMessage = (code) => {
      switch (code) {
    case 'auth/invalid-credential': 
      return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found': 
      return 'No account found with this email.';
    case 'auth/wrong-password': 
      return 'Incorrect password.';
    case 'auth/invalid-email': 
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed': 
      return 'Network error. Check your connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later.';
    default:
      console.log("Unrecognized Firebase Code:", code);
      return 'An error occurred. Please try again.';
  }
    };
    useEffect(() => {
      if (errorMsg) {
        const timer = setTimeout(() => setErrorMsg(''), 6000);
        return () => clearTimeout(timer);
      }
    }, [errorMsg]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 font-sans text-white">

      {errorMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-900/80 border border-red-500 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
            <button 
              onClick={() => setErrorMsg('')} 
              className="ml-4 text-red-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-[95%] sm:w-full md:max-w-md p-6 md:p-8 space-y-6 bg-[#1a1a1a] rounded-[2rem] border border-gray-800 shadow-2xl">
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-4 pl-12 bg-[#242424] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 pl-12 bg-[#242424] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
              Forgot password?
            </button>
          </div>

          <button className="w-full py-4 mt-2 font-bold text-black bg-white rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg" onClick={signIn}>
            Sign in
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 py-4 bg-[#242424] border border-gray-800 rounded-xl hover:bg-[#2a2a2a] transition-colors group" onClick={signInWithGoogle}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-semibold text-sm text-gray-300 group-hover:text-white">Sign in with Google</span>
        </button>

        <p className="text-center text-xs text-gray-500 leading-relaxed">
          Don't have an account? <Link to="/signup" className="text-white font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}