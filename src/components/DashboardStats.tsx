import React from 'react';
import { Bookmark, Briefcase, Sparkles, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { useAuth } from '../context/AuthContext';
import { calculateEligibility } from '../lib/matchingEngine';

export const DashboardStats: React.FC = () => {
  const { user } = useAuth();
  const { scholarships, savedScholarships, applications } = useSynora();

  const eligibleCount = user 
    ? scholarships.filter(s => calculateEligibility(user, s).isEligible).length 
    : 0;
  
  const inProgressApps = applications.filter(a => a.status === 'IN_PROGRESS').length;
  const submittedApps = applications.filter(a => a.status === 'SUBMITTED').length;
  const approvedApps = applications.filter(a => a.status === 'APPROVED').length;

  const stats = [
    {
      title: 'Eligible For You',
      value: eligibleCount,
      caption: '100% rule-matched schemes',
      icon: Sparkles,
      iconBg: 'bg-black text-white',
      trend: 'Based on marks & domicile'
    },
    {
      title: 'Active Applications',
      value: applications.length,
      caption: `${inProgressApps} drafting • ${submittedApps} submitted`,
      icon: Briefcase,
      iconBg: 'bg-gray-100 text-black',
      trend: `${approvedApps} approved`
    },
    {
      title: 'Saved Deadlines',
      value: savedScholarships.length,
      caption: 'Tracked on your calendar',
      icon: Bookmark,
      iconBg: 'bg-gray-100 text-black',
      trend: 'Reminders active'
    },
    {
      title: 'Academic Score',
      value: `${user?.score || 0}%`,
      caption: `${user?.level || 'Undergraduate'}`,
      icon: Award,
      iconBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      trend: user?.state || 'Maharashtra'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-black transition-colors shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.title}</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${stat.iconBg}`}>
              <stat.icon size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">{stat.value}</div>
            <p className="text-[11px] text-gray-500 mt-1">{stat.caption}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] font-semibold text-gray-700">
            <span>•</span>
            <span>{stat.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
