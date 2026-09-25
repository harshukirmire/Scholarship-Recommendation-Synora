export interface StudentProfile {
  uid: string;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
  dob?: string;
  gender: 'All' | 'Female' | 'Male' | 'Other';
  nationality: string;
  state: string; // Domicile state (e.g., 'Maharashtra', 'Karnataka', 'Delhi')
  category: string; // 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority'
  
  // Education & Academics
  level: 'Class 10' | 'Class 12' | 'Undergraduate' | 'Postgraduate' | 'PhD';
  course: string; // e.g. "B.Tech Computer Science", "Class 12 Science", "BA"
  institution: string;
  gradYear: number;
  score: number; // Percentage or equivalent (0-100)
  
  // Financials
  annualIncome: number; // in INR
  hasIncomeCertificate: boolean;
  
  // Preferences
  studyLocation: 'India' | 'Abroad' | 'Both';
  preferredCountries: string[];
  
  onboardingComplete: boolean;
  updatedAt: string;
}
