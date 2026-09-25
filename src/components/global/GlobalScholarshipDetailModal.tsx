import React, { useState } from 'react';
import { 
  X, CheckCircle2, Building2, Globe, Calendar, Clock, 
  ExternalLink, ArrowUpRight, Award, FileText, AlertCircle, BookOpen, ShieldCheck, Check
} from 'lucide-react';
import { GlobalScholarship } from '../../types/globalScholarships';

interface GlobalScholarshipDetailModalProps {
  scholarship: GlobalScholarship | null;
  onClose: () => void;
  onSelectExam?: (examName: string) => void;
}

export const GlobalScholarshipDetailModal: React.FC<GlobalScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onSelectExam
}) => {
  const [activeTab, setActiveTab] = useState<'exam' | 'overview' | 'requirements' | 'procedure'>('exam');

  if (!scholarship) return null;

  const { examRequirement } = scholarship;

  const renderExamStatusBadge = () => {
    switch (examRequirement.examStatus) {
      case 'SCHOLARSHIP_EXAM_REQUIRED':
        return {
          icon: '🔵',
          title: 'EXAM REQUIRED (SCHOLARSHIP TEST)',
          color: 'bg-blue-50 text-blue-950 border-blue-200',
          directAnswer: 'YES — A dedicated competitive examination is directly administered for this scholarship. You must qualify in this test to be awarded funding.'
        };
      case 'ADMISSION_EXAM_REQUIRED':
        return {
          icon: '🟣',
          title: 'ADMISSION EXAM REQUIRED (UNIVERSITY ENTRANCE)',
          color: 'bg-purple-50 text-purple-950 border-purple-200',
          directAnswer: 'ADMISSION EXAMINATION — Not a separate scholarship examination. The examination is required for university/program admission, and the scholarship is awarded upon qualifying for admission.'
        };
      case 'LANGUAGE_TEST_REQUIRED':
        return {
          icon: '🟠',
          title: 'LANGUAGE PROFICIENCY TEST MANDATORY',
          color: 'bg-amber-50 text-amber-950 border-amber-200',
          directAnswer: 'YES — An official language test (e.g. IELTS / TOEFL / PTE) is required at the time of application as a mandatory compliance prerequisite.'
        };
      case 'NO_SEPARATE_EXAM':
        return {
          icon: '🟢',
          title: 'NO SEPARATE SCHOLARSHIP EXAM',
          color: 'bg-emerald-50 text-emerald-950 border-emerald-200',
          directAnswer: 'NO SEPARATE SCHOLARSHIP EXAM. Selection is based strictly on the scholarship stated eligibility, prior academic credentials, research proposal/statement, documents, admission status, or interview.'
        };
      case 'CONDITIONAL_EXAM':
        return {
          icon: '🟡',
          title: 'EXAM DEPENDS ON PROGRAM / UNIVERSITY',
          color: 'bg-amber-50 text-amber-950 border-amber-200',
          directAnswer: 'CONDITIONAL REQUIREMENT. The scholarship granting body itself does not hold a universal exam. Written tests or language qualifications (such as HSK, IELTS, or entrance interviews) depend entirely on the host university and specific degree program chosen.'
        };
      default:
        return {
          icon: '⚪',
          title: 'REQUIREMENT NOT VERIFIED',
          color: 'bg-gray-50 text-gray-950 border-gray-200',
          directAnswer: 'Exam requirement cannot be confirmed from official publications at this time.'
        };
    }
  };

  const examBadge = renderExamStatusBadge();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/80 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-black text-white uppercase tracking-wider">
                {scholarship.country}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-200 text-gray-800">
                {scholarship.continent}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-600" />
                Officially Verified ({scholarship.lastVerifiedDate})
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
              {scholarship.name}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 font-medium">
              <Building2 size={15} className="text-gray-400 shrink-0" />
              <span>{scholarship.provider}</span>
              <span>•</span>
              <span>{scholarship.providerType}</span>
              <span>•</span>
              <span>Level: {scholarship.studyLevels.join(', ')}</span>
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
            { id: 'exam', label: '🎯 Required Exam / Test' },
            { id: 'overview', label: 'Overview & Coverage' },
            { id: 'requirements', label: 'Official Eligibility Requirements' },
            { id: 'procedure', label: 'Application Process' },
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

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-800">
          
          {/* TAB 1: 🎯 EXAM / TEST REQUIREMENTS */}
          {activeTab === 'exam' && (
            <div className="space-y-6">
              
              {/* Question & Direct Answer Box */}
              <div className={`p-6 rounded-3xl border ${examBadge.color} space-y-3`}>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                  <span>Question:</span>
                  <span className="font-extrabold text-black">"Do I need to take an exam to get this scholarship?"</span>
                </div>

                <div className="text-base sm:text-lg font-black text-black flex items-center gap-2">
                  <span>{examBadge.icon}</span>
                  <span>{examBadge.title}</span>
                </div>

                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {examBadge.directAnswer}
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Exam Relationship & Mechanics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1">Primary Exam / Test Name</span>
                    <p className="font-bold text-black text-sm">
                      {examRequirement.primaryExamName || 'None'}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Examination Category</span>
                    <p className="font-bold text-black text-sm">
                      {examRequirement.examType.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block mb-1">Why is this examination required?</span>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {examRequirement.relationshipExplanation}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block mb-1">Purpose & Assessment Target</span>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {examRequirement.purpose}
                    </p>
                  </div>

                  {examRequirement.minimumScore && (
                    <div className="sm:col-span-2 p-3 bg-white border border-gray-200 rounded-xl">
                      <span className="text-gray-400 font-bold block mb-0.5">Officially Stated Minimum Score</span>
                      <p className="font-bold text-black text-xs">
                        {examRequirement.minimumScore}
                      </p>
                    </div>
                  )}

                  {examRequirement.acceptedAlternativeExams && examRequirement.acceptedAlternativeExams.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block mb-1">Recognized Alternatives / Standardized Tests</span>
                      <div className="flex flex-wrap gap-2">
                        {examRequirement.acceptedAlternativeExams.map((alt, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800">
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {examRequirement.officialExamWebsite && (
                  <div className="pt-2 border-t border-gray-200">
                    <a
                      href={examRequirement.officialExamWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1"
                    >
                      <span>Visit Official Examination Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Verified Source Disclaimer */}
              <div className="p-4 bg-gray-100 rounded-2xl text-[11px] text-gray-600 flex items-start gap-2">
                <ShieldCheck size={16} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">Verified Scheme Source Note: </span>
                  <span>{examRequirement.verifiedSourceNote}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & COVERAGE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Funding Classification</span>
                  <span className="text-base font-bold text-black">{scholarship.fundingType}</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">{scholarship.amountOrAllowance || 'Tuition + Subsidy'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Target Study Level</span>
                  <span className="text-base font-bold text-black">{scholarship.studyLevels.join(', ')}</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">{scholarship.degreesOffered.join(' • ')}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Target Deadline</span>
                  <span className="text-base font-bold text-black">{scholarship.applicationDeadlineText}</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">Cycle: {scholarship.applicationPeriod}</p>
                </div>
              </div>

              <div className="p-5 bg-black text-white rounded-3xl space-y-2">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-emerald-400" />
                  <h4 className="text-sm font-bold">Funding Package Coverage</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                  {scholarship.fundingCoverageSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Applicable Fields of Study</h4>
                <div className="flex flex-wrap gap-2">
                  {scholarship.fieldsOfStudy.map((f, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-xl text-xs font-medium text-gray-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium">
                <strong>Public Directory Notice:</strong> These are the official non-personalized criteria stipulated by the scheme guidelines. No personal score matching is applied.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">Academic Qualifications</span>
                  <p className="text-gray-800 leading-relaxed font-medium">{scholarship.academicCriteriaSummary}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">Language Competence</span>
                  <p className="text-gray-800 leading-relaxed font-medium">{scholarship.languageRequirementsSummary}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">Admission / Institutional Prerequisite</span>
                  <p className="text-gray-800 leading-relaxed font-medium">{scholarship.admissionPrerequisites}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">Nationality & Citizenship</span>
                  <p className="text-gray-800 leading-relaxed font-medium">{scholarship.nationalityEligibility}</p>
                </div>

                {scholarship.ageRestrictions && (
                  <div className="sm:col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="font-bold text-gray-400 uppercase tracking-wider block">Age Specifications</span>
                    <p className="text-gray-800 leading-relaxed font-medium">{scholarship.ageRestrictions}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Mandatory Dossier Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scholarship.mandatoryDocuments.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5">
                      <FileText size={15} className="text-gray-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-gray-800 leading-snug">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROCEDURE */}
          {activeTab === 'procedure' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Step-by-Step Official Application Flow</h4>
              <ol className="space-y-3">
                {scholarship.applicationProcedureOverview.map((step, idx) => (
                  <li key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
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

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-medium">
            <span>Verified Source: </span>
            <a href={scholarship.officialSourceUrl} target="_blank" rel="noreferrer" className="text-black font-semibold hover:underline">
              Official Guidelines Link <ExternalLink size={11} className="inline ml-0.5" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={scholarship.officialScholarshipWebsite}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-black border border-gray-200 hover:bg-gray-100 rounded-xl flex items-center gap-1 transition-colors"
            >
              <span>Program Website</span>
              <ExternalLink size={13} />
            </a>

            <a
              href={scholarship.officialApplicationPortalUrl}
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
};
