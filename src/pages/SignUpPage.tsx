import React from 'react';
import { SignUp } from '@clerk/react';
import { useClerkStatus, clerkAppearance } from '../context/ClerkWrapper';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { isConfigured } = useClerkStatus();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-black">SYNORA</span>
          </Link>
          <p className="text-xs text-gray-500 font-medium">
            Create your SYNORA account to track scholarships and application deadlines worldwide.
          </p>
        </div>

        {isConfigured ? (
          <div className="flex justify-center">
            <SignUp 
              routing="path" 
              path="/sign-up" 
              signInUrl="/sign-in"
              appearance={clerkAppearance}
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-5 text-center">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs text-left space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} /> Clerk Authentication Initialized
              </div>
              <p className="leading-relaxed">
                Add your <code>VITE_CLERK_PUBLISHABLE_KEY</code> from the Clerk Dashboard to enable email, password, and Google SSO sign-ups.
              </p>
            </div>

            <Link
              to="/profile"
              className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all block"
            >
              Continue to Student Profile
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/global-scholarships"
            className="text-xs font-medium text-gray-500 hover:text-black inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            <span>Back to Public Global Scholarships Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
