import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Search, ShieldCheck, ArrowRight, CheckCircle2, 
  Building2, Globe, Landmark, GraduationCap, Award, Lock, BookOpen
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { useAuth } from '../context/AuthContext';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { ScholarshipDetailModal } from '../components/ScholarshipDetailModal';
import { Scholarship } from '../types/scholarship';

export const Landing: React.FC = () => {
  const { scholarships } = useSynora();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explorer?search=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    {
      title: 'Central Government Schemes',
      caption: 'NSP, Ministry of Education, Social Justice',
      count: scholarships.filter(s => s.category === 'CENTRAL').length,
      category: 'CENTRAL',
      icon: Landmark
    },
    {
      title: 'State Domicile Schemes',
      caption: 'MahaDBT Maharashtra, SSP Karnataka & more',
      count: scholarships.filter(s => s.category === 'STATE').length,
      category: 'STATE',
      icon: Building2
    },
    {
      title: 'Private & Foundation Grants',
      caption: 'Reliance Foundation, Tata Trusts, Corporate CSR',
      count: scholarships.filter(s => s.category === 'PRIVATE').length,
      category: 'PRIVATE',
      icon: Award
    },
    {
      title: 'International Fellowships',
      caption: 'DAAD Germany, Chevening UK, Erasmus Mundus',
      count: scholarships.filter(s => s.category === 'INTERNATIONAL').length,
      category: 'INTERNATIONAL',
      icon: Globe
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-black text-xs font-semibold mb-6 border border-gray-200">
          <ShieldCheck size={14} className="text-black" />
          <span>Official Verified Sources Only • Zero Synthetic Schemes</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black max-w-5xl mx-auto leading-[1.08]">
          Find Verified Scholarships <br className="hidden sm:inline" />
          Matched Exactly To <span className="underline decoration-2 underline-offset-8">You</span>.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          SYNORA uses a transparent, deterministic eligibility engine to cross-reference your exact academic marks, state domicile, and income against verified government & foundation records.
        </p>

        {/* Action Buttons & Quick Search */}
        <div className="mt-10 max-w-xl mx-auto space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-sm">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes (e.g. NSP Central Sector, Reliance, DAAD)..."
              className="w-full pl-11 pr-28 py-3.5 bg-white border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/global-scholarships"
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Globe size={16} className="text-emerald-400" />
              <span>🌍 Global Scholarships & Required Exams</span>
            </Link>
            <Link
              to="/find-for-me"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Sparkles size={16} />
              <span>Personalized Match (Find For Me)</span>
            </Link>
          </div>
        </div>

        {/* Student Quick Match Bar */}
        <div className="mt-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="text-xs font-bold text-black">Active Student: {user?.fullName}</p>
              <p className="text-[11px] text-gray-500">
                {user?.level} • {user?.score}% Marks • {user?.state} • ₹{(user?.annualIncome || 0).toLocaleString('en-IN')}/yr
              </p>
            </div>
          </div>

          <Link
            to="/find-for-me"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1 shrink-0"
          >
            Run Eligibility Check →
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Verified Categorization</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-1">Browse by Jurisdiction & Provider</h2>
          </div>
          <Link to="/explorer" className="text-xs font-bold text-black hover:underline flex items-center gap-1">
            View All in Explorer <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/explorer?category=${cat.category}`}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-black transition-all hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-black mb-4">
                  <cat.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-black group-hover:text-black mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {cat.caption}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>{cat.count} verified schemes</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Verified Scholarships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Hand-Picked & Verified</span>
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-1">Key National & Global Opportunities</h2>
          </div>
          <Link to="/explorer" className="text-xs font-bold text-black hover:underline flex items-center gap-1">
            See all {scholarships.length} scholarships <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.slice(0, 3).map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onSelect={(s) => setSelectedScholarship(s)}
            />
          ))}
        </div>
      </section>

      {/* Transparency & Zero-Hallucination Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative">
          <div className="max-w-3xl relative z-10 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              The SYNORA Commitment
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              100% Rule-Based Integrity.<br />
              No Guesswork, No Synthetic Deadlines.
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Unlike generic AI tools that hallucinate expired schemes and fictional requirements, SYNORA relies strictly on indexed official guidelines from central ministries, state portals, and recognized endowments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-medium">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Deterministic rules evaluate percentage, income, and state.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct outbound links to official application portals (.gov.in, .org).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Full application tracking with deadline alert countdowns.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/find-for-me"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-black text-xs font-bold rounded-xl transition-transform active:scale-95"
              >
                Match With My Profile
              </Link>
              <Link
                to="/guide"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition-colors"
              >
                Chat with Synora Guide AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
};
