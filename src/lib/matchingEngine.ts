import { StudentProfile } from '../types/profile';
import { Scholarship } from '../types/scholarship';

export interface EligibilityReport {
  scholarshipId: string;
  isEligible: boolean;
  status: 'ELIGIBLE' | 'ALMOST_ELIGIBLE' | 'NOT_ELIGIBLE';
  matchScore: number; // 0 to 100
  matchedCriteria: string[];
  missingCriteria: string[];
  requiredDocuments: string[];
  requiredExams: string[];
  deadline: string;
  benefits: string;
  applicationUrl: string;
}

export const calculateEligibility = (profile: StudentProfile, scholarship: Scholarship): EligibilityReport => {
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  let isEligible = true;
  let totalCriteriaCount = 0;
  let satisfiedCriteriaCount = 0;

  // 1. Education Level
  totalCriteriaCount++;
  if (scholarship.educationLevels.includes(profile.level)) {
    matchedCriteria.push(`Education Level: Matches current level (${profile.level})`);
    satisfiedCriteriaCount++;
  } else {
    isEligible = false;
    missingCriteria.push(`Education Level: Requires ${scholarship.educationLevels.join(' or ')} (You are ${profile.level})`);
  }

  // 2. Minimum Academic Marks / Percentage
  if (scholarship.minimumMarks !== undefined && scholarship.minimumMarks > 0) {
    totalCriteriaCount++;
    if (profile.score >= scholarship.minimumMarks) {
      matchedCriteria.push(`Academic Marks: Your score of ${profile.score}% satisfies minimum requirement (${scholarship.minimumMarks}%)`);
      satisfiedCriteriaCount++;
    } else {
      isEligible = false;
      missingCriteria.push(`Academic Marks: Requires minimum ${scholarship.minimumMarks}% (Your current score is ${profile.score}%)`);
    }
  }

  // 3. Family Annual Income Limit
  if (scholarship.incomeLimit !== undefined && scholarship.incomeLimit > 0) {
    totalCriteriaCount++;
    if (profile.annualIncome <= scholarship.incomeLimit) {
      matchedCriteria.push(`Family Income: ₹${profile.annualIncome.toLocaleString('en-IN')} is within maximum ceiling of ₹${scholarship.incomeLimit.toLocaleString('en-IN')}`);
      satisfiedCriteriaCount++;
    } else {
      isEligible = false;
      missingCriteria.push(`Family Income: Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} exceeds limit of ₹${scholarship.incomeLimit.toLocaleString('en-IN')}`);
    }
  }

  // 4. State / Domicile Criterion
  if (scholarship.state && scholarship.state !== 'All India') {
    totalCriteriaCount++;
    if (profile.state && profile.state.toLowerCase() === scholarship.state.toLowerCase()) {
      matchedCriteria.push(`Domicile Requirement: Resident of ${scholarship.state}`);
      satisfiedCriteriaCount++;
    } else {
      isEligible = false;
      missingCriteria.push(`Domicile Requirement: Restricted to permanent residents of ${scholarship.state} (Your profile indicates ${profile.state || 'unspecified'})`);
    }
  }

  // 5. Gender Criterion
  if (scholarship.genderCriteria && scholarship.genderCriteria !== 'All') {
    totalCriteriaCount++;
    if (profile.gender === scholarship.genderCriteria) {
      matchedCriteria.push(`Gender Criterion: Reserved for ${scholarship.genderCriteria} candidates`);
      satisfiedCriteriaCount++;
    } else {
      isEligible = false;
      missingCriteria.push(`Gender Criterion: Designated exclusively for ${scholarship.genderCriteria} candidates`);
    }
  }

  // 6. Social Category (SC/ST/OBC/EWS)
  if (scholarship.socialCategoryCriteria && scholarship.socialCategoryCriteria.length > 0) {
    // If not All-inclusive
    const includesCategory = scholarship.socialCategoryCriteria.includes(profile.category) || scholarship.socialCategoryCriteria.includes('General');
    totalCriteriaCount++;
    if (includesCategory) {
      matchedCriteria.push(`Category Criterion: Matches approved category list (${profile.category})`);
      satisfiedCriteriaCount++;
    } else {
      isEligible = false;
      missingCriteria.push(`Category Criterion: Restricted to ${scholarship.socialCategoryCriteria.join(', ')} (Your profile is ${profile.category})`);
    }
  }

  // Calculate Match Score
  const matchScore = totalCriteriaCount > 0 ? Math.round((satisfiedCriteriaCount / totalCriteriaCount) * 100) : 100;

  // Status mapping
  let status: 'ELIGIBLE' | 'ALMOST_ELIGIBLE' | 'NOT_ELIGIBLE' = 'NOT_ELIGIBLE';
  if (isEligible) {
    status = 'ELIGIBLE';
  } else if (missingCriteria.length === 1 && matchScore >= 70) {
    status = 'ALMOST_ELIGIBLE';
  } else {
    status = 'NOT_ELIGIBLE';
  }

  const requiredExams = scholarship.requiredExams?.map(e => e.examName + (e.minScore ? ` (Min Score: ${e.minScore})` : '')) || [];

  return {
    scholarshipId: scholarship.id,
    isEligible,
    status,
    matchScore,
    matchedCriteria,
    missingCriteria,
    requiredDocuments: scholarship.requiredDocuments,
    requiredExams,
    deadline: scholarship.deadline,
    benefits: scholarship.benefits,
    applicationUrl: scholarship.applicationUrl
  };
};
