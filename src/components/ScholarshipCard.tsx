import React from 'react';
import { 
  CheckCircle2, Bookmark, BookmarkCheck, ExternalLink, 
  Calendar, Clock, Building2, ArrowUpRight, Award, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Scholarship } from '../types/scholarship';
import { useSynora } from '../context/SynoraContext';
import { getDeadlineStatus } from '../lib/deadlineTracker';
import { EligibilityReport } from '../lib/matchingEngine';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onSelect: (scholarship: Scholarship) => void;
  matchReport?: EligibilityReport;
  showMatchDetails?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onSelect,
  matchReport,
  showMatchDetails = false
}) => {
  const { isScholarshipSaved, toggleSaveScholarship, getApplicationByScholarshipId, startTrackingApplication } = useSynora();
  const isSaved = isScholarshipSaved(scholarship.id);
  const deadlineInfo = getDeadlineStatus(scholarship.deadline);
  const activeApp = getApplicationByScholarshipId(scholarship.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveScholarship(scholarship);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTrackingApplication(scholarship);
  };

  return (
    <div 
      onClick={() => onSelect(scholarship)}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-black p-5 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between relative"
    >
      <div>
        {/* Card Header: Category & Deadline */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase tracking-wider">
              {scholarship.category}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {scholarship.country} {scholarship.state && scholarship.state !== 'All India' ? `• ${scholarship.state}` : ''}
            </span>
            {scholarship.verified && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                <CheckCircle2 size={10} className="text-emerald-600" /> Verified
              </span>
            )}
          </div>

          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-xl transition-colors border ${
              isSaved 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-400 hover:text-black border-gray-200 hover:border-black'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Scholarship'}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Title and Provider */}
        <h3 className="text-base sm:text-lg font-bold text-black group-hover:text-black leading-snug mb-1 line-clamp-2">
          {scholarship.name}
        </h3>
        
        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-3">
          <Building2 size={13} className="text-gray-400 shrink-0" />
          <span className="line-clamp-1">{scholarship.provider}</span>
        </p>

        {/* Benefit Highlight */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Benefit</span>
          <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-relaxed">
            {scholarship.benefits}
          </p>
        </div>

        {/* Requirements Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-4">
          {scholarship.minimumMarks !== undefined && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              Min Marks: <strong>{scholarship.minimumMarks}%</strong>
            </span>
          )}
          {scholarship.incomeLimit !== undefined && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              Income Limit: <strong>₹{(scholarship.incomeLimit / 100000).toFixed(1)}L</strong>
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
            {scholarship.educationLevels.slice(0, 2).join(', ')}
          </span>
        </div>

        {/* Eligibility Match Breakdown (if on Find For Me) */}
        {showMatchDetails && matchReport && (
          <div className="mt-2 pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Eligibility Match</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                matchReport.isEligible 
                  ? 'bg-emerald-100 text-emerald-900' 
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {matchReport.matchScore}% Match
              </span>
            </div>

            {matchReport.matchedCriteria.slice(0, 2).map((c, i) => (
              <div key={i} className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{c}</span>
              </div>
            ))}

            {matchReport.missingCriteria.slice(0, 1).map((m, i) => (
              <div key={i} className="text-[11px] text-amber-800 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="line-clamp-1">{m}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px]">
          <span className={`font-semibold px-2 py-0.5 rounded border ${deadlineInfo.badgeColor} flex items-center gap-1`}>
            <Clock size={11} /> {deadlineInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {activeApp ? (
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {activeApp.status.replace('_', ' ')}
            </span>
          ) : (
            <button
              onClick={handleTrackClick}
              className="text-[11px] font-semibold text-gray-600 hover:text-black hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
            >
              + Track
            </button>
          )}

          <span className="text-xs font-bold text-black flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Details <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
