import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase/firebaseConfig';
import { collection, runTransaction, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth } from "./firebase/firebaseConfig";


const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);


  const handleBookNow = async () => {
    if (!auth.currentUser) {
      alert("Please login to book this event");
      return;
    }

    if (!selectedTier) {
      alert("Please select a ticket tier");
      return;
    }

    setBookingLoading(true);

    const userId = auth.currentUser.uid;
    const eventRef = doc(db, "events", event.id);
    const registrationRef = doc(
      collection(eventRef, "registrations"),
      userId
    );

    try {
      await runTransaction(db, async (transaction) => {
        const regSnap = await transaction.get(registrationRef);

        // ❌ Prevent duplicate registration
        if (regSnap.exists()) {
          throw new Error("You already registered for this event");
        }

        // ✅ Create registration
        transaction.set(registrationRef, {
          userId,
          selectedTier: selectedTier.tierName,
          registeredAt: serverTimestamp(),
        });

        // ✅ Increment registeredCount
        transaction.update(eventRef, {
          registeredCount: (event.registeredCount || 0) + 1,
        });
      });

      alert("🎉 Registration successful!");
    } catch (error) {
      alert(error.message);
    } finally {
      setBookingLoading(false);
    }
  };


  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!event) return <div className="min-h-screen bg-black text-white p-10 text-center uppercase font-black">Event not found</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      {/* 1. HERO SECTION */}
      <div className="relative h-[50vh] md:h-[65vh] w-full">
        <img
          src={event.imageBase64?.startsWith('data:')
            ? event.imageBase64
            : `data:image/jpeg;base64,${event.imageBase64}`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-6 md:left-12">
          <span className="bg-yellow-400 text-black px-4 py-1 text-xs font-black uppercase mb-4 inline-block italic tracking-tighter">
            {event.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            {event.title}
          </h1>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN: DESCRIPTION & INFO */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-xl font-black uppercase italic border-l-4 border-yellow-400 pl-4 mb-6">About the Event</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              {event.description || "No description provided for this event."}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xs font-black uppercase text-gray-500 mb-2">When & How Long</h3>
              <p className="font-bold">{event.date?.toDate().toLocaleString()}</p>
              <p className="text-yellow-400 text-sm font-mono mt-1">
                Duration: {event.duration?.value} {event.duration?.type}
              </p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xs font-black uppercase text-gray-500 mb-2">Where</h3>
              <p className="font-bold">{event.location?.city}</p>
              {event.location?.mapURL && (
                <a
                  href={event.location.mapURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 text-xs font-black uppercase underline mt-2 inline-block hover:text-white transition-colors"
                >
                  Open in Google Maps
                </a>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: BOOKING / PRICING TIERS */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-gray-800 rounded-[2rem] p-8 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-black uppercase italic mb-6">Select <span className="text-yellow-400">Tickets</span></h2>

            <div className="space-y-4 mb-8">
              {event.pricingTiers?.map((tier, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTier?.tierName === tier.tierName
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-gray-800 hover:border-yellow-400/50"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-black uppercase text-sm">
                      {tier.tierName}
                    </span>
                    <span className="text-lg font-black italic">₹{tier.price}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    {tier.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleBookNow}
              disabled={bookingLoading}
              className="w-full py-5 bg-yellow-400 text-black font-black uppercase rounded-2xl hover:bg-white transition-all disabled:opacity-50"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
              
            <p className="text-center text-[10px] text-gray-600 uppercase font-bold mt-4">
              Secure Checkout • Instant Confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;