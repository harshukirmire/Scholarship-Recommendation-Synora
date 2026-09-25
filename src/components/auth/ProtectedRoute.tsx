import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, LogIn, UserCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  featureName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  featureName = 'this feature' 
}) => {
  const { user, loginAsStudent } = useAuth();

  // If user is authenticated (including default student profile Gayatri Kirmire), allow full access
  if (user) {
    return <>{children}</>;
  }

  // Fallback when user is signed out
  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-black text-white mx-auto flex items-center justify-center">
          <Lock size={22} />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            Authentication Required
          </span>
          <h2 className="text-xl font-black text-black tracking-tight">
            Sign in to access {featureName}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            Access your personalized student dashboard, application progress tracker, and saved scholarship deadlines.
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <button
            onClick={loginAsStudent}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <UserCheck size={15} />
            <span>Continue as Gayatri Kirmire (Student)</span>
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-xs font-medium">
          <Link
            to="/explorer"
            className="text-gray-500 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            <span>Explorer</span>
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/global-scholarships"
            className="text-gray-500 hover:text-black"
          >
            Global Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
};
