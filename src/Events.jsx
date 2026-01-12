import React, { useState, useEffect } from 'react';

const Events = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      title: "Electronic Night 2026",
      date: "Jan 24, 2026",
      desc: "Experience the ultimate neon-drenched soundscape."
    },
    {
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
      title: "Yellow Tech Summit",
      date: "Feb 10, 2026",
      desc: "Connecting the brightest minds in tech."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const categories = ["Music", "Tech", "Art", "Business", "Sports", "Gaming"];

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
            
            <div className="absolute bottom-12 left-6 md:left-12 z-20 max-w-2xl">
              <span className="bg-yellow-400 text-black px-3 py-1 text-xs font-black uppercase mb-4 inline-block">
                Featured Event
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase mb-2">{slide.title}</h1>
              <p className="text-yellow-400 font-mono mb-4">{slide.date}</p>
              <p className="text-gray-300 text-sm md:text-base mb-6">{slide.desc}</p>
              <button className="px-8 py-3 bg-white text-black font-bold uppercase text-sm rounded-sm hover:bg-yellow-400 transition-colors">
                Book Tickets
              </button>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 right-12 z-30 flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-8 transition-all ${i === activeSlide ? 'bg-yellow-400' : 'bg-gray-600'}`} 
            />
          ))}
        </div>
      </div>

      <section className="py-16 px-6 md:px-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black uppercase border-l-4 border-yellow-400 pl-4">
            Browse Categories
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat} 
              className="group border border-gray-800 p-6 rounded-xl hover:bg-yellow-400 transition-all cursor-pointer text-center"
            >
              <span className="text-sm font-bold uppercase group-hover:text-black transition-colors">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition-colors">
          <div className="h-48 bg-gray-800" />
          <div className="p-6">
            <h3 className="text-xl font-bold uppercase mb-2">Upcoming Workshop</h3>
            <p className="text-gray-400 text-sm mb-4">Learn the basics of UI/UX design in 2026.</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-bold">$25.00</span>
              <button className="text-xs uppercase font-black underline hover:text-yellow-400">View Details</button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      
    </div>
  );
};

export default Events;