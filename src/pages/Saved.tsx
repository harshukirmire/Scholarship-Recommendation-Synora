import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, Clock, Bell, BellOff, ExternalLink, 
  Trash2, ArrowRight, ArrowUpRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { getDeadlineStatus } from '../lib/deadlineTracker';
import { ScholarshipDetailModal } from '../components/ScholarshipDetailModal';
import { Scholarship } from '../types/scholarship';

export const SavedScholarshipsPage: React.FC = () => {
  const { savedScholarships, removeSavedScholarship, toggleReminder, scholarships, startTrackingApplication, getApplicationByScholarshipId } = useSynora();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Sort by closest deadline
  const sortedSaved = [...savedScholarships].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Shortlist & Alerts</span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">Deadlines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Saved Scholarships
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Keep track of upcoming deadlines, turn on reminders, and jump directly to official application portals.
          </p>
        </div>

        <Link
          to="/explorer"
          className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
        >
          <span>Find More Scholarships</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* List */}
      {sortedSaved.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-200 rounded-3xl space-y-4">
          <Bookmark size={40} className="mx-auto text-gray-300" />
          <h3 className="text-xl font-bold text-black">No saved scholarships yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            When you find opportunities in the Explorer or Find For Me, click the bookmark icon to save them here for deadline tracking.
          </p>
          <Link
            to="/explorer"
            className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl"
          >
            Explore Verified Scholarships
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSaved.map((item) => {
            const deadlineInfo = getDeadlineStatus(item.deadline);
            const fullScholarship = scholarships.find(s => s.id === item.scholarshipId);
            const activeApp = getApplicationByScholarshipId(item.scholarshipId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-black transition-all p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${deadlineInfo.badgeColor} flex items-center gap-1`}>
                      <Clock size={11} /> {deadlineInfo.label}
                    </span>
                    {item.remindersEnabled ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <Bell size={10} /> Alerts Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        Alerts Muted
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => fullScholarship && setSelectedScholarship(fullScholarship)}
                    className="text-lg font-bold text-black hover:underline cursor-pointer"
                  >
                    {item.scholarshipName}
                  </h3>

                  <p className="text-xs text-gray-500 font-medium">
                    Provider: {item.provider} • Target Closing: {new Date(item.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleReminder(item.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      item.remindersEnabled
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-400 hover:text-black border-gray-200'
                    }`}
                    title={item.remindersEnabled ? 'Turn Off Reminders' : 'Enable Deadline Reminder'}
                  >
                    {item.remindersEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                  </button>

                  {fullScholarship && (
                    <button
                      onClick={() => setSelectedScholarship(fullScholarship)}
                      className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black border border-gray-200 hover:border-black rounded-xl transition-colors"
                    >
                      Details
                    </button>
                  )}

                  {fullScholarship && (
                    <a
                      href={fullScholarship.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <span>Apply on Portal</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}

                  <button
                    onClick={() => removeSavedScholarship(item.scholarshipId)}
                    className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-gray-200 transition-colors"
                    title="Remove from Saved"
                  >
                    <Trash2 size={16} />
                  </button>
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
