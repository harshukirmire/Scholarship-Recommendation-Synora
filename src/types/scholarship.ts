export type ScholarshipCategory = 'CENTRAL' | 'STATE' | 'PRIVATE' | 'UNIVERSITY' | 'INTERNATIONAL';
export type FundingType = 'FULLY_FUNDED' | 'PARTIALLY_FUNDED' | 'TUITION_WAIVER' | 'MERIT_FELLOWSHIP';

export interface RequiredExam {
  examName: string;
  minScore?: number;
  minRank?: number;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: ScholarshipCategory;
  fundingType: FundingType;
  country: string;
  state?: string; // Relevant for State scholarships (e.g., Maharashtra, Karnataka)
  
  // Eligibility Criteria
  educationLevels: string[]; // e.g., ["Class 10", "Class 12", "Undergraduate", "Postgraduate", "PhD"]
  applicableCourses: string[]; // e.g., ["Engineering", "Medicine", "Arts", "All Streams"]
  minimumMarks?: number; // e.g., 75 (%)
  incomeLimit?: number; // e.g., 250000 (INR)
  genderCriteria?: 'All' | 'Female' | 'Other';
  socialCategoryCriteria?: string[]; // e.g. ["General", "OBC", "SC", "ST", "Minority"]
  requiredExams?: RequiredExam[];
  
  // Details & Benefits
  benefits: string;
  amountPerYear?: number;
  requiredDocuments: string[];
  applicationProcedure: string[];
  
  // Logistics & Dates
  deadline: string; // ISO Date YYYY-MM-DD
  academicYear: string;
  officialWebsite: string;
  applicationUrl: string;
  
  // Verification
  verified: boolean;
  lastVerifiedAt: string;
  sourceUrl: string;
}
