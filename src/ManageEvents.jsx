import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import OrganizerSidebar from './OrganizerSidebar';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(collection(db, "events"), where("organizerId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEditTier = () => {
    setEditingEvent({
      ...editingEvent,
      pricingTiers: [
        ...editingEvent.pricingTiers,
        { tierName: "", price: "", description: "" },
      ],
    });
  };

  const removeEditTier = (index) => {
    const updatedTiers = editingEvent.pricingTiers.filter((_, i) => i !== index);
    setEditingEvent({
      ...editingEvent,
      pricingTiers: updatedTiers,
    });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(db, "events", editingEvent.id);
      await updateDoc(eventRef, editingEvent);
      alert("Event Updated!");
      setEditingEvent(null);
      fetchMyEvents();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white font-sans">
      {/* SIDEBAR (REUSED FROM DASHBOARD) */}
      <OrganizerSidebar />

      {/* MAIN CONTENT: EVENT LISTING */}
      <main className="flex-1 h-full p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black uppercase italic">Manage <span className="text-yellow-400">Events</span></h1>
          <Link to="/CreateEvent" className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-xs uppercase hover:bg-white transition-all">+ New Event</Link>
        </header>

        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-[#111] border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <img src={event.imageBase64} className="w-20 h-20 object-cover rounded-xl border border-gray-800" alt="event.title" />
                <div>
                  <h3 className="font-black uppercase text-lg">{event.title}</h3>
                  <p className="text-gray-500 text-xs">{event.location?.city} • {event.category}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingEvent(event)} className="px-4 py-2 border border-gray-700 rounded-lg text-xs font-bold uppercase hover:bg-white hover:text-black transition-all">Edit Details</button>
                <button onClick={async () => { if (window.confirm("Delete?")) { await deleteDoc(doc(db, "events", event.id)); fetchMyEvents(); } }} className="px-4 py-2 border border-red-900 text-red-500 rounded-lg text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MODAL */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form onSubmit={handleUpdate} className="bg-[#111] border border-gray-800 p-8 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
              <h2 className="text-xl font-black uppercase italic text-yellow-400">Edit Event Details</h2>

              <div className="space-y-4">
                <input value={editingEvent.title} className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none"
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} placeholder="Title" />

                <textarea value={editingEvent.description} className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none h-32"
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })} placeholder="Description" />

                <div className="grid grid-cols-2 gap-4">
                  <input value={editingEvent.location.city} className="bg-black border border-gray-800 p-4 rounded-xl outline-none"
                    onChange={e => setEditingEvent({ ...editingEvent, location: { ...editingEvent.location, city: e.target.value } })} placeholder="City" />
                  <input value={editingEvent.location.mapURL} type="text" className="bg-black border border-gray-800 p-4 rounded-xl outline-none"
                    onChange={e => setEditingEvent({ ...editingEvent, location: { ...editingEvent.location, mapURL: e.target.value } })} placeholder="Map URL" />
                </div>

                <h3 className="font-bold uppercase italic text-yellow-400 text-sm">Ticket Tiers</h3>
                <button
                  type="button"
                  onClick={addEditTier}
                  className="text-[10px] bg-yellow-400 text-black px-4 py-2 rounded-full font-black uppercase hover:bg-white transition-all text-align-right mb-4"
                >
                  + Add Tier
                </button>
                <div className="grid grid-cols-3 gap-4">
                  <p className="font-bold uppercase text-xs">Tier Name</p>
                  <p className="font-bold uppercase text-xs">Price (₹)</p>
                  <p className="font-bold uppercase text-xs">Description</p>
                </div>
                {editingEvent.pricingTiers.map((tier, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black p-5 rounded-2xl border border-gray-800 relative"
                  >
                    {/* Tier Name */}
                    <input
                      value={tier.tierName}
                      placeholder="Tier Name"
                      className="bg-[#111] border border-gray-800 p-3 rounded-lg outline-none focus:border-yellow-400"
                      onChange={(e) => {
                        const updatedTiers = [...editingEvent.pricingTiers];
                        updatedTiers[index].tierName = e.target.value;
                        setEditingEvent({ ...editingEvent, pricingTiers: updatedTiers });
                      }}
                    />

                    {/* Price */}
                    <input
                      type="number"
                      value={tier.price}
                      placeholder="Price (₹)"
                      className="bg-[#111] border border-gray-800 p-3 rounded-lg outline-none focus:border-yellow-400"
                      onChange={(e) => {
                        const updatedTiers = [...editingEvent.pricingTiers];
                        updatedTiers[index].price = e.target.value;
                        setEditingEvent({ ...editingEvent, pricingTiers: updatedTiers });
                      }}
                    />

                    {/* Description */}
                    <div className="flex gap-2">
                      <input
                        value={tier.description}
                        placeholder="Description"
                        className="flex-1 bg-[#111] border border-gray-800 p-3 rounded-lg outline-none focus:border-yellow-400"
                        onChange={(e) => {
                          const updatedTiers = [...editingEvent.pricingTiers];
                          updatedTiers[index].description = e.target.value;
                          setEditingEvent({ ...editingEvent, pricingTiers: updatedTiers });
                        }}
                      />

                      {editingEvent.pricingTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEditTier(index)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Remove tier"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-yellow-400 text-black font-black uppercase rounded-xl">Save Changes</button>
                <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 py-4 border border-gray-800 font-black uppercase rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEvents;