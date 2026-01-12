import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black">

      <main className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
        <div className="inline-block px-3 py-1 mb-6 border border-yellow-400 text-yellow-400 text-[10px] uppercase font-bold tracking-[0.3em] rounded-full">
          Welcome Back
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black uppercase leading-none mb-6">
          The Future is <br />
          <span className="text-yellow-400">Bright & Bold.</span>
        </h1>
        
        <p className="max-w-xl text-gray-400 text-sm md:text-base leading-relaxed mb-10">
          Logged in as <span className="text-white font-mono">{user?.email || "Guest"}</span>. 
          Explore our exclusive events and stay ahead of the curve with our aesthetic dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/events')}
            className="px-10 py-4 bg-yellow-400 text-black font-black uppercase text-sm rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] active:scale-95"
          >
            Explore Events
          </button>
          <button className="px-10 py-4 bg-transparent border border-gray-700 text-white font-black uppercase text-sm rounded-lg hover:bg-gray-800 transition-all active:scale-95">
            View Profile
          </button>
        </div>
      </main>

      <section className="px-6 py-20 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="group p-8 bg-[#111] border border-gray-900 rounded-3xl hover:border-yellow-400/50 transition-all">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl mb-6 flex items-center justify-center text-black font-bold">
              0{item}
            </div>
            <h3 className="text-xl font-bold mb-3 uppercase">Feature Name</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Experience the perfect blend of black minimalism and high-energy yellow accents.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;