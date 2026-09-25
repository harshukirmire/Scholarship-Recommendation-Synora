import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, CheckCircle2, Clock, Send, Search, MoreHorizontal, 
  ExternalLink, Trash2, Edit3, Plus, ArrowUpRight, FileText, AlertCircle
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { ApplicationStatus, ScholarshipApplication } from '../types/application';
import { getDeadlineStatus } from '../lib/deadlineTracker';

const STATUS_PIPELINE: { key: ApplicationStatus; label: string; badge: string }[] = [
  { key: 'NOT_STARTED', label: 'Not Started', badge: 'bg-gray-100 text-gray-700 border-gray-200' },
  { key: 'IN_PROGRESS', label: 'In Progress', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
  { key: 'SUBMITTED', label: 'Submitted', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { key: 'UNDER_REVIEW', label: 'Under Review', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  { key: 'APPROVED', label: 'Approved', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { key: 'REJECTED', label: 'Rejected', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
];

export const ApplicationTracker: React.FC = () => {
  const { applications, updateApplicationStatus, deleteApplication, scholarships } = useSynora();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editRefNumber, setEditRefNumber] = useState<string>('');

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  const handleStartEdit = (app: ScholarshipApplication) => {
    setEditingId(app.id);
    setEditNotes(app.notes || '');
    setEditRefNumber(app.referenceNumber || '');
  };

  const handleSaveEdit = (appId: string, currentStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, currentStatus, editNotes, editRefNumber);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Lifecycle Management</span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">Progress Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Application Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Monitor each application stage, keep track of official application reference numbers, and log verification notes.
          </p>
        </div>

        <Link
          to="/explorer"
          className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
        >
          <Plus size={15} />
          <span>Track Another Scholarship</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            filterStatus === 'ALL'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Applications ({applications.length})
        </button>

        {STATUS_PIPELINE.map(st => {
          const count = applications.filter(a => a.status === st.key).length;
          return (
            <button
              key={st.key}
              onClick={() => setFilterStatus(st.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === st.key
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-200 rounded-3xl space-y-4">
          <Briefcase size={36} className="mx-auto text-gray-300" />
          <h3 className="text-lg font-bold text-black">No applications in this category</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Select a verified scholarship from the Explorer or Find For Me to start tracking your application lifecycle.
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
          {filteredApps.map((app) => {
            const deadlineInfo = getDeadlineStatus(app.deadline);
            const isEditing = editingId === app.id;
            const currentStatusObj = STATUS_PIPELINE.find(s => s.key === app.status);

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-black transition-all p-6 shadow-sm space-y-4"
              >
                {/* Top Details */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                        {app.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentStatusObj?.badge}`}>
                        {currentStatusObj?.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${deadlineInfo.badgeColor}`}>
                        {deadlineInfo.label}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-black">{app.scholarshipName}</h3>
                    <p className="text-xs text-gray-500 font-medium">Provider: {app.provider}</p>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                      className="text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      {STATUS_PIPELINE.map(st => (
                        <option key={st.key} value={st.key}>{st.label}</option>
                      ))}
                    </select>

                    <a
                      href={app.officialPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                      title="Open Official Portal"
                    >
                      <ArrowUpRight size={16} />
                    </a>

                    <button
                      onClick={() => handleStartEdit(app)}
                      className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                      title="Edit Notes & Reference Number"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this tracked application?')) {
                          deleteApplication(app.id);
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-gray-200 transition-colors"
                      title="Remove Tracker"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl text-xs border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">Reference / Application ID</span>
                    <span className="font-semibold text-black">{app.referenceNumber || 'Not assigned yet'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">Tracking Started</span>
                    <span className="font-semibold text-black">{new Date(app.startedAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">Last Status Update</span>
                    <span className="font-semibold text-black">{new Date(app.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Notes Section or Edit Mode */}
                {isEditing ? (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                    <h4 className="font-bold text-black">Update Reference & Verification Notes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-500 mb-1">Official Reference Number</label>
                        <input
                          type="text"
                          value={editRefNumber}
                          onChange={(e) => setEditRefNumber(e.target.value)}
                          placeholder="e.g. MH-CSSS-2026-990"
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Application Notes / Checklist</label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="e.g. Bonafide verified; pending principal signature"
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl font-medium"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(app.id, app.status)}
                        className="px-4 py-1.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  app.notes && (
                    <div className="flex items-start gap-2 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                      <FileText size={15} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-800">Notes: </span>
                        <span>{app.notes}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
