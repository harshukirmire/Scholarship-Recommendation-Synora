import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scholarship } from '../types/scholarship';
import { SavedScholarship } from '../types/interactions';
import { ScholarshipApplication, ApplicationStatus } from '../types/application';
import { INITIAL_VERIFIED_SCHOLARSHIPS } from '../data/verifiedScholarships';
import { useAuth } from './AuthContext';

interface SynoraContextType {
  scholarships: Scholarship[];
  savedScholarships: SavedScholarship[];
  applications: ScholarshipApplication[];
  
  // Saved operations
  toggleSaveScholarship: (scholarship: Scholarship) => boolean;
  isScholarshipSaved: (scholarshipId: string) => boolean;
  toggleReminder: (savedId: string) => void;
  removeSavedScholarship: (scholarshipId: string) => void;
  
  // Application tracking operations
  startTrackingApplication: (scholarship: Scholarship, initialStatus?: ApplicationStatus) => string;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus, notes?: string, refNumber?: string) => void;
  getApplicationByScholarshipId: (scholarshipId: string) => ScholarshipApplication | undefined;
  deleteApplication: (applicationId: string) => void;
  
  // Admin CRUD
  addScholarship: (newScholarship: Omit<Scholarship, 'id'>) => Scholarship;
  updateScholarship: (id: string, updates: Partial<Scholarship>) => void;
  deleteScholarship: (id: string) => void;
  resetToDefaultScholarships: () => void;
}

const SynoraContext = createContext<SynoraContextType | undefined>(undefined);

const INITIAL_USER_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: 'app-rel-01',
    userId: 'usr-synora-student-01',
    scholarshipId: 'reliance-foundation-ug-2026',
    scholarshipName: 'Reliance Foundation Undergraduate Scholarships',
    provider: 'Reliance Foundation',
    category: 'PRIVATE',
    status: 'IN_PROGRESS',
    startedAt: '2026-09-10T10:30:00.000Z',
    updatedAt: '2026-09-22T14:15:00.000Z',
    referenceNumber: 'RF-UG-2026-88194',
    notes: 'Prepared 10th and 12th marksheets; need to take the online aptitude practice test before final submission.',
    deadline: '2026-10-15',
    officialPortalUrl: 'https://scholarships.reliancefoundation.org'
  },
  {
    id: 'app-nsp-02',
    userId: 'usr-synora-student-01',
    scholarshipId: 'nsp-central-sector-2026',
    scholarshipName: 'Central Sector Scheme of Scholarship for College and University Students (CSSS)',
    provider: 'Ministry of Education, Government of India',
    category: 'CENTRAL',
    status: 'SUBMITTED',
    startedAt: '2026-09-02T09:00:00.000Z',
    submittedAt: '2026-09-18T16:45:00.000Z',
    updatedAt: '2026-09-18T16:45:00.000Z',
    referenceNumber: 'MH-CSSS-2026-49201',
    notes: 'Application submitted with college bonafide and income certificate. Awaiting institute nodal officer verification.',
    deadline: '2026-11-30',
    officialPortalUrl: 'https://scholarships.gov.in'
  }
];

const INITIAL_SAVED_ITEMS: SavedScholarship[] = [
  {
    id: 'saved-nsp-01',
    userId: 'usr-synora-student-01',
    scholarshipId: 'nsp-central-sector-2026',
    scholarshipName: 'Central Sector Scheme of Scholarship for College and University Students (CSSS)',
    provider: 'Ministry of Education, Government of India',
    category: 'CENTRAL',
    deadline: '2026-11-30',
    savedAt: '2026-09-05T12:00:00.000Z',
    remindersEnabled: true
  },
  {
    id: 'saved-rel-02',
    userId: 'usr-synora-student-01',
    scholarshipId: 'reliance-foundation-ug-2026',
    scholarshipName: 'Reliance Foundation Undergraduate Scholarships',
    provider: 'Reliance Foundation',
    category: 'PRIVATE',
    deadline: '2026-10-15',
    savedAt: '2026-09-08T15:20:00.000Z',
    remindersEnabled: true
  },
  {
    id: 'saved-mahadbt-03',
    userId: 'usr-synora-student-01',
    scholarshipId: 'mahadbt-post-matric-ebc-2026',
    scholarshipName: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna',
    provider: 'Higher & Technical Education Department, Government of Maharashtra',
    category: 'STATE',
    deadline: '2026-11-15',
    savedAt: '2026-09-12T08:30:00.000Z',
    remindersEnabled: true
  }
];

