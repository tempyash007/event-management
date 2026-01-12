import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-[#050505] py-12 px-6 md:px-12 text-white">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="max-w-xs">
          <h3 className="text-xl font-black mb-4 uppercase">The Bold Room<span className="text-yellow-400">.</span></h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            The premier platform for high-end events and networking. Build the future with us.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-xs font-black uppercase mb-4 text-yellow-400 tracking-widest">Links</h4>
            <ul className="text-gray-500 text-xs space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Support</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase mb-4 text-yellow-400 tracking-widest">Social</h4>
            <ul className="text-gray-500 text-xs space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-white cursor-pointer transition-colors">X / Twitter</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-900 text-[10px] text-gray-600 text-center uppercase tracking-widest">
        © 2026 Your Company. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;