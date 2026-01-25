import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import OrganizerSidebar from './OrganizerSidebar';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalLikes: 0,
    eventCount: 0,
    // avgRating: 4.8
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrganizerStats(user.uid);
      } else {
        setLoading(false);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchOrganizerStats = async (uid) => {
    try {
      const bookingQuery = query(collection(db, "bookings"), where("organizerId", "==", uid));
      const bookingSnap = await getDocs(bookingQuery);

      let totalEarnings = 0;
      bookingSnap.forEach((doc) => {
        totalEarnings += doc.data().amountPaid;
      });

      const eventQuery = query(collection(db, "events"), where("organizerId", "==", uid));
      const eventSnap = await getDocs(eventQuery);

      let totalLikes = 0;
      // let totalRating = 0;
      let eventCount = 0;

      eventSnap.forEach((doc) => {
        const data = doc.data();
        eventCount++;
        totalLikes += (data.likedBy?.length || 0);
        // totalRating += (data.rating || 0);
      });

      setStats({
        totalEarnings: totalEarnings,
        totalLikes: totalLikes,
        eventCount: eventCount,
        // avgRating: eventCount > 0 ? (totalRating / eventCount).toFixed(1) : "0.0"
      });
    } catch (error) {
      console.error("Error fetching dynamic stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { label: 'Total Earning', value: `₹ ${stats.totalEarnings.toLocaleString()}`, icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z' },
    { label: 'Active Events', value: stats.eventCount, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Total Likes', value: stats.totalLikes.toLocaleString(), icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { label: 'Avg Rating', value: stats.avgRating, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <OrganizerSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-full">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Organizer <span className="text-yellow-400">Dashboard</span>
          </h1>
        </header>

        {/* DYNAMIC STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex items-center justify-between hover:border-yellow-400 transition-all group">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black mt-1 group-hover:text-yellow-400 transition-colors">{stat.value}</h3>
              </div>
              <div className="text-yellow-400 bg-yellow-400/10 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-[#111] p-8 rounded-3xl border border-gray-800">
            <h3 className="text-sm font-black uppercase tracking-widest italic mb-8">Performance Analytics</h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {[40, 70, 45, 90, 65, 80, 30, 85, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-yellow-400/10 rounded-t-lg relative group overflow-hidden" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 w-full bg-yellow-400 transition-all duration-700 h-1 group-hover:h-full"></div>
                  </div>
                  <span className="text-[9px] text-gray-600 font-bold uppercase">Event {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest italic">Inventory</h3>
            </div>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * (stats.eventCount / 10))} className="text-yellow-400 transition-all duration-1000" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{stats.eventCount}</span>
                <span className="text-[10px] uppercase text-gray-500 font-bold">Events</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizerDashboard;