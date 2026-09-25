import React, { useState } from 'react';
import { 
  X, CheckCircle2, Bookmark, BookmarkCheck, ExternalLink, 
  Calendar, FileText, Award, Building2, Landmark, GraduationCap, AlertCircle, ArrowUpRight, Clock
} from 'lucide-react';
import { Scholarship } from '../types/scholarship';
import { useSynora } from '../context/SynoraContext';
import { getDeadlineStatus } from '../lib/deadlineTracker';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onTrackApplication?: (scholarship: Scholarship) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onTrackApplication
}) => {
  const { isScholarshipSaved, toggleSaveScholarship, getApplicationByScholarshipId, startTrackingApplication } = useSynora();
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'procedure'>('overview');

  if (!scholarship) return null;

  const isSaved = isScholarshipSaved(scholarship.id);
  const existingApp = getApplicationByScholarshipId(scholarship.id);
  const deadlineInfo = getDeadlineStatus(scholarship.deadline);

  const handleToggleSave = () => {
    toggleSaveScholarship(scholarship);
  };

  const handleStartTrack = () => {
    if (onTrackApplication) {
      onTrackApplication(scholarship);
    } else {
      startTrackingApplication(scholarship);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-black text-white uppercase tracking-wider">
                {scholarship.category}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${deadlineInfo.badgeColor} flex items-center gap-1`}>
                <Clock size={11} /> {deadlineInfo.label}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-600" /> Verified {scholarship.lastVerifiedAt}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
              {scholarship.name}
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 font-medium">
              <Building2 size={15} className="text-gray-400 shrink-0" />
              <span>{scholarship.provider}</span>
              <span>•</span>
              <span>{scholarship.country} {scholarship.state && scholarship.state !== 'All India' ? `(${scholarship.state})` : ''}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-200 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-8 border-b border-gray-200 flex items-center gap-2 overflow-x-auto bg-white">
          {[
            { id: 'overview', label: 'Overview & Benefits' },
            { id: 'eligibility', label: 'Eligibility Rules' },
            { id: 'documents', label: 'Required Documents' },
            { id: 'procedure', label: 'Application Steps' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-800">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h3>
                <p className="text-sm leading-relaxed text-gray-700">{scholarship.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Scholarship Award</span>
                  <span className="text-lg font-bold text-black">{scholarship.amountPerYear ? `₹${scholarship.amountPerYear.toLocaleString('en-IN')}/yr` : 'Full Coverage'}</span>
                  <p className="text-[11px] text-gray-500 mt-1">{scholarship.fundingType.replace('_', ' ')}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Minimum Marks</span>
                  <span className="text-lg font-bold text-black">{scholarship.minimumMarks ? `${scholarship.minimumMarks}%` : 'Merit Evaluated'}</span>
                  <p className="text-[11px] text-gray-500 mt-1">Previous qualifying exam</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Income Ceiling</span>
                  <span className="text-lg font-bold text-black">{scholarship.incomeLimit ? `₹${scholarship.incomeLimit.toLocaleString('en-IN')}` : 'No Income Cap'}</span>
                  <p className="text-[11px] text-gray-500 mt-1">Annual family income</p>
                </div>
              </div>

              <div className="p-5 bg-black text-white rounded-2xl">
                <div className="flex items-start gap-3">
                  <Award size={22} className="text-white shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">Comprehensive Grant Benefits</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{scholarship.benefits}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-5">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Official Eligibility Parameters</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1">Applicable Education Levels</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scholarship.educationLevels.map(lvl => (
                        <span key={lvl} className="px-2 py-1 bg-white rounded-lg border border-gray-200 font-semibold text-black">
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Course & Discipline</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scholarship.applicableCourses.map(c => (
                        <span key={c} className="px-2 py-1 bg-white rounded-lg border border-gray-200 font-medium text-gray-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Domicile / Regional Requirement</span>
                    <p className="font-semibold text-black">{scholarship.state || scholarship.country || 'All India'}</p>
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Gender Specification</span>
                    <p className="font-semibold text-black">{scholarship.genderCriteria === 'All' ? 'Open to All Genders' : `Exclusively for ${scholarship.genderCriteria}`}</p>
                  </div>
                </div>
              </div>

              {scholarship.requiredExams && scholarship.requiredExams.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertCircle size={15} /> Required Examination / Aptitude Test
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {scholarship.requiredExams.map((ex, idx) => (
                      <li key={idx} className="flex items-center justify-between font-medium">
                        <span>• {ex.examName}</span>
                        {ex.minScore && <span className="font-bold">Min Score: {ex.minScore}%</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Ensure all documents are original or officially attested clear PDF scans before uploading on the application portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scholarship.requiredDocuments.map((doc, index) => (
                  <div key={index} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                    <FileText size={16} className="text-gray-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-gray-800 leading-snug">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'procedure' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Step-by-Step Official Procedure</h4>
              <ol className="space-y-3">
                {scholarship.applicationProcedure.map((step, index) => (
                  <li key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSaved 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-800 border-gray-200 hover:border-black'
              }`}
            >
              {isSaved ? <BookmarkCheck size={16} className="text-white" /> : <Bookmark size={16} />}
              <span>{isSaved ? 'Saved in Shortlist' : 'Save for Later'}</span>
            </button>

            <button
              onClick={handleStartTrack}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                existingApp 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-gray-800 border-gray-200 hover:border-black'
              }`}
            >
              <CheckCircle2 size={16} className={existingApp ? 'text-emerald-600' : 'text-gray-400'} />
              <span>{existingApp ? `Tracked: ${existingApp.status.replace('_', ' ')}` : 'Track Application'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={scholarship.officialWebsite}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:text-black border border-gray-200 hover:bg-gray-100 rounded-xl flex items-center gap-1 transition-colors"
            >
              <span>Scheme Portal</span>
              <ExternalLink size={13} />
            </a>

            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <span>Apply on Official Portal</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
