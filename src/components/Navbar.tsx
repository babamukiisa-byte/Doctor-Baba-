import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab } from '../types';
import { SITE_INFO } from '../data/initialData';
import { normalizeImageUrl, handleImageError } from '../utils/imageUtils';
import { Menu, X, Phone, MessageSquare, Flame, Sparkles, Sun, Moon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectServiceDetail?: (serviceName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSelectServiceDetail }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDesktopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // 300ms grace period so users can comfortably move mouse to any dropdown item
    hoverTimeoutRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 300);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const serviceOfferings = [
    "Relationship Reconciliation",
    "Marriage & Family Harmony",
    "Prosperity & Career Focus",
    "Spiritual Protection & Shielding",
    "Ancestral Guidance",
    "Traditional Shielding UK",
    "Psychic Guidance Canada",
    "Inclusive Relationship Guidance",
    "Business Blessings",
    "Traditional Healer Uganda"
  ];

  const navItems: { label: string; tab: ActiveTab; hasDropdown?: boolean }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'Blog', tab: 'blog' },
    { label: 'Services', tab: 'services', hasDropdown: true },
    { label: 'Videos', tab: 'videos' },
    { label: 'Gallery', tab: 'gallery' },
    { label: 'About', tab: 'about' },
    { label: 'Contact Us', tab: 'contact' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setDesktopDropdownOpen(false);
    setMobileServicesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceDetailClick = (service: string) => {
    if (onSelectServiceDetail) {
      onSelectServiceDetail(service);
    }
    setDesktopDropdownOpen(false);
    setMobileServicesOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-amber-900/40 text-amber-50 shadow-xl">
      {/* Top Banner Bar */}
      <div className="bg-amber-950/80 border-b border-amber-800/30 text-amber-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Official Spiritual Temple Website of <strong>Doctor Baba Mukisa</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${SITE_INFO.phone}`} 
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> {SITE_INFO.phone}
            </a>
            <a 
              href={`https://wa.me/${SITE_INFO.whatsapp}?text=Hello%20Doctor%20Baba%20Mukisa,%20I%20am%20reaching%20out%20for%20spiritual%20help`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-300 font-medium"
            >
              <MessageSquare className="w-3 h-3" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0 shrink"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-950 p-0.5 shadow-md shadow-amber-900/50 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center overflow-hidden border border-amber-500/50">
                <img
                  src={normalizeImageUrl('/Doctor Baba Mukisa Logo -1.jpg')}
                  alt="Doctor Baba Mukisa Logo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={handleImageError}
                />
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-amber-100 group-hover:text-amber-300 transition-colors font-serif block truncate">
                Doctor Baba Mukisa
              </span>
              <span className="block text-[9px] xs:text-[10px] sm:text-xs text-amber-400/80 tracking-wider uppercase font-sans truncate">
                Spiritual Healer &amp; Temple
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab || 
                (item.tab === 'blog' && activeTab === 'blog-detail') ||
                (item.tab === 'services' && (activeTab === 'category-detail' || activeTab === 'service-detail'));
              
              if (item.hasDropdown) {
                return (
                  <div 
                    key={item.tab} 
                    className="relative" 
                    ref={desktopDropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.tab)}
                        className={`pl-3 pr-1.5 py-2 rounded-l-md text-sm font-medium transition-all border-y border-l ${
                          isActive
                            ? 'bg-amber-900/60 text-amber-200 border-amber-700/50 shadow-inner'
                            : 'text-amber-100/90 border-transparent hover:text-amber-300 hover:bg-slate-900/80'
                        }`}
                      >
                        {item.label}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDesktopDropdownOpen((prev) => !prev);
                        }}
                        aria-label="Toggle Services menu"
                        aria-expanded={desktopDropdownOpen}
                        className={`pr-2.5 pl-1 py-2 rounded-r-md text-sm font-medium transition-all border-y border-r cursor-pointer ${
                          isActive
                            ? 'bg-amber-900/60 text-amber-200 border-amber-700/50 shadow-inner'
                            : 'text-amber-100/90 border-transparent hover:text-amber-300 hover:bg-slate-900/80'
                        }`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${desktopDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {desktopDropdownOpen && (
                      <div 
                        className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="services-dropdown-box bg-slate-900 border border-amber-800/60 rounded-xl shadow-2xl overflow-hidden py-1 backdrop-blur-md">
                          <div className="px-3.5 py-2 border-b border-amber-900/40 bg-amber-950/30 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                              Spiritual Offerings
                            </span>
                            <button
                              type="button"
                              onClick={() => handleNavClick('services')}
                              className="text-[11px] text-amber-300 hover:text-amber-100 underline font-semibold cursor-pointer"
                            >
                              All Services &rarr;
                            </button>
                          </div>
                          <div className="max-h-[340px] overflow-y-auto py-1 custom-scrollbar">
                            {serviceOfferings.map((service) => (
                              <button
                                key={service}
                                type="button"
                                onClick={() => handleServiceDetailClick(service)}
                                className="services-dropdown-item flex items-center justify-between w-full text-left px-3.5 py-2 text-xs text-amber-100/90 hover:bg-amber-800/40 hover:text-amber-200 transition-colors border-b border-amber-900/15 last:border-0 cursor-pointer group/item"
                              >
                                <span className="truncate">{service}</span>
                                <span className="text-[10px] text-amber-500/60 group-hover/item:text-amber-400 group-hover/item:translate-x-0.5 transition-all flex-shrink-0 ml-2">
                                  &rsaquo;
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50 shadow-inner'
                      : 'text-amber-100/90 hover:text-amber-300 hover:bg-slate-900/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls (Start Now CTA + Light Mode Icon) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle Light/Dark Mode"
              className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-700/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              {isLightMode ? (
                <Moon className="w-5 h-5 text-amber-300" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold px-5 py-2.5 rounded-full text-sm shadow-lg shadow-amber-900/40 hover:shadow-amber-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Start Now!
            </button>
          </div>

          {/* Mobile Hamburger & Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle Light/Dark Mode"
              className="p-2 rounded-full bg-slate-900/80 text-amber-300 border border-amber-700/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isLightMode ? (
                <Moon className="w-5 h-5 text-amber-300" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-full text-xs shadow"
            >
              Start Now!
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900/40 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/98 border-b border-amber-900/50 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200 overflow-y-auto max-h-[80vh]">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab ||
                (item.tab === 'blog' && activeTab === 'blog-detail') ||
                (item.tab === 'services' && (activeTab === 'category-detail' || activeTab === 'service-detail'));

              if (item.hasDropdown) {
                return (
                  <div key={item.tab} className="space-y-1">
                    <div className="flex items-center w-full">
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.tab)}
                        className={`flex-1 text-left px-4 py-3 rounded-l-lg text-base font-medium min-h-[44px] border-l-4 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-amber-900/80 text-amber-200 font-semibold border-amber-400'
                            : 'text-amber-100/90 hover:bg-slate-900 hover:text-amber-300 border-transparent'
                        }`}
                      >
                        {item.label}
                      </button>
                      <button
                        type="button"
                        aria-label="Toggle mobile services submenu"
                        aria-expanded={mobileServicesOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileServicesOpen((prev) => !prev);
                        }}
                        className={`px-4 py-3 rounded-r-lg text-base font-medium min-h-[44px] transition-colors cursor-pointer flex items-center justify-center ${
                          isActive
                            ? 'bg-amber-900/80 text-amber-200'
                            : 'text-amber-100/90 hover:bg-slate-900'
                        }`}
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-amber-400' : ''}`} />
                      </button>
                    </div>
                    
                    {mobileServicesOpen && (
                      <div className="pl-4 pr-1 space-y-1 py-1.5 border-l-2 border-amber-600/40 ml-4 animate-in slide-in-from-top-1 duration-200 bg-slate-900/60 rounded-r-lg">
                        <button
                          type="button"
                          onClick={() => handleNavClick('services')}
                          className="w-full text-left px-3 py-2.5 text-xs font-bold text-amber-400 hover:text-amber-200 active:bg-amber-800/40 rounded-md min-h-[44px] flex items-center justify-between border-b border-amber-900/30 cursor-pointer"
                        >
                          <span>Explore All Services &rarr;</span>
                        </button>
                        {serviceOfferings.map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceDetailClick(service)}
                            className="w-full text-left px-3 py-2.5 text-xs text-amber-100/90 hover:text-amber-200 active:bg-amber-800/50 hover:bg-amber-900/30 rounded-md min-h-[44px] flex items-center justify-between cursor-pointer transition-colors border-b border-amber-900/10 last:border-0"
                          >
                            <span className="truncate">{service}</span>
                            <span className="text-amber-500/80 text-xs ml-2 font-bold">&rsaquo;</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium min-h-[44px] ${
                    isActive
                      ? 'bg-amber-900/80 text-amber-200 font-semibold border-l-4 border-amber-400'
                      : 'text-amber-100/90 hover:bg-slate-900 hover:text-amber-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-amber-900/40 space-y-2">
            <a
              href={`https://wa.me/${SITE_INFO.whatsapp}?text=Hello%20Doctor%20Baba%20Mukisa,%20I%20am%20reaching%20out%20for%20spiritual%20help`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Doctor Baba Mukisa
            </a>
            <a
              href={`tel:${SITE_INFO.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg font-semibold text-sm min-h-[44px]"
            >
              <Phone className="w-4 h-4" /> Call {SITE_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
