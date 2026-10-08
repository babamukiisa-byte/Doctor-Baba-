import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { SITE_INFO } from '../data/initialData';
import { normalizeImageUrl, handleImageError } from '../utils/imageUtils';
import { ChevronDown, ChevronUp, Flame, ShieldAlert, Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Globe, Map, Sparkles, Star, Heart } from 'lucide-react';
import { useEmail } from '../context/EmailContext';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectServiceDetail?: (service: string) => void;
  onSubscribe?: (email: string) => { added: boolean; isDuplicate: boolean; message: string; subscriberId?: string } | void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onSelectServiceDetail, onSubscribe }) => {
  const { openEmail } = useEmail();
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState('');
  const [isDuplicateAttempt, setIsDuplicateAttempt] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (service: string) => {
    if (onSelectServiceDetail) {
      onSelectServiceDetail(service);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    if (onSubscribe) {
      const res = onSubscribe(emailInput.trim());
      if (res) {
        setSubscribedMsg(res.message);
        setIsDuplicateAttempt(res.isDuplicate);
      } else {
        setSubscribedMsg('Thank you for subscribing! Your email has been registered for weekly spiritual updates.');
        setIsDuplicateAttempt(false);
      }
    } else {
      setSubscribedMsg('Thank you for subscribing! Your email has been registered for weekly spiritual updates.');
      setIsDuplicateAttempt(false);
    }
    setEmailInput('');
    setTimeout(() => {
      setSubscribedMsg('');
      setIsDuplicateAttempt(false);
    }, 8000);
  };

  return (
    <footer className="site-footer bg-slate-950 border-t border-amber-900/50 text-amber-100/90 pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Subscribe Today Section */}
        <div className="newsletter-subscription-box bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Send className="w-4 h-4 text-amber-500" />
              <span className="newsletter-tag-text text-amber-400">Spiritual Newsletter</span>
            </div>
            <h3 className="newsletter-heading text-xl sm:text-2xl font-bold font-serif text-white">
              Subscribe Today!
            </h3>
            <p className="newsletter-desc text-xs sm:text-sm text-slate-200 sm:text-slate-300 leading-relaxed">
              Subscribe to Doctor Baba Mukisa’s weekly spiritual updates, monthly horoscopes, and ancestral wisdom via email.
            </p>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {subscribedMsg ? (
              <div
                className={`px-4 py-3 rounded-2xl text-xs flex items-center gap-2 max-w-md ${
                  isDuplicateAttempt
                    ? 'bg-amber-950/90 border border-amber-500 text-amber-200'
                    : 'bg-emerald-950/90 border border-emerald-500 text-emerald-200'
                }`}
              >
                {isDuplicateAttempt ? (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{subscribedMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-slate-950 border border-amber-900/80 focus:border-amber-400 rounded-full px-4 py-3 text-xs text-amber-100 placeholder-slate-400 focus:outline-none w-full sm:w-72 shadow-inner"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-full text-xs shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap min-h-[42px] w-full sm:w-auto"
                >
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-amber-900/40">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-900 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-full overflow-hidden flex items-center justify-center border border-amber-500/50">
                  <img
                    src={normalizeImageUrl('/Doctor Baba Mukisa Logo -1.jpg')}
                    alt="Doctor Baba Mukisa Logo"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              </div>
              <span className="text-xl font-bold font-serif text-amber-100">
                Doctor Baba Mukisa
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {SITE_INFO.aboutShort}
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-amber-300/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{SITE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{SITE_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <button
                  type="button"
                  onClick={() => openEmail()}
                  className="hover:text-amber-200 hover:underline transition-colors text-left break-all cursor-pointer"
                  title="Click to compose an email with your service provider"
                >
                  {SITE_INFO.email}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-sm font-bold font-serif text-amber-200 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-amber-300 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('blog')} className="hover:text-amber-300 transition-colors">
                  Spiritual Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-300 transition-colors">
                  Services & Guidance
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('videos')} className="hover:text-amber-300 transition-colors">
                  Spiritual Videos
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('admin')} className="hover:text-amber-300 transition-colors font-semibold text-amber-300/90">
                  Admin facilities
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-sm font-bold font-serif text-amber-200 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Spiritual Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-300 transition-colors">
                  Relationship Guidance
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-300 transition-colors">
                  Marriage & Family Harmony
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-300 transition-colors">
                  Prosperity & Career Focus
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-300 transition-colors">
                  Spiritual Cleansing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-300 transition-colors">
                  Dispute & Legal Mediation
                </button>
              </li>
            </ul>
          </div>

          {/* Temple Hours / Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-serif text-amber-200 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Contact Information
            </h4>
            <div className="pt-2 text-xs space-y-2.5 text-amber-300/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{SITE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{SITE_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <button
                  type="button"
                  onClick={() => openEmail()}
                  className="hover:text-amber-200 hover:underline transition-colors text-left break-all cursor-pointer"
                  title="Click to compose an email with your service provider"
                >
                  {SITE_INFO.email}
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <a href={`https://wa.me/${SITE_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[10px] font-bold">
                  <Phone className="w-3 h-3" />
                  WhatsApp Doctor
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* SEO Optimized Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-10 text-[10px] text-slate-400 border-b border-amber-900/20 pb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-900/40">
              <Globe className="w-4 h-4 text-amber-500" />
              <h5 className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">Global Consultations</h5>
            </div>
            <ul className="space-y-1.5">
              {[
                "Relationship Guidance USA", "Relationship Guidance UK", "Relationship Guidance Canada", "Relationship Guidance Australia",
                "Relationship Guidance London", "Relationship Guidance California", "Relationship Guidance New York", "Relationship Guidance Los Angeles",
                "Relationship Guidance Norway", "Relationship Guidance Germany", "Relationship Guidance Dubai", "Relationship Guidance France",
                "Relationship Guidance UAE", "Relationship Guidance Switzerland", "Relationship Guidance Russia", "Relationship Guidance Ireland",
                "Relationship Guidance Sweden", "Relationship Guidance Oman"
              ].map((loc) => (
                <li key={loc} onClick={() => handleServiceClick(loc)} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-amber-900 group-hover:bg-amber-500 transition-colors" />
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-900/40">
              <Map className="w-4 h-4 text-amber-500" />
              <h5 className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">Regional Services</h5>
            </div>
            <ul className="space-y-1.5">
              {[
                "Relationship Guidance South Africa", "Relationship Guidance Kenya", "Relationship Guidance Botswana", "Relationship Guidance Namibia",
                "Relationship Guidance Mauritius", "Relationship Guidance Moscow", "Relationship Guidance Istanbul", "Relationship Guidance Mumbai",
                "Relationship Guidance Berlin", "Relationship Guidance Johannesburg", "Relationship Guidance St.Petersburg", "Relationship Guidance Shanghai",
                "Relationship Guidance Bahrain", "Relationship Guidance Singapore", "Relationship Guidance Malaysia", "Relationship Guidance Kuwait",
                "Relationship Guidance Denmark", "Relationship Guidance Nairobi"
              ].map((loc) => (
                <li key={loc} onClick={() => handleServiceClick(loc)} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-amber-900 group-hover:bg-amber-500 transition-colors" />
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-900/40">
              <MapPin className="w-4 h-4 text-amber-500" />
              <h5 className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">Specific Locations</h5>
            </div>
            <ul className="space-y-1.5">
              {[
                "Relationship Guidance Mombasa", "Relationship Guidance Kisumu", "Relationship Guidance Eldoret", "Relationship Guidance Nakuru",
                "Relationship Guidance Langata", "Relationship Guidance Malaba", "Relationship Guidance Soweto", "Relationship Guidance Limpopo",
                "Relationship Guidance Durban", "Relationship Guidance Witbank", "Relationship Guidance Stellenbosch", "Relationship Guidance Transkei",
                "Relationship Guidance Copenhagen", "Relationship Guidance Amsterdam", "Relationship Guidance Seoul", "Relationship Guidance Bali"
              ].map((loc) => (
                <li key={loc} onClick={() => handleServiceClick(loc)} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-amber-900 group-hover:bg-amber-500 transition-colors" />
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-900/40">
              <Flame className="w-4 h-4 text-amber-500" />
              <h5 className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">Our Specializations</h5>
            </div>
            <ul className="space-y-1.5">
              {[
                "Traditional Healer Uganda", "Traditional Healer Soweto", "Traditional Healer Sandton", "Traditional Healer Kenya",
                "Traditional Healer USA", "Traditional Shielding UK", "Traditional Shielding Cyprus", "Traditional Shielding Canada",
                "Traditional Shielding USA", "Spiritual Protection & Shielding", "Spiritual Protection USA", "Spiritual Protection UK",
                "Prosperity Alignment Uganda", "Prosperity Alignment Limpopo", "Prosperity Alignment Sandton", "Prosperity Alignment UAE",
                "Psychic Guidance Canada", "Psychic Guidance USA", "Psychic Guidance South Africa"
              ].map((loc) => (
                <li key={loc} onClick={() => handleServiceClick(loc)} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-amber-900 group-hover:bg-amber-500 transition-colors" />
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-900/40">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h5 className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">Sacred Offerings</h5>
            </div>
            <ul className="space-y-1.5">
              {[
                "Ancestral Guidance", "Relationship Reconciliation", "Spiritual Mediation", "Reconciliation Consultations",
                "Family & Marriage Peace", "Court Dispute Guidance", "Business Blessings", "Family Harmony Rituals",
                "Inclusive Relationship Guidance", "Spiritual Protection", "Prosperity Consultations", "Aura Cleansing",
                "Traditional Shielding", "Spiritual Insight", "Herbal Consultations", "Dream Interpretation",
                "Protection Artifacts", "Remote Meditation"
              ].map((loc) => (
                <li key={loc} onClick={() => handleServiceClick(loc)} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-amber-900 group-hover:bg-amber-500 transition-colors" />
                  {loc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Accordion */}
        <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-inner">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}>
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm font-serif">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Official Disclaimer & Terms of Service</span>
            </div>
            <button className="p-1 text-amber-400 hover:text-amber-200">
              {disclaimerExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {SITE_INFO.disclaimerShort}
          </p>

          {disclaimerExpanded && (
            <div className="mt-4 pt-4 border-t border-amber-900/40 text-xs text-slate-400 space-y-2 whitespace-pre-line leading-relaxed animate-in fade-in duration-200">
              {SITE_INFO.disclaimerFull}
            </div>
          )}
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-xs text-amber-500/70 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
          <p>© {new Date().getFullYear()} Doctor Baba Mukisa. All Rights Reserved. Sacred African spiritual wisdom.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNavClick('contact')} className="hover:text-amber-400 transition-colors border-b border-amber-900/50 pb-0.5">
              Contact Us
            </button>
            <button onClick={() => handleNavClick('about')} className="hover:text-amber-400 transition-colors">Privacy Policy</button>
            <button onClick={() => handleNavClick('about')} className="hover:text-amber-400 transition-colors">Terms of Use</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
