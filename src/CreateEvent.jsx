import React, { useState } from 'react';
import { db, auth } from './firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import OrganizerSidebar from './OrganizerSidebar';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music & Concerts',
    date: '',
    durationValue: 1,
    durationType: 'hours',
    city: '',
    mapURL: '',
    pricingTiers: [{ tierName: 'General Entry', price: '', description: '' }]
  });

  const categories = [
    "Music & Concerts", "Tech & Workshops", "Business & Networking",
    "Food & Drink", "Nightlife & Parties", "Health & Wellness", "Art & Culture"
  ];

  const addTier = () => {
    setFormData({
      ...formData,
      pricingTiers: [...formData.pricingTiers, { tierName: '', price: '', description: '' }]
    });
  };

  const removeTier = (index) => {
    const newTiers = formData.pricingTiers.filter((_, i) => i !== index);
    setFormData({ ...formData, pricingTiers: newTiers });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: limit size to ~300KB
    if (file.size > 300 * 1024) {
      alert("Please select an image under 300KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageBase64) {
        alert("Please select an event poster");
        return;
      }

      await addDoc(collection(db, "events"), {
        title: formData.title,
        description: formData.description || "",
        category: formData.category,
        date: new Date(formData.date),
        duration: {
          value: Number(formData.durationValue),
          type: formData.durationType,
        },
        location: {
          city: formData.city,
          mapURL: formData.mapURL,
        },
        pricingTiers: formData.pricingTiers.map((tier) => ({
          tierName: tier.tierName,
          price: Number(tier.price),
          description: tier.description || "",
        })),
        imageBase64: imageBase64,
        organizerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("Event Published Successfully!");
      navigate("/ManageEvents");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <OrganizerSidebar />

      {/* MAIN CONTENT: CREATE EVENT FORM */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-[#111] border border-gray-800 rounded-[2rem] p-8 shadow-2xl">
          <h1 className="text-3xl font-black uppercase italic mb-8 border-l-4 border-yellow-400 pl-4">
            Publish <span className="text-yellow-400">Event</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Event Title</label>
                <input required type="text" placeholder="e.g. Neon Summer Fest" className="w-full bg-black border border-gray-800 p-4 rounded-xl focus:ring-1 focus:ring-yellow-400 outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                <select className="w-full bg-black border border-gray-800 p-4 rounded-xl focus:ring-1 focus:ring-yellow-400 outline-none text-sm cursor-pointer"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Start Date & Time</label>
                <input required type="datetime-local" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none text-sm text-gray-300"
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Duration Value</label>
                <input required type="number" min="1" placeholder="e.g. 2" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, durationValue: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Unit</label>
                <select className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">City</label>
                <input required type="text" placeholder="Gandhinagar" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Google Maps URL</label>
                <input required type="url" placeholder="https://goo.gl/maps/..." className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, mapURL: e.target.value })} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold uppercase italic text-yellow-400 text-sm">Ticket Tiers</h3>
                <button type="button" onClick={addTier} className="text-[10px] bg-yellow-400 text-black px-4 py-2 rounded-full font-black uppercase hover:bg-white transition-all">+ Add New Tier</button>
              </div>

              {formData.pricingTiers.map((tier, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black p-5 rounded-2xl border border-gray-800 relative">
                  <input required placeholder="Tier Name (e.g. Couple)" className="bg-[#111] border border-gray-800 p-3 rounded-lg text-sm outline-none focus:border-yellow-400"
                    onChange={(e) => {
                      const newTiers = [...formData.pricingTiers];
                      newTiers[index].tierName = e.target.value;
                      setFormData({ ...formData, pricingTiers: newTiers });
                    }} />
                  <input required type="number" placeholder="Price (₹)" className="bg-[#111] border border-gray-800 p-3 rounded-lg text-sm outline-none focus:border-yellow-400"
                    onChange={(e) => {
                      const newTiers = [...formData.pricingTiers];
                      newTiers[index].price = e.target.value;
                      setFormData({ ...formData, pricingTiers: newTiers });
                    }} />
                  <div className="flex gap-2">
                    <input placeholder="Short info..." className="flex-1 bg-[#111] border border-gray-800 p-3 rounded-lg text-sm outline-none focus:border-yellow-400"
                      onChange={(e) => {
                        const newTiers = [...formData.pricingTiers];
                        newTiers[index].description = e.target.value;
                        setFormData({ ...formData, pricingTiers: newTiers });
                      }} />
                    {formData.pricingTiers.length > 1 && (
                      <button type="button" onClick={() => removeTier(index)} className="text-red-500 hover:text-red-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 bg-black p-6 rounded-2xl border border-gray-800">
              <label className="text-xs font-bold uppercase text-gray-400">Event Poster (Required)</label>
              {/* <input required type="file" accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-yellow-400 file:text-black hover:file:bg-white cursor-pointer transition-all"
                // onChange={(e) => setImageFile(e.target.files[0])}
                 /> */}
              <input
                required
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-yellow-400 file:text-black hover:file:bg-white cursor-pointer"
              />
              {imageBase64 && (
                <img
                  src={imageBase64}
                  alt="Preview"
                  className="mt-4 w-full h-64 object-cover rounded-xl border border-gray-700"
                />
              )}

            </div>

            <button disabled={loading} type="submit" className="w-full py-5 bg-yellow-400 text-black font-black uppercase rounded-2xl hover:bg-white transition-all shadow-[0_10px_30px_rgba(250,204,21,0.2)] active:scale-[0.98]">
              {loading ? "Processing..." : "Confirm & Publish Event"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;