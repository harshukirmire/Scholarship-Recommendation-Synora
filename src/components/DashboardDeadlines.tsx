import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Bell, ExternalLink, ArrowRight, Bookmark } from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { getDeadlineStatus } from '../lib/deadlineTracker';
import { Scholarship } from '../types/scholarship';

interface DashboardDeadlinesProps {
  onSelectScholarship?: (scholarship: Scholarship) => void;
}

export const DashboardDeadlines: React.FC<DashboardDeadlinesProps> = ({ onSelectScholarship }) => {
  const { savedScholarships, scholarships, toggleReminder } = useSynora();

  // Sort by deadline closest to today
  const sortedSaved = [...savedScholarships].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
            <Clock size={18} className="text-black" />
            Upcoming Deadlines
          </h3>
          <p className="text-xs text-gray-500">Tracked closing dates for your saved shortlist</p>
        </div>
        <Link 
          to="/saved" 
          className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
        >
          View All ({savedScholarships.length}) <ArrowRight size={13} />
        </Link>
      </div>

      {sortedSaved.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <Bookmark size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-xs font-semibold text-gray-700">No saved scholarships yet</p>
          <p className="text-[11px] text-gray-400 mt-0.5 mb-3">Save scholarships to activate deadline countdowns and alerts.</p>
          <Link
            to="/explorer"
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Explore Schemes
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSaved.slice(0, 4).map((item) => {
            const status = getDeadlineStatus(item.deadline);
            const fullScholarship = scholarships.find(s => s.id === item.scholarshipId);

            return (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl border border-gray-100 hover:border-black transition-all bg-gray-50/60 hover:bg-white flex items-center justify-between gap-3 group"
              >
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => fullScholarship && onSelectScholarship && onSelectScholarship(fullScholarship)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black text-white uppercase">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.badgeColor}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-black truncate group-hover:underline">
                    {item.scholarshipName}
                  </h4>
                  
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {item.provider} • Target: {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleReminder(item.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      item.remindersEnabled
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-400 hover:text-black border-gray-200'
                    }`}
                    title={item.remindersEnabled ? 'Alert Active' : 'Enable Alert'}
                  >
                    <Bell size={14} />
                  </button>

                  {fullScholarship && (
                    <a
                      href={fullScholarship.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 transition-colors"
                      title="Open Official Portal"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
