import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, XCircle, AlertCircle, 
  ArrowRight, Sliders, ExternalLink, FileText, Award, Clock, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { useAuth } from '../context/AuthContext';
import { calculateEligibility, EligibilityReport } from '../lib/matchingEngine';
import { Scholarship } from '../types/scholarship';
import { ScholarshipDetailModal } from '../components/ScholarshipDetailModal';
import { getDeadlineStatus } from '../lib/deadlineTracker';

export const FindForMe: React.FC = () => {
  const { scholarships, isScholarshipSaved, toggleSaveScholarship, startTrackingApplication, getApplicationByScholarshipId } = useSynora();
  const { user, updateProfile } = useAuth();

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [filterView, setFilterView] = useState<'all' | 'eligible' | 'almost'>('all');
  const [quickEditOpen, setQuickEditOpen] = useState(false);

  // Quick tweak state
  const [tempScore, setTempScore] = useState(user?.score || 80);
  const [tempState, setTempState] = useState(user?.state || 'Maharashtra');
  const [tempLevel, setTempLevel] = useState(user?.level || 'Undergraduate');
  const [tempIncome, setTempIncome] = useState(user?.annualIncome || 350000);

  const applyQuickEdit = () => {
    updateProfile({
      score: Number(tempScore),
      state: tempState,
      level: tempLevel as any,
      annualIncome: Number(tempIncome)
    });
    setQuickEditOpen(false);
  };

  // Run matching engine deterministically for each verified scholarship
  const matchResults = useMemo(() => {
    if (!user) return [];
    return scholarships.map(scholarship => {
      const report = calculateEligibility(user, scholarship);
      return { scholarship, report };
    });
  }, [scholarships, user]);

  const eligibleList = useMemo(() => {
    return matchResults.filter(r => r.report.isEligible);
  }, [matchResults]);

  const almostEligibleList = useMemo(() => {
    return matchResults.filter(r => r.report.status === 'ALMOST_ELIGIBLE');
  }, [matchResults]);

  const displayedResults = useMemo(() => {
    if (filterView === 'eligible') return eligibleList;
    if (filterView === 'almost') return almostEligibleList;
    return matchResults.filter(r => r.report.status !== 'NOT_ELIGIBLE');
  }, [matchResults, eligibleList, almostEligibleList, filterView]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold border border-white/15">
            <Sparkles size={14} />
            <span>Deterministic Rule-Based Matching Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Find Scholarships For Me
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Every scholarship here has been checked against your active profile criteria: education level, marks percentage, domicile state, and family income limit.
          </p>

          {/* Active Profile Pill and Quick Tweak */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-white">
              <span className="font-bold">{user?.fullName}</span>
              <span className="text-gray-400">•</span>
              <span>{user?.level}</span>
              <span className="text-gray-400">•</span>
              <span className="font-bold text-emerald-400">{user?.score}% Marks</span>
              <span className="text-gray-400">•</span>
              <span>{user?.state}</span>
              <span className="text-gray-400">•</span>
              <span>₹{(user?.annualIncome || 0).toLocaleString('en-IN')}/yr</span>
            </div>

            <button
              onClick={() => setQuickEditOpen(!quickEditOpen)}
              className="px-3.5 py-2 bg-white text-black text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
            >
              <Sliders size={14} />
              <span>{quickEditOpen ? 'Close Editor' : 'Tweak Parameters'}</span>
            </button>

            <Link
              to="/profile"
              className="text-xs text-gray-300 hover:text-white underline underline-offset-4"
            >
              Edit Full Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Parameter Adjuster Dropdown */}
      {quickEditOpen && (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 animate-fadeIn space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black flex items-center gap-2">
              <Sliders size={16} /> Test Different Academic & Financial Profiles
            </h3>
            <span className="text-xs text-gray-500">Matches update instantaneously</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Marks / Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={tempScore}
                onChange={(e) => setTempScore(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">State of Domicile</label>
              <select
                value={tempState}
                onChange={(e) => setTempState(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="All India">All India</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Education Level</label>
              <select
                value={tempLevel}
                onChange={(e) => setTempLevel(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 12">Class 12</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Annual Family Income (INR)</label>
              <input
                type="number"
                step="50000"
                value={tempIncome}
                onChange={(e) => setTempIncome(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setQuickEditOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={applyQuickEdit}
              className="px-5 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800"
            >
              Apply & Re-evaluate
            </button>
          </div>
        </div>
      )}

      {/* Tabs for Filter View */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterView('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterView === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Compatible Schemes ({eligibleList.length + almostEligibleList.length})
          </button>
          
          <button
            onClick={() => setFilterView('eligible')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filterView === 'eligible'
                ? 'bg-black text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>100% Eligible ({eligibleList.length})</span>
          </button>

          {almostEligibleList.length > 0 && (
            <button
              onClick={() => setFilterView('almost')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                filterView === 'almost'
                  ? 'bg-black text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertCircle size={13} />
              <span>Close Matches ({almostEligibleList.length})</span>
            </button>
          )}
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Deterministic checks: Marks • Income • State • Level
        </span>
      </div>

      {/* Results List */}
      {displayedResults.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-200 rounded-3xl space-y-4">
          <HelpCircle size={40} className="mx-auto text-gray-300" />
          <h3 className="text-xl font-bold text-black">No matching scholarships for current profile criteria</h3>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            Try tweaking your income limit or state parameters above, or review the general directory in the Explorer.
          </p>
          <Link
            to="/explorer"
            className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl"
          >
            Browse All Scholarships
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedResults.map(({ scholarship, report }) => {
            const isSaved = isScholarshipSaved(scholarship.id);
            const activeApp = getApplicationByScholarshipId(scholarship.id);
            const deadlineInfo = getDeadlineStatus(scholarship.deadline);

            return (
              <div
                key={scholarship.id}
                className="bg-white border-2 border-gray-200 hover:border-black rounded-3xl overflow-hidden transition-all shadow-sm"
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                          {scholarship.category}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          report.isEligible 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        } flex items-center gap-1`}>
                          {report.isEligible ? <CheckCircle2 size={13} className="text-emerald-700" /> : <AlertCircle size={13} />}
                          <span>{report.isEligible ? '100% Eligible' : 'Partially Eligible'}</span>
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${deadlineInfo.badgeColor}`}>
                          {deadlineInfo.label}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-black">
                        {scholarship.name}
                      </h2>

                      <p className="text-xs text-gray-500 font-medium">
                        {scholarship.provider} • {scholarship.country} {scholarship.state && scholarship.state !== 'All India' ? `(${scholarship.state})` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleSaveScholarship(scholarship)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                          isSaved 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                        }`}
                      >
                        {isSaved ? '★ Saved' : '☆ Save'}
                      </button>

                      <button
                        onClick={() => startTrackingApplication(scholarship)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                          activeApp 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                        }`}
                      >
                        {activeApp ? `Tracked (${activeApp.status})` : '+ Track App'}
                      </button>
                    </div>
                  </div>

                  {/* Why you match vs Missing Requirements breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    {/* Why You Match */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Why You Are Eligible ({report.matchedCriteria.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {report.matchedCriteria.map((item, idx) => (
                          <li key={idx} className="text-xs text-emerald-950 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing criteria if any */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        {report.missingCriteria.length > 0 ? (
                          <>
                            <AlertCircle size={14} className="text-amber-600" />
                            Unmet / Additional Requirements ({report.missingCriteria.length})
                          </>
                        ) : (
                          <>
                            <Award size={14} className="text-black" />
                            Scheme Highlights
                          </>
                        )}
                      </h4>
                      {report.missingCriteria.length > 0 ? (
                        <ul className="space-y-1.5">
                          {report.missingCriteria.map((item, idx) => (
                            <li key={idx} className="text-xs text-amber-950 flex items-start gap-2 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          All mandatory academic, income, and domicile criteria are fully satisfied by your profile.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Documents and Exams Requirement Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Key Required Documents
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {scholarship.requiredDocuments.slice(0, 3).map((d, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-800 font-medium">
                            {d}
                          </span>
                        ))}
                        {scholarship.requiredDocuments.length > 3 && (
                          <span className="px-2 py-1 text-gray-400 font-medium">
                            +{scholarship.requiredDocuments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Exams & Scores
                      </span>
                      {report.requiredExams.length > 0 ? (
                        <div className="space-y-1">
                          {report.requiredExams.map((ex, i) => (
                            <p key={i} className="font-semibold text-black">
                              • {ex}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No external entrance exam required (Direct merit evaluation)</p>
                      )}
                    </div>
                  </div>

                  {/* Footer of Card */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Grant Amount</span>
                        <span className="text-sm sm:text-base font-bold text-black">{scholarship.benefits.split('.')[0]}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Target Deadline</span>
                        <span className="text-sm font-semibold text-gray-800">{scholarship.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedScholarship(scholarship)}
                        className="px-4 py-2 text-xs font-bold text-gray-800 hover:text-black border border-gray-200 hover:border-black rounded-xl transition-colors"
                      >
                        View Full Details
                      </button>

                      <a
                        href={scholarship.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <span>Apply on Official Portal</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
