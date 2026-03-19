import React, { useState } from 'react';
import { HeaderIcons } from './HeaderIcons';
import { HeaderNavMenu } from './HeaderNavMenu';
import { HeaderLogo } from './HeaderLogo';
import { HeaderSearch } from './HeaderSearch';
import { FaBars, FaTimes } from "react-icons/fa";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#364e57] relative">
      <section className="w-[85%] mx-auto text-white flex justify-between items-center lg:gap-4 gap-2 lg:py-8 py-6">
        <HeaderLogo />
        <div className="flex-1 lg:max-w-[600px] sm:max-w-[800px]">
          <HeaderSearch />
        </div>

        <div className="hidden lg:block">
          <HeaderNavMenu />
        </div>

        <HeaderIcons />

        <button
          onClick={() => setMenuOpen(true)}
          className="text-lg block lg:hidden cursor-pointer"
        >
          <FaBars />
        </button>
      </section>

      {/* Overlay background */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0  bg-opacity-40 lg:hidden"
        ></div>
      )}

      {/* Slide menu */}
      <div className={`
        fixed top-0 right-0 h-full w-[70%] max-w-[320px]
      bg-[#364e57]/80
        text-white p-6 z-50 lg:hidden
        transform ${menuOpen ? "translate-x-0" : "translate-x-full"}
        transition-transform duration-300 ease-out
      `}>
        
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-xl mr-4 text-white"
        >
          <FaTimes />
        </button>
        {/* Nav menu mobile */}
        <nav className="pace-y-4 mt-8">
          <HeaderNavMenu mobile />
        </nav>
      </div>
    </header>
  );
};
