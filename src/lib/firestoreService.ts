/**
 * Firestore Architecture & Data Layer for SYNORA
 * 
 * Provides unified schema definitions and operations for:
 * - `users`: Student profile records (e.g. Gayatri Kirmire)
 * - `scholarships`: Verified domestic and state scholarships
 * - `saved_scholarships`: User-specific saved scholarship shortlists and deadline alerts
 * - `applications`: User-specific scholarship milestone applications
 * - `global_scholarships`: Separate international scholarships with exam prerequisites
 */

import { Scholarship } from '../types/scholarship';
import { SavedScholarship } from '../types/interactions';
import { ScholarshipApplication } from '../types/application';
import { StudentProfile } from '../types/profile';
import { GlobalScholarship } from '../types/globalScholarships';
import { INITIAL_VERIFIED_SCHOLARSHIPS } from '../data/verifiedScholarships';
import { GLOBAL_SCHOLARSHIPS_DATA } from '../data/globalScholarshipsData';
import { DEFAULT_PROFILE } from '../context/AuthContext';

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  SCHOLARSHIPS: 'scholarships',
  SAVED_SCHOLARSHIPS: 'saved_scholarships',
  APPLICATIONS: 'applications',
  GLOBAL_SCHOLARSHIPS: 'global_scholarships',
} as const;

// Local persistence keys aligned with Firestore collections
const STORAGE_KEYS = {
  USERS: 'synora_firestore_users',
  SCHOLARSHIPS: 'synora_scholarships_data',
  SAVED_SCHOLARSHIPS: 'synora_saved_scholarships',
  APPLICATIONS: 'synora_applications_data',
  GLOBAL_SCHOLARSHIPS: 'synora_global_scholarships',
};

/**
 * Seed data loader ensuring existing records are never wiped or lost
 */
export function getStoredCollection<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return defaultData;
  } catch {
    return defaultData;
  }
}

export function saveCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to persist collection ${key}:`, err);
  }
}

// Data access interfaces
export const FirestoreDataLayer = {
  // Scholarships (Domestic / Verified)
  getScholarships(): Scholarship[] {
    return getStoredCollection<Scholarship>(STORAGE_KEYS.SCHOLARSHIPS, INITIAL_VERIFIED_SCHOLARSHIPS);
  },
  saveScholarships(scholarships: Scholarship[]): void {
    saveCollection(STORAGE_KEYS.SCHOLARSHIPS, scholarships);
  },

  // Saved Scholarships
  getSavedScholarships(userId: string): SavedScholarship[] {
    const all = getStoredCollection<SavedScholarship>(STORAGE_KEYS.SAVED_SCHOLARSHIPS, []);
    return all.filter(s => s.userId === userId);
  },

  // Applications
  getApplications(userId: string): ScholarshipApplication[] {
    const all = getStoredCollection<ScholarshipApplication>(STORAGE_KEYS.APPLICATIONS, []);
    return all.filter(a => a.userId === userId);
  },

  // Global Scholarships (Strictly separated dataset)
  getGlobalScholarships(): GlobalScholarship[] {
    return GLOBAL_SCHOLARSHIPS_DATA;
  },

  // User profile
  getUserProfile(userId: string): StudentProfile {
    try {
      const raw = localStorage.getItem('synora_current_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.uid === userId) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  }
};
