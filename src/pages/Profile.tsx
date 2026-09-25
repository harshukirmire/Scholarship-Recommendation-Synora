import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, CheckCircle2, Sparkles, Building2, 
  GraduationCap, Award, DollarSign, MapPin, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isAdmin, switchRole } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    dob: user?.dob || '',
    gender: user?.gender || 'All',
    state: user?.state || 'Maharashtra',
    category: user?.category || 'General',
    level: user?.level || 'Undergraduate',
    course: user?.course || '',
    institution: user?.institution || '',
    gradYear: user?.gradYear || 2027,
    score: user?.score || 80,
    annualIncome: user?.annualIncome || 300000,
    hasIncomeCertificate: user?.hasIncomeCertificate ?? true,
    studyLocation: user?.studyLocation || 'Both'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      onboardingComplete: true
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Student Profile</span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">Eligibility Master</span>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            Academic & Eligibility Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            The values configured here drive the deterministic rule-based matching engine across verified schemes.
          </p>
        </div>

        <Link
          to="/find-for-me"
          className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>Check Matching Schemes</span>
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Profile updated successfully! Matching rules have been re-synchronized.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Basic Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2 border-b border-gray-100 pb-2">
            <User size={16} /> 1. Personal & Domicile Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Legal Name (as on Aadhaar/ID)</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">State of Domicile (Permanent Residence)</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium cursor-pointer"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Telangana">Telangana</option>
                <option value="All India">All India / Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Social Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium cursor-pointer"
              >
                <option value="General">General / Open</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="Minority">Religious Minority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2 border-b border-gray-100 pb-2">
            <GraduationCap size={16} /> 2. Education & Academic Performance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Current Education Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium cursor-pointer"
              >
                <option value="Class 10">Class 10 (Secondary)</option>
                <option value="Class 12">Class 12 (Higher Secondary)</option>
                <option value="Undergraduate">Undergraduate Degree (e.g. BTech, BSc, BCom, BA)</option>
                <option value="Postgraduate">Postgraduate Degree (e.g. MTech, MSc, MBA, MA)</option>
                <option value="PhD">PhD / Doctorate</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Qualifying Academic Marks / Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                required
                value={formData.score}
                onChange={(e) => setFormData({...formData, score: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-bold text-black"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Marks in preceding board/degree examination</span>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Course / Specialization</label>
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Engineering"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Institution / College Name</label>
              <input
                type="text"
                placeholder="e.g. Pune Institute of Computer Technology"
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-medium"
              />
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2 border-b border-gray-100 pb-2">
            <DollarSign size={16} /> 3. Financial & Income Criteria
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Annual Family Income (INR)</label>
              <input
                type="number"
                step="10000"
                required
                value={formData.annualIncome}
                onChange={(e) => setFormData({...formData, annualIncome: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-bold text-black"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Total combined gross family annual income</span>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasIncomeCertificate}
                  onChange={(e) => setFormData({...formData, hasIncomeCertificate: e.target.checked})}
                  className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                />
                <span className="font-semibold text-gray-800">Possess official Tehsildar / Competent Authority Income Certificate</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            <span>Active Role: <strong className="text-black uppercase">{isAdmin ? 'Admin' : 'Student'}</strong></span>
            <button
              type="button"
              onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
              className="ml-2 text-black underline"
            >
              Switch to {isAdmin ? 'Student' : 'Admin'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
