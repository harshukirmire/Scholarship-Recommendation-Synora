import React from 'react';
import { BookOpen, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GlobalExamRecord } from '../../types/globalScholarships';

interface ExamCardProps {
  exam: GlobalExamRecord;
  connectedScholarshipsCount: number;
  onSelect: (exam: GlobalExamRecord) => void;
  onViewConnectedScholarships: (exam: GlobalExamRecord) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  connectedScholarshipsCount,
  onSelect,
  onViewConnectedScholarships
}) => {
  return (
    <div 
      onClick={() => onSelect(exam)}
      className="bg-white rounded-3xl border border-gray-200 hover:border-black p-6 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-black text-white uppercase tracking-wider">
            {exam.examType.replace('_', ' ')}
          </span>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 size={10} className="text-emerald-600" />
            Verified Record
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-black group-hover:underline leading-snug">
            {exam.examName}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Conducting Body: {exam.conductingOrganization} • {exam.countryOrGlobal}
          </p>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {exam.purpose}
        </p>

        {exam.typicalMinimumScores && (
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Typical Minimum Score / Cutoff
            </span>
            <p className="font-semibold text-gray-800 line-clamp-2">
              {exam.typicalMinimumScores}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewConnectedScholarships(exam);
          }}
          className="text-xs font-bold text-black hover:underline flex items-center gap-1"
        >
          <span>{connectedScholarshipsCount} Connected Schemes</span>
          <ArrowRight size={13} />
        </button>

        <span className="text-xs font-semibold text-gray-500 group-hover:text-black flex items-center gap-0.5">
          View Exam Details →
        </span>
      </div>
    </div>
  );
};
