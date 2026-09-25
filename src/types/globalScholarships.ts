export type ExamRequirementStatus = 
  | 'SCHOLARSHIP_EXAM_REQUIRED'       // A specific exam created/required for the scholarship itself
  | 'ADMISSION_EXAM_REQUIRED'          // Exam required for university admission, scholarship is tied to admission
  | 'LANGUAGE_TEST_REQUIRED'          // Official language proficiency exam required (e.g. IELTS, TOEFL, HSK, JLPT)
  | 'APTITUDE_TEST_REQUIRED'          // Aptitude/assessment test required
  | 'SELECTION_TEST_REQUIRED'         // Competitive selection/merit test
  | 'NO_SEPARATE_EXAM'                // No exam required; merit/need/profile/interview based
  | 'CONDITIONAL_EXAM'                // Depends on university/degree/program/department
  | 'NOT_VERIFIED';                   // Exam requirement unverified

export type GlobalExamType = 
  | 'SCHOLARSHIP_TEST'
  | 'UNIVERSITY_ADMISSION'
  | 'LANGUAGE_PROFICIENCY'
  | 'APTITUDE_ASSESSMENT'
  | 'NATIONAL_ENTRANCE'
  | 'SUBJECT_GRE_SAT'
  | 'NOT_APPLICABLE';

export type GlobalContinent = 
  | 'India'
  | 'North America'
  | 'Europe'
  | 'Asia'
  | 'Middle East'
  | 'Africa'
  | 'South America'
  | 'Oceania'
  | 'International';

export type StudyLevel = 
  | 'School'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD'
  | 'Postdoctoral'
  | 'Research'
  | 'All Levels';

export interface ScholarshipExamDetail {
  examStatus: ExamRequirementStatus;
  primaryExamName?: string;
  examType: GlobalExamType;
  displayHeadline: string; // e.g., "NO SEPARATE SCHOLARSHIP EXAM" or "ADMISSION EXAM REQUIRED"
  relationshipExplanation: string; // Explains whether the exam is for the scholarship itself, for admission, or conditional
  purpose: string; // Why the exam is needed
  minimumScore?: string;
  acceptedAlternativeExams?: string[]; // e.g. ["IELTS 6.5+", "TOEFL iBT 90+"] or ["SAT", "ACT"]
  officialExamWebsite?: string;
  verificationStatus: 'OFFICIALLY_VERIFIED' | 'PROGRAM_DEPENDENT' | 'UNVERIFIED';
  verifiedSourceNote: string;
}

export interface GlobalScholarship {
  id: string;
  name: string;
  shortName?: string;
  provider: string;
  providerType: 'Government' | 'University' | 'Foundation' | 'Multinational' | 'Corporate' | 'NGO';
  country: string;
  stateOrRegion?: string;
  continent: GlobalContinent;
  studyLevels: StudyLevel[];
  fieldsOfStudy: string[];
  degreesOffered: string[];
  
  // Funding
  fundingType: 'Full' | 'Partial' | 'Tuition Waiver' | 'Stipend Only' | 'Travel & Living';
  fundingCoverageSummary: string;
  amountOrAllowance?: string;
  
  // Exam Requirement Core Architecture
  examRequirement: ScholarshipExamDetail;
  
  // Other Non-Personalized Requirements
  academicCriteriaSummary: string;
  languageRequirementsSummary: string;
  admissionPrerequisites: string;
  nationalityEligibility: string;
  ageRestrictions?: string;
  mandatoryDocuments: string[];
  applicationProcedureOverview: string[];
  
  // Logistics & Verification
  applicationDeadlineText: string;
  applicationPeriod: string;
  officialScholarshipWebsite: string;
  officialApplicationPortalUrl: string;
  officialSourceUrl: string;
  verificationStatus: 'VERIFIED_OFFICIAL' | 'CONDITIONAL_VARIED';
  lastVerifiedDate: string;
}

export interface GlobalExamRecord {
  id: string;
  examName: string;
  abbreviation?: string;
  examType: GlobalExamType;
  conductingOrganization: string;
  countryOrGlobal: string;
  purpose: string;
  typicalMinimumScores?: string;
  connectedScholarshipIds: string[];
  officialWebsite: string;
  officialSourceUrl: string;
  verificationStatus: 'VERIFIED_OFFICIAL';
  lastVerifiedDate: string;
}
