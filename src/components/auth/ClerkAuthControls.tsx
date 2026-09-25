import React from 'react';
import { 
  SignInButton, 
  SignUpButton, 
  UserButton,
  useUser 
} from '@clerk/react';
import { useClerkStatus } from '../../context/ClerkWrapper';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClerkLiveControls: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-16 h-8 bg-gray-100 rounded-xl animate-pulse" />
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="text-xs font-semibold text-gray-600 hover:text-black hidden sm:block"
        >
          My Profile
        </Link>
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-8 h-8 rounded-xl border border-gray-200 shadow-sm',
              userButtonPopoverCard: 'shadow-xl border border-gray-200 rounded-2xl bg-white p-2',
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <button className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
          <LogIn size={14} />
          <span>Sign In</span>
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer">
          <UserPlus size={14} />
          <span>Sign Up</span>
        </button>
      </SignUpButton>
    </div>
  );
};

export const ClerkAuthControls: React.FC = () => {
  const { isConfigured } = useClerkStatus();
  const { user, loginAsStudent, logout } = useAuth();

  if (isConfigured) {
    return <ClerkLiveControls />;
  }

  // Fallback when Clerk publishable key is still the placeholder in development/preview
  return (
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-2.5">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-black transition-colors bg-white text-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-[10px]">
              {user.fullName ? user.fullName.charAt(0) : 'S'}
            </div>
            <span className="font-bold text-black hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
          </Link>
          <button
            onClick={logout}
            className="text-[11px] font-bold text-gray-400 hover:text-black uppercase tracking-wider px-2 py-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={loginAsStudent}
            className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>

          <button
            onClick={loginAsStudent}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Sign Up</span>
          </button>
        </div>
      )}
    </div>
  );
};
