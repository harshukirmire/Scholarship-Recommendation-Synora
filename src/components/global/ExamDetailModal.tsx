import React from 'react';
import { X, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2, BookOpen, AlertCircle } from 'lucide-react';
import { GlobalExamRecord, GlobalScholarship } from '../../types/globalScholarships';

interface ExamDetailModalProps {
  exam: GlobalExamRecord | null;
  connectedScholarships: GlobalScholarship[];
  onClose: () => void;
  onSelectScholarship: (scholarship: GlobalScholarship) => void;
}

export const ExamDetailModal: React.FC<ExamDetailModalProps> = ({
  exam,
  connectedScholarships,
  onClose,
  onSelectScholarship
}) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase tracking-wider">
                {exam.examType.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 size={10} className="text-emerald-600" />
                Verified Examination Profile
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-black">
              {exam.examName}
            </h2>

            <p className="text-xs text-gray-500 font-medium">
              Conducted by: {exam.conductingOrganization} • {exam.countryOrGlobal}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-800 text-xs sm:text-sm">
          {/* Important Legal/Factual Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950 text-xs">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Official Notice:</strong> Qualifying or sitting for an examination does not automatically grant a scholarship. Each scholarship program evaluates overall application packages, academic transcripts, statements, and available quotas.
            </p>
          </div>

          {/* Exam Details */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Exam Purpose & Target Evaluation
            </h4>
            <p className="text-xs leading-relaxed text-gray-800 font-medium">
              {exam.purpose}
            </p>

            {exam.typicalMinimumScores && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Typical Minimum Scores Required by Scholarships
                </span>
                <p className="text-xs font-semibold text-black">
                  {exam.typicalMinimumScores}
                </p>
              </div>
            )}
          </div>

          {/* Connected Scholarships in the database */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                Verified Scholarships Requiring / Connected to {exam.abbreviation || exam.examName} ({connectedScholarships.length})
              </h4>
            </div>

            {connectedScholarships.length === 0 ? (
              <p className="text-xs text-gray-500">No scholarships currently mapped to this examination.</p>
            ) : (
              <div className="space-y-3">
                {connectedScholarships.map(sch => (
                  <div
                    key={sch.id}
                    onClick={() => {
                      onClose();
                      onSelectScholarship(sch);
                    }}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-black transition-all bg-gray-50/50 hover:bg-white cursor-pointer group flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                          {sch.country}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-600">
                          {sch.examRequirement.displayHeadline}
                        </span>
                      </div>
                      <h5 className="font-bold text-black text-xs sm:text-sm group-hover:underline">
                        {sch.name}
                      </h5>
                      <p className="text-[11px] text-gray-500 line-clamp-1">
                        {sch.provider} • Benefit: {sch.fundingCoverageSummary}
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
          <div className="text-xs text-gray-500">
            <span>Official Source: </span>
            <a href={exam.officialSourceUrl} target="_blank" rel="noreferrer" className="text-black font-semibold hover:underline">
              Official Examination Portal <ExternalLink size={11} className="inline ml-0.5" />
            </a>
          </div>

          <a
            href={exam.officialWebsite}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <span>Visit Exam Website</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};
