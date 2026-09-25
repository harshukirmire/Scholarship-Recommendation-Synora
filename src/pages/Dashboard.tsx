import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, Bookmark, Briefcase, Bot, 
  ArrowRight, ArrowUpRight, Clock, User, ShieldCheck, FileText, ChevronRight, Plus
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { useAuth } from '../context/AuthContext';
import { calculateEligibility } from '../lib/matchingEngine';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardDeadlines } from '../components/DashboardDeadlines';
import { ScholarshipDetailModal } from '../components/ScholarshipDetailModal';
import { Scholarship } from '../types/scholarship';
import { SynoraGuide } from '../components/SynoraGuide';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { scholarships, savedScholarships, applications, updateApplicationStatus } = useSynora();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Top eligible recommendations
  const topRecommendations = useMemo(() => {
    if (!user) return [];
    return scholarships
      .map(s => ({ scholarship: s, report: calculateEligibility(user, s) }))
      .filter(item => item.report.isEligible)
      .slice(0, 3);
  }, [scholarships, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner & Profile Strength Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Student Command Center</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified Profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Welcome back, {user?.fullName || 'Scholar'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {user?.course || 'Undergraduate'} • {user?.institution || 'Enrolled College'} • Domicile: {user?.state}
          </p>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Profile Strength</span>
            <span className="text-lg font-black text-black">{user?.onboardingComplete ? '100%' : '70%'} Complete</span>
            <span className="text-[11px] text-gray-400 block">{user?.score}% Academic Score</span>
          </div>

          <Link
            to="/profile"
            className="w-12 h-12 rounded-2xl bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center font-bold text-base shadow-sm"
            title="Edit Profile"
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <DashboardStats />

      {/* Main Grid: Left Column (Recommendations & Applications), Right Column (Deadlines & Guide) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Recommendations */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-black flex items-center gap-2">
                  <Sparkles size={20} className="text-emerald-500" />
                  Recommended For You
                </h2>
                <p className="text-xs text-gray-500">Verified schemes matching your marks, state, and income limit</p>
              </div>

              <Link
                to="/find-for-me"
                className="text-xs font-bold text-black hover:underline flex items-center gap-1"
              >
                View all matches ({topRecommendations.length}) <ArrowRight size={13} />
              </Link>
            </div>

            {topRecommendations.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-xs font-semibold text-gray-600">No immediate 100% matches found with current score.</p>
                <Link to="/find-for-me" className="text-xs font-bold text-black underline mt-1 block">
                  Check partially matching opportunities →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {topRecommendations.map(({ scholarship, report }) => (
                  <div
                    key={scholarship.id}
                    onClick={() => setSelectedScholarship(scholarship)}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-black transition-all bg-gray-50/50 hover:bg-white cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                          {scholarship.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                          100% Match
                        </span>
                      </div>
                      
                      <h3 className="text-sm sm:text-base font-bold text-black group-hover:underline">
                        {scholarship.name}
                      </h3>
                      
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {scholarship.provider} • Benefit: {scholarship.benefits}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Review <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Application Tracker Widget */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-black flex items-center gap-2">
                  <Briefcase size={20} className="text-black" />
                  Application Progress
                </h2>
                <p className="text-xs text-gray-500">Live tracker for your ongoing scholarship submissions</p>
              </div>

              <Link
                to="/applications"
                className="text-xs font-bold text-black hover:underline flex items-center gap-1"
              >
                Manage All ({applications.length}) <ArrowRight size={13} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <Briefcase size={26} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-700">No applications currently tracked</p>
                <p className="text-[11px] text-gray-400 mt-0.5 mb-3">Add any scholarship to monitor drafts, dates, and verification.</p>
                <Link
                  to="/explorer"
                  className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 bg-black text-white rounded-xl"
                >
                  Start Tracking
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                          {app.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-black">{app.scholarshipName}</h4>
                      <p className="text-xs text-gray-500">{app.provider} • Ref: {app.referenceNumber || 'Drafting'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                        className="text-xs font-bold bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                      >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <a
                        href={app.officialPortalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 hover:text-black transition-colors"
                        title="Open Official Portal"
                      >
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Synora Guide AI Widget Box */}
          <div className="bg-black text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Bot size={22} />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Need Guidance? Ask Synora AI
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Personalized answers strictly backed by verified schemes in our database. Never invents deadlines or criteria.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 relative z-10 flex flex-col gap-2">
              <Link
                to="/guide"
                className="w-full py-2.5 bg-white text-black hover:bg-gray-100 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Launch Synora Guide</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <DashboardDeadlines onSelectScholarship={(s) => setSelectedScholarship(s)} />

          {/* Quick Official Portal Links */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-black flex items-center gap-2">
              <ShieldCheck size={16} /> Official Government Portals
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a 
                  href="https://scholarships.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-black border border-transparent hover:border-gray-200 transition-all"
                >
                  <span>National Scholarship Portal (NSP)</span>
                  <ArrowUpRight size={13} className="text-gray-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://mahadbt.maharashtra.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-black border border-transparent hover:border-gray-200 transition-all"
                >
                  <span>MahaDBT State Portal</span>
                  <ArrowUpRight size={13} className="text-gray-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://scholarships.reliancefoundation.org" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-black border border-transparent hover:border-gray-200 transition-all"
                >
                  <span>Reliance Foundation Portal</span>
                  <ArrowUpRight size={13} className="text-gray-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>

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
