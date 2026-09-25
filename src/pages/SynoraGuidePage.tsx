import React from 'react';
import { Bot, ShieldCheck, Sparkles, User, Info, CheckCircle2 } from 'lucide-react';
import { SynoraGuide } from '../components/SynoraGuide';
import { useAuth } from '../context/AuthContext';

export const SynoraGuidePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">AI Counselor</span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">Zero-Hallucination</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight flex items-center gap-3">
            SYNORA Guide AI
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Ask questions about schemes, deadlines, required documents, and eligibility. Powered by Gemini with verified official database grounding.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Strict RAG Guardrails Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chat window (8 cols) */}
        <div className="lg:col-span-8">
          <SynoraGuide />
        </div>

        {/* Context Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-black flex items-center gap-2">
              <User size={16} /> Active Student Context
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Synora Guide automatically factors in these credentials when evaluating schemes:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-gray-500 font-medium">Student Name:</span>
                <span className="font-bold text-black">{user?.fullName}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-gray-500 font-medium">Education Level:</span>
                <span className="font-bold text-black">{user?.level}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-gray-500 font-medium">Academic Score:</span>
                <span className="font-bold text-emerald-700">{user?.score}% Marks</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-gray-500 font-medium">Domicile State:</span>
                <span className="font-bold text-black">{user?.state}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-gray-500 font-medium">Family Income:</span>
                <span className="font-bold text-black">₹{(user?.annualIncome || 0).toLocaleString('en-IN')}/yr</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-3 text-xs text-gray-600">
            <div className="flex items-center gap-2 font-bold text-black text-sm">
              <Info size={16} /> Grounding Rules
            </div>
            <p className="leading-relaxed">
              1. The AI only references verified scholarships indexed in our official registry.
            </p>
            <p className="leading-relaxed">
              2. It will never synthesize fake application deadlines or imaginary requirements.
            </p>
            <p className="leading-relaxed">
              3. Official application links are directly provided from the authenticated scheme database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
