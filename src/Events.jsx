import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { arrayRemove, increment } from "firebase/firestore";
import { auth } from "./firebase/firebaseConfig";


const Events = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const eventData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Auto-slide logic for the Hero
  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length]);

  const toggleLike = async (eventId, likedBy = []) => {
    if (!auth.currentUser) {
      alert("Please login to mark interest");
      return;
    }

    const userId = auth.currentUser.uid;
    const eventRef = doc(db, "events", eventId);
    const isLiked = likedBy.includes(userId);

    // 🔄 TOGGLE
    await updateDoc(eventRef, {
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    });

    // ⚡ Optimistic UI update
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
            ...event,
            likedBy: isLiked
              ? event.likedBy.filter((id) => id !== userId)
              : [...(event.likedBy || []), userId],
          }
          : event
      )
    );
  };

  const categories = ["Music", "Tech", "Art", "Business", "Sports", "Gaming"];

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* HERO SLIDER (Shows Real Data) */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        {events.length > 0 ? events.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img
              src={event.imageBase64?.startsWith('data:')
                ? event.imageBase64
                : `data:image/jpeg;base64,${event.imageBase64}`}

              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              alt={event.title}
            />

            <div className="absolute bottom-12 left-6 md:left-12 z-20 max-w-2xl">
              <span className="bg-yellow-400 text-black px-3 py-1 text-xs font-black uppercase mb-4 inline-block tracking-tighter italic">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase mb-2 italic tracking-tighter">
                {event.title}
              </h1>
              <p className="text-yellow-400 font-mono mb-4 text-sm">
                {event.date?.toDate ? event.date.toDate().toDateString() : 'Date TBD'}
              </p>
              <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2">{event.description}</p>
              <button className="px-8 py-3 bg-white text-black font-black uppercase text-xs rounded-sm hover:bg-yellow-400 transition-all active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                Book Tickets
              </button>
            </div>
          </div>
          // <div
          //   key={event.id}
          //   className="bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition-all group flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          // >
          //   {/* IMAGE */}
          //   <div className="h-56 relative overflow-hidden">
          //     <img
          //       src={
          //         event.imageBase64?.startsWith("data:")
          //           ? event.imageBase64
          //           : `data:image/jpeg;base64,${event.imageBase64}`
          //       }
          //       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          //       alt={event.title}
          //     />

          //     {/* CITY BADGE */}
          //     <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-yellow-400 border border-yellow-400/30 rounded-full">
          //       {event.location?.city}
          //     </div>

          //     {/* LIKE BUTTON */}
          //     <button
          //       onClick={() => toggleLike(event.id, event.likedBy || [])}
          //       className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold hover:bg-black transition-all"
          //     >
          //       <span
          //         className={`text-lg transition-transform ${event.likedBy?.includes(auth.currentUser?.uid)
          //             ? "scale-110 text-red-500"
          //             : "text-gray-300"
          //           }`}
          //       >
          //         {event.likedBy?.includes(auth.currentUser?.uid) ? "❤️" : "🤍"}
          //       </span>
          //       <span className="text-yellow-400 text-xs">
          //         {event.likedBy?.length || 0}
          //       </span>
          //     </button>
          //   </div>

          //   {/* CONTENT */}
          //   <div className="p-6 flex flex-col flex-1">
          //     <div className="flex justify-between items-start mb-2">
          //       <h3 className="text-lg font-black uppercase italic leading-tight">
          //         {event.title}
          //       </h3>
          //       <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          //         {event.duration?.value} {event.duration?.type}
          //       </span>
          //     </div>

          //     <p className="text-gray-400 text-xs mb-6 line-clamp-2 flex-1">
          //       {event.description}
          //     </p>

          //     {/* FOOTER */}
          //     <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          //       <div>
          //         <span className="block text-[9px] text-gray-600 uppercase font-black tracking-widest">
          //           Starting At
          //         </span>
          //         <span className="text-xl font-black text-white">
          //           ₹{event.pricingTiers?.[0]?.price || "Free"}
          //         </span>
          //       </div>

          //       <Link
          //         to={`/EventDetails/${event.id}`}
          //         className="text-[10px] uppercase font-black px-5 py-3 bg-yellow-400 text-black rounded-xl hover:bg-white transition-colors"
          //       >
          //         View Details
          //       </Link>
          //     </div>
          //   </div>
          // </div>

        )) : (
          <div className="flex items-center justify-center h-full text-gray-500 uppercase font-black italic">No Featured Events Found</div>
        )}

        <div className="absolute bottom-6 right-12 z-30 flex gap-2">
          {events.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 transition-all duration-500 ${i === activeSlide ? 'bg-yellow-400 w-12' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-16 px-6 md:px-12">
        <h2 className="text-2xl font-black uppercase border-l-4 border-yellow-400 pl-4 mb-10 italic">
          Browse <span className="text-yellow-400">Categories</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat} className="group border border-gray-800 p-6 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/5 transition-all cursor-pointer text-center">
              <span className="text-sm font-bold uppercase group-hover:text-yellow-400 transition-colors tracking-widest">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* EVENT GRID (Displays Real Pricing and Location) */}
      <section className="pb-20 px-6 md:px-12">
        <h2 className="text-2xl font-black uppercase border-l-4 border-yellow-400 pl-4 mb-10 italic">
          Upcoming <span className="text-yellow-400">Experiences</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition-all group flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            >
              {/* IMAGE CONTAINER */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={event.imageBase64?.startsWith("data:")
                    ? event.imageBase64
                    : `data:image/jpeg;base64,${event.imageBase64}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={event.title}
                />

                {/* CITY BADGE */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-yellow-400 border border-yellow-400/30 rounded-full">
                  {event.location?.city}
                </div>

                {/* LIKE BUTTON */}
                <button
                  onClick={() => toggleLike(event.id, event.likedBy || [])}
                  className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold hover:bg-black transition-all"
                >
                  <span
                    className={`text-lg transition-transform ${event.likedBy?.includes(auth.currentUser?.uid)
                      ? "scale-110 text-red-500"
                      : "text-gray-300"
                      }`}
                  >
                    {event.likedBy?.includes(auth.currentUser?.uid) ? "❤️" : "🤍"}
                  </span>
                  <span className="text-yellow-400 text-xs">
                    {event.likedBy?.length || 0}
                  </span>
                </button>
              </div>

              {/* DETAILS SECTION */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black uppercase italic leading-tight">{event.title}</h3>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {event.duration?.value} {event.duration?.type}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-6 line-clamp-2 flex-1">{event.description}</p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Starting At</span>
                    <span className="text-xl font-black text-white">
                      ₹{event.pricingTiers?.[0]?.price || 'Free'}
                    </span>
                  </div>
                  <button className="text-[10px] uppercase font-black px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-white transition-colors">
                    <Link to={`/EventDetails/${event.id}`}>View Details</Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Events;