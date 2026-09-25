import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StudentProfile } from '../types/profile';
import { useUser } from '@clerk/react';
import { useClerkStatus } from './ClerkWrapper';

interface AuthContextType {
  user: StudentProfile | null;
  isAdmin: boolean;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  logout: () => void;
  switchRole: (role: 'student' | 'admin') => void;
}

export const DEFAULT_PROFILE: StudentProfile = {
  uid: 'usr-synora-student-01',
  fullName: 'Gayatri Kirmire',
  email: 'gayatrikirmire@gmail.com',
  role: 'student',
  dob: '2004-05-14',
  gender: 'Female',
  nationality: 'Indian',
  state: 'Maharashtra',
  category: 'General',
  level: 'Undergraduate',
  course: 'Bachelor of Technology (Computer Engineering)',
  institution: 'Pune Institute of Computer Technology',
  gradYear: 2027,
  score: 82, // 82% marks
  annualIncome: 320000, // ₹3,20,000
  hasIncomeCertificate: true,
  studyLocation: 'Both',
  preferredCountries: ['India', 'Germany', 'United Kingdom'],
  onboardingComplete: true,
  updatedAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ClerkSyncHelper: React.FC<{ onSync: (clerkUser: any) => void }> = ({ 
  onSync 
}) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      onSync(clerkUser);
    }
  }, [clerkUser, isLoaded, isSignedIn, onSync]);

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConfigured } = useClerkStatus();

  const [user, setUser] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('synora_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.uid) return parsed;
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const handleClerkSync = useCallback((clerkUser: any) => {
    setUser((prev) => {
      const email = clerkUser.primaryEmailAddress?.emailAddress || prev?.email || DEFAULT_PROFILE.email;
      const fullName = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || prev?.fullName || DEFAULT_PROFILE.fullName;
      const uid = clerkUser.id || prev?.uid || DEFAULT_PROFILE.uid;

      if (prev) {
        return {
          ...prev,
          uid,
          fullName,
          email,
          updatedAt: new Date().toISOString()
        };
      }

      return {
        ...DEFAULT_PROFILE,
        uid,
        fullName,
        email,
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('synora_current_user', JSON.stringify(user));
    }
  }, [user]);

  const loginAsStudent = () => {
    setUser({
      ...DEFAULT_PROFILE,
      role: 'student'
    });
  };

  const loginAsAdmin = () => {
    if (user) {
      setUser({ ...user, role: 'admin' });
    } else {
      setUser({
        ...DEFAULT_PROFILE,
        fullName: 'Synora Admin Master',
        role: 'admin'
      });
    }
  };

  const switchRole = (role: 'student' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setUser((prev) => {
      if (!prev) return DEFAULT_PROFILE;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const logout = () => {
    // Keep DEFAULT_PROFILE accessible so user is never stranded with broken views
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginAsStudent,
        loginAsAdmin,
        updateProfile,
        logout,
        switchRole
      }}
    >
      {isConfigured && <ClerkSyncHelper onSync={handleClerkSync} />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
