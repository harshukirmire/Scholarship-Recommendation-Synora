import React from 'react';
import { 
  Building2, Clock, CheckCircle2, ChevronRight, 
  GraduationCap, AlertCircle, CheckCircle, HelpCircle, FileText, Award
} from 'lucide-react';
import { GlobalScholarship } from '../../types/globalScholarships';

interface GlobalScholarshipCardProps {
  scholarship: GlobalScholarship;
  onSelect: (scholarship: GlobalScholarship) => void;
  onSelectExam?: (examName: string) => void;
}

export const GlobalScholarshipCard: React.FC<GlobalScholarshipCardProps> = ({
  scholarship,
  onSelect,
  onSelectExam
}) => {
  const { examRequirement } = scholarship;

  // Determine requirement status details
  const getExamStatusDetails = () => {
    switch (examRequirement.examStatus) {
      case 'SCHOLARSHIP_EXAM_REQUIRED':
        return {
          isRequired: 'Yes',
          badgeText: 'Scholarship Exam Required',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
          containerClass: 'bg-blue-50/60 border-blue-200',
          headerColor: 'text-blue-950',
          icon: <AlertCircle size={15} className="text-blue-600 shrink-0" />
        };
      case 'ADMISSION_EXAM_REQUIRED':
        return {
          isRequired: 'Yes (Admission Entrance)',
          badgeText: 'Entrance / Admission Exam',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
          containerClass: 'bg-purple-50/60 border-purple-200',
          headerColor: 'text-purple-950',
          icon: <GraduationCap size={15} className="text-purple-600 shrink-0" />
        };
      case 'LANGUAGE_TEST_REQUIRED':
        return {
          isRequired: 'Language Test Required',
          badgeText: 'Language Proficiency Test',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          containerClass: 'bg-amber-50/60 border-amber-200',
          headerColor: 'text-amber-950',
          icon: <FileText size={15} className="text-amber-600 shrink-0" />
        };
      case 'NO_SEPARATE_EXAM':
        return {
          isRequired: 'No Exam Required',
          badgeText: 'No Exam Required',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          containerClass: 'bg-emerald-50/60 border-emerald-200',
          headerColor: 'text-emerald-950',
          icon: <CheckCircle size={15} className="text-emerald-600 shrink-0" />
        };
      case 'CONDITIONAL_EXAM':
        return {
          isRequired: 'Conditional',
          badgeText: 'Depends on University / Major',
          badgeClass: 'bg-orange-100 text-orange-900 border-orange-300 font-bold',
          containerClass: 'bg-orange-50/60 border-orange-200',
          headerColor: 'text-orange-950',
          icon: <HelpCircle size={15} className="text-orange-600 shrink-0" />
        };
      default:
        return {
          isRequired: 'Check Details',
          badgeText: 'Verification Pending',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
          containerClass: 'bg-gray-50 border-gray-200',
          headerColor: 'text-gray-900',
          icon: <HelpCircle size={15} className="text-gray-500 shrink-0" />
        };
    }
  };

  const status = getExamStatusDetails();

  return (
    <div 
      onClick={() => onSelect(scholarship)}
      className="bg-white rounded-3xl border border-gray-200 hover:border-black p-6 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between relative group"
    >
      <div className="space-y-4">
        {/* Country, Continent & Provider Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold px-2 py-0.5 rounded bg-black text-white uppercase tracking-wider text-[10px]">
              {scholarship.country}
            </span>
            <span className="font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {scholarship.continent}
            </span>
            <span className="font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {scholarship.studyLevels.join(', ')}
            </span>
          </div>

          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-600" />
            Verified {scholarship.lastVerifiedDate}
          </span>
        </div>

        {/* Title & Provider */}
        <div>
          <h3 className="text-lg font-bold text-black group-hover:underline leading-snug">
            {scholarship.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-1.5">
            <Building2 size={13} className="text-gray-400 shrink-0" />
            <span>{scholarship.provider}</span>
            <span>•</span>
            <span className="text-gray-400">{scholarship.providerType}</span>
          </p>
        </div>

        {/* Funding Overview */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <Award size={12} className="text-amber-600" /> Funding Coverage
            </span>
            <span className="font-bold text-black px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] uppercase">
              {scholarship.fundingType}
            </span>
          </div>
          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-relaxed">
            {scholarship.fundingCoverageSummary}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🎯 EXAM REQUIRED SEPARATE SECTION                                        */}
        {/* ========================================================================= */}
        <div className={`p-4 rounded-2xl border ${status.containerClass} space-y-3`}>
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-black/10 pb-2.5">
            <div className="flex items-center gap-1.5">
              {status.icon}
              <span className={`text-xs font-black uppercase tracking-wider ${status.headerColor}`}>
                Exam Required
              </span>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${status.badgeClass}`}>
              {status.badgeText}
            </span>
          </div>

          {/* Section Body */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                Requirement:
              </span>
              <span className="font-black text-gray-900 text-right">
                {status.isRequired}
              </span>
            </div>

            {examRequirement.primaryExamName && (
              <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-black/5">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide shrink-0">
                  Target Exam:
                </span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectExam) onSelectExam(examRequirement.primaryExamName || '');
                  }}
                  className="font-bold text-black text-right underline hover:text-blue-700 transition-colors"
                >
                  {examRequirement.primaryExamName}
                </span>
              </div>
            )}

            {examRequirement.minimumScore && (
              <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-black/5 text-[11px]">
                <span className="font-bold text-gray-600 uppercase tracking-wide shrink-0">
                  Min. Score:
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {examRequirement.minimumScore}
                </span>
              </div>
            )}

            <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-2 pt-1 border-t border-black/5">
              {examRequirement.relationshipExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
          <Clock size={13} className="text-gray-400 shrink-0" />
          <span className="truncate">Deadline: <strong>{scholarship.applicationDeadlineText}</strong></span>
        </div>

        <div className="flex items-center gap-1 font-bold text-black group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>View Details</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};
