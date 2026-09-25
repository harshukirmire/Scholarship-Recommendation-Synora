import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-base">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-white">SYNORA</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              The verified national and international scholarship intelligence platform. Guaranteed zero synthetic or unverified scholarship listings.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck size={14} />
              <span>Official Government & Trust Verified</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Core Navigation</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link to="/global-scholarships" className="hover:text-white transition-colors text-emerald-400 font-semibold">🌍 Global Scholarships & Required Exams</Link></li>
              <li><Link to="/find-for-me" className="hover:text-white transition-colors">Find For Me (Rule-Based Match)</Link></li>
              <li><Link to="/explorer" className="hover:text-white transition-colors">Scheme Explorer</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/applications" className="hover:text-white transition-colors">Application Progress Tracker</Link></li>
              <li><Link to="/saved" className="hover:text-white transition-colors">Saved Deadlines & Alerts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Official Portals Connected</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  National Scholarship Portal (NSP) <ExternalLink size={11} className="text-gray-500" />
                </a>
              </li>
              <li>
                <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  MahaDBT State Portal <ExternalLink size={11} className="text-gray-500" />
                </a>
              </li>
              <li>
                <a href="https://scholarships.reliancefoundation.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Reliance Foundation Portal <ExternalLink size={11} className="text-gray-500" />
                </a>
              </li>
              <li>
                <a href="https://www.daad.de" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  DAAD German Academic Exchange <ExternalLink size={11} className="text-gray-500" />
                </a>
              </li>
              <li>
                <a href="https://www.chevening.org" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  UK Chevening FCDO Portal <ExternalLink size={11} className="text-gray-500" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Security & Verification</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Deterministic rule engine ensures complete eligibility transparency.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock size={16} className="text-white shrink-0 mt-0.5" />
                <span>Client-side persistent storage safeguards your personal and academic data.</span>
              </div>
              <div className="pt-2">
                <Link to="/admin" className="text-xs text-gray-300 hover:text-white underline underline-offset-4">
                  Access Admin Verification Console →
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 SYNORA Platform. Built with desktop-first responsive design.</p>
          <div className="flex items-center gap-6">
            <span>Official Portal Verification Only</span>
            <span>Zero Synthetic Hallucinations</span>
            <span className="text-white font-medium">Desktop Web Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
