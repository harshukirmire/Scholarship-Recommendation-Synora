import React, { useState } from 'react';
import { 
  ShieldCheck, Plus, Edit2, Trash2, Search, CheckCircle2, 
  RotateCcw, ExternalLink, X, AlertTriangle, Building2, Globe
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { useAuth } from '../context/AuthContext';
import { Scholarship, ScholarshipCategory, FundingType } from '../types/scholarship';

export const AdminPanel: React.FC = () => {
  const { scholarships, addScholarship, updateScholarship, deleteScholarship, resetToDefaultScholarships } = useSynora();
  const { isAdmin, switchRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

  // Form State
  const initialFormData: Omit<Scholarship, 'id'> = {
    name: '',
    provider: '',
    description: '',
    category: 'CENTRAL',
    fundingType: 'MERIT_FELLOWSHIP',
    country: 'India',
    state: 'All India',
    educationLevels: ['Undergraduate'],
    applicableCourses: ['All Streams'],
    minimumMarks: 60,
    incomeLimit: 500000,
    genderCriteria: 'All',
    socialCategoryCriteria: ['General', 'OBC', 'SC', 'ST'],
    benefits: 'Tuition support and monthly grant',
    amountPerYear: 25000,
    requiredDocuments: ['Marksheet', 'Income Certificate', 'Aadhaar Card', 'College Admission Proof'],
    applicationProcedure: ['Register on official portal', 'Upload verified documents', 'Submit for institute verification'],
    deadline: '2026-11-30',
    academicYear: '2026-2027',
    officialWebsite: 'https://scholarships.gov.in',
    applicationUrl: 'https://scholarships.gov.in',
    verified: true,
    lastVerifiedAt: new Date().toISOString().split('T')[0],
    sourceUrl: 'https://scholarships.gov.in'
  };

  const [formData, setFormData] = useState<Omit<Scholarship, 'id'>>(initialFormData);
  const [docsInput, setDocsInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [levelsInput, setLevelsInput] = useState('Undergraduate');

  const filteredList = scholarships.filter(s => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingScholarship(null);
    setFormData(initialFormData);
    setDocsInput(initialFormData.requiredDocuments.join(', '));
    setStepsInput(initialFormData.applicationProcedure.join('\n'));
    setLevelsInput(initialFormData.educationLevels.join(', '));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData(scholarship);
    setDocsInput(scholarship.requiredDocuments.join(', '));
    setStepsInput(scholarship.applicationProcedure.join('\n'));
    setLevelsInput(scholarship.educationLevels.join(', '));
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanDocs = docsInput.split(',').map(d => d.trim()).filter(Boolean);
    const cleanSteps = stepsInput.split('\n').map(s => s.trim()).filter(Boolean);
    const cleanLevels = levelsInput.split(',').map(l => l.trim()).filter(Boolean);

    const payload = {
      ...formData,
      requiredDocuments: cleanDocs.length > 0 ? cleanDocs : ['Marksheet', 'Income Proof'],
      applicationProcedure: cleanSteps.length > 0 ? cleanSteps : ['Apply on official website'],
      educationLevels: cleanLevels.length > 0 ? cleanLevels : ['Undergraduate'],
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      verified: true
    };

    if (editingScholarship) {
      updateScholarship(editingScholarship.id, payload);
    } else {
      addScholarship(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Authorization Notice & Role Banner */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isAdmin ? 'Admin Console Authorized' : 'Viewing in Preview Mode'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Scholarship Master Database
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Publish, audit, edit, and verify national and international scholarship records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-colors"
          >
            {isAdmin ? 'Switch to Student View' : 'Enable Full Admin Privileges'}
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-white hover:bg-gray-100 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            <span>Add Verified Scheme</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, Reset */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scholarship title, scheme provider, or ministry..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset database to clean verified official seeds?')) {
                resetToDefaultScholarships();
              }
            }}
            className="px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
            title="Reset to official seed data"
          >
            <RotateCcw size={14} />
            <span>Reset Official Defaults</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'CENTRAL', 'STATE', 'PRIVATE', 'INTERNATIONAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Scholarships */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Scheme & Provider</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Academic & Income Rules</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6">Audit Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredList.map((scholarship) => (
                <tr key={scholarship.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-6 max-w-xs">
                    <p className="font-bold text-black text-sm line-clamp-1">{scholarship.name}</p>
                    <p className="text-gray-500 line-clamp-1 mt-0.5">{scholarship.provider} • {scholarship.country}</p>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase">
                      {scholarship.category}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-800">Min: {scholarship.minimumMarks || 0}%</p>
                    <p className="text-gray-500 text-[11px]">
                      Income: {scholarship.incomeLimit ? `₹${(scholarship.incomeLimit / 100000).toFixed(1)}L` : 'No Cap'}
                    </p>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-semibold text-black">{scholarship.deadline}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                      <CheckCircle2 size={11} className="text-emerald-600" /> Verified ({scholarship.lastVerifiedAt})
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={scholarship.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl"
                        title="View Official Portal"
                      >
                        <ExternalLink size={15} />
                      </a>

                      <button
                        onClick={() => handleOpenEdit(scholarship)}
                        className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${scholarship.name}" from verified database?`)) {
                            deleteScholarship(scholarship.id);
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-gray-200 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Scholarship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-black">
                  {editingScholarship ? 'Edit Verified Scholarship' : 'Add New Verified Scholarship'}
                </h3>
                <p className="text-xs text-gray-500">Provide official scheme attributes and strict eligibility rules</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Scholarship Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Central Sector Scheme of Scholarship"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Provider / Ministry / Foundation</label>
                  <input
                    type="text"
                    required
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    placeholder="e.g. Ministry of Education, Govt of India"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as ScholarshipCategory})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  >
                    <option value="CENTRAL">CENTRAL (National)</option>
                    <option value="STATE">STATE (State Domicile)</option>
                    <option value="PRIVATE">PRIVATE (Trust / Foundation)</option>
                    <option value="INTERNATIONAL">INTERNATIONAL (Study Abroad)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Minimum Marks Required (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.minimumMarks || 0}
                    onChange={(e) => setFormData({...formData, minimumMarks: Number(e.target.value)})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Annual Family Income Ceiling (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={formData.incomeLimit || 0}
                    onChange={(e) => setFormData({...formData, incomeLimit: Number(e.target.value)})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Applicable State / Region</label>
                  <input
                    type="text"
                    value={formData.state || 'All India'}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="e.g. Maharashtra, Karnataka, or All India"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Application Closing Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Official Portal URL</label>
                  <input
                    type="url"
                    required
                    value={formData.applicationUrl}
                    onChange={(e) => setFormData({...formData, applicationUrl: e.target.value, officialWebsite: e.target.value})}
                    placeholder="https://scholarships.gov.in"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Education Levels (Comma-separated)</label>
                  <input
                    type="text"
                    value={levelsInput}
                    onChange={(e) => setLevelsInput(e.target.value)}
                    placeholder="Class 12, Undergraduate, Postgraduate"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Benefits Description</label>
                  <input
                    type="text"
                    required
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    placeholder="e.g. ₹12,000 per annum for 3 years degree"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Required Documents (Comma-separated)</label>
                  <input
                    type="text"
                    value={docsInput}
                    onChange={(e) => setDocsInput(e.target.value)}
                    placeholder="Class 12th Marksheet, Income Certificate, Aadhaar Card, Admission Proof"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Application Steps (One per line)</label>
                  <textarea
                    rows={3}
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    placeholder="Register on portal&#10;Upload verified certificates&#10;Submit for institutional nod"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold transition-transform active:scale-95"
                >
                  {editingScholarship ? 'Save Updates' : 'Publish Verified Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