export const SynoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentUserId = user?.uid || 'usr-synora-student-01';

  // Master Scholarships
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    try {
      const saved = localStorage.getItem('synora_scholarships_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_VERIFIED_SCHOLARSHIPS;
    } catch {
      return INITIAL_VERIFIED_SCHOLARSHIPS;
    }
  });

  // Saved Scholarships
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>(() => {
    try {
      const saved = localStorage.getItem('synora_saved_scholarships');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SAVED_ITEMS;
    } catch {
      return INITIAL_SAVED_ITEMS;
    }
  });

  // Applications
  const [applications, setApplications] = useState<ScholarshipApplication[]>(() => {
    try {
      const saved = localStorage.getItem('synora_applications_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_USER_APPLICATIONS;
    } catch {
      return INITIAL_USER_APPLICATIONS;
    }
  });

  // Persist master scholarships
  useEffect(() => {
    localStorage.setItem('synora_scholarships_data', JSON.stringify(scholarships));
  }, [scholarships]);

  // Persist saved
  useEffect(() => {
    localStorage.setItem('synora_saved_scholarships', JSON.stringify(savedScholarships));
  }, [savedScholarships]);

  // Persist applications
  useEffect(() => {
    localStorage.setItem('synora_applications_data', JSON.stringify(applications));
  }, [applications]);

  // Filtered by active user
  const userSaved = savedScholarships.filter(s => s.userId === currentUserId || s.userId === 'usr-synora-student-01');
  const userApps = applications.filter(a => a.userId === currentUserId || a.userId === 'usr-synora-student-01');

  // Saved Actions
  const isScholarshipSaved = (scholarshipId: string): boolean => {
    return userSaved.some(s => s.scholarshipId === scholarshipId);
  };

  const toggleSaveScholarship = (scholarship: Scholarship): boolean => {
    const exists = userSaved.some(s => s.scholarshipId === scholarship.id);
    if (exists) {
      setSavedScholarships(prev => prev.filter(s => !(s.userId === currentUserId && s.scholarshipId === scholarship.id)));
      return false;
    } else {
      const newItem: SavedScholarship = {
        id: `saved-${Date.now()}`,
        userId: currentUserId,
        scholarshipId: scholarship.id,
        scholarshipName: scholarship.name,
        provider: scholarship.provider,
        category: scholarship.category,
        deadline: scholarship.deadline,
        savedAt: new Date().toISOString(),
        remindersEnabled: true
      };
      setSavedScholarships(prev => [newItem, ...prev]);
      return true;
    }
  };

  const removeSavedScholarship = (scholarshipId: string) => {
    setSavedScholarships(prev => prev.filter(s => !(s.userId === currentUserId && s.scholarshipId === scholarshipId)));
  };

  const toggleReminder = (savedId: string) => {
    setSavedScholarships(prev => prev.map(item => {
      if (item.id === savedId) {
        return { ...item, remindersEnabled: !item.remindersEnabled };
      }
      return item;
    }));
  };

  // Application Tracking Actions
  const getApplicationByScholarshipId = (scholarshipId: string) => {
    return userApps.find(a => a.scholarshipId === scholarshipId);
  };

  const startTrackingApplication = (scholarship: Scholarship, initialStatus: ApplicationStatus = 'IN_PROGRESS'): string => {
    const existing = userApps.find(a => a.scholarshipId === scholarship.id);
    if (existing) {
      return existing.id;
    }
    const newId = `app-${Date.now()}`;
    const newApp: ScholarshipApplication = {
      id: newId,
      userId: currentUserId,
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      provider: scholarship.provider,
      category: scholarship.category,
      status: initialStatus,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: scholarship.deadline,
      officialPortalUrl: scholarship.applicationUrl
    };
    setApplications(prev => [newApp, ...prev]);
    return newId;
  };

  const updateApplicationStatus = (
    applicationId: string, 
    status: ApplicationStatus, 
    notes?: string, 
    refNumber?: string
  ) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const now = new Date().toISOString();
        return {
          ...app,
          status,
          updatedAt: now,
          ...(status === 'SUBMITTED' && !app.submittedAt ? { submittedAt: now } : {}),
          ...(notes !== undefined ? { notes } : {}),
          ...(refNumber !== undefined ? { referenceNumber: refNumber } : {})
        };
      }
      return app;
    }));
  };

  const deleteApplication = (applicationId: string) => {
    setApplications(prev => prev.filter(a => a.id !== applicationId));
  };

  // Admin Actions
  const addScholarship = (newScholarship: Omit<Scholarship, 'id'>): Scholarship => {
    const created: Scholarship = {
      ...newScholarship,
      id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      verified: true
    };
    setScholarships(prev => [created, ...prev]);
    return created;
  };

  const updateScholarship = (id: string, updates: Partial<Scholarship>) => {
    setScholarships(prev => prev.map(sch => {
      if (sch.id === id) {
        return {
          ...sch,
          ...updates,
          lastVerifiedAt: new Date().toISOString().split('T')[0]
        };
      }
      return sch;
    }));
  };

  const deleteScholarship = (id: string) => {
    setScholarships(prev => prev.filter(s => s.id !== id));
  };

  const resetToDefaultScholarships = () => {
    setScholarships(INITIAL_VERIFIED_SCHOLARSHIPS);
  };

  return (
    <SynoraContext.Provider
      value={{
        scholarships,
        savedScholarships: userSaved,
        applications: userApps,
        toggleSaveScholarship,
        isScholarshipSaved,
        toggleReminder,
        removeSavedScholarship,
        startTrackingApplication,
        updateApplicationStatus,
        getApplicationByScholarshipId,
        deleteApplication,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        resetToDefaultScholarships
      }}
    >
      {children}
    </SynoraContext.Provider>
  );
};

export const useSynora = () => {
  const context = useContext(SynoraContext);
  if (!context) {
    throw new Error('useSynora must be used within a SynoraProvider');
  }
  return context;
};
