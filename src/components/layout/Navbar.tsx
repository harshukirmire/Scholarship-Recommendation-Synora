import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Search, Sparkles, LayoutDashboard, Bookmark, Globe,
  Briefcase, Bot, ShieldCheck, Menu, X, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSynora } from '../../context/SynoraContext';
import { ClerkAuthControls } from '../auth/ClerkAuthControls';
import { useClerkStatus } from '../../context/ClerkWrapper';

export const Navbar: React.FC = () => {
  const { user, isAdmin, switchRole } = useAuth();
  const { savedScholarships, applications } = useSynora();
  const { isConfigured } = useClerkStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/find-for-me', label: 'Find For Me', icon: Sparkles, badge: 'Smart', highlight: true },
    { to: '/global-scholarships', label: 'Global Scholarships', icon: Globe, badge: 'Exams' },
    { to: '/explorer', label: 'Explorer', icon: Search, badge: null },
    { to: '/saved', label: 'Saved', icon: Bookmark, badge: savedScholarships.length > 0 ? savedScholarships.length : null },
    { to: '/applications', label: 'Tracker', icon: Briefcase, badge: applications.length > 0 ? applications.length : null },
    { to: '/guide', label: 'Synora Guide', icon: Bot, badge: 'AI' },
    { to: '/admin', label: 'Admin', icon: ShieldCheck, badge: isAdmin ? 'Active' : null },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Banner Notice */}
      <div className="bg-black text-white text-[11px] font-medium tracking-wide py-1.5 px-4 text-center flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>SYNORA Official Scholarship Platform</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-300">
          Auth: <strong className={isConfigured ? "text-emerald-400 font-bold" : "text-amber-300 font-bold"}>
            {isConfigured ? 'Clerk Active' : 'Clerk Initialized'}
          </strong>
        </span>
        <span className="hidden md:inline-block text-gray-400">|</span>
        <span className="hidden md:inline-block text-gray-300">Mode: <strong className="text-white uppercase">{isAdmin ? 'Admin' : 'Student'}</strong></span>
        <button
          onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
          className="ml-1 text-[10px] bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded transition-colors text-white border border-white/20 cursor-pointer"
        >
          {isAdmin ? 'Student View' : 'Admin View'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg tracking-tight group-hover:bg-gray-800 transition-colors">
              S
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-black flex items-center gap-1.5">
                SYNORA
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                  Web
                </span>
              </span>
              <span className="text-[9px] block text-gray-400 font-medium tracking-wider uppercase -mt-0.5">
                Verified Scholarship Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  relative px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5
                  ${isActive 
                    ? 'bg-black text-white shadow-sm' 
                    : item.highlight
                      ? 'text-gray-900 bg-gray-50 hover:bg-gray-100'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }
                `}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    item.badge === 'Smart' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.badge === 'AI'
                        ? 'bg-indigo-100 text-indigo-800'
                        : item.badge === 'Exams'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side Clerk Auth Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <ClerkAuthControls />

          <Link
            to="/find-for-me"
            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>Match</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <ClerkAuthControls />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 border border-gray-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <div className="p-3 bg-gray-50 rounded-xl mb-3 flex items-center justify-between">
            <div className="text-xs">
              <p className="font-bold text-black">{user?.fullName || 'Student Account'}</p>
              <p className="text-[11px] text-gray-500">{user?.level || 'Undergraduate'} • {user?.score}% Marks</p>
            </div>
            <button
              onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
              className="text-[10px] font-bold px-2 py-1 bg-black text-white rounded-lg"
            >
              Switch Role
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  p-3 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors
                  ${isActive ? 'bg-black text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}
                `}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-center rounded-xl text-xs font-semibold text-black block"
            >
              Edit Profile
            </Link>
            <Link
              to="/global-scholarships"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 bg-black hover:bg-gray-800 text-center rounded-xl text-xs font-semibold text-white block"
            >
              Global Directory
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

